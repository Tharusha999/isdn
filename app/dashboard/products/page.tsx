"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    ShoppingCart,
    Zap,
    Info,
    Plus,
    Minus,
    ArrowRight,
    Star,
    Calendar,
    Filter
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { INITIAL_PRODUCTS, RDC } from "@/lib/data";

const CATEGORIES = ["All", "Packaged Food", "Beverages", "Home Cleaning", "Personal Care"];

export default function ProductsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cart, setCart] = useState<Record<string, number>>({});
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // For demo, we assume the customer is in the West region
    const userRegion: RDC = "West (Colombo)";

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

    const handleCheckout = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            setIsCheckingOut(false);
            setShowSuccess(true);
            setCart({});
        }, 1500);
    };

    const filteredProducts = INITIAL_PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = INITIAL_PRODUCTS.find(p => p.id === id);
        return total + (product?.price || 0) * qty;
    }, 0);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="max-w-md w-full text-center space-y-10">
                        <div className="h-24 w-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce border border-white/20">
                            <Zap className="h-10 w-10 text-primary fill-current" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Order Established</h2>
                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Network Synchronisation Complete</p>
                        </div>

                        <Card className="bg-white border-black/5 shadow-2xl p-10 rounded-[3rem]">
                            <div className="flex flex-col items-center gap-6">
                                <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Calendar className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Expected Trajectory</p>
                                    <p className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">{estimatedDelivery.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full mt-3">24-48 HOUR GUARANTEE</Badge>
                                </div>
                            </div>
                        </Card>

                        <Button
                            size="lg"
                            onClick={() => setShowSuccess(false)}
                            className="bg-slate-900 text-white hover:bg-black w-full h-18 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-black/20"
                        >
                            Back to Network Hub
                        </Button>
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
                    {/* Visual Accent */}
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

            {/* Product Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map(product => {
                    const localStock = product.stock[userRegion];
                    const isLowStock = localStock > 0 && localStock < 500;
                    const isOutOfStock = localStock === 0;

                    return (
                        <Card key={product.id} className="border border-black/[0.03] shadow-sm hover:shadow-2xl transition-all duration-500 group rounded-[2.5rem] overflow-hidden bg-white/50 backdrop-blur-sm">
                            <CardHeader className="p-0 relative">
                                <div className="h-56 relative overflow-hidden bg-slate-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply opacity-90"
                                    />
                                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                        <Badge className={`font-black text-[8px] uppercase tracking-widest border-none px-3 py-1 ${isOutOfStock ? "bg-rose-500 text-white" :
                                            isLowStock ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                                            }`}>
                                            {isOutOfStock ? "Out of Stock" : isLowStock ? "Limited" : "In Stock"}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-4 right-4 z-10">
                                        <button className="h-10 w-10 rounded-2xl bg-white/80 backdrop-blur-md text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-lg border border-white">
                                            <Info className="h-5 w-5" />
                                        </button>
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
                                    <span className="text-2xl font-black italic tracking-tighter">Rs. {product.price.toLocaleString()}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">/ UNIT</span>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (localStock / 2000) * 100)}%` }} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase text-slate-400 whitespace-nowrap">{localStock.toLocaleString()} UNITS</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-8 pt-0">
                                {cart[product.id] ? (
                                    <div className="flex items-center justify-between w-full h-14 bg-slate-900 rounded-2xl px-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromCart(product.id)}
                                            className="h-10 w-10 text-white hover:bg-white/10 rounded-xl"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="font-black text-lg text-white tabular-nums">{cart[product.id]}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => addToCart(product.id)}
                                            className="h-10 w-10 text-white hover:bg-white/10 rounded-xl"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        disabled={isOutOfStock}
                                        onClick={() => addToCart(product.id)}
                                        className="w-full h-14 rounded-2xl bg-white border border-black/5 text-slate-900 hover:bg-slate-900 hover:text-white transition-all font-black uppercase tracking-widest text-[9px]"
                                    >
                                        Add to Consignment <Plus className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Floating Intelligence Bar */}
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
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-white h-14 px-10 rounded-[2rem] font-black uppercase tracking-widest text-[10px] group"
                                >
                                    Review Order <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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

                        <div className="flex-1 overflow-y-auto p-10 space-y-8">
                            {Object.entries(cart).map(([id, qty]) => {
                                const p = INITIAL_PRODUCTS.find(prod => prod.id === id);
                                if (!p) return null;
                                return (
                                    <div key={id} className="flex gap-6 items-center group">
                                        <div className="h-20 w-20 rounded-[1.5rem] overflow-hidden bg-slate-100 p-2 shrink-0 border border-black/5">
                                            <img src={p.image} className="h-full w-full object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="font-black text-sm uppercase italic tracking-tight">{p.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                                {qty} UNIT{qty > 1 ? 'S' : ''} • RS. {(p.price * qty).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-10 space-y-6 bg-slate-900 text-white rounded-t-[3rem]">
                            <div className="space-y-4 pt-4">
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
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total Consignment Value</span>
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
                                        Authorize Requisition <Zap className="ml-2 h-5 w-5 text-amber-500 fill-current" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
