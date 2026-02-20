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
    Maximize2,
    ShieldCheck,
    BarChart3,
    Gauge,
    Fuel,
    Timer,
    CheckCircle2
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { fetchMissions } from "@/public/src/supabaseClient";

export default function LogisticsPage() {
    const router = useRouter();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const loadMissions = async () => {
        try {
            setLoading(true);
            const data = await fetchMissions();

            // Map database missions to UI format with initial random positions for the tactical grid
            const mappedQueue = (data || []).map((m: any) => ({
                id: m.id,
                driver: m.driver_name || "Unassigned",
                vehicle: m.vehicle || "N/A",
                eta: m.status === 'In Transit' ? "12m" : "N/A",
                status: m.status === 'In Transit' ? "IN ROUTE" : m.status.toUpperCase(),
                progress: m.progress || 0,
                location: {
                    x: Math.floor(Math.random() * 80) + 10,
                    y: Math.floor(Math.random() * 80) + 10
                },
                metrics: {
                    fuel: m.telemetry?.fuel ? parseInt(m.telemetry.fuel) : 100,
                    dist: m.km_traversed || "0km"
                }
            }));

            setQueue(mappedQueue);
        } catch (err) {
            console.error("Failed to fetch missions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMissions();
    }, []);

    // Simulate Live GPS Movement
    useEffect(() => {
        if (queue.length === 0) return;
        const interval = setInterval(() => {
            setQueue(prev => prev.map(item => {
                if (item.status === "IN ROUTE") {
                    const newX = item.location.x + (Math.random() - 0.5) * 1.5;
                    const newY = item.location.y + (Math.random() - 0.5) * 1.5;
                    return {
                        ...item,
                        location: {
                            x: Math.min(90, Math.max(10, newX)),
                            y: Math.min(90, Math.max(10, newY)),
                        },
                        progress: Math.min(100, item.progress + 0.1)
                    };
                }
                return item;
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, [queue.length]);

    const handleOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setIsOptimizing(false);
            loadMissions();
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Executive Overview Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Logistics Matrix</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Grid Sync</span>
                        </div>
                    </div>
                    <p className="text-muted-foreground font-bold text-sm tracking-tight">
                        Real-time fleet orchestration and AI-driven route synchronization.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="rounded-2xl bg-slate-900 text-white shadow-2xl shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10 group transition-all"
                    >
                        {isOptimizing ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin text-primary" />
                        ) : (
                            <Zap className="mr-2 h-4 w-4 text-primary fill-current group-hover:scale-125 transition-transform" />
                        )}
                        {isOptimizing ? "Calibrating..." : "Optimize Grid"}
                    </Button>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="rounded-2xl bg-primary text-white shadow-xl font-black uppercase text-[10px] tracking-widest h-14 px-10 group">
                                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> New Dispatch
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-md border-none p-0">
                            <div className="flex flex-col h-full bg-white">
                                <SheetHeader className="p-8 border-b border-black/5 bg-slate-50">
                                    <SheetTitle className="text-2xl font-black uppercase tracking-tighter italic">Fleet Dispatch System</SheetTitle>
                                    <SheetDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                        Authorise new regional delivery vectors.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="p-10 flex flex-col gap-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payload Selection</p>
                                        <div className="h-40 rounded-3xl border-2 border-dashed border-black/5 flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                                            <Truck className="h-8 w-8 text-slate-200" />
                                            <p className="text-xs font-bold text-slate-400">Drag Orders to Dispatch</p>
                                        </div>
                                    </div>
                                    <Button className="h-16 rounded-2xl bg-slate-900 font-black uppercase tracking-widest text-[10px] shadow-xl">
                                        Initiate Load-out <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Tactical Grid Visualization */}
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="border-none shadow-2xl bg-slate-100 rounded-[3rem] overflow-hidden group h-[600px] relative border border-slate-200">
                    {/* Map Overlay Logic - Blueprint Light Style */}
                    <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-100 to-transparent opacity-90 z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-100 to-transparent opacity-90 z-10" />

                    <div className="absolute top-10 left-10 z-20 flex items-center gap-6">
                        <div className="h-14 w-14 bg-white/40 backdrop-blur-xl border border-black/5 rounded-2xl flex items-center justify-center">
                            <Navigation className="h-7 w-7 text-slate-800" />
                        </div>
                        <div>
                            <h3 className="text-slate-900 font-black uppercase tracking-widest text-xs leading-none mb-2">Real-Time Fleet Grid</h3>
                            <div className="flex gap-4">
                                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">14 Active Nodes</span>
                                <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3" /> Grid Encrypted
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Animated Fleet Elements */}
                    <div className="absolute inset-0 mt-32 p-10 z-10">
                        {queue.map(truck => (
                            <div
                                key={truck.id}
                                className="absolute transition-all duration-2000 group/node cursor-pointer"
                                style={{ left: `${truck.location.x}%`, top: `${truck.location.y}%` }}
                            >
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-primary/10 rounded-full animate-ping opacity-20" />
                                    <div className={`h-6 w-6 rounded-lg ${truck.status === 'IN ROUTE' ? 'bg-emerald-500 shadow-emerald-500/40' :
                                        truck.status === 'LOADING' ? 'bg-primary shadow-black/40' : 'bg-slate-300'
                                        } shadow-lg flex items-center justify-center transition-transform hover:scale-125 border-2 border-white`}>
                                        <Truck className="h-3 w-3 text-white" />
                                    </div>

                                    {/* Hover HUD Label */}
                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-white p-3 rounded-xl shadow-2xl border border-black/5 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                                        <p className="text-[9px] font-black uppercase text-slate-400 mb-1">{truck.id}</p>
                                        <p className="text-xs font-black text-slate-900 mb-2">{truck.driver}</p>
                                        <div className="flex gap-3 text-[8px] font-black uppercase tracking-widest">
                                            <span className="text-emerald-500">{truck.metrics.fuel}% Fuel</span>
                                            <span className="text-primary">{truck.metrics.dist}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map HUD Controls - Light Mode */}
                    <div className="absolute bottom-8 left-8 right-8 z-30 flex justify-between items-end">
                        <div className="bg-white/80 backdrop-blur-xl border border-black/5 p-4 rounded-2xl shadow-xl flex gap-1">
                            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-600">
                                <LocateFixed className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-600">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                onClick={handleOptimize}
                                className="h-14 px-8 rounded-2xl bg-white text-slate-900 border border-black/5 hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] shadow-2xl group overflow-hidden relative"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {isOptimizing ? (
                                        <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                                    ) : (
                                        <Zap className="h-4 w-4 text-amber-500 fill-current" />
                                    )}
                                    {isOptimizing ? "Syncing Grid..." : "AI Route Optimizer"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Fleet KPI Overview - Light mode already but ensuring consistency */}
                <div className="lg:col-span-2 grid gap-6 md:grid-cols-2">
                    <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 border border-black/[0.03]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <ShieldCheck className="h-7 w-7 text-emerald-600" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Network Efficiency</p>
                                <p className="text-3xl font-black italic tracking-tighter text-slate-900">98.4%</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                <span>Optimization Target</span>
                                <span className="text-emerald-500">+2.1% ↑</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[94%]" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 border border-black/[0.03]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                                <BarChart3 className="h-7 w-7 text-primary" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Fleet</p>
                                <p className="text-3xl font-black italic tracking-tighter text-slate-900">14 / 16</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest">12 Normal</Badge>
                            <Badge className="bg-amber-50 text-amber-600 border-none font-black text-[9px] uppercase tracking-widest">2 Alerted</Badge>
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 border border-black/[0.03]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                                <Gauge className="h-7 w-7 text-amber-600" />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Fleet Health</p>
                                <p className="text-3xl font-black italic tracking-tighter text-slate-900">Optimal</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                            No critical vector failures detected across 5 RDCs.
                        </p>
                    </Card>

                    <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden group border border-white/5">
                        <Fuel className="absolute -right-4 -bottom-4 h-24 w-24 text-white/5 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Fuel Economy Index</p>
                                <div className="text-3xl font-black italic tracking-tighter uppercase leading-none">12.4 Km/L</div>
                            </div>
                            <div className="flex items-center gap-2 mt-4 relative z-10">
                                <div className="h-1 w-full bg-white/10 rounded-full">
                                    <div className="h-full bg-primary w-[99.8%]" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Fleet Dispatch Queue */}
            <div className="space-y-8">
                <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col h-[750px] border border-black/5">
                    <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Fleet Queue</CardTitle>
                            <div className="h-8 w-8 bg-black/5 rounded-xl flex items-center justify-center">
                                <RefreshCw className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                        <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">
                            Live vector synchronization for regional assets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                        {queue.map(truck => (
                            <div
                                key={truck.id}
                                className="p-6 rounded-[2.5rem] bg-slate-50 border border-black/[0.03] hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all group relative overflow-hidden"
                            >
                                {truck.status === "IN ROUTE" && (
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${truck.status === 'IN ROUTE' ? 'bg-emerald-500/10 text-emerald-600' :
                                            truck.status === 'LOADING' ? 'bg-primary/10 text-primary' : 'bg-slate-200/50 text-slate-400'
                                            }`}>
                                            <Truck className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{truck.id}</p>
                                            <p className="text-sm font-black text-slate-900 leading-none">{truck.driver}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Progress Matrix</span>
                                        <span className="text-slate-900 italic">{Math.floor(truck.progress)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white rounded-full overflow-hidden p-0.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${truck.status === 'IN ROUTE' ? 'bg-emerald-500' :
                                                truck.status === 'LOADING' ? 'bg-primary' : 'bg-slate-300'
                                                }`}
                                            style={{ width: `${truck.progress}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-end pt-2">
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Time to Node</p>
                                            <p className="font-black italic text-lg tracking-tighter text-slate-900">{truck.eta}</p>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group">
                                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-10 border-t border-black/5 bg-slate-50/50">
                        <Button className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 group" onClick={() => { }}>
                            Expand Global Reach <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
