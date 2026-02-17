"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    TrendingUp,
    Map as MapIcon,
    AlertTriangle,
    BarChart3,
    ArrowUpRight,
    Circle,
    Package,
    Truck,
    CheckCircle2,
    Calendar,
    ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        setRole(localStorage.getItem('userRole'));
    }, []);

    if (role === 'customer') {
        return (
            <div className="space-y-8 text-foreground/90">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black tracking-tight uppercase">My Orders & Tracking</h2>
                    <p className="text-sm text-muted-foreground font-medium">Welcome back! Here's an overview of your recent activity and orders.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-none shadow-sm bg-primary text-white shadow-primary/20 overflow-hidden relative group font-sans">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full translate-x-8 -translate-y-8" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/80">Active Orders</CardTitle>
                            <Package className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">04</div>
                            <p className="text-xs font-bold text-white/90 mt-1">2 arriving today</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Spent</CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">$1,240.00</div>
                            <p className="text-xs font-bold text-emerald-600 mt-1">Across 12 orders</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loyalty Points</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter">840</div>
                            <p className="text-xs font-bold text-primary mt-1">Silver Member Status</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-none shadow-sm bg-white/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold tracking-tight">Recent Orders</CardTitle>
                            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { id: '#ORD-9921', status: 'Delivered', date: 'Feb 15, 2024', amount: '$145.20' },
                                    { id: '#ORD-9945', status: 'In Transit', date: 'Feb 17, 2024', amount: '$210.00' },
                                ].map((order, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-black/5 hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                                                <Package className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{order.id}</p>
                                                <p className="text-[10px] text-muted-foreground">{order.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black">{order.amount}</p>
                                            <Badge variant="outline" className={`mt-1 text-[8px] font-black uppercase border-none ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold tracking-tight">Support & Assistance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-indigo-900">Need help with an order?</p>
                                    <p className="text-[10px] text-indigo-700/70">Our support team is available 24/7.</p>
                                </div>
                                <Button size="sm" className="ml-auto bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase">Chat Now</Button>
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-black/10 hover:bg-black/5 transition-all">
                                <ExternalLink className="mr-2 h-4 w-4" /> Visit Help Center
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                            Total Daily Sales
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight">$42,850.40</div>
                        <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                            +5.2% <span className="text-muted-foreground font-normal">from yesterday</span>
                        </p>
                    </CardContent>
                    <div className="h-1.5 w-full bg-emerald-500/10 mt-auto">
                        <div className="h-full bg-emerald-500 w-[65%]" />
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                            Active Deliveries
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black px-2 py-0.5">Map Toggle</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight">124</div>
                        <p className="text-xs font-medium text-muted-foreground mt-2">
                            Real-time status tracking
                        </p>
                    </CardContent>
                    <div className="h-1.5 w-full bg-primary/10 mt-auto flex items-end">
                        <div className="h-[40%] bg-primary w-[40%] ml-4 rounded-t-sm" />
                        <div className="h-[70%] bg-primary w-[30%] ml-1 rounded-t-sm" />
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                            Low Stock Alerts
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-rose-500 group-hover:animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight">18 Items</div>
                        <p className="text-xs font-medium text-muted-foreground mt-2">
                            Across <span className="text-rose-500 font-bold">5 RDCs</span>
                        </p>
                    </CardContent>
                    <div className="h-1.5 w-full bg-rose-500/10 mt-auto">
                        <div className="h-full bg-rose-500 w-[20%]" />
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                            Monthly Revenue
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tight font-sans">+12.5%</div>
                        <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                            +$4.2k <span className="text-muted-foreground font-normal">projected growth</span>
                        </p>
                    </CardContent>
                    <div className="h-2 w-full bg-secondary/30 mt-auto px-4 flex items-end gap-1 pb-1">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} className={`flex-1 bg-primary/20 rounded-t-[1px]`} style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </Card>
            </div>

            {/* Middle Section: Regional Performance & Activity Feed */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm bg-white/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight">Regional Performance</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Sales volume by distribution center</p>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg border-black/5 bg-white shadow-sm text-[10px] font-bold uppercase">
                            Last 30 Days <ArrowUpRight className="ml-2 h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-end justify-around gap-4 px-4 pb-8">
                            {[
                                { name: 'North', val: 70 },
                                { name: 'South', val: 45 },
                                { name: 'East', val: 90 },
                                { name: 'West', val: 60 },
                                { name: 'Central', val: 80 }
                            ].map((item, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                    <div className="w-full relative flex items-end justify-center">
                                        <div className="w-full bg-primary/5 rounded-xl absolute bottom-0 h-[100%] border border-black/[0.02]" />
                                        <div
                                            className="w-10 md:w-16 bg-gradient-to-t from-primary to-primary/60 rounded-xl transition-all duration-500 group-hover:scale-x-105"
                                            style={{ height: `${item.val}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-bold tracking-tight">Activity Feed</CardTitle>
                        <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/20 before:via-primary/5 before:to-transparent">
                            {[
                                {
                                    icon: Truck,
                                    color: 'bg-emerald-500',
                                    title: 'Delivery #8231 Completed',
                                    desc: 'South RDC • Driver: J. Smith',
                                    time: '2 mins ago'
                                },
                                {
                                    icon: Package,
                                    color: 'bg-indigo-500',
                                    title: 'New Bulk Order #9102',
                                    desc: 'North RDC • 142 items',
                                    time: '14 mins ago'
                                },
                                {
                                    icon: AlertTriangle,
                                    color: 'bg-amber-500',
                                    title: 'Inventory Level Critical',
                                    desc: 'East RDC • SKU: ISL-99',
                                    time: '32 mins ago'
                                },
                                {
                                    icon: Users,
                                    color: 'bg-slate-500',
                                    title: 'RDC Admin Logged In',
                                    desc: 'Central RDC • M. Taylor',
                                    time: '1 hour ago'
                                }
                            ].map((item, i) => (
                                <div key={i} className="relative flex items-start gap-4 pl-1">
                                    <div className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg shadow-${item.color.split('-')[1]}-500/20 z-10 scale-90`}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{item.title}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium mt-1">{item.desc}</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section: Inventory Criticality Matrix */}
            <Card className="border-none shadow-sm bg-white/50">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-black tracking-tight uppercase">Inventory Criticality Matrix</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Live stock status across all Regional Distribution Centers</p>
                    </div>
                    <Button size="sm" className="rounded-xl px-6 bg-primary text-white font-bold tracking-tight hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20">
                        Export Stock Report
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-black/5 bg-black/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Distribution Center</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock Level (%)</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Open Alerts</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avg. Fulfillment</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {[
                                    { name: 'North RDC (Toronto Hub)', stock: 65, alerts: '2 Critical', time: '4.2 hours', status: 'STABLE', statusColor: 'emerald' },
                                    { name: 'South RDC (Miami Coastal)', stock: 35, alerts: '8 Alerts', time: '12.5 hours', status: 'LOW STOCK', statusColor: 'amber' },
                                    { name: 'Central Hub (Dallas TX)', stock: 88, alerts: 'No Alerts', time: '2.8 hours', status: 'OPTIMAL', statusColor: 'indigo' },
                                    { name: 'West Coast RDC (LA)', stock: 15, alerts: '14 Critical', time: '18.2 hours', status: 'CRITICAL', statusColor: 'rose' }
                                ].map((item, i) => (
                                    <tr key={i} className="hover:bg-black/[0.01] transition-colors group">
                                        <td className="px-6 py-5 font-bold text-sm">{item.name}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4 w-40">
                                                <div className="h-2 flex-1 bg-secondary/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full bg-${item.statusColor}-500 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                                                        style={{ width: `${item.stock}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-muted-foreground min-w-[30px]">{item.stock}%</span>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-5 text-sm font-bold ${item.alerts.includes('Critical') ? 'text-rose-500' : item.alerts.includes('Alerts') ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                            {item.alerts}
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium">{item.time}</td>
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className={`rounded-lg px-3 py-1 border-none bg-${item.statusColor}-500/10 text-${item.statusColor}-600 text-[10px] font-black uppercase`}>
                                                {item.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
