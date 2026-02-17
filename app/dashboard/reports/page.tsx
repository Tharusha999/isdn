"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Download,
    ShoppingCart,
    Users,
    Zap,
    ArrowUpRight,
    Target,
    Activity,
    RefreshCw,
    CheckCircle2,
    FileText
} from "lucide-react";


export default function ReportsPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [genSuccess, setGenSuccess] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setGenSuccess(true);
            setTimeout(() => setGenSuccess(false), 3000);
        }, 2500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Intelligence Hub</h2>
                    <p className="text-muted-foreground font-bold text-sm">
                        Advanced predictive analytics and system-wide KPI orchestration.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="flex p-1 bg-black/5 rounded-2xl">
                        {["Day", "Week", "Month", "Year"].map((t) => (
                            <button
                                key={t}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === "Month" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-black"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="rounded-2xl bg-black text-white shadow-xl hover:shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10 group transition-all"
                    >
                        {isGenerating ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : genSuccess ? (
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" />
                        ) : (
                            <Download className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                        )}
                        {isGenerating ? "Compiling Data..." : genSuccess ? "Report Ready" : "Generate Q3 Report"}
                    </Button>
                </div>
            </div>

            {/* Top KPI Row */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gross Sales</p>
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none">Rs. 12.4M</div>
                    <div className="flex items-center gap-1 mt-6 text-emerald-500">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase">+12.5% Month</span>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Volume</p>
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="h-4 w-4 text-primary" />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none">1,284</div>
                    <div className="flex items-center gap-1 mt-6 text-emerald-500">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase">+5.2% Velocity</span>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Partner Ret.</p>
                        <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-amber-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-black italic tracking-tighter uppercase leading-none">94.2%</div>
                    <div className="flex items-center gap-1 mt-6 text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase">Above Target</span>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-black text-white rounded-[2rem] p-8 overflow-hidden group relative">
                    <div className="absolute top-0 right-0 p-8">
                        <Zap className="h-12 w-12 text-white/5" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">System Uptime</p>
                            <div className="text-3xl font-black italic tracking-tighter uppercase leading-none">99.99%</div>
                        </div>
                        <div className="flex items-center gap-2 mt-6">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">Nodes Operational</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Visual Analytics Section */}
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-10 overflow-hidden">
                    <CardHeader className="p-0 mb-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Regional Performance</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">Cross-RDC sales and payload efficiency.</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl border border-black/5 transition-transform hover:scale-110 active:scale-95">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex items-end justify-between h-64 gap-4 px-4">
                            {[
                                { label: "North", val: 65, color: "bg-primary" },
                                { label: "South", val: 82, color: "bg-emerald-500" },
                                { label: "East", val: 45, color: "bg-amber-500" },
                                { label: "West", val: 95, color: "bg-black" },
                                { label: "Central", val: 78, color: "bg-indigo-500" }
                            ].map((bar, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="w-full relative">
                                        <div
                                            className={`w-full ${bar.color} rounded-2xl transition-all duration-1000 group-hover:brightness-110 shadow-lg`}
                                            style={{ height: `${bar.val}%` }}
                                        />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] font-black px-2 py-1 rounded-lg">
                                            {bar.val}%
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-10 flex flex-col">
                    <CardHeader className="p-0 mb-10">
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Category Mix</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">Order value distribution.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col justify-center">
                        <div className="relative w-48 h-48 mx-auto mb-10">
                            <div className="absolute inset-0 rounded-full border-[20px] border-primary/10" />
                            <div className="absolute inset-0 rounded-full border-[20px] border-primary border-t-transparent border-r-transparent -rotate-45" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <p className="text-3xl font-black italic tracking-tighter underline decoration-primary decoration-4">74%</p>
                                <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Pantry Hub</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Pantry</span>
                                <span>74%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Beverages</span>
                                <span>18%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300" /> Other</span>
                                <span>8%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Insight Row */}
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="border-none shadow-sm bg-emerald-500 text-white rounded-[2rem] p-8 group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8">
                        <Target className="h-12 w-12 text-white/20 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Inventory Efficiency</p>
                        <div className="text-4xl font-black italic tracking-tighter uppercase leading-none">Optimum</div>
                        <p className="text-[10px] font-black uppercase mt-6 tracking-widest bg-white/20 w-fit px-3 py-1 rounded-full">AI Recommended</p>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 flex flex-col justify-between group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Fleet Readiness</p>
                            <div className="text-3xl font-black italic tracking-tighter uppercase leading-none">92%</div>
                        </div>
                        <Activity className="h-5 w-5 text-primary/20" />
                    </div>
                    <div className="h-1.5 bg-black/5 rounded-full overflow-hidden mt-6">
                        <div className="h-full bg-primary rounded-full w-[92%]" />
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-black text-white rounded-[2rem] p-8 flex items-center gap-6 group hover:bg-primary transition-colors cursor-pointer">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Latest Insight</p>
                        <p className="font-bold text-sm tracking-tight group-hover:underline underline-offset-4">Annual Growth Projection Q4 →</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

const Maximize2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
);
