"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Truck,
    Calendar,
    MoreHorizontal,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Box,
    AlertTriangle,
    Navigation,
    Clock,
    User,
    Edit2,
    Plus,
    TrendingUp,
    ChevronRight
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const inventory = [
    {
        id: "IL-9842-X",
        name: "Solar Array Connector Kit",
        onHand: 1240,
        buffer: 200,
        incoming: "+ 450 (2h)",
        allocated: "120 (Pending)",
        status: "OPTIMAL",
        statusColor: "emerald"
    },
    {
        id: "IL-2104-M",
        name: "Lithium-Ion Battery Module (High Cap)",
        onHand: 18,
        buffer: 50,
        incoming: "None Scheduled",
        allocated: "0",
        status: "LOW STOCK",
        statusColor: "rose"
    },
    {
        id: "IL-5532-S",
        name: "Mounting Bracket Sub-Assembly",
        onHand: 3400,
        buffer: 500,
        incoming: "+ 1,200 (Tomorrow)",
        allocated: "850 (In Queue)",
        status: "OVERSTOCK",
        statusColor: "indigo"
    }
];

const deliveryQueue = [
    {
        id: "RT-2280",
        driver: "Marcus Thorne",
        vehicle: "IS-VAN-782",
        eta: "14:45 (22m)",
        status: "IN ROUTE",
        statusColor: "emerald"
    },
    {
        id: "RT-2291",
        driver: "Sarah Jenkins",
        vehicle: "IS-LRY-403",
        eta: "8 Locations",
        status: "LOADING",
        statusColor: "primary"
    },
    {
        id: "RT-2305",
        driver: "Unassigned",
        vehicle: "IS-LRY-000",
        eta: "Awaiting cargo consolidation for 16:00 window.",
        status: "STANDBY",
        statusColor: "muted"
    }
];

export default function LogisticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">RDC Management Portal</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Real-time inventory and logistics oversight for regional hubs.</p>
                </div>

                <div className="bg-secondary/50 p-1 rounded-xl flex items-center gap-1">
                    {["North", "South", "East", "West", "Central"].map((hub) => (
                        <Button
                            key={hub}
                            variant={hub === "Central" ? "default" : "ghost"}
                            className={`rounded-lg h-9 px-4 text-[10px] font-black uppercase tracking-widest ${hub === "Central" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground"}`}
                        >
                            {hub}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Deliveries</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">142</div>
                        <p className="text-xs font-bold text-emerald-600 mt-1">+12% from yesterday</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-rose-500 text-white shadow-rose-500/20 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full translate-x-4 -translate-y-4" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/80">Low Stock Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">12</div>
                        <p className="text-xs font-bold text-white/90 mt-1">Critical items identified</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fleet Utilization</CardTitle>
                        <Truck className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">88%</div>
                        <p className="text-xs font-bold text-primary mt-1">14 vehicles active</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Outflows</CardTitle>
                        <Box className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black tracking-tighter">24</div>
                        <p className="text-xs font-bold text-muted-foreground mt-1 text-indigo-600">Awaiting dispatch</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black tracking-tight">Local Stock Inventory</CardTitle>
                                <p className="text-xs text-muted-foreground font-medium mt-0.5">Current levels for Central Regional Hub</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="rounded-lg h-9 border-black/5 bg-white font-bold text-[10px] uppercase tracking-widest">
                                    <RefreshCw className="mr-2 h-3 w-3" /> Reconciliation
                                </Button>
                                <Button size="sm" className="rounded-lg h-9 bg-primary text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                    <Navigation className="mr-2 h-3 w-3" /> Transfer Stock
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-x-auto rounded-xl">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-black/5 bg-black/[0.02]">
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">SKU / Product Name</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">On Hand</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Buffer</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Incoming (ETA)</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Allocated</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {inventory.map((item, i) => (
                                            <tr key={i} className="hover:bg-black/[0.01] transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-xs uppercase tracking-tight">{item.id}</span>
                                                        <span className="text-xs text-muted-foreground line-clamp-1">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 font-black">{item.onHand.toLocaleString()}</td>
                                                <td className="px-4 py-4 text-muted-foreground">{item.buffer}</td>
                                                <td className={`px-4 py-4 text-xs font-bold ${item.incoming.includes('+') ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                                    {item.incoming.includes('+') ? <ArrowDown className="inline mr-1 h-3 w-3" /> : null}
                                                    {item.incoming}
                                                </td>
                                                <td className={`px-4 py-4 text-xs font-bold ${item.allocated !== '0' ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                                    {item.allocated !== '0' ? <ArrowUp className="inline mr-1 h-3 w-3" /> : null}
                                                    {item.allocated}
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <Badge variant="outline" className={`rounded-lg border-none px-2 py-0.5 text-[9px] font-black uppercase bg-${item.statusColor}-500/10 text-${item.statusColor}-600`}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Button variant="ghost" className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary h-10 group">
                                View Complete Inventory <ChevronRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-none shadow-sm bg-white/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-rose-500" /> Damages & Returns
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                                    <div>
                                        <p className="text-xs font-black text-rose-700">Batch #REC-9812</p>
                                        <p className="text-[10px] text-rose-600/70">RECEIVED 10:30 AM</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-rose-700">4 Damaged</span>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-100">
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                    <div>
                                        <p className="text-xs font-black text-emerald-700">Batch #REC-9788</p>
                                        <p className="text-[10px] text-emerald-600/70">RECEIVED 08:15 AM</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-emerald-700">12 Restocked</span>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100">
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-10 border-black/5 hover:bg-black/5">
                                    + Log New Reconciliation Data
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-white/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary rotate-45" /> Inter-Branch Transfers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                        <div>
                                            <p className="text-xs font-black text-indigo-700">North → Central</p>
                                            <p className="text-[10px] text-indigo-600/70 uppercase">PRIORITY: HIGH</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-indigo-500/10 text-indigo-700 border-none text-[8px] font-black uppercase px-2 h-5">In Transit</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-slate-400" />
                                        <div>
                                            <p className="text-xs font-black text-slate-700">West → Central</p>
                                            <p className="text-[10px] text-slate-600/70 uppercase">PRIORITY: STANDARD</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-slate-500/10 text-slate-700 border-none text-[8px] font-black uppercase px-2 h-5">Scheduled</Badge>
                                </div>
                                <Button className="w-full bg-primary text-white text-[10px] font-black uppercase tracking-widest h-10 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-98">
                                    Initiate Bulk Transfer
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-white overflow-hidden relative group">
                        <CardHeader className="flex flex-row items-center justify-between absolute top-0 left-0 right-0 z-20 p-4 bg-white/80 backdrop-blur-md">
                            <Badge className="bg-rose-500 text-white border-none font-black text-[8px] uppercase tracking-widest px-2 group-hover:animate-pulse">Live: GPS Grid</Badge>
                            <Button variant="outline" className="h-6 px-2 text-[8px] font-black uppercase tracking-widest bg-primary text-white border-none shadow-sm">Central Hub View</Button>
                        </CardHeader>
                        <div className="h-[300px] w-full bg-slate-100 relative">
                            {/* Map Mockup Background */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                                    <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-xl relative z-10" />
                                </div>
                            </div>

                            <div className="absolute top-1/4 right-1/4">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-lg animate-pulse" />
                            </div>

                            <Button size="icon" variant="secondary" className="absolute bottom-4 right-4 h-8 w-8 bg-white/90 backdrop-blur shadow-xl rounded-lg">
                                <Navigation className="h-4 w-4 text-primary" />
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm bg-white/50">
                        <CardHeader className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-black tracking-tight">Delivery Queue</CardTitle>
                                <Badge variant="outline" className="rounded-lg h-6 border-black/5 text-[9px] font-black bg-secondary/50 uppercase">12 Routes Today</Badge>
                            </div>
                            <div className="flex bg-secondary/50 p-1 rounded-xl w-full">
                                {["Active", "Pending", "Completed"].map((tab) => (
                                    <Button
                                        key={tab}
                                        variant={tab === "Active" ? "default" : "ghost"}
                                        className={`flex-1 h-8 rounded-lg text-[9px] font-black uppercase tracking-widest ${tab === "Active" ? "bg-white text-primary shadow-sm" : "text-muted-foreground"}`}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {deliveryQueue.map((route, i) => (
                                <div key={i} className="space-y-3 p-4 rounded-2xl bg-white border border-black/[0.03] hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-secondary/50 rounded-xl">
                                                <Navigation className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black">Route #{route.id}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">Driver: {route.driver}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`h-5 border-none px-2 text-[8px] font-black uppercase bg-${route.statusColor}-500/10 text-${route.statusColor}-600`}>
                                            {route.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] font-bold">
                                            <span className="text-muted-foreground uppercase flex items-center gap-1"><Truck className="h-3 w-3" /> Vehicle</span>
                                            <span className="text-muted-foreground uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> ETA</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-black">
                                            <span>{route.vehicle}</span>
                                            <span className={route.status === 'IN ROUTE' ? 'text-primary' : ''}>{route.eta}</span>
                                        </div>
                                    </div>

                                    {route.status === 'IN ROUTE' && (
                                        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full w-[65%] animate-pulse" />
                                        </div>
                                    )}

                                    {route.status === 'LOADING' && (
                                        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full w-[25%]" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Button className="w-full bg-white text-primary border-2 border-primary/10 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 shadow-sm active:scale-95 transition-all mt-4">
                                <Plus className="mr-2 h-4 w-4" /> Generate New Dispatch Route
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
