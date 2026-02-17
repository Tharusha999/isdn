"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Truck,
    ArrowRight,
    RefreshCw,
    Navigation,
    Plus,
    TrendingUp,
    ChevronRight,
    Zap,
    LocateFixed,
    Maximize2
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const INITIAL_QUEUE = [
    {
        id: "RT-2280",
        driver: "Marcus Thorne",
        vehicle: "IS-VAN-782",
        eta: "In 12m",
        status: "IN ROUTE",
        progress: 65,
        location: { x: 45, y: 55 }
    },
    {
        id: "RT-2291",
        driver: "Sarah Jenkins",
        vehicle: "IS-LRY-403",
        eta: "8 Locations",
        status: "LOADING",
        progress: 25,
        location: { x: 60, y: 35 }
    },
    {
        id: "RT-2305",
        driver: "Dilshan Perera",
        vehicle: "IS-LRY-112",
        eta: "Scheduled 16:00",
        status: "STANDBY",
        progress: 0,
        location: { x: 30, y: 70 }
    }
];

export default function LogisticsPage() {
    const [queue, setQueue] = useState(INITIAL_QUEUE);
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Simulate Live GPS Movement
    useEffect(() => {
        const interval = setInterval(() => {
            setQueue(prev => prev.map(item => {
                if (item.status === "IN ROUTE") {
                    // Small random movement simulation
                    return {
                        ...item,
                        location: {
                            x: item.location.x + (Math.random() - 0.5) * 2,
                            y: item.location.y + (Math.random() - 0.5) * 2,
                        }
                    };
                }
                return item;
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Logistics Matrix</h2>
                        <Badge className="bg-primary text-white font-black text-[8px] uppercase tracking-widest px-2 animate-pulse">Live: Grid-Alpha</Badge>
                    </div>
                    <p className="text-muted-foreground font-bold text-sm">
                        Enterprise fleet orchestration and AI-driven route optimization.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="rounded-2xl bg-black text-white shadow-xl hover:shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10 group transition-all"
                    >
                        {isOptimizing ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Zap className="mr-2 h-4 w-4 text-amber-400 fill-current group-hover:scale-125 transition-transform" />
                        )}
                        {isOptimizing ? "Optimizing Routes..." : "AI Route Optimizer"}
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="rounded-2xl border-black/5 bg-white shadow-sm font-black uppercase text-[10px] tracking-widest h-14 px-8">
                                <Plus className="mr-2 h-4 w-4" /> New Dispatch
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-md border-none p-0">
                            <div className="flex flex-col h-full bg-white">
                                <SheetHeader className="p-8 border-b border-black/5 bg-black/[0.02]">
                                    <SheetTitle className="text-2xl font-black uppercase tracking-tighter italic">Fleet Dispatch System</SheetTitle>
                                    <SheetDescription className="font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest">
                                        Authorise new delivery routes for the regional network.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="p-8 flex items-center justify-center flex-1">
                                    <div className="text-center space-y-4">
                                        <div className="h-16 w-16 bg-black/[0.03] rounded-full flex items-center justify-center mx-auto">
                                            <Truck className="h-8 w-8 text-muted-foreground/40" />
                                        </div>
                                        <p className="text-sm font-bold text-muted-foreground">Select orders to begin payload consolidation.</p>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Visual Map Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm bg-black rounded-[2.5rem] overflow-hidden group h-[500px] relative">
                        {/* Map Gradient/Texture Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                        {/* Map Header Overlay */}
                        <div className="absolute top-8 left-8 z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                                    <Navigation className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black uppercase tracking-widest text-[10px]">Real-time Tracking Grid</h3>
                                    <p className="text-white/40 text-[8px] font-bold uppercase">Active Nodes: 14 | Hubs: 05</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-8 right-8 z-10">
                            <Button size="icon" variant="secondary" className="h-10 w-10 bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 rounded-xl transition-all">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Animated Fleet Dots */}
                        <div className="absolute inset-0 mt-20 p-20">
                            {queue.map(truck => (
                                <div
                                    key={truck.id}
                                    className="absolute transition-all duration-1000 group/node"
                                    style={{ left: `${truck.location.x}%`, top: `${truck.location.y}%` }}
                                >
                                    <div className="relative">
                                        {truck.status === "IN ROUTE" && (
                                            <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                                        )}
                                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-2xl relative z-10 transition-colors ${truck.status === 'IN ROUTE' ? 'bg-emerald-500' :
                                            truck.status === 'LOADING' ? 'bg-primary' : 'bg-slate-500'
                                            }`} />

                                        {/* Label on Hover */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/node:opacity-100 transition-opacity whitespace-nowrap z-20">
                                            <div className="bg-white p-3 rounded-2xl shadow-2xl border border-black/5">
                                                <p className="font-black text-[8px] uppercase text-black">{truck.id}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">{truck.driver}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Optimization Lines Animation */}
                            {isOptimizing && (
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="w-full h-full animate-pulse flex items-center justify-center">
                                        <Zap className="h-32 w-32 text-amber-500/10 fill-current" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Map Stats Footer */}
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div className="flex gap-4">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                                    <p className="text-[8px] font-black uppercase text-white/40 mb-1">Fleet Health</p>
                                    <p className="text-xl font-black text-emerald-500 italic uppercase">Optimal</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                                    <p className="text-[8px] font-black uppercase text-white/40 mb-1">Fuel Economy</p>
                                    <p className="text-xl font-black text-white italic">+14%</p>
                                </div>
                            </div>
                            <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase text-[10px] tracking-widest shadow-2xl">
                                <LocateFixed className="mr-2 h-4 w-4" /> Recenter View
                            </Button>
                        </div>
                    </Card>

                    {/* Fleet Stats Summary */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Hubs</p>
                                <MapPin className="h-5 w-5 text-primary/20" />
                            </div>
                            <div className="text-4xl font-black italic tracking-tighter uppercase leading-none">05</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-4 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> Sync Level: High
                            </p>
                        </Card>
                        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trucks Out</p>
                                <Truck className="h-5 w-5 text-primary/20" />
                            </div>
                            <div className="text-4xl font-black italic tracking-tighter uppercase leading-none">14</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-4">Average Trip: 42km</p>
                        </Card>
                        <Card className="border-none shadow-sm bg-primary rounded-[2rem] p-8 overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Success Rate</p>
                                <TrendingUp className="h-5 w-5 text-white/20" />
                            </div>
                            <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">99%</div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-4">Last 30 Days</p>
                        </Card>
                    </div>
                </div>

                {/* Tracking Queue Section */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-[700px]">
                        <CardHeader className="p-8 border-b border-black/5 bg-black/[0.02]">
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Fleet Queue</CardTitle>
                            <CardDescription className="font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest">
                                Live dispatch status for ongoing deliveries.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6 overflow-y-auto flex-1">
                            {queue.map(truck => (
                                <div key={truck.id} className="p-6 rounded-3xl bg-white border border-black/5 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${truck.status === 'IN ROUTE' ? 'bg-emerald-50' :
                                                truck.status === 'LOADING' ? 'bg-primary/10' : 'bg-slate-50'
                                                }`}>
                                                <Truck className={`h-6 w-6 ${truck.status === 'IN ROUTE' ? 'text-emerald-500' :
                                                    truck.status === 'LOADING' ? 'text-primary' : 'text-slate-400'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight">{truck.id}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground">{truck.driver}</p>
                                            </div>
                                        </div>
                                        <Badge className={`rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest border-none ${truck.status === 'IN ROUTE' ? 'bg-emerald-500/10 text-emerald-600' :
                                            truck.status === 'LOADING' ? 'bg-primary/10 text-primary' : 'bg-slate-500/10 text-slate-500'
                                            }`}>
                                            {truck.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                            <span>Progress</span>
                                            <span className="text-black italic">{truck.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${truck.status === 'IN ROUTE' ? 'bg-emerald-500' :
                                                    truck.status === 'LOADING' ? 'bg-primary' : 'bg-slate-300'
                                                    }`}
                                                style={{ width: `${truck.progress}%` }}
                                            />
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-muted-foreground/60 mb-1">ETA Window</p>
                                                <p className="font-black italic text-sm">{truck.eta}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-black hover:text-white transition-all">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-8 border-t border-black/5 bg-black/[0.02]">
                            <Button className="w-full h-16 rounded-2xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-widest text-[10px] shadow-xl group">
                                View Fleet Map Fullscreen <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
