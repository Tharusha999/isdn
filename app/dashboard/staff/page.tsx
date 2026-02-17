import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    ShoppingCart,
    ChevronRight,
    Plus,
    Minus,
    Clock,
    Truck,
    Star,
    ArrowRight,
    SearchIcon,
    Filter,
    Store
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const products = [
    {
        id: "ISDN-CK-9022",
        name: "Crispy Salted Potato Chips - Case of 24",
        category: "PACKAGED FOODS",
        price: 39.99,
        originalPrice: 48.00,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=200",
        tag: "HOT DEAL",
        tagColor: "bg-rose-500",
        stock: 24,
        inCart: 1
    },
    {
        id: "ISDN-BV-1044",
        name: "Tropical Mango Juice - Case of 12",
        category: "BEVERAGES",
        price: 24.50,
        image: "https://images.unsplash.com/photo-1621506289937-4c72ba5dd973?auto=format&fit=crop&q=80&w=200",
        stock: 45
    },
    {
        id: "ISDN-CL-5500",
        name: "Glass Surface Cleaner - Case of 6",
        category: "HOME CLEANING",
        price: 18.90,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200",
        stock: 12
    },
    {
        id: "ISDN-PC-2121",
        name: "Antibacterial Hand Soap - Case of 12",
        category: "PERSONAL CARE",
        price: 32.00,
        image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=200",
        tag: "LIMITED",
        tagColor: "bg-amber-500",
        stock: 8
    },
    {
        id: "ISDN-FD-7711",
        name: "Premium Jasmine Rice - 10kg Bag",
        category: "PACKAGED FOODS",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200",
        outOfStock: true
    }
];

const quickReorder = [
    { name: "Alpine Spring Water (24pk)", lastOrdered: "2 days ago", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=100" },
    { name: "Ultra Clean Detergent (5L)", lastOrdered: "1 week ago", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=100" }
];

export default function RetailerPortal() {
    return (
        <div className="space-y-8">
            {/* Promo Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 lg:p-12 shadow-2xl shadow-primary/20 group">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <Badge className="bg-white/20 text-white border-none px-4 py-1 text-xs font-black uppercase tracking-widest">Flash Sale</Badge>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            Restock your Beverages <br />
                            <span className="text-white/80">Get 20% Off Bulk Orders</span>
                        </h2>
                        <p className="text-primary-foreground/70 font-medium max-w-md">
                            Valid until Friday. Apply to all major soda and juice brands for case orders over 50 units.
                        </p>
                        <Button className="rounded-xl bg-white text-primary hover:bg-white/90 font-bold px-8 h-12">
                            Claim Offer Now
                        </Button>
                    </div>
                    <div className="hidden md:flex justify-end">
                        <div className="relative">
                            <div className="w-64 h-64 bg-white/10 rounded-2xl rotate-12 absolute -top-4 -right-4" />
                            <img
                                src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400"
                                alt="Beverages"
                                className="w-64 h-64 object-cover rounded-2xl relative z-10 shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Active Order Tracking */}
                <Card className="lg:col-span-2 border-none shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Truck className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-black tracking-tight">Order #4429 is Out for Delivery</CardTitle>
                                <p className="text-xs text-muted-foreground font-medium mt-0.5">Estimated Arrival: 11:45 AM (Today)</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="text-primary text-xs font-bold hover:bg-primary/5">View Full Map</Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="relative h-2 bg-secondary/50 rounded-full mb-8">
                            <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full w-[75%] shadow-[0_0_12px_rgba(16,185,129,0.3)]" />

                            <div className="absolute -top-1 left-0 flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                                <span className="absolute top-6 text-[10px] font-black text-muted-foreground uppercase whitespace-nowrap">Packed</span>
                            </div>
                            <div className="absolute -top-1 left-[33%] flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                                <span className="absolute top-6 text-[10px] font-black text-muted-foreground uppercase whitespace-nowrap">Transit</span>
                            </div>
                            <div className="absolute -top-1 left-[66%] flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm ring-4 ring-emerald-500/20" />
                                <span className="absolute top-6 text-[10px] font-black text-foreground uppercase whitespace-nowrap">On Route</span>
                            </div>
                            <div className="absolute -top-1 right-0 flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-white border-2 border-secondary" />
                                <span className="absolute top-6 text-[10px] font-black text-muted-foreground/50 uppercase whitespace-nowrap">Arrived</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Reorder */}
                <Card className="border-none shadow-sm bg-white/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Quick Reorder</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {quickReorder.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-black/[0.02] p-2 rounded-xl transition-colors">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                    <p className="text-[10px] text-muted-foreground">Last ordered {item.lastOrdered}</p>
                                </div>
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg bg-secondary/50 group-hover:bg-primary group-hover:text-white transition-all">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full text-xs font-bold border-black/5 hover:bg-black/5 rounded-xl h-10 ring-offset-background transition-all">
                            View Order History
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Product Catalog Section */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <Tabs defaultValue="all" className="w-full md:w-auto">
                        <TabsList className="bg-secondary/50 p-1 rounded-xl h-auto flex flex-wrap gap-1">
                            {["All Products", "Packaged Foods", "Beverages", "Home Cleaning", "Personal Care"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab.toLowerCase().replace(' ', '-')}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-6 py-2 text-xs font-black uppercase tracking-widest border-none h-9"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest mr-2">
                            Sort by: <span className="text-foreground">Relevance</span>
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-black/5 shadow-sm">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className={`group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col ${product.outOfStock ? 'opacity-60 grayscale' : 'bg-white'}`}>
                            <div className="relative aspect-square overflow-hidden bg-secondary/20">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.tag && (
                                    <div className={`absolute top-4 left-4 ${product.tagColor} text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg`}>
                                        {product.tag}
                                    </div>
                                )}
                                {product.outOfStock && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Badge className="bg-white text-black border-none font-black text-[10px] px-4 py-1.5 uppercase tracking-widest">Out of Stock</Badge>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur shadow-sm">
                                        <Star className="h-4 w-4 text-amber-500" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-5 flex-1 flex flex-col">
                                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-2">{product.category}</p>
                                <h4 className="font-bold text-sm mb-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{product.name}</h4>
                                <p className="text-[10px] text-muted-foreground font-medium mb-4">SKU: {product.id}</p>

                                <div className="mt-auto flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-black tracking-tight text-foreground flex items-baseline gap-1">
                                            ${product.price.toFixed(2)}
                                            <span className="text-[10px] text-muted-foreground font-medium">/case</span>
                                        </p>
                                        {product.originalPrice && (
                                            <p className="text-xs text-muted-foreground line-through decoration-rose-500/50">${product.originalPrice.toFixed(2)}</p>
                                        )}
                                    </div>

                                    {product.outOfStock ? (
                                        <Button className="rounded-xl px-4 text-xs font-black uppercase tracking-widest bg-secondary text-muted-foreground hover:bg-secondary/80">
                                            Notify Me
                                        </Button>
                                    ) : product.inCart ? (
                                        <div className="flex items-center bg-secondary/50 rounded-xl overflow-hidden">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary">
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-xs font-black">{product.inCart}</span>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary">
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button size="sm" className="rounded-xl px-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                                            <Plus className="h-3 w-3 mr-1.5" /> Add
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="pt-8 flex justify-center">
                    <Button variant="ghost" className="text-muted-foreground hover:text-primary font-black uppercase tracking-widest text-xs h-12 px-8 group">
                        Show More Products <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Contact Support Floating Mini-Card */}
            <div className="fixed bottom-8 right-8 z-50">
                <Card className="border-none shadow-2xl bg-white p-4 w-48 hidden xl:block animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Support Available</p>
                    <Button size="sm" className="w-full rounded-xl bg-black text-white hover:bg-black/90 font-bold flex items-center justify-center gap-2 h-10 shadow-lg shadow-black/10">
                        <Store className="h-4 w-4" /> Contact Support
                    </Button>
                </Card>
            </div>
        </div>
    );
}
