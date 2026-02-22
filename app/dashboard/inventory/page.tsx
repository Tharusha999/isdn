"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Search,
    RefreshCw,
    ArrowRightLeft,
    Package,
    ArrowUpRight,
    Building2,
    Zap,
    Loader2,
    AlertCircle,
    RotateCcw,
    Edit2,
    Check,
    X,
    TrendingDown
} from "lucide-react";
import { fetchProducts, fetchAllProductStocks, updateProduct, updateProductStock, createProductStock, createProduct, fetchRDCHubs } from "@/lib/supabaseClient";
import type { Product } from "@/lib/database-types";


interface StockEntry {
    id: number;
    product_id: string;
    rdc: string;
    quantity: number;
}

interface InventoryProduct extends Product {
    totalStock: number;
    rdcStocks: Record<string, number>;
    hasRdcData: boolean;
}

interface TransferState {
    productId: string;
    productName: string;
    fromRdc: string;
    toRdc: string;
    quantity: number;
}

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRDC, setSelectedRDC] = useState<string | "All">("All");
    const [isSyncing, setIsSyncing] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [allStocks, setAllStocks] = useState<StockEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingStock, setEditingStock] = useState<{ productId: string; rdc: string } | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [savingStock, setSavingStock] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transfer, setTransfer] = useState<TransferState>({
        productId: "", productName: "", fromRdc: "", toRdc: "", quantity: 0
    });
    const [transferring, setTransferring] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isCreatingProduct, setIsCreatingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        category: "Packaged Food" as any,
        price: 0,
        image: "",
        description: "",
        sku: ""
    });

    const [activeRdcs, setActiveRdcs] = useState<string[]>([]);

    // Derive RDC list dynamically from the database
    const rdcs = activeRdcs;

    const loadData = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const [productsData, stocksData, hubsData] = await Promise.all([
                fetchProducts(),
                fetchAllProductStocks(),
                fetchRDCHubs()
            ]);
            setProducts(productsData || []);
            setAllStocks(stocksData || []);
            setActiveRdcs(hubsData ? hubsData.map((h: any) => h.name).sort() : []);
            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching inventory:", err);
            setError("Failed to synchronize with central inventory node.");
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleSync = async () => {
        setIsSyncing(true);
        await loadData(false);
    };

    const resyncLedger = async () => {
        if (!confirm("This will:\n1. Create missing RDC stock entries for unallocated products\n2. Recalculate all master stock totals\n\nContinue?")) return;

        try {
            setIsSyncing(true);
            const [productsData, stocksData, hubsData] = await Promise.all([
                fetchProducts(),
                fetchAllProductStocks(),
                fetchRDCHubs()
            ]);

            // Derive available RDCs from the definitive hubs table
            const availableRdcs = hubsData ? hubsData.map((h: any) => h.name) : [];
            const defaultRdc = availableRdcs.length > 0 ? availableRdcs[0] : "";

            let created = 0;
            if (defaultRdc) {
                // For every product with NO product_stock rows, seed using the first RDC from DB
                for (const product of (productsData || [])) {
                    const existingStocks = (stocksData || []).filter(s => s.product_id === product.id);
                    if (existingStocks.length === 0 && (product.stock || 0) > 0) {
                        await createProductStock(product.id, defaultRdc, product.stock);
                        created++;
                    }
                }
            }

            // Re-fetch after creating new stock rows
            const [freshProducts, freshStocks] = await Promise.all([
                fetchProducts(),
                fetchAllProductStocks()
            ]);

            // Sync master stock totals from per-RDC rows
            for (const product of (freshProducts || [])) {
                const totalStock = (freshStocks || [])
                    .filter(s => s.product_id === product.id)
                    .reduce((acc, s) => acc + (s.quantity || 0), 0);
                if (product.stock !== totalStock) {
                    await updateProduct(product.id, { stock: totalStock });
                }
            }

            await loadData(false);
            alert(`Sync complete!\n${created > 0 ? `• ${created} unallocated product(s) added to ${defaultRdc}\n` : ''}• All master stock totals recalculated and synchronized across ${availableRdcs.length} nodes.`);
        } catch (err) {
            console.error("Resync failed:", err);
            alert("Resync failed. Check the console for details.");
        } finally {
            setIsSyncing(false);
        }
    };


    const startEditStock = (productId: string, rdc: string, currentValue: number) => {
        setEditingStock({ productId, rdc });
        setEditValue(String(currentValue));
    };

    const saveStockEdit = async () => {
        if (!editingStock) return;
        setSavingStock(true);
        try {
            const newQty = parseInt(editValue, 10);
            if (isNaN(newQty) || newQty < 0) { alert("Please enter a valid quantity."); return; }
            await updateProductStock(editingStock.productId, editingStock.rdc, newQty);
            // Also update master stock in products table
            const relatedStocks = allStocks.filter(s => s.product_id === editingStock.productId);
            const otherStocksTotal = relatedStocks
                .filter(s => s.rdc !== editingStock.rdc)
                .reduce((a, s) => a + s.quantity, 0);
            await updateProduct(editingStock.productId, { stock: otherStocksTotal + newQty });
            setEditingStock(null);
            await loadData(false);
        } catch (err) {
            alert("Failed to update stock.");
            console.error(err);
        } finally {
            setSavingStock(false);
        }
    };

    const openTransferModal = (product: InventoryProduct) => {
        setTransfer({
            productId: product.id,
            productName: product.name,
            fromRdc: rdcs[0],
            toRdc: rdcs[1],
            quantity: 1
        });
        setShowTransferModal(true);
    };

    const handleCreateProduct = async () => {
        if (!newProduct.name || newProduct.price <= 0) {
            alert("Please provide a valid product name and price.");
            return;
        }

        setIsCreatingProduct(true);
        try {
            // 1. Create the product
            const sku = newProduct.sku || `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const productId = crypto.randomUUID();
            const created = await createProduct({
                id: productId,
                name: newProduct.name,
                sku: sku,
                category: newProduct.category,
                price: newProduct.price,
                image: newProduct.image,
                description: newProduct.description,
                stock: 0 // Initial master stock
            });

            // 2. Initialize stock entries for each active RDC with 0 quantity
            for (const rdc of activeRdcs) {
                await createProductStock(created.id, rdc, 0);
            }

            setShowAddModal(false);
            setNewProduct({
                name: "",
                category: "Packaged Food" as any,
                price: 0,
                image: "",
                description: "",
                sku: ""
            });
            await loadData(false);
            alert(`Product '${created.name}' created and synchronized across the network.`);
        } catch (err: any) {
            console.error("Failed to create product:", err);
            const detail = err.message || "Unknown database error";
            alert(`Failed to register new product: ${detail}`);
        } finally {
            setIsCreatingProduct(false);
        }
    };

    const executeTransfer = async () => {
        if (transfer.fromRdc === transfer.toRdc) { alert("From and To RDC must be different."); return; }
        if (transfer.quantity <= 0) { alert("Transfer quantity must be positive."); return; }

        const fromStock = allStocks.find(s => s.product_id === transfer.productId && s.rdc === transfer.fromRdc);
        if (!fromStock || fromStock.quantity < transfer.quantity) {
            alert(`Insufficient stock at ${transfer.fromRdc}. Available: ${fromStock?.quantity || 0}`);
            return;
        }

        setTransferring(true);
        try {
            const toStock = allStocks.find(s => s.product_id === transfer.productId && s.rdc === transfer.toRdc);
            await updateProductStock(transfer.productId, transfer.fromRdc, fromStock.quantity - transfer.quantity);
            const newToQty = (toStock?.quantity || 0) + transfer.quantity;
            await updateProductStock(transfer.productId, transfer.toRdc, newToQty);
            setShowTransferModal(false);
            await loadData(false);
            alert(`Transfer complete: ${transfer.quantity} units moved from ${transfer.fromRdc} to ${transfer.toRdc}.`);
        } catch (err) {
            alert("Transfer failed.");
            console.error(err);
        } finally {
            setTransferring(false);
        }
    };

    const inventoryWithStock: InventoryProduct[] = products.map(p => {
        const stocksForProduct = allStocks.filter(s => s.product_id === p.id);
        // If no per-RDC rows exist, fall back to the master stock column
        const totalStock = stocksForProduct.length > 0
            ? stocksForProduct.reduce((acc, s) => acc + (s.quantity || 0), 0)
            : (p.stock || 0);
        const rdcStocks: Record<string, number> = {};
        stocksForProduct.forEach(s => { rdcStocks[s.rdc] = (rdcStocks[s.rdc] || 0) + (s.quantity || 0); });
        return { ...p, totalStock, rdcStocks, hasRdcData: stocksForProduct.length > 0 };
    });

    const filteredInventory = inventoryWithStock.filter(p => {
        const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.id || "").toLowerCase().includes(searchQuery.toLowerCase());
        if (selectedRDC !== "All") {
            return matchesSearch && (p.rdcStocks[selectedRDC] !== undefined);
        }
        return matchesSearch;
    });

    const totalGlobalStock = inventoryWithStock.reduce((acc, p) => acc + p.totalStock, 0);
    const lowStockCount = inventoryWithStock.filter(p => p.totalStock < 500).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Top Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-[2rem] border-black/5 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="h-6 w-6" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Global Stock</p>
                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">
                            {loading ? "..." : totalGlobalStock.toLocaleString()}
                        </h3>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium">Units across all rdcs</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-black/5 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">Alert</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Low Stock Items</p>
                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">
                            {loading ? "..." : lowStockCount}
                        </h3>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium">Products below 500 units</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-black/5 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Building2 className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active RDC Nodes</p>
                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">{rdcs.length}</h3>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium">All nodes operational</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-black/5 shadow-2xl bg-white overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resyncLedger}
                                disabled={isSyncing}
                                className="h-8 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-amber-100 text-amber-600 border border-amber-100"
                            >
                                <RotateCcw className={`mr-1.5 h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                                Resync Ledger
                            </Button>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Sync Status</p>
                        <p className="text-sm font-bold text-emerald-600">●&nbsp;Live Database Linked</p>
                    </CardContent>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 p-1.5 bg-black/5 rounded-2xl w-fit overflow-x-auto">
                    <button
                        onClick={() => setSelectedRDC("All")}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedRDC === "All" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        All rdcs
                    </button>
                    {rdcs.map(rdc => (
                        <button
                            key={rdc}
                            onClick={() => setSelectedRDC(rdc)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedRDC === rdc ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            {rdc.split(" ")[0]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by product name or SKU..."
                            className="pl-12 pr-6 h-14 rounded-2xl bg-white border-black/5 shadow-sm w-full lg:w-[320px] font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="h-14 px-8 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest shadow-xl hover:shadow-black/20"
                    >
                        <Package className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                    <Button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="h-14 px-6 rounded-2xl bg-white border border-black/5 hover:bg-slate-50 text-slate-900 font-black uppercase text-[10px] tracking-widest"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing..." : "Refresh"}
                    </Button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-bold">{error}</p>
                    <Button size="sm" variant="ghost" onClick={() => loadData()} className="ml-auto text-rose-700">Retry</Button>
                </div>
            )}

            {/* Inventory Matrix */}
            <Card className="rounded-[2.5rem] border-black/5 shadow-2xl overflow-hidden bg-white">
                <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Inventory Matrix</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                            Live stock data — click the edit icon to update quantities directly.
                        </CardDescription>
                    </div>
                    {selectedRDC !== "All" && (
                        <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-4 py-2 rounded-xl uppercase tracking-widest">
                            {selectedRDC} NODE ACTIVE
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="p-10">
                    <div className="rounded-3xl border border-black/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="hover:bg-transparent border-black/5">
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Stock Identity</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Category</TableHead>
                                    {selectedRDC === "All"
                                        ? rdcs.map(r => (
                                            <TableHead key={r} className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                                                {r.split(" ")[0]}
                                            </TableHead>
                                        ))
                                        : <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">
                                            {selectedRDC.split(" ")[0]} Stock
                                        </TableHead>
                                    }
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Total</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center animate-pulse">
                                                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                                                <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">Accessing database...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredInventory.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-20 text-center">
                                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No inventory records found.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredInventory.map(product => (
                                        <TableRow key={product.id} className="hover:bg-slate-50/30 transition-colors group border-black/5">
                                            <TableCell className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl border border-black/5 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                                        {product.image ? (
                                                            <>
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img src={product.image} alt={product.name} className="h-full w-full object-cover mix-blend-multiply opacity-80" />
                                                            </>
                                                        ) : (
                                                            <Package className="h-5 w-5 text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold tracking-tight text-slate-900 text-sm leading-none mb-1.5">{product.name}</p>
                                                        <p className="text-[10px] font-black text-primary font-mono opacity-60 uppercase">{product.sku || product.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-8 py-6">
                                                <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase tracking-widest border-black/10 px-3 py-1 bg-white text-slate-600">
                                                    {product.category}
                                                </Badge>
                                            </TableCell>

                                            {selectedRDC === "All"
                                                ? rdcs.map(rdc => {
                                                    const qty = product.rdcStocks[rdc] ?? 0;
                                                    const isEditing = editingStock?.productId === product.id && editingStock?.rdc === rdc;
                                                    // Product has no per-RDC data - show a dash
                                                    if (!product.hasRdcData) {
                                                        return (
                                                            <TableCell key={rdc} className="px-4 py-6 text-center">
                                                                <span className="text-[10px] text-slate-300 font-black">—</span>
                                                            </TableCell>
                                                        );
                                                    }
                                                    return (
                                                        <TableCell key={rdc} className="px-4 py-6 text-center">
                                                            {isEditing ? (
                                                                <div className="flex items-center gap-1 justify-center">
                                                                    <Input
                                                                        type="number"
                                                                        value={editValue}
                                                                        onChange={e => setEditValue(e.target.value)}
                                                                        className="h-8 w-20 text-center text-sm font-bold rounded-lg border-primary"
                                                                        autoFocus
                                                                    />
                                                                    <button onClick={saveStockEdit} disabled={savingStock} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                                                        <Check className="h-3 w-3" />
                                                                    </button>
                                                                    <button onClick={() => setEditingStock(null)} className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200">
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center gap-1.5 group/cell">
                                                                    <span className={`text-sm font-black tabular-nums ${qty < 200 ? "text-rose-600" : qty < 500 ? "text-amber-600" : "text-slate-900"}`}>
                                                                        {qty.toLocaleString()}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => startEditStock(product.id, rdc, qty)}
                                                                        className="opacity-0 group-hover/cell:opacity-100 p-1 rounded hover:bg-black/5 transition-all"
                                                                    >
                                                                        <Edit2 className="h-2.5 w-2.5 text-slate-400" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })
                                                : (() => {
                                                    const qty = product.rdcStocks[selectedRDC] ?? 0;
                                                    const isEditing = editingStock?.productId === product.id && editingStock?.rdc === selectedRDC;
                                                    return (
                                                        <TableCell className="px-8 py-6">
                                                            {isEditing ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="number"
                                                                        value={editValue}
                                                                        onChange={e => setEditValue(e.target.value)}
                                                                        className="h-9 w-28 text-sm font-bold rounded-lg border-primary"
                                                                        autoFocus
                                                                    />
                                                                    <button onClick={saveStockEdit} disabled={savingStock} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                                                        <Check className="h-3.5 w-3.5" />
                                                                    </button>
                                                                    <button onClick={() => setEditingStock(null)} className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200">
                                                                        <X className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-3">
                                                                    <div className="space-y-1.5">
                                                                        <p className={`text-lg font-black tabular-nums tracking-tighter italic leading-none ${qty < 200 ? "text-rose-600" : qty < 500 ? "text-amber-600" : "text-slate-900"}`}>
                                                                            {qty.toLocaleString()}
                                                                        </p>
                                                                        <div className="h-1 w-24 bg-black/5 rounded-full overflow-hidden">
                                                                            <div className={`h-full ${qty < 200 ? "bg-rose-500" : qty < 500 ? "bg-amber-500" : "bg-emerald-500"}`}
                                                                                style={{ width: `${Math.min(100, (qty / 3000) * 100)}%` }} />
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => startEditStock(product.id, selectedRDC, qty)}
                                                                        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-black/5 transition-all"
                                                                    >
                                                                        <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })()
                                            }

                                            <TableCell className="px-8 py-6">
                                                <div className="space-y-1.5">
                                                    <p className="text-sm font-black tabular-nums tracking-tighter italic text-slate-900 leading-none">
                                                        {product.totalStock.toLocaleString()}
                                                    </p>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Live</span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-8 py-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openTransferModal(product)}
                                                    className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all text-slate-600"
                                                >
                                                    <ArrowRightLeft className="mr-2 h-4 w-4 opacity-40" />
                                                    Transfer
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl p-12 w-full max-w-2xl space-y-10 animate-in fade-in zoom-in-95 duration-300">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Register New Inventory</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Initialize a new product across the distribution grid.</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Product Descriptor</label>
                                <Input
                                    placeholder="e.g. Premium Basmati Rice"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="h-14 rounded-2xl font-bold border-black/10 bg-slate-50/50"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category Node</label>
                                <select
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value as any })}
                                    className="w-full h-14 rounded-2xl border border-black/10 px-6 font-bold text-sm bg-slate-50/50"
                                >
                                    <option>Packaged Food</option>
                                    <option>Beverages</option>
                                    <option>Home Cleaning</option>
                                    <option>Personal Care</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Unit Valuation (Rs.)</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                                    className="h-14 rounded-2xl font-bold border-black/10 bg-slate-50/50"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Asset SKU (Leave blank for auto)</label>
                                <Input
                                    placeholder="ISO-XXXXXX"
                                    value={newProduct.sku}
                                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                                    className="h-14 rounded-2xl font-bold border-black/10 bg-slate-50/50"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visual Representation URL</label>
                                <Input
                                    placeholder="https://..."
                                    value={newProduct.image}
                                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className="h-14 rounded-2xl font-bold border-black/10 bg-slate-50/50"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400"
                            >
                                Abort Initialization
                            </Button>
                            <Button
                                onClick={handleCreateProduct}
                                disabled={isCreatingProduct}
                                className="flex-1 h-14 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest shadow-2xl"
                            >
                                {isCreatingProduct ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="mr-2 h-5 w-5" />Authorized Creation</>}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Inter-Node Transfer</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{transfer.productName}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">From RDC</label>
                                <select
                                    value={transfer.fromRdc}
                                    onChange={e => setTransfer(t => ({ ...t, fromRdc: e.target.value }))}
                                    className="w-full h-12 rounded-xl border border-black/10 px-4 font-bold text-sm bg-white"
                                >
                                    {rdcs.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-1 ml-1">
                                    Available: {(inventoryWithStock.find(p => p.id === transfer.productId)?.rdcStocks[transfer.fromRdc] || 0).toLocaleString()} units
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <ArrowRightLeft className="h-5 w-5 text-slate-300" />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">To RDC</label>
                                <select
                                    value={transfer.toRdc}
                                    onChange={e => setTransfer(t => ({ ...t, toRdc: e.target.value }))}
                                    className="w-full h-12 rounded-xl border border-black/10 px-4 font-bold text-sm bg-white"
                                >
                                    {rdcs.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Quantity to Transfer</label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={transfer.quantity}
                                    onChange={e => setTransfer(t => ({ ...t, quantity: parseInt(e.target.value) || 0 }))}
                                    className="h-12 rounded-xl font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => setShowTransferModal(false)}
                                className="flex-1 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={executeTransfer}
                                disabled={transferring}
                                className="flex-1 h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-[10px] tracking-widest"
                            >
                                {transferring ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Zap className="mr-2 h-4 w-4" />Authorize Transfer</>}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-[280px] bg-white border-t border-black/5 p-6 z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl bg-white/90">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Inter-Node Requisition</span>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 border border-black/5 rounded-xl text-slate-900">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <ArrowRightLeft className="h-4 w-4 text-slate-300" />
                                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                                    <Building2 className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-black/5 hidden md:block" />
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Global Allocation Active</p>
                            <p className="font-bold text-slate-600 text-sm italic tracking-tight">
                                {loading ? "Loading..." : `${totalGlobalStock.toLocaleString()} total units across ${rdcs.length} nodes`}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={resyncLedger}
                        disabled={isSyncing}
                        className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 group"
                    >
                        {isSyncing
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Zap className="ml-2 h-4 w-4 text-primary fill-current group-hover:scale-125 transition-transform" />
                        }
                        Authorize Stock Realignment
                    </Button>
                </div>
            </div>
        </div>
    );
}
