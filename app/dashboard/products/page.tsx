"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Search,
    ShoppingCart,
    Zap,
    Info,
    Plus,
    Minus,
    ArrowRight,
    Calendar,
    Loader2,
    AlertTriangle,
    X,
    Package,
    Trash2,
    Edit2,
    Check,
    CreditCard,
    Clock,
    Receipt,
    CheckCircle2,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { fetchProducts, createProduct, fetchAllProductStocks, createProductStock, createOrderWithItems, deleteProduct, updateProduct, updateProductStock } from "@/lib/supabaseClient";
import type { Product, ProductCategory } from "@/lib/database-types";

const CATEGORIES = ["All", "Packaged Food", "Beverages", "Home Cleaning", "Personal Care"];
const PRODUCT_CATEGORIES: ProductCategory[] = ["Packaged Food", "Beverages", "Home Cleaning", "Personal Care"];

const PAYMENT_METHODS = [
    { id: "Credit Card", label: "Credit/Debit Card", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "Bank Transfer", label: "Bank Transfer", icon: Receipt, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "Online Banking", label: "Online Banking", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { id: "Cash on Delivery", label: "Cash on Delivery", icon: Package, color: "text-rose-500", bg: "bg-rose-50" },
];

const generateSKU = (count: number): string => {
    const num = String(count + 1).padStart(2, "0");
    return `ISDN-${num}`;
};

const EMPTY_FORM = {
    name: "",
    category: "Packaged Food" as ProductCategory,
    price: "",
    sku: "",
    stock: "",
    description: "",
    image: "",
};

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cart, setCart] = useState<Record<string, number>>({});
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Online Banking");
    const [showSuccess, setShowSuccess] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [allStocks, setAllStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // First RDC name from the database — used as default when creating stock entries
    const defaultRdc: string | null = allStocks.length > 0
        ? Array.from(new Set(allStocks.map((s: any) => s.rdc))).sort()[0] as string
        : null;

    // Admin state
    const [role, setRole] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        setRole(storedRole);
        loadProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = products.find(p => p.id === id);
        return total + (product?.price || 0) * qty;
    }, 0);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

    const isAdmin = role === "admin";

    const loadProducts = async () => {
        try {
            setLoading(true);
            const [productsData, stocksData] = await Promise.all([
                fetchProducts(),
                fetchAllProductStocks()
            ]);

            // Sync master stock totals from regional nodes for UI consistency
            const syncedProducts = (productsData || []).map(p => {
                const productStocks = (stocksData || []).filter(s => s.product_id === p.id);

                // Fallback: If no regional entries exist, use the master stock record
                // Otherwise, sum the regional nodes for the definitive total
                const totalStock = productStocks.length > 0
                    ? productStocks.reduce((acc, s) => acc + (s.quantity || 0), 0)
                    : (p.stock || 0);

                return { ...p, stock: totalStock };
            });

            setProducts(syncedProducts);
            setAllStocks(stocksData || []);
            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching products:", err);
            setError("Failed to synchronize with central inventory node.");
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setForm({ ...EMPTY_FORM, sku: generateSKU(products.length) });
        setSaveError(null);
        setShowAddModal(true);
    };

    const handleCategoryChange = (category: ProductCategory) => {
        setForm(prev => ({ ...prev, category }));
    };

    const handleAddProduct = async () => {
        if (!form.name || !form.sku || !form.price) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            const newId = `P${Math.floor(Math.random() * 90000) + 10000}`;
            const productData = {
                id: newId,
                sku: form.sku.toUpperCase(),
                name: form.name,
                category: form.category,
                price: parseFloat(form.price),
                stock: form.stock ? parseInt(form.stock) : 0,
                description: form.description || null,
                image: form.image || null,
            };

            await createProduct(productData);

            // Initialize stock in the first available RDC (sourced from database)
            if (form.stock && parseInt(form.stock) > 0 && defaultRdc) {
                await createProductStock(newId, defaultRdc, parseInt(form.stock));
            }

            await loadProducts();
            setForm(EMPTY_FORM);
            setShowAddModal(false);
        } catch (err: unknown) {
            console.error("Error creating product:", err);
            setSaveError("Failed to save product. Please check the details and try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            category: product.category,
            price: String(product.price),
            sku: product.sku,
            stock: String(product.stock || 0),
            description: product.description || "",
            image: product.image || "",
        });
        setSaveError(null);
        setShowEditModal(true);
    };

    const handleEditProduct = async () => {
        if (!editingProduct || !form.name || !form.sku || !form.price) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            const newStockTotal = form.stock ? parseInt(form.stock) : (editingProduct.stock || 0);
            const stockDifference = newStockTotal - (editingProduct.stock || 0);

            const productData = {
                sku: form.sku.toUpperCase(),
                name: form.name,
                category: form.category,
                price: parseFloat(form.price),
                stock: newStockTotal,
                description: form.description || null,
                image: form.image || null,
            };

            await updateProduct(editingProduct.id, productData);

            // If stock was changed manually, update the regional distribution node(s)
            if (stockDifference !== 0 && defaultRdc) {
                const existingRdcStock = allStocks.find(s => s.product_id === editingProduct.id && s.rdc === defaultRdc);

                // If it's a new product or first-time setup, we might need to create the row
                if (existingRdcStock) {
                    await updateProductStock(editingProduct.id, defaultRdc, Math.max(0, (existingRdcStock.quantity || 0) + stockDifference));
                } else {
                    await createProductStock(editingProduct.id, defaultRdc, Math.max(0, newStockTotal));
                }
            }

            await loadProducts();
            setShowEditModal(false);
            setEditingProduct(null);
            setForm(EMPTY_FORM);
        } catch (err: unknown) {
            console.error("Error updating product:", err);
            setSaveError("Failed to update product. Please check the details and try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const addToCart = (id: string) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id: string) => {
        if (cart[id] > 1) {
            setCart(prev => ({ ...prev, [id]: prev[id] - 1 }));
        } else {
            const newCart = { ...cart };
            delete newCart[id];
            setCart(newCart);
        }
    };

    const updateQuantity = (id: string, qty: string) => {
        const val = parseInt(qty);
        if (isNaN(val) || val <= 0) {
            const newCart = { ...cart };
            delete newCart[id];
            setCart(newCart);
        } else {
            setCart(prev => ({ ...prev, [id]: val }));
        }
    };

    const [orderInfo, setOrderInfo] = useState<{
        id: string,
        total: number,
        date: string,
        eta: string,
        invoice: string,
        method: string,
        items: { name: string, quantity: number, price: number }[]
    } | null>(null);

    const downloadReceipt = () => {
        if (!orderInfo) return;

        // CSV Headers
        const headers = ["Order ID", "Invoice", "Date", "Customer", "Product Name", "Quantity", "Unit Price (Rs.)", "Line Total (Rs.)", "Grand Total (Rs.)", "Payment Method", "Estimated Arrival"];

        // CSV Rows
        const rows = (orderInfo.items || []).map(item => [
            orderInfo.id,
            orderInfo.invoice,
            orderInfo.date,
            localStorage.getItem("profileName") || "Retail Partner",
            item.name || "Unknown Product",
            item.quantity || 0,
            item.price || 0,
            (item.price || 0) * (item.quantity || 0),
            orderInfo.total,
            orderInfo.method,
            orderInfo.eta
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        const element = document.createElement("a");
        const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        element.href = URL.createObjectURL(file);
        element.download = `Transaction_${orderInfo.id}.csv`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleCheckout = async () => {
        try {
            setIsCheckingOut(true);

            // Create real Order
            const orderId = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;

            // Get ID from authenticated session
            const storedAuth = localStorage.getItem('authUser');
            let customerId = "CUST-USER-001"; // Fallback for demo
            if (storedAuth) {
                const user = JSON.parse(storedAuth);
                customerId = user.id;
            }

            const orderData = {
                id: orderId,
                customer_id: customerId,
                total: cartTotal,
                status: 'Pending',
                rdc: defaultRdc || '', // First RDC from database
                date: new Date().toISOString().split('T')[0],
                eta: estimatedDelivery.toISOString().split('T')[0]
            };

            const itemsData = Object.entries(cart).map(([id, qty]) => {
                const product = products.find(p => p.id === id);
                return {
                    product_id: id,
                    quantity: qty,
                    price: product?.price || 0
                };
            });

            const itemsWithNames = Object.entries(cart).map(([id, qty]) => {
                const product = products.find(p => p.id === id);
                return {
                    name: product?.name || "Unknown Product",
                    quantity: qty,
                    price: product?.price || 0
                };
            });

            const transactionData = {
                id: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
                customer: localStorage.getItem("profileName") || "Retail Partner",
                amount: cartTotal,
                date: new Date().toISOString().split('T')[0],
                status: 'PAID', // Assuming instant payment for demo
                method: selectedPaymentMethod
            };

            await createOrderWithItems(orderData, itemsData, transactionData);
            await loadProducts();

            setOrderInfo({
                id: orderId,
                total: cartTotal,
                date: orderData.date,
                eta: orderData.eta,
                invoice: transactionData.id,
                method: transactionData.method,
                items: itemsWithNames
            });
            setShowSuccess(true);
            setCart({});
        } catch (err: any) {
            console.error("Checkout failed:", err);
            const errorMsg = err.message || "Network synchronization failed during checkout.";
            alert(`${errorMsg} Please try again.`);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const handleDeleteProduct = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to terminate the sync for "${name}"? This will permanently remove it from the global catalog.`)) return;

        try {
            setLoading(true);
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error("Deletion failed:", err);
            alert("Security lock prevented product removal. Please check permissions.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Success Overlay */}
            {showSuccess && orderInfo && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
                    <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden scale-in-95 animate-in zoom-in-95 duration-500 border border-white/20">
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left Side: Status & Hero */}
                            <div className="w-full md:w-5/12 bg-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Zap className="h-40 w-40 rotate-12" />
                                </div>

                                <div className="relative z-10">
                                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                    </div>
                                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none mb-4">
                                        Order <br />Confirmed
                                    </h2>
                                    <p className="text-white/40 font-black uppercase text-[10px] tracking-widest leading-relaxed">
                                        Your transaction has been <br />validated across the <br />network mesh.
                                    </p>
                                </div>

                                <div className="relative z-10 pt-12">
                                    <div className="space-y-4">

                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Inventory Reserved</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Details */}
                            <div className="w-full md:w-7/12 p-10 bg-white">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Confirmation ID</p>
                                        <p className="text-lg font-black font-mono text-slate-900">{orderInfo.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Transaction Date</p>
                                        <p className="text-xs font-black text-slate-900">{new Date(orderInfo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Financial Widget */}
                                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <CreditCard className="h-5 w-5 text-slate-900" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Settlement Amount</p>
                                                <p className="text-xl font-black italic tracking-tight text-slate-900">Rs. {orderInfo.total.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                                            <div className="flex items-center gap-2">
                                                <Receipt className="h-3 w-3 text-slate-400" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Invoice: {orderInfo.invoice}</span>
                                            </div>
                                            <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">
                                                {orderInfo.method}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Logistics Widget */}
                                    <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                                <Clock className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/70">Estimated Arrival</p>
                                                <p className="text-xl font-black italic tracking-tight text-indigo-900">
                                                    {new Date(orderInfo.eta).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-indigo-600/5 px-3 py-2 rounded-lg">
                                            <div className="h-1 w-1 bg-indigo-600 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Priority Logistics Route Active</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col gap-3">
                                    <Button
                                        onClick={() => setShowSuccess(false)}
                                        className="h-14 bg-slate-900 text-white hover:bg-black w-full rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20"
                                    >
                                        Acknowledge & Continue
                                    </Button>
                                    <button
                                        onClick={downloadReceipt}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors text-center py-2"
                                    >
                                        Download Transaction CSV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal (Admin only) */}
            {showAddModal && isAdmin && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => { setShowAddModal(false); setForm(EMPTY_FORM); setSaveError(null); }}
                            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                        >
                            <X className="h-4 w-4 text-slate-600" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Add New Product</h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                            Fill in the product details to add to the network catalogue.
                        </p>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name *</Label>
                                    <Input
                                        placeholder="e.g. Premium Ceylon White Rice (5kg)"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SKU *</Label>
                                        <button
                                            type="button"
                                            onClick={() => setForm(prev => ({ ...prev, sku: generateSKU(products.length) }))}
                                            className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center gap-1"
                                        >
                                            ↻ Regenerate
                                        </button>
                                    </div>
                                    <Input
                                        placeholder="e.g. ISDN-FD-101"
                                        value={form.sku}
                                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900 font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (Rs.) *</Label>
                                    <Input
                                        placeholder="e.g. 1250"
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                                        className="w-full h-12 rounded-xl bg-slate-50 border border-black/5 px-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                                    >
                                        {PRODUCT_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initial Stock (Units)</Label>
                                    <Input
                                        placeholder="e.g. 1000"
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</Label>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                                    <textarea
                                        placeholder="Brief product description..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        className="w-full rounded-xl bg-slate-50 border border-black/5 px-4 py-3 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 resize-none"
                                    />
                                </div>
                            </div>

                            {saveError && (
                                <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{saveError}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => { setShowAddModal(false); setForm(EMPTY_FORM); setSaveError(null); }}
                                className="flex-1 h-12 rounded-xl border-black/5 font-black text-[10px] uppercase tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddProduct}
                                disabled={isSaving || !form.name || !form.sku || !form.price}
                                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
                            >
                                {isSaving ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Committing...</>
                                ) : (
                                    <><Plus className="mr-2 h-4 w-4" />Add Product</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal (Admin only) */}
            {showEditModal && isAdmin && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => { setShowEditModal(false); setEditingProduct(null); setForm(EMPTY_FORM); setSaveError(null); }}
                            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                        >
                            <X className="h-4 w-4 text-slate-600" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Edit2 className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Edit Product</h3>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                            Update the product details in the network catalogue.
                        </p>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name *</Label>
                                    <Input
                                        placeholder="e.g. Premium Ceylon White Rice (5kg)"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SKU *</Label>
                                    <Input
                                        placeholder="e.g. ISDN-FD-101"
                                        value={form.sku}
                                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900 font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (Rs.) *</Label>
                                    <Input
                                        placeholder="e.g. 1250"
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</Label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => handleCategoryChange(e.target.value as ProductCategory)}
                                        className="w-full h-12 rounded-xl bg-slate-50 border border-black/5 px-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                                    >
                                        {PRODUCT_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Master Stock (Units)</Label>
                                    <Input
                                        placeholder="e.g. 1000"
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</Label>
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                                    <textarea
                                        placeholder="Brief product description..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        className="w-full rounded-xl bg-slate-50 border border-black/5 px-4 py-3 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 resize-none"
                                    />
                                </div>
                            </div>

                            {saveError && (
                                <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{saveError}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => { setShowEditModal(false); setEditingProduct(null); setForm(EMPTY_FORM); setSaveError(null); }}
                                className="flex-1 h-12 rounded-xl border-black/5 font-black text-[10px] uppercase tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEditProduct}
                                disabled={isSaving || !form.name || !form.sku || !form.price}
                                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
                            >
                                {isSaving ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Syncing...</>
                                ) : (
                                    <><Check className="mr-2 h-4 w-4" />Update Product</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Promotion Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 relative h-72 rounded-[3rem] overflow-hidden bg-white shadow-2xl group border border-black/5">
                    <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] [background-size:24px_24px]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10" />
                    <div className="relative z-20 h-full flex flex-col justify-center px-12 text-slate-900">
                        <Badge className="w-fit mb-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest border-none px-4 py-1.5 rounded-full">Active Distribution Alert</Badge>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Bulk Logistic <br /><span className="text-indigo-600 italic">Efficiency Rebate</span></h1>
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-6 bg-slate-50 w-fit px-3 py-1 rounded-lg">Valid across all 5 regional distribution centres.</p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
                </div>
                <Card className="bg-slate-900 rounded-[3rem] border-none p-12 flex flex-col justify-between text-white shadow-2xl shadow-black/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="h-32 w-32 rotate-12" />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">Instant <br />Confirmation</h3>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 relative z-10">Zero manual delays. <br />Real-time node sync.</p>
                </Card>
            </div>

            {/* Catalog Controls */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 p-1.5 bg-black/5 rounded-2xl w-fit overflow-x-auto">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    {/* Admin: Add Product Button */}
                    {isAdmin && (
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-black/10"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    )}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Identify Product..."
                            className="pl-12 pr-6 h-14 rounded-2xl bg-white border-black/5 shadow-sm focus:ring-1 focus:ring-primary/20 w-full lg:w-[350px] font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 animate-pulse">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">Accessing product ledger...</p>
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="flex flex-col items-center justify-center py-24">
                    <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
                    <p className="font-bold text-rose-600 text-sm mb-6">{error}</p>
                    <Button onClick={loadProducts} variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6">
                        Retry Sync
                    </Button>
                </div>
            )}

            {/* Product Grid */}
            {!loading && !error && (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-4 py-24 text-center">
                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No products found matching your search.</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => {
                            const stock = product.stock || 0;
                            const isLowStock = stock > 0 && stock < 500;
                            const isOutOfStock = stock === 0;

                            return (
                                <Card key={product.id} className="border border-black/[0.03] shadow-sm hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-sm">
                                    <CardHeader className="p-0 relative">
                                        <div className="h-56 relative overflow-hidden bg-slate-100">
                                            {product.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply opacity-90"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ShoppingCart className="h-12 w-12" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                <Badge className={`font-black text-[8px] uppercase tracking-widest border-none px-3 py-1 ${isOutOfStock ? "bg-rose-500 text-white" :
                                                    isLowStock ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                                                    }`}>
                                                    {isOutOfStock ? "Out of Stock" : isLowStock ? "Limited" : "In Stock"}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                                <button className="h-10 w-10 rounded-2xl bg-white/80 backdrop-blur-md text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-lg border border-white">
                                                    <Info className="h-5 w-5" />
                                                </button>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() => openEditModal(product)}
                                                            className="h-10 w-10 rounded-2xl bg-white/80 backdrop-blur-md text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-lg border border-white"
                                                        >
                                                            <Edit2 className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id, product.name)}
                                                            className="h-10 w-10 rounded-2xl bg-white/80 backdrop-blur-md text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-lg border border-white"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{product.category}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-primary font-mono">{product.sku}</p>
                                        </div>
                                        <CardTitle className="text-lg font-bold tracking-tight mb-4 min-h-[3.5rem] line-clamp-2">{product.name}</CardTitle>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black italic tracking-tighter">Rs. {(product.price || 0).toLocaleString()}</span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">/ UNIT</span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (stock / 2000) * 100)}%` }} />
                                            </div>
                                            <span className="text-[8px] font-black uppercase text-slate-400 whitespace-nowrap">{stock.toLocaleString()} UNITS</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-8 pt-0">
                                        {isAdmin ? (
                                            // Admin sees a stock indicator instead of cart
                                            <div className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 border border-black/5">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Stock Level</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {isOutOfStock ? "Out of Stock" : isLowStock ? `${stock} — Low` : `${stock.toLocaleString()} Units`}
                                                </span>
                                            </div>
                                        ) : cart[product.id] ? (
                                            <div className="flex items-center justify-between w-full h-14 bg-slate-900 rounded-2xl px-2">
                                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)} className="h-10 w-10 text-white hover:bg-white/10 rounded-xl">
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <input
                                                    type="number"
                                                    value={cart[product.id]}
                                                    onChange={(e) => updateQuantity(product.id, e.target.value)}
                                                    className="w-16 bg-transparent border-none text-center font-black text-lg text-white tabular-nums focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                                <Button variant="ghost" size="icon" onClick={() => addToCart(product.id)} className="h-10 w-10 text-white hover:bg-white/10 rounded-xl">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                disabled={isOutOfStock}
                                                onClick={() => addToCart(product.id)}
                                                className="w-full h-14 rounded-2xl bg-white border border-black/5 text-slate-900 hover:bg-slate-900 hover:text-white transition-all font-black uppercase tracking-widest text-[9px]"
                                            >
                                                Purchase Item <Plus className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}

            {/* Floating Cart Bar (customers only) */}
            {!isAdmin && (
                <Sheet>
                    {cartCount > 0 && !showSuccess && (
                        <div className="fixed bottom-8 left-1/2 lg:left-[calc(50%+140px)] -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-bottom-10 duration-500">
                            <div className="bg-slate-900 text-white rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl ring-1 ring-white/10">
                                <div className="flex items-center gap-6 pl-6">
                                    <div className="relative">
                                        <ShoppingCart className="h-6 w-6" />
                                        <Badge className="absolute -top-3 -right-3 h-5 min-w-[20px] p-1 flex items-center justify-center bg-primary text-white border-none text-[8px] font-black">
                                            {cartCount}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40 leading-none mb-1 text-left">Total Value</span>
                                        <span className="text-xl font-black italic tracking-tighter">Rs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <SheetTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90 text-white h-14 px-10 rounded-[2rem] font-black uppercase tracking-widest text-[10px] group">
                                        PURCHASE <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </SheetTrigger>
                            </div>
                        </div>
                    )}

                    <SheetContent side="right" className="w-full sm:max-w-md border-none bg-white p-0">
                        <div className="flex flex-col h-full">
                            <SheetHeader className="p-10 border-b border-black/5 bg-slate-50">
                                <SheetTitle className="text-3xl font-black uppercase tracking-tighter italic leading-none">Order <br />Requisition</SheetTitle>
                                <SheetDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-2">
                                    Direct RDC node synchronisation active.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {Object.entries(cart).map(([id, qty]) => {
                                    const p = products.find(prod => prod.id === id);
                                    if (!p) return null;
                                    return (
                                        <div key={id} className="flex gap-6 items-center group">
                                            <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden bg-slate-100 p-2 shrink-0 border border-black/5">
                                                {p.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={p.image} alt={p.name} className="h-full w-full object-cover mix-blend-multiply" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                        <ShoppingCart className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="font-black text-sm uppercase italic tracking-tight">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                                    {qty} UNIT{qty > 1 ? 'S' : ''} • RS. {((p.price || 0) * qty).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Payment Method Selection inside scrollable area */}
                                <div className="pt-6 border-t border-black/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Select Payment Method</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {PAYMENT_METHODS.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setSelectedPaymentMethod(method.id)}
                                                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${selectedPaymentMethod === method.id
                                                    ? "bg-white border-slate-900 shadow-lg ring-1 ring-slate-900/5 scale-[1.02]"
                                                    : "bg-white border-black/5 hover:border-slate-200"
                                                    }`}
                                            >
                                                <div className={`${method.bg} ${method.color} h-10 w-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                                    <method.icon className="h-5 w-5" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-tight text-slate-900 leading-none">{method.label}</p>
                                                {selectedPaymentMethod === method.id && (
                                                    <div className="absolute top-3 right-3 h-5 w-5 bg-slate-900 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-4 bg-slate-900 text-white rounded-t-[3rem]">
                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-baseline opacity-40">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                        <span className="font-bold text-sm">Rs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline opacity-40">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Logistic Fee</span>
                                        <span className="font-bold text-sm text-emerald-400 italic font-black">WAIVED</span>
                                    </div>
                                    <div className="h-px bg-white/5" />
                                    <div className="flex justify-between items-center text-left">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total Order Value</span>
                                            <span className="text-4xl font-black italic tracking-tighter">Rs. {cartTotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    disabled={isCheckingOut}
                                    onClick={handleCheckout}
                                    className="w-full h-20 rounded-[2rem] bg-white text-slate-900 hover:bg-white/90 font-black uppercase tracking-widest text-xs mt-6 shadow-2xl transition-all"
                                >
                                    {isCheckingOut ? "Committing To Grid..." : (
                                        <>
                                            PURCHASE <Zap className="ml-2 h-5 w-5 text-amber-500 fill-current" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
}
