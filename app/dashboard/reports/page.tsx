"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Box,
    Users,
    Shield,
    BarChart2,
    PieChart,
    Truck,
    BrainCircuit,
    ArrowUpRight,
    CheckCircle2,
    Zap,
    FileText
} from "lucide-react";
import {
    INITIAL_PRODUCTS,
    INITIAL_ORDERS,
    INITIAL_TRANSACTIONS,
    RDCS
} from "@/lib/data";

export default function ReportsPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    // Calculate dynamic stats
    const totalSales = INITIAL_TRANSACTIONS.reduce((acc, t) => t.status === "PAID" ? acc + t.amount : acc, 0);
    const orderVolume = INITIAL_ORDERS.length;

    const rdcSales = RDCS.map(rdc => {
        const orders = INITIAL_ORDERS.filter(o => o.rdc === rdc);
        const total = orders.reduce((acc, o) => acc + o.total, 0);
        return { name: rdc.split(" ")[0], value: total };
    });

    const maxRdcValue = Math.max(...rdcSales.map(r => r.value), 1);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Intelligence Hub</h2>
                    <p className="text-muted-foreground font-bold text-sm">
                        Executive analytics and real-time network performance monitoring.
                    </p>
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="rounded-2xl bg-black text-white shadow-xl hover:shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10 transition-all hover:scale-105 active:scale-95"
                >
                    {isGenerating ? <div className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Compiling Q3...</div> : "Generate Q3 Report"}
                </Button>
            </div>

            {/* Main KPIs */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 overflow-hidden group border border-black/[0.03]">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gross Sales</p>
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                        Rs. {(totalSales / 1000).toFixed(1)}K
                    </div>
                    <div className="flex items-center gap-1 mt-6 text-emerald-500">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">+12.5% Month</span>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 overflow-hidden group border border-black/[0.03]">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Volume</p>
                        <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center">
                            <Box className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none text-slate-900">{orderVolume} Nodes</div>
                    <div className="flex items-center gap-1 mt-6 text-slate-400">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Target: 250</span>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 overflow-hidden group border border-black/[0.03]">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partner Ret.</p>
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <Users className="h-5 w-5 text-indigo-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none text-slate-900">98.2%</div>
                    <div className="flex items-center gap-1 mt-6 text-emerald-500">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Strong Affinity</span>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 overflow-hidden group border border-black/[0.03]">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Uptime</p>
                        <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center animate-pulse">
                            <Shield className="h-5 w-5 text-rose-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none text-slate-900">99.98%</div>
                    <div className="flex items-center gap-1 mt-6 text-rose-500">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Mission Critical</span>
                    </div>
                </Card>
            </div>

            {/* Reports and Charts */}
            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-10 overflow-hidden border border-black/5 relative active:scale-[0.99] transition-transform cursor-crosshair group">
                    <div className="absolute top-0 right-0 p-8">
                        <BarChart2 className="h-6 w-6 text-slate-100 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-10 text-slate-950">Regional Performance</h3>
                    <div className="h-64 flex items-end justify-between gap-6 px-4">
                        {rdcSales.map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                <div
                                    className="w-full bg-slate-900 rounded-2xl relative transition-all duration-1000 group-hover/bar:bg-primary group-hover/bar:scale-x-110"
                                    style={{ height: `${(item.value / maxRdcValue) * 100}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black text-white text-[8px] font-black px-2 py-1 rounded-full whitespace-nowrap">
                                        Rs. {(item.value / 1000).toFixed(1)}K
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/bar:text-slate-900">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-10 overflow-hidden border border-black/5 relative group">
                    <div className="absolute top-0 right-0 p-8">
                        <PieChart className="h-6 w-6 text-slate-100 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-10 text-slate-950">Category Mix</h3>
                    <div className="flex items-center justify-center h-64 gap-12">
                        <div className="relative h-48 w-48 rounded-full border-[20px] border-slate-900 border-t-indigo-500 border-l-rose-500 border-r-emerald-500 rotate-45 animate-[spin_20s_linear_infinite] group-hover:animate-none group-hover:scale-110 transition-transform">
                            <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                                <span className="text-2xl font-black text-slate-950 italic">74%</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Packaged Food", color: "bg-slate-900", val: "45%" },
                                { label: "Beverages", color: "bg-indigo-500", val: "22%" },
                                { label: "Personal Care", color: "bg-emerald-500", val: "18%" },
                                { label: "Home Cleaning", color: "bg-rose-500", val: "15%" }
                            ].map((cat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`h-3 w-3 rounded-full ${cat.color}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{cat.label}</span>
                                    <span className="text-[10px] font-black text-slate-900 ml-auto italic">{cat.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Insight Rows */}
            <div className="grid gap-8 md:grid-cols-3">
                {[
                    {
                        title: "Inventory Efficiency",
                        val: "1.2x",
                        desc: "Stock turnover velocity above average.",
                        icon: Zap,
                        color: "text-amber-500",
                        bg: "bg-amber-50"
                    },
                    {
                        title: "Fleet Readiness",
                        val: "94%",
                        desc: "Optimal vehicle utilization in Western RDC.",
                        icon: Truck,
                        color: "text-indigo-500",
                        bg: "bg-indigo-50"
                    },
                    {
                        title: "Advanced Forecasting",
                        val: "+4.1%",
                        desc: "AI predicted demand spike for Q4 beverages.",
                        icon: BrainCircuit,
                        color: "text-rose-500",
                        bg: "bg-rose-50"
                    }
                ].map((insight, i) => (
                    <Card key={i} className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 overflow-hidden border border-black/5 group hover:bg-slate-950 hover:text-white transition-all duration-500 translate-y-0 hover:-translate-y-2">
                        <div className={`h-12 w-12 rounded-2xl ${insight.bg} flex items-center justify-center mb-8 group-hover:bg-white/10`}>
                            <insight.icon className={`h-6 w-6 ${insight.color} group-hover:text-white`} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{insight.title}</p>
                        <div className="text-3xl font-black italic tracking-tighter uppercase mb-2">{insight.val}</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] leading-relaxed group-hover:text-white/40">{insight.desc}</p>
                    </Card>
                ))}
            </div>

            {/* Generation Overlay */}
            {isGenerating && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-2xl flex items-center justify-center p-8">
                    <div className="max-w-md w-full space-y-8 text-center animate-in zoom-in duration-500">
                        <div className="relative h-48 w-48 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                            <div
                                className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-[spin_1s_linear_infinite]"
                                style={{ transform: `rotate(${progress * 3.6}deg)` }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black italic text-slate-950">{progress}%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Analyzing</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Compiling Executive Q3</h3>
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Integrating Ledger Entries...</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulating Market Trends...</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Optimizing Logistics Matrices...</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="fixed bottom-12 right-12 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <Card className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl flex items-center gap-6 border-none ring-8 ring-white">
                        <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 animate-bounce">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-black uppercase tracking-tighter text-xl italic leading-none">Intelligence Compiled</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Automated PDF available in HQ Portal</p>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
