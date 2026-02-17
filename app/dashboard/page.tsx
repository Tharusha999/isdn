"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DollarSign,
    BarChart3,
    ArrowUpRight,
    Package,
    Truck,
    Calendar,
    Zap,
    ArrowRight,
    ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (role !== storedRole) {
            setRole(storedRole);
        }
    }, [role]);

    if (role === 'customer') {
        const orders = [
            { id: '#ORD-9921', status: 'Delivered', date: 'Feb 15, 2024', amount: 'Rs. 14,500' },
            { id: '#ORD-9945', status: 'In Transit', date: 'Feb 17, 2024', amount: 'Rs. 21,200' },
            { id: '#ORD-9952', status: 'Processing', date: 'Feb 18, 2024', amount: 'Rs. 8,500' },
        ];

        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">My Supply Line</h2>
                    <p className="text-sm text-muted-foreground font-bold italic">Tracking the flow of your bulk orders across the regional grid.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {orders.map((order, i) => (
                        <Card key={i} className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 group hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <p className="font-black text-xs uppercase text-primary">{order.id}</p>
                                <Badge className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest border-none ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                                    order.status === 'In Transit' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-amber-500/10 text-amber-600'
                                    }`}>
                                    {order.status}
                                </Badge>
                            </div>
                            <div className="text-2xl font-black italic tracking-tighter mb-4">{order.amount}</div>
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-bold text-muted-foreground">{order.date}</p>
                                <Button variant="ghost" size="icon" className="h-10 w-10 p-0 rounded-xl hover:bg-black hover:text-white transition-all">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <Button
                    onClick={() => router.push('/dashboard/products')}
                    className="w-full h-20 rounded-[2rem] bg-black text-white hover:bg-black/90 font-black uppercase tracking-widest text-lg shadow-2xl group"
                >
                    Quick Order Console <Zap className="ml-3 h-6 w-6 text-amber-400 fill-current group-hover:scale-125 transition-transform" />
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Executive Welcome */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">ISDN Network Commander</h2>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_theme(colors.emerald.500)]" />
                    </div>
                    <p className="text-muted-foreground font-bold text-sm">
                        Unified executive oversight of regional distribution, inventory, and finance.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-black/5 bg-white shadow-sm font-black uppercase text-[10px] tracking-widest h-14 px-8">
                        <Calendar className="mr-2 h-4 w-4" /> Network Schedule
                    </Button>
                    <Button className="rounded-2xl bg-black text-white shadow-xl hover:shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10">
                        <Globe className="mr-2 h-4 w-4 text-primary" /> System Health: 99.9%
                    </Button>
                </div>
            </div>

            {/* Hub Quick-Links */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Inventory Hub", path: "/dashboard/inventory", color: "bg-indigo-500", icon: Package, val: "1,204 SKU" },
                    { label: "Logistics Grid", path: "/dashboard/logistics", color: "bg-emerald-500", icon: Truck, val: "14 Active" },
                    { label: "Finance Ledger", path: "/dashboard/finance", color: "bg-amber-500", icon: DollarSign, val: "Rs. 8.2M" },
                    { label: "Intelligence", path: "/dashboard/reports", color: "bg-primary", icon: BarChart3, val: "+12.5% Growth" }
                ].map((hub) => (
                    <Card
                        key={hub.label}
                        onClick={() => router.push(hub.path)}
                        className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 group cursor-pointer hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`h-12 w-12 rounded-2xl ${hub.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <hub.icon className="h-6 w-6" />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{hub.label}</p>
                        <div className="text-2xl font-black italic tracking-tighter uppercase">{hub.val}</div>
                    </Card>
                ))}
            </div>

            {/* Network Health & Activity Matrix */}
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm bg-black text-white rounded-[2.5rem] overflow-hidden group relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-primary/10" />

                    <CardHeader className="p-10 border-b border-white/5 relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Network Health Matrix</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">Live synchronisation of regional توزيع (distribution) nodes.</CardDescription>
                            </div>
                            <ShieldCheck className="h-8 w-8 text-emerald-500" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 relative z-10 h-[350px] flex items-center justify-center">
                        <div className="relative w-full max-w-md h-full flex items-center justify-center">
                            {/* 3D-effect Grid Visualisation */}
                            <div className="absolute inset-0 border border-white/5 rounded-[2rem] rotate-x-45 scale-y-50 -skew-x-12 bg-white/[0.02]" />
                            <div className="absolute inset-0 border border-white/5 rounded-[2rem] rotate-x-45 scale-y-50 -skew-x-12 translate-y-10 bg-white/[0.01]" />

                            <div className="relative flex gap-8">
                                {[65, 82, 45, 95, 78].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 group/node">
                                        <div className="w-8 h-40 bg-white/5 rounded-full relative flex items-end p-1">
                                            <div
                                                className={`w-full rounded-full transition-all duration-1000 ${h > 80 ? 'bg-primary' : h > 50 ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                                                style={{ height: `${h}%` }}
                                            />
                                        </div>
                                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Node {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center opacity-40">
                        <p className="text-[8px] font-black uppercase tracking-widest">End-to-End Encryption Active</p>
                        <p className="text-[8px] font-black uppercase tracking-widest">Protocol: ISDN-SIGMA-9</p>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-[550px]">
                    <CardHeader className="p-8 border-b border-black/5 bg-black/[0.02]">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter italic">Live System Feed</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6 overflow-y-auto flex-1">
                        {[
                            { title: "Stock Authorized", desc: "450 Units moved Central → North", color: "bg-emerald-500", time: "2m" },
                            { title: "Dispatch Active", desc: "Truck #RT-2280 is now in transit", color: "bg-primary", time: "14m" },
                            { title: "Payment Verified", desc: "Invoice #INV-201-B settled", color: "bg-amber-500", time: "32m" },
                            { title: "Alert Clearance", desc: "Low stock alert resolved at West RDC", color: "bg-indigo-500", time: "1h" },
                            { title: "System Sync", desc: "Manual node reconciliation complete", color: "bg-slate-500", time: "3h" }
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className={`h-8 w-8 rounded-xl ${log.color} flex items-center justify-center shrink-0 shadow-lg shadow-black/5`}>
                                    <Zap className="h-4 w-4 text-white" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <p className="font-black text-[10px] uppercase tracking-tighter">{log.title}</p>
                                        <span className="text-[8px] font-bold text-muted-foreground">{log.time}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 leading-tight">{log.desc}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-8 border-t border-black/5 bg-black/[0.02]">
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all h-10 rounded-xl">
                            All Events Log
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

const Globe = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
