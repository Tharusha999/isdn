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
    ShieldCheck,
    MapPin,
    Navigation,
    Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { INITIAL_MISSIONS, INITIAL_PRODUCTS, Mission } from "@/lib/data";

export default function DashboardPage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (role !== storedRole) {
            const timer = setTimeout(() => setRole(storedRole), 0);
            return () => clearTimeout(timer);
        }
    }, [role]);

    // Load missions from localStorage on mount
    useEffect(() => {
        const savedMissions = localStorage.getItem('isdn_missions');
        if (savedMissions) {
            try {
                setMissions(JSON.parse(savedMissions));
            } catch (e) {
                console.error("Failed to parse missions", e);
            }
        }
    }, []);

    // Save missions to localStorage on change
    useEffect(() => {
        localStorage.setItem('isdn_missions', JSON.stringify(missions));
    }, [missions]);

    const handleUpdateMission = (missionId: string, updates: Partial<Mission>) => {
        setMissions(prev => prev.map(m => m.id === missionId ? { ...m, ...updates } : m));
    };

    const handleToggleTask = (missionId: string, taskIdx: number) => {
        setMissions(prev => prev.map(m => {
            if (m.id === missionId) {
                const tasks = [...m.tasks];
                tasks[taskIdx] = { ...tasks[taskIdx], done: !tasks[taskIdx].done };
                return { ...m, tasks };
            }
            return m;
        }));
    };

    if (role === 'customer') {
        const activeOrders = [
            { id: '#ORD-9921', status: 'Delivered', date: 'Feb 15, 2025', amount: 'Rs. 14,500' },
            { id: '#ORD-9945', status: 'In Transit', date: 'Feb 17, 2025', amount: 'Rs. 21,200' },
            { id: '#ORD-9952', status: 'Processing', date: 'Feb 18, 2025', amount: 'Rs. 8,500' },
        ];

        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Executive Welcome */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">My Supply Network</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                            Real-time oversight of your procurement and logistics operations.
                        </p>
                    </div>
                    <Button variant="ghost" className="h-12 border border-black/5 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">
                        Download Q1 Statement
                    </Button>
                </div>

                {/* Hub Quick-Links */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "New Order", path: "/dashboard/products", color: "bg-indigo-50", icon: Package, val: "Catalog", text: "text-indigo-600" },
                        { label: "Active Orders", path: "/dashboard/orders", color: "bg-emerald-50", icon: Truck, val: "3 Active", text: "text-emerald-600" },
                        { label: "Payment Due", path: "/dashboard/finance", color: "bg-amber-50", icon: DollarSign, val: "Rs. 0.00", text: "text-amber-600" },
                        { label: "Priority Help", path: "/dashboard/settings", color: "bg-slate-50", icon: ShieldCheck, val: "24/7 Desk", text: "text-slate-900" }
                    ].map((hub) => (
                        <Card
                            key={hub.label}
                            onClick={() => router.push(hub.path)}
                            className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 cursor-pointer group border border-black/[0.03] transition-all hover:scale-[1.02] hover:shadow-black/10"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-14 w-14 rounded-2xl ${hub.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                    <hub.icon className={`h-7 w-7 ${hub.text}`} />
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{hub.label}</p>
                                <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{hub.val}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Active Transit Matrix */}
                <div className="grid gap-8 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                        <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Transit Matrix</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Live tracking of your inbound logistics.</CardDescription>
                                </div>
                                <div className="h-10 w-10 bg-white shadow-md rounded-xl flex items-center justify-center border border-black/5">
                                    <Navigation className="h-5 w-5 text-slate-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                {activeOrders.map((order, i) => (
                                    <div
                                        key={i}
                                        className="p-6 rounded-[2.5rem] bg-slate-50 border border-black/[0.03] hover:shadow-2xl hover:shadow-black/5 transition-all group cursor-pointer relative overflow-hidden"
                                        onClick={() => router.push('/dashboard/logistics/track')}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-sm text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-black italic text-lg tracking-tighter text-slate-900 underline decoration-slate-200 decoration-2 underline-offset-4">{order.id}</span>
                                                        <Badge className={`font-black text-[9px] uppercase tracking-widest border-none px-4 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                                                            order.status === 'In Transit' ? 'bg-indigo-100 text-indigo-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-lg font-black italic tracking-tighter text-slate-900">{order.amount}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden p-0.5">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${order.status === 'Delivered' ? 'bg-emerald-500 w-full' :
                                                                order.status === 'In Transit' ? 'bg-indigo-500 w-[65%]' :
                                                                    'bg-amber-500 w-[15%]'
                                                                }`}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                                        <span>Arrival: {order.date}</span>
                                                        <span className="text-slate-900">{order.status === 'Delivered' ? 'Completed' : 'On Vector'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Activity Feed */}
                    <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col border border-black/5">
                        <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Activity Feed</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 flex-1 overflow-y-auto">
                            {[
                                { title: "Order Delivered", desc: "Order #ORD-9921 arrived at location", color: "bg-emerald-50", iconColor: "text-emerald-600", time: "2h ago" },
                                { title: "Payment Confirmed", desc: "Invoice paid for #ORD-9921", color: "bg-indigo-50", iconColor: "text-indigo-600", time: "5h ago" },
                                { title: "New Promotion", desc: "Summer Bash Sale is live!", color: "bg-amber-50", iconColor: "text-amber-600", time: "1d ago" },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-6 group hover:-translate-y-1 transition-all cursor-pointer">
                                    <div className={`h-12 w-12 rounded-2xl ${log.color} flex items-center justify-center shrink-0 shadow-sm text-white transition-all group-hover:scale-110`}>
                                        <Zap className={`h-6 w-6 ${log.iconColor} fill-current`} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-black uppercase italic tracking-tight text-slate-900 leading-none">{log.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-widest mt-1">{log.desc}</p>
                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest pt-2">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-10 bg-slate-50 border-t border-black/5">
                            <Button
                                onClick={() => router.push('/dashboard/products')}
                                className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 group"
                            >
                                Place New Order <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (role === 'driver') {
        const activeRoute = missions.find(m => m.driverName === 'Sam Perera') || missions[0];

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Operations Cockpit</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Active Duty: Alpha-7 Logistics Team | Node Sync: 99.8%</p>
                    </div>
                    <Badge variant="outline" className="h-10 px-6 rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-600 font-black uppercase tracking-widest text-[9px]">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" /> Live Grid Connection
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 group relative overflow-hidden border border-black/[0.03]">
                        <Truck className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-100 -rotate-12 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Asset</p>
                            <div className="text-2xl font-black tracking-tight uppercase italic mb-4 text-slate-900">{activeRoute.vehicle}</div>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                                <ShieldCheck className="h-3 w-3" /> System Secure
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-black/[0.03]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Vector</p>
                            <div className="text-xl font-black tracking-tighter uppercase mb-1 leading-tight line-clamp-1 italic text-slate-900">{activeRoute.currentLocation}</div>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-500">
                            <MapPin className="h-3 w-3" /> Sector S-02
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-black/[0.03]">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Telemetry Index</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Fuel</p>
                                    <p className="font-black italic text-lg leading-none text-slate-900">{activeRoute.telemetry.fuel}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Load</p>
                                    <p className="font-black italic text-lg leading-none text-slate-900">{activeRoute.telemetry.load}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-xl bg-slate-50 rounded-[2.5rem] p-8 flex flex-col justify-between group">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Daily Traverse</p>
                            <div className="text-2xl font-black tracking-tighter text-slate-900 italic leading-none">{activeRoute.kmTraversed}</div>
                        </div>
                        <Navigation className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                    </Card>
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col border border-black/[0.03]">
                        <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Mission Timeline</CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Route Sync: {activeRoute.id} | Priority High</CardDescription>
                                </div>
                                <div className="h-10 w-10 bg-white shadow-md rounded-xl flex items-center justify-center border border-black/5">
                                    <Clock className="h-5 w-5 text-slate-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="space-y-10 relative">
                                <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100" />
                                {activeRoute.tasks.map((task, idx) => (
                                    <div key={idx} className="flex gap-8 relative items-start group">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center relative z-10 shadow-lg transition-all group-hover:scale-110 ${task.done ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-slate-300'}`}>
                                            {task.done ? <ShieldCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className={`font-black text-sm uppercase tracking-tight italic ${task.done ? 'text-slate-900' : 'text-slate-400'}`}>{task.label}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{task.location}</p>
                                                </div>
                                                <span className="text-[10px] font-black tabular-nums text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{task.time}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest px-3 border-none ${task.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    {task.done ? 'Operations Complete' : 'Awaiting Arrival'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>


                </div>
            </div>

        );
    }


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Executive Welcome */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Network Commander</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                        Unified executive oversight of regional distribution, inventory, and fleet missions.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" className="h-12 border border-black/5 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest px-6">
                        <Calendar className="mr-3 h-4 w-4" /> Network Schedule
                    </Button>
                    <Button className="h-12 bg-slate-900 text-white rounded-xl shadow-2xl shadow-black/20 font-black uppercase text-[10px] tracking-widest px-6 hover:bg-black transition-all">
                        <Globe className="mr-3 h-4 w-4" /> System Health: 99.9%
                    </Button>
                </div>
            </div>

            {/* Hub Quick-Links */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                    {
                        label: "Global Consignment",
                        path: "/dashboard/inventory",
                        color: "bg-indigo-50",
                        icon: Package,
                        val: INITIAL_PRODUCTS.reduce((acc, p) => acc + Object.values(p.stock).reduce((a, b) => a + b, 0), 0).toLocaleString(),
                        text: "text-indigo-600"
                    },
                    { label: "Dispatch Management", path: "/dashboard/management/dispatch", color: "bg-emerald-50", icon: Navigation, val: "Command Center", text: "text-emerald-600" },
                    { label: "Finance Ledger", path: "/dashboard/finance", color: "bg-amber-50", icon: DollarSign, val: "Rs. 8.2M", text: "text-amber-600" },
                    { label: "Intelligence", path: "/dashboard/reports", color: "bg-slate-900", icon: BarChart3, val: "+12.5% Growth", text: "text-white" }
                ].map((hub) => (
                    <Card
                        key={hub.label}
                        onClick={() => router.push(hub.path)}
                        className={`border-none shadow-2xl rounded-[2.5rem] p-8 cursor-pointer group border border-black/[0.03] transition-all hover:scale-[1.02] ${hub.label === 'Intelligence' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`h-14 w-14 rounded-2xl ${hub.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                <hub.icon className={`h-7 w-7 ${hub.text}`} />
                            </div>
                            <ArrowUpRight className={`h-4 w-4 transition-colors ${hub.label === 'Intelligence' ? 'text-white/40 group-hover:text-white' : 'text-slate-300 group-hover:text-slate-900'}`} />
                        </div>
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${hub.label === 'Intelligence' ? 'text-white/40' : 'text-slate-400'}`}>{hub.label}</p>
                            <p className="text-2xl font-black italic tracking-tighter">{hub.val}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Network Health & Activity Matrix */}
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden group relative border border-black/5">
                    <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50 relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">Network Health Matrix</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Live synchronisation of regional distribution nodes.</CardDescription>
                            </div>
                            <div className="h-12 w-12 bg-white shadow-md rounded-2xl flex items-center justify-center border border-black/5">
                                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 relative z-10 h-[350px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
                        <div className="relative w-full max-w-sm h-full flex items-center justify-center">
                            <div className="relative flex gap-8 items-end h-40">
                                {[65, 82, 45, 95, 78].map((h, i) => (
                                    <div key={i} className="flex flex-col items-center gap-6">
                                        <div className="w-8 h-40 bg-slate-50 rounded-full relative flex items-end p-1 border border-black/[0.02]">
                                            <div
                                                className={`w-full rounded-full transition-all duration-2000 shadow-lg ${h > 80 ? 'bg-indigo-500 shadow-indigo-500/20' : h > 50 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}
                                                style={{ height: `${h}%` }}
                                            />
                                            {h > 80 && <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-600">{h}%</div>}
                                        </div>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Node {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>

                    <div className="p-8 border-t border-black/5 flex justify-between items-center bg-slate-50/30">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">End-to-End Encryption Active</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 tabular-nums">Protocol: ISDN-SIGMA-9</p>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col border border-black/5">
                    <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                        <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">Live System Feed</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8 flex-1 overflow-y-auto">
                        {[
                            { title: "Stock Authorized", desc: "450 Units moved Central → North", color: "bg-emerald-50", iconColor: "text-emerald-600", time: "2m" },
                            { title: "Dispatch Active", desc: "Truck #RT-2280 is now in transit", color: "bg-slate-100", iconColor: "text-slate-900", time: "14m" },
                            { title: "Payment Verified", desc: "Invoice #INV-201-B settled", color: "bg-amber-50", iconColor: "text-amber-600", time: "32m" },
                            { title: "Alert Clearance", desc: "Low stock alert resolved at West RDC", color: "bg-indigo-50", iconColor: "text-indigo-600", time: "1h" },
                            { title: "System Sync", desc: "Manual node reconciliation complete", color: "bg-slate-50", iconColor: "text-slate-400", time: "3h" }
                        ].map((log, i) => (
                            <div key={i} className="flex gap-6 group cursor-pointer">
                                <div className={`h-10 w-10 rounded-xl ${log.color} flex items-center justify-center shrink-0 transition-all group-hover:scale-110`}>
                                    <Zap className={`h-5 w-5 ${log.iconColor} fill-current`} />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex justify-between items-baseline gap-4">
                                        <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">{log.title}</p>
                                        <span className="text-[9px] font-black text-slate-300 tabular-nums">{log.time}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-widest">{log.desc}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-10 border-t border-black/5 bg-slate-50">
                        <Button variant="ghost" className="w-full h-14 rounded-xl border border-black/5 bg-white text-slate-900 font-black uppercase tracking-widest text-[9px] hover:bg-slate-900 hover:text-white transition-all">
                            View Comprehensive Logs
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

const OperationsCockpit = ({ activeRoute }: { activeRoute: Mission }) => (
    <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 group relative overflow-hidden border border-black/[0.03]">
            <Truck className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-100 -rotate-12 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Asset</p>
                <div className="text-2xl font-black tracking-tight uppercase italic mb-4 text-slate-900">{activeRoute.vehicle}</div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                    <ShieldCheck className="h-3 w-3" /> System Secure
                </div>
            </div>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-black/[0.03]">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Vector</p>
                <div className="text-xl font-black tracking-tighter uppercase mb-1 leading-tight line-clamp-1 italic text-slate-900">{activeRoute.currentLocation}</div>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-500">
                <MapPin className="h-3 w-3" /> Sector S-02
            </div>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-black/[0.03]">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Telemetry Index</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Fuel</p>
                        <p className="font-black italic text-lg leading-none text-slate-900">{activeRoute.telemetry.fuel}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Load</p>
                        <p className="font-black italic text-lg leading-none text-slate-900">{activeRoute.telemetry.load}</p>
                    </div>
                </div>
            </div>
        </Card>

        <Card className="border-none shadow-xl bg-slate-50 rounded-[2.5rem] p-8 flex flex-col justify-between group">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Daily Traverse</p>
                <div className="text-2xl font-black tracking-tighter text-slate-900 italic leading-none">{activeRoute.kmTraversed}</div>
            </div>
            <Navigation className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
        </Card>
    </div>
);

const MissionTimeline = ({ activeRoute, fullWidth }: { activeRoute: Mission, fullWidth?: boolean }) => (
    <Card className={`${fullWidth ? 'w-full' : 'w-full max-w-2xl'} border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col border border-black/[0.03]`}>
        <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Mission Timeline</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Route Sync: {activeRoute.id} | Priority High</CardDescription>
                </div>
                <div className="h-10 w-10 bg-white shadow-md rounded-xl flex items-center justify-center border border-black/5">
                    <Clock className="h-5 w-5 text-slate-400" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-10">
            <div className="space-y-10 relative">
                <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100" />
                {activeRoute.tasks.map((task, idx) => (
                    <div key={idx} className="flex gap-8 relative items-start group">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center relative z-10 shadow-lg transition-all group-hover:scale-110 ${task.done ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-slate-300'}`}>
                            {task.done ? <ShieldCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className={`font-black text-sm uppercase tracking-tight italic ${task.done ? 'text-slate-900' : 'text-slate-400'}`}>{task.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{task.location}</p>
                                </div>
                                <span className="text-[10px] font-black tabular-nums text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{task.time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest px-3 border-none ${task.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                    {task.done ? 'Operations Complete' : 'Awaiting Arrival'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const Globe = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
