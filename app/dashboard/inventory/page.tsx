"use client";

import { useState, useEffect } from "react";
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
    AlertTriangle,
    Package,
    ArrowUpRight,
    Building2,
    ShieldAlert,
    TrendingUp,
    MapPin,
    Zap,
    Loader2
} from "lucide-react";
import { fetchProducts, fetchAllProductStocks, updateProduct } from "@/public/src/supabaseClient";
import type { Product } from "@/lib/database-types";
import { AlertCircle, RotateCcw } from "lucide-react";

const RDCS = ["West (Colombo)", "Central (Kandy)", "South (Galle)", "North (Jaffna)", "East (Trincomalee)"];

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRDC, setSelectedRDC] = useState<string | "All">("All");
    const [isSyncing, setIsSyncing] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [allStocks, setAllStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            if (!isSyncing) setLoading(true);
            const [productsData, stocksData] = await Promise.all([
                fetchProducts(),
                fetchAllProductStocks()
            ]);
            setProducts(productsData || []);
            setAllStocks(stocksData || []);
            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching inventory:", err);
            setError("Failed to synchronize with central inventory node.");
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        await loadData();
    };

    const resyncLedger = async () => {
        try {
            setIsSyncing(true);
            const [productsData, stocksData] = await Promise.all([
                fetchProducts(),
                fetchAllProductStocks()
            ]);

            for (const product of (productsData || [])) {
                const totalStock = (stocksData || [])
                    .filter(s => s.product_id === product.id)
                    .reduce((acc, s) => acc + (s.quantity || 0), 0);

                if (product.stock !== totalStock) {
                    console.log(`Resyncing ${product.name}: ${product.stock} -> ${totalStock}`);
                    await updateProduct(product.id, { stock: totalStock });
                }
            }
            await loadData();
            alert("Ledger synchronisation complete. Master records aligned with regional nodes.");
        } catch (err) {
            console.error("Resync failed:", err);
            alert("Failed to resync ledger.");
        } finally {
            setIsSyncing(false);
        }
    };

    const inventoryWithStock = products.map(p => {
        const stocksForProduct = allStocks.filter(s => s.product_id === p.id);
        const totalStock = stocksForProduct.reduce((acc, s) => acc + (s.quantity || 0), 0);

        // Per-RDC stock mapping - using split(0) to match RDCS component logic
        const rdcStocks: Record<string, number> = {};
        stocksForProduct.forEach(s => {
            const key = s.rdc.split(" ")[0];
            rdcStocks[key] = (rdcStocks[key] || 0) + (s.quantity || 0);
        });

        return { ...p, totalStock, rdcStocks };
    });

    const filteredInventory = inventoryWithStock.filter(p => {
        const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedRDC !== "All") {
            const rdcKey = selectedRDC.split(" ")[0];
            return matchesSearch && (p.rdcStocks[rdcKey] !== undefined);
        }

        return matchesSearch;
    });

    const totalGlobalStock = inventoryWithStock.reduce((acc, p) => acc + p.totalStock, 0);
    const lowStockCount = inventoryWithStock.filter(p => p.totalStock < 500).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Intelligent Oversight Headers */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-[2rem] border-black/5 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="h-6 w-6" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Global Consignment</p>
                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">
                            {loading ? "..." : totalGlobalStock.toLocaleString()}
                        </h3>
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Stock Discrepancies</p>
                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">
                            {loading ? "..." : lowStockCount} Nodes
                        </h3>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-none shadow-2xl bg-white col-span-2 border border-black/5 overflow-hidden group">
                    <CardHeader className="p-8 border-b border-black/5 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black italic tracking-tighter uppercase leading-tight text-slate-900">Node Synchronization Status</h3>
                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-2">{RDCS.length} ACTIVE DISTRIBUTION CORES</p>
                            </div>
                            <Button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="bg-slate-900 hover:bg-black text-white rounded-xl h-12 px-6 font-black uppercase text-[10px] shadow-lg shadow-black/10"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                                {isSyncing ? "Syncing..." : "Sync Network"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex gap-3">
                            {RDCS.map(rdc => (
                                <div key={rdc} className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden border border-black/[0.03]">
                                    <div className="h-full bg-emerald-500 animate-pulse transition-all duration-1000" style={{ width: '100%' }} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <span>Latency: 8ms</span>
                            <span className="text-emerald-500">Live Database Link Established</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Controls */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 p-1.5 bg-black/5 rounded-2xl w-fit overflow-x-auto">
                    <button
                        onClick={() => setSelectedRDC("All")}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedRDC === "All"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Master Inventory
                    </button>
                    {RDCS.map(rdc => (
                        <button
                            key={rdc}
                            onClick={() => setSelectedRDC(rdc)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedRDC === rdc
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {rdc.split(" ")[0]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Locate Consignment..."
                            className="pl-12 pr-6 h-14 rounded-2xl bg-white border-black/5 shadow-sm w-full lg:w-[300px] font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Consignment Matrix */}
            <Card className="rounded-[2.5rem] border-black/5 shadow-2xl overflow-hidden bg-white">
                <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Consignment Matrix</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Professional oversight for regional node stock distribution.</CardDescription>
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
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Consignment Identity</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Department</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">
                                        {selectedRDC === "All" ? "Global Vol." : `${selectedRDC.split(" ")[0]} Vol.`}
                                    </TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Integrity</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && !isSyncing ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center animate-pulse">
                                                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                                                <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">Accessing central ledger...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredInventory.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center">
                                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No consignment records detected.</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredInventory.map(product => {
                                        const displayStock = selectedRDC === "All"
                                            ? product.totalStock
                                            : product.rdcStocks[selectedRDC.split(" ")[0]] || 0;

                                        return (
                                            <TableRow key={product.id} className="hover:bg-slate-50/30 transition-colors group border-black/5">
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl border border-black/5 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                                            <img src={product.image || ""} className="h-full w-full object-cover mix-blend-multiply opacity-80" />
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
                                                <TableCell className="px-8 py-6">
                                                    <div className="space-y-1.5">
                                                        <p className="text-lg font-black tabular-nums tracking-tighter italic text-slate-900 leading-none">
                                                            {displayStock.toLocaleString()}
                                                        </p>
                                                        <div className="h-1 w-24 bg-black/5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${displayStock < 500 ? "bg-rose-500" : "bg-emerald-500"}`}
                                                                style={{ width: `${Math.min(100, (displayStock / 2000) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Sync Active</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all text-slate-600"
                                                    >
                                                        <ArrowRightLeft className="mr-2 h-4 w-4 opacity-40" />
                                                        Transfer
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Transfer Dock - Fixed Bottom */}
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
                            <p className="font-bold text-slate-600 text-sm italic tracking-tight">Direct database link for cross-regional inventory movement.</p>
                        </div>
                    </div>
                    <Button className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 group">
                        Authorize Stock Realignment <Zap className="ml-2 h-4 w-4 text-primary fill-current group-hover:scale-125 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
