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
    Star
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
import { Calendar } from "lucide-react";

// Mock Products
const PRODUCTS = [
    {
        id: "P001",
        name: "Premium Ceylon Tea (Export Grade)",
        category: "Beverages",
        price: 2450.00,
        image: "https://images.unsplash.com/photo-1594631252845-29fc4586236b?auto=format&fit=crop&q=80&w=400",
        rating: 4.8,
        stock: 120,
        promo: "10% OFF"
    },
    {
        id: "P002",
        name: "Organic Coconut Oil (500ml)",
        category: "Cooking",
        price: 1800.00,
        image: "https://images.unsplash.com/photo-1549419137-f8233ed10959?auto=format&fit=crop&q=80&w=400",
        rating: 4.9,
        stock: 50,
        promo: "Top Seller"
    },
    {
        id: "P003",
        name: "Whole Wheat Pasta (Pack of 5)",
        category: "Pantry",
        price: 3200.00,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=400",
        rating: 4.5,
        stock: 200,
        promo: null
    },
    {
        id: "P004",
        name: "Spices Selection - Gourmet Box",
        category: "Spices",
        price: 4500.00,
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400",
        rating: 5.0,
        stock: 15,
        promo: "Limited Edition"
    },
    {
        id: "P005",
        name: "Basmati Rice (Bulk 5kg)",
        category: "Pantry",
        price: 12500.00,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
        rating: 4.7,
        stock: 80,
        promo: null
    },
    {
        id: "P006",
        name: "Natural Forest Honey",
        category: "Health",
        price: 3800.00,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400",
        rating: 4.9,
        stock: 42,
        promo: "Buy 1 Get 1"
    }
];

const CATEGORIES = ["All", "Beverages", "Cooking", "Pantry", "Spices", "Health"];

export default function ProductsPage() {
    useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cart, setCart] = useState<Record<string, number>>({});
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
        // Simulate processing
        setTimeout(() => {
            setIsCheckingOut(false);
            setShowSuccess(true);
            setCart({});
        }, 1500);
    };

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
        const product = PRODUCTS.find(p => p.id === id);
        return total + (product?.price || 0) * qty;
    }, 0);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Success Animation Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] bg-primary flex items-center justify-center p-6 animate-in zoom-in-95 duration-500">
                    <div className="max-w-md w-full text-center space-y-8">
                        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                            <Zap className="h-12 w-12 text-primary fill-current" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Order Confirmed!</h2>
                            <p className="text-white/80 font-bold">Your instance confirmation has been sent to your email.</p>
                        </div>

                        <Card className="bg-white/10 border-white/20 backdrop-blur-md text-white p-8 rounded-[2rem] border-none">
                            <div className="flex flex-col items-center gap-4">
                                <Calendar className="h-8 w-8 text-amber-400" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Estimated Delivery Date</p>
                                    <p className="text-2xl font-black italic">{estimatedDelivery.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </Card>

                        <Button
                            size="lg"
                            onClick={() => setShowSuccess(false)}
                            className="bg-white text-primary hover:bg-white/90 w-full h-16 rounded-2xl font-black uppercase tracking-widest"
                        >
                            Return To Portal
                        </Button>
                    </div>
                </div>
            )}
            {/* Promotion Banner */}
            <div className="relative h-48 rounded-[2rem] overflow-hidden bg-primary shadow-2xl shadow-primary/20 group">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-[#ffd700]/10 mix-blend-overlay group-hover:bg-[#ffd700]/20 transition-all duration-700" />
                <div className="relative z-20 h-full flex flex-col justify-center px-12 text-white">
                    <Badge className="w-fit mb-4 bg-amber-500 hover:bg-amber-600 text-[10px] font-black uppercase tracking-widest border-none px-3">Flash Sale</Badge>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Island Summer Bash</h1>
                    <p className="text-white/80 font-bold max-w-md mt-2">Get up to 40% OFF on all bulk exports this weekend. Limited time offer!</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 p-1 bg-black/5 rounded-2xl w-fit">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search products..."
                            className="pl-11 pr-6 py-6 rounded-2xl bg-white border-black/5 shadow-sm focus:ring-1 focus:ring-primary/20 w-[300px] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(product => (
                    <Card key={product.id} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 group rounded-[2rem] overflow-hidden bg-white/50 backdrop-blur-sm card-hover">
                        <CardHeader className="p-0 relative">
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {product.promo && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <Badge className="bg-primary text-white font-black text-[10px] uppercase tracking-widest border-none px-3 py-1">
                                            {product.promo}
                                        </Badge>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 z-10">
                                    <button className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all shadow-lg">
                                        <Info className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{product.category}</p>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="text-[10px] font-black">{product.rating}</span>
                                </div>
                            </div>
                            <CardTitle className="text-xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">{product.name}</CardTitle>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black italic">Rs. {product.price.toLocaleString()}</span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">/ Unit</span>
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-0">
                            {cart[product.id] ? (
                                <div className="flex items-center justify-between w-full h-14 bg-black/5 rounded-2xl px-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFromCart(product.id)}
                                        className="h-10 w-10 text-primary hover:bg-white hover:text-rose-500 transition-all rounded-xl"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="font-black text-lg">{cart[product.id]}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => addToCart(product.id)}
                                        className="h-10 w-10 text-primary hover:bg-white transition-all rounded-xl"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => addToCart(product.id)}
                                    className="w-full h-14 rounded-2xl bg-white text-primary border border-primary/10 shadow-sm hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
                                >
                                    Add To Cart <Plus className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Cart Floating Bar with Sheet */}
            <Sheet>
                {cartCount > 0 && !showSuccess && (
                    <div className="fixed bottom-8 left-1/2 lg:left-[calc(50%+140px)] -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="bg-black text-white rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl shadow-black/40 ring-1 ring-white/10">
                            <div className="flex items-center gap-6 pl-6">
                                <div className="relative">
                                    <ShoppingCart className="h-6 w-6" />
                                    <Badge className="absolute -top-3 -right-3 h-5 min-w-[20px] p-1 flex items-center justify-center bg-primary text-white border-none text-[8px] font-black">
                                        {cartCount}
                                    </Badge>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Total Amount</span>
                                    <span className="text-xl font-black italic tracking-tighter">Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <SheetTrigger asChild>
                                <Button
                                    className="bg-primary text-white hover:bg-primary/90 h-14 px-10 rounded-[2rem] font-black uppercase tracking-widest text-xs group"
                                >
                                    Quick Checkout <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </SheetTrigger>
                        </div>
                    </div>
                )}

                <SheetContent side="right" className="w-full sm:max-w-md border-none bg-white p-0">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-8 border-b border-black/5 bg-black/[0.02]">
                            <SheetTitle className="text-2xl font-black uppercase tracking-tighter italic">Review Order</SheetTitle>
                            <SheetDescription className="font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest">
                                Instant confirmation will be generated upon payment.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {Object.entries(cart).map(([id, qty]) => {
                                const p = PRODUCTS.find(prod => prod.id === id);
                                if (!p) return null;
                                return (
                                    <div key={id} className="flex gap-4 items-center">
                                        <div className="h-16 w-16 rounded-2xl overflow-hidden border border-black/5">
                                            <img src={p.image} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm tracking-tight">{p.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Qty: {qty} • Rs. {(p.price * qty).toLocaleString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-8 space-y-4 bg-black/[0.02] border-t border-black/5">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subtotal</span>
                                <span className="font-bold">Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform Fee</span>
                                <span className="font-bold">Rs. 250.00</span>
                            </div>
                            <div className="h-px bg-black/5" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs font-black uppercase tracking-widest">Total Payable</span>
                                <span className="text-3xl font-black italic tracking-tighter">Rs. {(cartTotal + 250).toLocaleString()}</span>
                            </div>

                            <Button
                                disabled={isCheckingOut}
                                onClick={handleCheckout}
                                className="w-full h-16 rounded-2xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-widest text-xs mt-4 shadow-xl"
                            >
                                {isCheckingOut ? "Processing Transaction..." : "Complete & Place Order"}
                                {!isCheckingOut && <Zap className="ml-2 h-4 w-4 text-amber-400 fill-current" />}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
