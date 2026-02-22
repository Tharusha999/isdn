"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Package,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    MapPin,
    User,
    Loader2,
    RefreshCw,
    ChevronDown,
    ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    fetchOrdersByPartnerRDC,
    fetchActiveDrivers,
    assignDriverToOrder,
    updateOrderStatusByPartner,
    fetchRDCHubs,
} from "@/lib/supabaseClient";

const ORDER_STATUSES = ["Pending", "In Transit", "Delivered", "Cancelled"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_STYLES: Record<OrderStatus, string> = {
    Pending: "bg-amber-100 text-amber-700",
    "In Transit": "bg-indigo-100 text-indigo-700",
    Delivered: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-rose-100 text-rose-700",
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
    Pending: <Clock className="h-3.5 w-3.5" />,
    "In Transit": <Truck className="h-3.5 w-3.5" />,
    Delivered: <CheckCircle2 className="h-3.5 w-3.5" />,
    Cancelled: <XCircle className="h-3.5 w-3.5" />,
};

export default function PartnerDashboardPage() {
    const router = useRouter();
    const [partnerName, setPartnerName] = useState("RDC Partner");
    const [rdcHub, setRdcHub] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    // dropdown open state: { [orderId]: 'status' | 'driver' | null }
    const [openDropdown, setOpenDropdown] = useState<Record<string, string | null>>({});

    const [hubOptions, setHubOptions] = useState<string[]>([]);

    const loadData = useCallback(async (hub: string) => {
        try {
            setLoading(true);
            const [ordersData, driversData] = await Promise.all([
                // @ts-ignore
                fetchOrdersByPartnerRDC(hub),
                // @ts-ignore
                fetchActiveDrivers(),
            ]);
            setOrders(ordersData || []);
            setDrivers(driversData || []);
        } catch (err) {
            console.error("Partner dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
        const role = authUser.role || localStorage.getItem("userRole");

        if (role !== "partner" && role !== "admin") {
            router.push("/dashboard");
            return;
        }

        const adminUser = role === "admin";
        setIsAdmin(adminUser);

        setPartnerName(adminUser ? "Global Dispatch" : (authUser.full_name || "RDC Partner"));

        // Fetch dynamic hubs
        fetchRDCHubs().then((hubsData) => {
            const dynamicHubs = hubsData.map((h: any) => h.name);
            setHubOptions(dynamicHubs);

            // For partners, get their specific hub. 
            // For admins, start with West (Colombo) or the first available hub
            let defaultHub = authUser.rdc_hub;
            if (adminUser) {
                defaultHub = dynamicHubs.includes("West (Colombo)") ? "West (Colombo)" : dynamicHubs[0];
            }

            setRdcHub(defaultHub);

            if (defaultHub) {
                loadData(defaultHub);
            } else {
                setLoading(false);
            }
        });
    }, [router, loadData]);

    const handleHubChange = (hub: string) => {
        setRdcHub(hub);
        setOpenDropdown({});
        loadData(hub);
    };

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        setUpdatingOrderId(orderId);
        setOpenDropdown(p => ({ ...p, [orderId]: null }));
        try {
            // @ts-ignore
            await updateOrderStatusByPartner(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update order status.");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleDriverAssign = async (orderId: string, driver: any) => {
        setUpdatingOrderId(orderId);
        setOpenDropdown(p => ({ ...p, [orderId]: null }));
        try {
            // @ts-ignore
            await assignDriverToOrder(orderId, driver.id, driver.full_name);
            setOrders(prev => prev.map(o =>
                o.id === orderId
                    ? { ...o, driver_id: driver.id, driver_name: driver.full_name }
                    : o
            ));
        } catch (err) {
            console.error("Driver assignment error:", err);
            alert("Failed to assign driver.");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const toggleDropdown = (orderId: string, type: string) => {
        setOpenDropdown(prev => ({
            ...prev,
            [orderId]: prev[orderId] === type ? null : type,
        }));
    };

    // KPI stats
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    const inTransitCount = orders.filter(o => o.status === "In Transit").length;
    const deliveredCount = orders.filter(o => o.status === "Delivered").length;
    const cancelledCount = orders.filter(o => o.status === "Cancelled").length;

    const kpiCards = [
        { label: "Total Orders", value: totalOrders, icon: Package, color: "bg-slate-50", text: "text-slate-700" },
        { label: "Pending", value: pendingCount, icon: Clock, color: "bg-amber-50", text: "text-amber-600" },
        { label: "In Transit", value: inTransitCount, icon: Truck, color: "bg-indigo-50", text: "text-indigo-600" },
        { label: "Delivered", value: deliveredCount, icon: CheckCircle2, color: "bg-emerald-50", text: "text-emerald-600" },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
                    Loading RDC Operations...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500" onClick={() => setOpenDropdown({})}>
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                            {partnerName}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pl-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                RDC Hub:
                            </p>
                            {isAdmin ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(p => ({ ...p, hub: p.hub ? null : 'hub' }))}
                                        className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors text-[10px] font-black uppercase tracking-widest"
                                    >
                                        {rdcHub} <ChevronDown className="h-3 w-3" />
                                    </button>
                                    {openDropdown['hub'] === 'hub' && (
                                        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-black/5 shadow-xl shadow-indigo-500/10 py-2 z-50 overflow-hidden transform opacity-0 scale-95 origin-top-right group-focus-within:opacity-100 group-focus-within:scale-100 transition-all duration-200 pointer-events-none group-focus-within:pointer-events-auto">
                                            {hubOptions.length === 0 ? (
                                                <div className="px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-widest text-center">Loading hubs...</div>
                                            ) : (
                                                hubOptions.map(hub => (
                                                    <button
                                                        key={hub}
                                                        onClick={() => handleHubChange(hub)}
                                                        className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors ${rdcHub === hub ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                                    >
                                                        {hub}
                                                        {rdcHub === hub && <CheckCircle2 className="inline ml-2 h-3.5 w-3.5" />}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                                    {rdcHub || (loading ? "IDENTIFYING..." : "NOT ASSIGNED")}
                                </p>
                            )}
                            {!loading && rdcHub && (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-2" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                                </>
                            )}
                            {!loading && !rdcHub && (
                                <>
                                    <div className="h-2 w-2 rounded-full bg-rose-500 ml-2" />
                                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest italic">Action Required</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() => loadData(rdcHub)}
                    variant="ghost"
                    className="h-12 border border-black/5 rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest px-6"
                >
                    <RefreshCw className="mr-2 h-4 w-4" /> Refresh Orders
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map(card => (
                    <Card key={card.label} className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 group border border-black/[0.03] hover:scale-[1.02] transition-all hover:shadow-black/10">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`h-14 w-14 rounded-2xl ${card.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                <card.icon className={`h-7 w-7 ${card.text}`} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                        <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{card.value}</p>
                    </Card>
                ))}
            </div>

            {/* Orders Table */}
            <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                <CardHeader className="p-8 border-b border-black/5 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">
                                Order Management
                            </CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                {rdcHub} · {totalOrders} orders · update status and assign drivers below
                            </CardDescription>
                        </div>
                        <Badge className="bg-slate-900 text-white font-black uppercase tracking-widest text-[9px] px-4 py-2 rounded-xl">
                            {cancelledCount} Cancelled
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Package className="h-12 w-12 text-slate-200" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                No orders found for {rdcHub}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black/5 bg-slate-50/30">
                                        {["Order ID", "Customer", "Date", "Items", "Value", "Driver", "Status", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/[0.03]">
                                    {orders.map(order => (
                                        <tr key={order.id} className="group hover:bg-black/[0.01] transition-colors">
                                            {/* Order ID */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-[10px] font-black text-primary">{order.id}</span>
                                            </td>
                                            {/* Customer */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                                        <User className="h-3.5 w-3.5 text-indigo-600" />
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-900 max-w-[120px] truncate">
                                                        {order.customer_name}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                                                {order.date
                                                    ? new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                                    : "—"}
                                            </td>
                                            {/* Items count */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-600">
                                                {order.order_items?.length ?? 0} item{order.order_items?.length !== 1 ? "s" : ""}
                                            </td>
                                            {/* Value */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-black italic tracking-tighter text-slate-900">
                                                    Rs. {Number(order.total).toLocaleString()}
                                                </span>
                                            </td>

                                            {/* Driver Assignment */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => toggleDropdown(order.id, "driver")}
                                                        disabled={updatingOrderId === order.id}
                                                        className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-slate-50 border border-black/5 hover:bg-slate-100 transition-all text-[10px] font-black uppercase tracking-widest text-slate-600 min-w-[120px]"
                                                    >
                                                        <Truck className="h-3 w-3 shrink-0" />
                                                        <span className="truncate">{order.driver_name || "Assign Driver"}</span>
                                                        <ChevronDown className="h-3 w-3 ml-auto shrink-0" />
                                                    </button>
                                                    {openDropdown[order.id] === "driver" && (
                                                        <div className="absolute z-50 top-full mt-1 left-0 w-52 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden">
                                                            {drivers.length === 0 ? (
                                                                <div className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                                                    No active drivers
                                                                </div>
                                                            ) : (
                                                                drivers.map(driver => (
                                                                    <button
                                                                        key={driver.id}
                                                                        onClick={() => handleDriverAssign(order.id, driver)}
                                                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left ${order.driver_id === driver.id ? "bg-indigo-50" : ""}`}
                                                                    >
                                                                        <div className="h-7 w-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                                                            <User className="h-3.5 w-3.5 text-indigo-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-[11px] font-black text-slate-900 leading-none">{driver.full_name}</p>
                                                                            <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{driver.rdc_hub}</p>
                                                                        </div>
                                                                        {order.driver_id === driver.id && (
                                                                            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 ml-auto" />
                                                                        )}
                                                                    </button>
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge className={`h-6 px-3 rounded-full border-none font-black uppercase tracking-widest text-[8px] flex items-center gap-1 w-fit ${STATUS_STYLES[order.status as OrderStatus] || "bg-slate-100 text-slate-600"}`}>
                                                    {STATUS_ICONS[order.status as OrderStatus]}
                                                    {order.status}
                                                </Badge>
                                            </td>

                                            {/* Status Change Dropdown */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative" onClick={e => e.stopPropagation()}>
                                                    {updatingOrderId === order.id ? (
                                                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => toggleDropdown(order.id, "status")}
                                                                className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-slate-900 text-white hover:bg-black transition-all text-[10px] font-black uppercase tracking-widest"
                                                            >
                                                                Update <ChevronDown className="h-3 w-3" />
                                                            </button>
                                                            {openDropdown[order.id] === "status" && (
                                                                <div className="absolute z-50 top-full mt-1 right-0 w-44 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden">
                                                                    {ORDER_STATUSES.map(status => (
                                                                        <button
                                                                            key={status}
                                                                            onClick={() => handleStatusChange(order.id, status)}
                                                                            disabled={order.status === status}
                                                                            className={`w-full flex items-center gap-2.5 px-4 py-3 hover:bg-slate-50 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed`}
                                                                        >
                                                                            <span className={`h-6 w-6 rounded-lg flex items-center justify-center ${STATUS_STYLES[status]}`}>
                                                                                {STATUS_ICONS[status]}
                                                                            </span>
                                                                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{status}</span>
                                                                            {order.status === status && (
                                                                                <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-auto" />
                                                                            )}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Driver Roster */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                        Active Driver Roster · {drivers.length} drivers available
                    </h3>
                </div>
                {drivers.map(driver => (
                    <Card key={driver.id} className="border-none shadow-sm bg-white rounded-2xl overflow-hidden border border-black/5 p-5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                                <User className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 leading-none">{driver.full_name}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{driver.rdc_hub || "Unassigned"}</p>
                            </div>
                            <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
                        </div>
                    </Card>
                ))}
                {drivers.length === 0 && (
                    <Card className="lg:col-span-4 border-none shadow-sm bg-white rounded-2xl border border-black/5 p-8 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active drivers in the system</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
