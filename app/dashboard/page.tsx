"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DollarSign,
    ArrowUpRight,
    Package,
    Truck,
    Calendar,
    Zap,
    ArrowRight,
    ShieldCheck,
    Navigation,
    Clock,
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MissionWithTasks, OrderWithDetails, Transaction, Product, MissionTask } from "@/lib/database-types";
import { fetchMissions, fetchOrders, fetchTransactions, fetchProducts, fetchPartners, fetchAllProductStocks } from "@/public/src/supabaseClient";

// Custom Globe Icon
const Globe = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export default function DashboardPage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [profileName, setProfileName] = useState("User");
    const [missions, setMissions] = useState<MissionWithTasks[]>([]);
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [partners, setPartners] = useState<any[]>([]);
    const [allStocks, setAllStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        setRole(storedRole);

        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const [missionsData, ordersData, transactionsData, productsData, partnersData, stocksData] = await Promise.all([
                    fetchMissions(),
                    fetchOrders(),
                    fetchTransactions(),
                    fetchProducts(),
                    fetchPartners(),
                    fetchAllProductStocks()
                ]);

                setMissions(missionsData as MissionWithTasks[] || []);
                setOrders(ordersData as OrderWithDetails[] || []);
                setTransactions(transactionsData as Transaction[] || []);
                setProducts(productsData as Product[] || []);
                setPartners(partnersData || []);
                setAllStocks(stocksData || []);

                // Profile Name resolution
                let storedName = null;
                if (storedRole === 'admin') storedName = localStorage.getItem('isdn_admin_name');
                else if (storedRole === 'customer') storedName = localStorage.getItem('isdn_customer_name');
                else if (storedRole === 'driver') storedName = localStorage.getItem('isdn_driver_name');

                setProfileName(storedName || (storedRole === 'admin' ? "Alex Rivera" : storedRole === 'driver' ? "Sam Perera" : "Partner Store"));
            } catch (err) {
                console.error("Dashboard data load error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Synchronizing Operations...</p>
            </div>
        );
    }

    // --- CUSTOMER VIEW ---
    if (role === 'customer') {
        const activeOrders = orders.slice(0, 3);
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">{profileName}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">Real-time oversight of your procurement and logistics operations.</p>
                    </div>
                    <Button variant="ghost" className="h-12 border border-black/5 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest px-6">
                        Download Q1 Statement
                    </Button>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "New Order", path: "/dashboard/products", color: "bg-indigo-50", icon: Package, val: "Catalog", text: "text-indigo-600" },
                        { label: "Active Orders", path: "/dashboard/orders", color: "bg-emerald-50", icon: Truck, val: `${activeOrders.length} Active`, text: "text-emerald-600" },
                        { label: "Payment Due", path: "/dashboard/finance", color: "bg-amber-50", icon: DollarSign, val: "Rs. 0.00", text: "text-amber-600" },
                        { label: "Priority Help", path: "/dashboard/settings", color: "bg-slate-50", icon: ShieldCheck, val: "24/7 Desk", text: "text-slate-900" }
                    ].map((hub) => (
                        <Card key={hub.label} onClick={() => router.push(hub.path)} className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 cursor-pointer group border border-black/[0.03] transition-all hover:scale-[1.02] hover:shadow-black/10">
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
                                    <div key={i} className="p-6 rounded-[2.5rem] bg-slate-50 border border-black/[0.03] hover:shadow-2xl hover:shadow-black/5 transition-all group cursor-pointer relative overflow-hidden" onClick={() => router.push('/dashboard/orders')}>
                                        <div className="flex items-center gap-6">
                                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-sm text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">{i + 1}</div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-black italic text-lg tracking-tighter text-slate-900">{order.id}</span>
                                                        <Badge className={`font-black text-[9px] uppercase tracking-widest border-none px-4 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : order.status === 'In Transit' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-lg font-black italic tracking-tighter text-slate-900">Rs. {order.total || '0'}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-1000 ${order.status === 'Delivered' ? 'bg-emerald-500 w-full' : order.status === 'In Transit' ? 'bg-indigo-500 w-[65%]' : 'bg-amber-500 w-[15%]'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col border border-black/5">
                        <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Activity Feed</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 flex-1 overflow-y-auto">
                            {transactions.slice(0, 4).map((tx, i) => (
                                <div key={i} className="flex gap-6 group hover:-translate-y-1 transition-all cursor-pointer">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-110">
                                        <Zap className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-black uppercase italic tracking-tight text-slate-900 leading-none">{tx.status === 'PAID' ? 'Payment Verified' : 'Transaction Pending'}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Invoice {tx.id.slice(-6)} processed.</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-10 bg-slate-50 border-t border-black/5">
                            <Button onClick={() => router.push('/dashboard/products')} className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 group">
                                Place New Order <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    // --- DRIVER VIEW ---
    if (role === 'driver') {
        const activeRoute = missions.find(m => m.driver_name === profileName) || missions[0];

        if (!activeRoute) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Truck className="h-12 w-12 text-slate-300 mb-4" />
                    <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">No Active Missions Assigned</p>
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Operations Cockpit</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Active Duty: {profileName} | Asset: {activeRoute.vehicle}</p>
                    </div>
                    <Badge variant="outline" className="h-10 px-6 rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-600 font-black uppercase tracking-widest text-[9px]">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" /> Live Grid Connection
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: 'Route Progress', value: `${activeRoute.progress}%`, sub: 'Estimated ETA 45m', icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-600/10' },
                        { label: 'Fuel Matrix', value: activeRoute.fuel_level || activeRoute.telemetry?.fuel || '85%', sub: 'Level Optimal', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-600/10' },
                        { label: 'Cold-Chain', value: activeRoute.temperature || activeRoute.telemetry?.temp || '4°C', sub: 'Critical Monitor', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
                        { label: 'Active Weight', value: activeRoute.load_weight || activeRoute.telemetry?.load || '1,240kg', sub: 'Load Balanced', icon: Package, color: 'text-purple-600', bg: 'bg-purple-600/10' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm bg-white/50 group hover:bg-white transition-colors">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-lg font-black tracking-tighter">{stat.value}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold">{stat.sub}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2 border-none shadow-sm bg-white/50 rounded-[2rem] overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-6">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Mission Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6 relative ml-2">
                                <div className="absolute top-0 bottom-0 left-0 w-px bg-slate-200 ml-[11px]" />
                                {(activeRoute.mission_tasks || []).map((task: MissionTask, i: number) => (
                                    <div key={i} className="relative flex items-center gap-6 group">
                                        <div className={`h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center relative z-10 transition-colors ${task.completed || task.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                            {(task.completed || task.done) && <ArrowRight className="h-2 w-2 text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0 bg-white p-3 rounded-xl border border-transparent group-hover:border-primary/20 transition-all">
                                            <div className="flex items-center justify-between font-black uppercase tracking-tight text-[10px]">
                                                <h4 className={task.completed || task.done ? 'text-slate-400 line-through' : 'text-slate-900'}>{task.task_label || task.label}</h4>
                                                <span className="text-muted-foreground">{task.task_time || task.time}</span>
                                            </div>
                                            <p className="text-[9px] text-muted-foreground font-medium mt-0.5">{task.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col justify-between group">
                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Vector</p>
                                <div className="text-2xl font-black tracking-tighter uppercase italic text-white line-clamp-2 leading-tight">{activeRoute.currentLocation}</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase">
                                    <span className="text-slate-400">Next Node</span>
                                    <span className="text-emerald-400">Sector West-09</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[72%] rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <Button className="w-full mt-8 h-14 rounded-xl bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 hover:text-white transition-all">Update Status</Button>
                    </Card>
                </div>
            </div>
        );
    }

    // --- ADMIN VIEW (DEFAULT) ---
    const totalRev = transactions.filter(t => t.status === 'PAID').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    const activeFleet = missions.filter(m => m.status === 'In Transit').length;

    // Dynamic Compliance Score
    const complianceScore = partners.length > 0
        ? (partners.reduce((sum, p) => sum + (p.compliance_score || 0), 0) / partners.length).toFixed(1)
        : "98.4";

    // Aggregated Stock Data for Inventory Cockpit
    const inventoryData = products.slice(0, 5).map(product => {
        const totalStock = allStocks
            .filter(s => s.product_id === product.id)
            .reduce((sum, s) => sum + (s.quantity || 0), 0);
        return { ...product, stock: totalStock };
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">{profileName}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">Unified executive oversight of regional distribution and fleet missions.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" className="h-12 border border-black/5 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest px-6">
                        <Calendar className="mr-3 h-4 w-4" /> Schedule
                    </Button>
                    <Button className="h-12 bg-slate-900 text-white rounded-xl shadow-2xl shadow-black/20 font-black uppercase text-[10px] tracking-widest px-6 hover:bg-black transition-all">
                        <Globe className="mr-3 h-4 w-4" /> System: 99.9%
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Pulse Revenue", val: `Rs. ${totalRev.toLocaleString()}`, color: "bg-emerald-500/10", icon: DollarSign, iconColor: "text-emerald-600", sub: "+12.5% vs LW" },
                    { label: "Active Units", val: `${activeFleet} Units`, color: "bg-blue-500/10", icon: Truck, iconColor: "text-blue-600", sub: "Fleet Nominal" },
                    { label: "Active Orders", val: `${activeOrders} Pending`, color: "bg-amber-500/10", icon: Package, iconColor: "text-amber-600", sub: "Requires Sync" },
                    { label: "Compliance", val: `${complianceScore}%`, color: "bg-purple-500/10", icon: ShieldCheck, iconColor: "text-purple-600", sub: "High Grade" }
                ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm bg-white/50 backdrop-blur-sm group hover:bg-black/5 transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                            <div className={`p-2 ${stat.color} rounded-lg group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black tracking-tighter">{stat.val}</div>
                            <p className="text-[10px] text-muted-foreground font-bold mt-1">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                    <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">Executive Order Manifest</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Live synchronisation of system-wide requisition logs.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/orders')} className="h-10 rounded-xl border border-black/5 font-black uppercase text-[9px] tracking-widest px-4">View Full Registry</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="space-y-4">
                            {orders.slice(0, 5).map((order, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-black/[0.02] hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer" onClick={() => router.push('/dashboard/orders')}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                            <Package className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase italic tracking-tight text-slate-900 leading-none">{order.id}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {order.customers?.name ||
                                                    (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('authUser') || '{}').id === order.customer_id ? JSON.parse(localStorage.getItem('authUser') || '{}').full_name : null) ||
                                                    order.customer_id || "Retail Partner"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] font-black italic tracking-tighter text-slate-900">Rs. {Number(order.total).toLocaleString()}</p>
                                        <Badge variant="outline" className={`mt-1 h-5 px-3 rounded-full border-none font-black uppercase tracking-widest text-[8px] ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col border border-black/5">
                    <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                        <CardTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">Live Pulse</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6 flex-1 overflow-y-auto">
                        {transactions.slice(0, 6).map((log, i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer items-center">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 transition-all group-hover:scale-110">
                                    <Zap className="h-5 w-5 text-slate-900" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                                            {((log as any).resolved_customer === (log as any).customer_id ? null : (log as any).resolved_customer) ||
                                                (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('authUser') || '{}').id === (log as any).customer_id ? JSON.parse(localStorage.getItem('authUser') || '{}').full_name : null) ||
                                                (log as any).customer || "System"}
                                        </p>
                                        <span className="text-[9px] font-black text-slate-300">{log.status}</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rs. {log.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
