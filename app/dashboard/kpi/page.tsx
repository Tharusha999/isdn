"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart,
    DollarSign,
    Clock,
    PackageCheck,
    TrendingUp,
    ArrowUpRight,
    Loader2,
    BarChart2,
    CreditCard,
    MapPin,
    Truck,
    CheckCircle2,
    Box,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchOrders, fetchTransactions } from "@/lib/supabaseClient";
import type { OrderWithDetails, Transaction } from "@/lib/database-types";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

export default function CustomerKPIPage() {
    const router = useRouter();
    const [profileName, setProfileName] = useState("Customer");
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [trackingOrder, setTrackingOrder] = useState<OrderWithDetails | null>(null);

    useEffect(() => {
        const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
        const userRole: string = authUser.role || localStorage.getItem("userRole") || "";

        if (userRole !== "customer") {
            router.push("/dashboard");
            return;
        }

        setProfileName(authUser.full_name || authUser.username || "Customer");
        loadData(authUser.id, userRole);
    }, [router]);

    const loadData = async (userId: string, userRole: string) => {
        try {
            setLoading(true);
            // @ts-ignore - JS client accepts userId and role params
            const [ordersData, txData] = await Promise.all([
                fetchOrders(userId, userRole),
                fetchTransactions(userId, userRole),
            ]);
            setOrders((ordersData as OrderWithDetails[]) || []);
            setTransactions((txData as Transaction[]) || []);
        } catch (err) {
            console.error("KPI data load error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
                    Loading Your Performance Data...
                </p>
            </div>
        );
    }

    // ── KPI Computations from orders table ──────────────────────────────────
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
    const inTransitOrders = orders.filter(o => o.status === "In Transit").length;
    const pendingOrders = orders.filter(
        o => o.status === "Pending"
    ).length;
    const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;

    // Total items ordered (sum of order_items across all orders)
    const totalItemsOrdered = orders.reduce(
        (sum, o) => sum + (o.order_items?.length ?? 0),
        0
    );

    // ── KPI Computations from transactions table ─────────────────────────────
    // transactions.customer = UUID of the customer
    // transactions.status: 'PAID' | 'PENDING' | 'FAILED'
    const totalSpend = transactions
        .filter(t => t.status === "PAID")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const pendingPayment = transactions
        .filter(t => t.status === "PENDING")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Payment method breakdown
    const methodCounts: Record<string, number> = {};
    transactions.forEach(t => {
        if (t.method) {
            methodCounts[t.method] = (methodCounts[t.method] || 0) + 1;
        }
    });

    const deliveryRate =
        totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

    // Monthly spend from transactions.date (only PAID)
    const monthlySpend: Record<string, number> = {};
    transactions
        .filter(t => t.status === "PAID")
        .forEach(t => {
            const d = new Date(t.date);
            if (!isNaN(d.getTime())) {
                const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
                monthlySpend[key] = (monthlySpend[key] || 0) + Number(t.amount || 0);
            }
        });

    const monthlyEntries = Object.entries(monthlySpend).slice(-6);
    const maxSpend = Math.max(...monthlyEntries.map(([, v]) => v), 1);

    // Top RDC region by order volume
    const rdcCounts: Record<string, number> = {};
    orders.forEach(o => {
        if (o.rdc) rdcCounts[o.rdc] = (rdcCounts[o.rdc] || 0) + 1;
    });
    const topRDC = Object.entries(rdcCounts).sort((a, b) => b[1] - a[1])[0];

    const kpiCards = [
        {
            label: "Total Orders",
            value: totalOrders,
            sub: `${totalItemsOrdered} Total Items`,
            icon: ShoppingCart,
            color: "bg-indigo-50",
            text: "text-indigo-600",
        },
        {
            label: "Total Spend",
            value: `Rs. ${totalSpend.toLocaleString()}`,
            sub: `${transactions.filter(t => t.status === "PAID").length} Paid Transactions`,
            icon: DollarSign,
            color: "bg-emerald-50",
            text: "text-emerald-600",
        },
        {
            label: "Pending Payments",
            value: `Rs. ${pendingPayment.toLocaleString()}`,
            sub: `${transactions.filter(t => t.status === "PENDING").length} Awaiting Clearance`,
            icon: Clock,
            color: "bg-amber-50",
            text: "text-amber-600",
        },
        {
            label: "Delivery Rate",
            value: `${deliveryRate}%`,
            sub: `${deliveredOrders} of ${totalOrders} Delivered`,
            icon: PackageCheck,
            color: "bg-purple-50",
            text: "text-purple-600",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
                            <BarChart2 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                            MY KPIs
                        </h2>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 pl-1">
                        {profileName} — Real-time performance metrics for your account.
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/dashboard/orders")}
                    className="h-12 bg-slate-900 text-white rounded-xl shadow-2xl shadow-black/20 font-black uppercase text-[10px] tracking-widest px-6 hover:bg-black transition-all"
                >
                    <TrendingUp className="mr-2 h-4 w-4" /> View All Orders
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {kpiCards.map((card) => (
                    <Card
                        key={card.label}
                        className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 group border border-black/[0.03] transition-all hover:scale-[1.02] hover:shadow-black/10"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`h-14 w-14 rounded-2xl ${card.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                <card.icon className={`h-7 w-7 ${card.text}`} />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                {card.label}
                            </p>
                            <p className="text-2xl font-black text-slate-900 italic tracking-tighter">
                                {card.value}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                {card.sub}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts + Recent Orders */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Monthly Spend Chart */}
                <Card className="lg:col-span-1 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                    <CardHeader className="p-8 border-b border-black/5 bg-slate-50/50">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">
                            Monthly Spend
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                            Paid transactions · last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {monthlyEntries.length === 0 ? (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-8">
                                No payment data yet
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {monthlyEntries.map(([month, amount]) => (
                                    <div key={month} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                            <span>{month}</span>
                                            <span className="text-slate-700">Rs. {amount.toLocaleString()}</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-700"
                                                style={{ width: `${Math.round((amount / maxSpend) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Orders (from orders + order_items) */}
                <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                    <CardHeader className="p-8 border-b border-black/5 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">
                                    Order History
                                </CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                    From the <span className="text-slate-600">orders</span> table · filtered by your account
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push("/dashboard/orders")}
                                className="h-9 rounded-xl border border-black/5 font-black uppercase text-[9px] tracking-widest px-4"
                            >
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <ShoppingCart className="h-10 w-10 text-slate-200" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    No orders found for your account.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.slice(0, 8).map((order, i) => (
                                    <div
                                        key={order.id}
                                        onClick={() => setTrackingOrder(order)}
                                        className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-black/[0.02] hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-sm text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black uppercase italic tracking-tight text-slate-900 leading-none">
                                                    {order.id}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {order.date
                                                            ? new Date(order.date).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })
                                                            : "—"}
                                                    </p>
                                                    {order.rdc && (
                                                        <span className="text-[8px] font-black uppercase text-slate-300">
                                                            · {order.rdc}
                                                        </span>
                                                    )}
                                                    {order.order_items?.length > 0 && (
                                                        <span className="text-[8px] font-black uppercase text-indigo-400">
                                                            · {order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] font-black italic tracking-tighter text-slate-900">
                                                Rs. {Number(order.total).toLocaleString()}
                                            </p>
                                            <Badge
                                                className={`mt-1 h-5 px-3 rounded-full border-none font-black uppercase tracking-widest text-[8px] ${order.status === "Delivered"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : order.status === "In Transit"
                                                        ? "bg-indigo-100 text-indigo-700"
                                                        : order.status === "Cancelled"
                                                            ? "bg-rose-100 text-rose-700"
                                                            : "bg-amber-100 text-amber-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Status Breakdown + Payment Methods */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Order Status Breakdown */}
                <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden border border-black/5">
                    <CardHeader className="p-6 border-b border-black/5 bg-slate-50/50">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">
                            Order Status Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Pending", count: pendingOrders, color: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700" },
                                { label: "In Transit", count: inTransitOrders, color: "bg-indigo-500", light: "bg-indigo-50", text: "text-indigo-700" },
                                { label: "Delivered", count: deliveredOrders, color: "bg-emerald-500", light: "bg-emerald-50", text: "text-emerald-700" },
                                { label: "Cancelled", count: cancelledOrders, color: "bg-rose-500", light: "bg-rose-50", text: "text-rose-700" },
                            ].map(stat => (
                                <div key={stat.label} className={`p-5 rounded-2xl ${stat.light} flex items-center gap-4`}>
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center`}>
                                        <div className={`h-5 w-5 rounded-full ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                        <p className={`text-2xl font-black italic tracking-tighter ${stat.text}`}>{stat.count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method Breakdown from transactions table */}
                <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden border border-black/5">
                    <CardHeader className="p-6 border-b border-black/5 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">
                                Payment Methods Used
                            </CardTitle>
                        </div>
                        <CardDescription className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                            From transactions table · method column
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {Object.keys(methodCounts).length === 0 ? (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-8">
                                No transaction records yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(methodCounts)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([method, count]) => {
                                        const pct = Math.round((count / transactions.length) * 100);
                                        return (
                                            <div key={method} className="space-y-1">
                                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                                                    <span>{method}</span>
                                                    <span>{count} transaction{count !== 1 ? "s" : ""} · {pct}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-slate-700 to-slate-500 transition-all duration-700"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}

                        {/* Top RDC summary */}
                        {topRDC && (
                            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-black/[0.03]">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Top RDC Region</p>
                                <p className="text-sm font-black italic tracking-tighter text-slate-900 mt-1">{topRDC[0]}</p>
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5">{topRDC[1]} order{topRDC[1] !== 1 ? "s" : ""} dispatched</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tracking Modal */}
            {trackingOrder && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl p-8 sm:p-12 w-full max-w-2xl space-y-8 animate-in zoom-in-95 duration-200 border border-black/5 flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex items-start justify-between shrink-0">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">Logistics Tracker</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-3">Requisition ID: <span className="text-slate-500 font-mono tracking-normal">{trackingOrder.id}</span></p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTrackingOrder(null)}
                                className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-all shrink-0"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div className="overflow-y-auto pr-2 pb-4 space-y-8">

                            {/* Order Details Summary */}
                            <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border border-black/[0.03]">
                                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                                    <ShoppingCart className="h-8 w-8 text-primary/60" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Destination Identity</p>
                                    <h3 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                                        {trackingOrder.customers?.name || trackingOrder.customer_id || "Retail Partner"}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500 mt-2">{trackingOrder.items || "1"} Units • {trackingOrder.date}</p>
                                </div>
                                <div className="ml-auto flex shrink-0">
                                    <OrderStatusBadge status={trackingOrder.status} />
                                </div>
                            </div>

                            {/* Timeline Visualizer */}
                            <div className="relative pl-6 sm:pl-10 pb-4">
                                {/* Connecting Line */}
                                <div className="absolute top-8 bottom-8 left-[39px] sm:left-[55px] w-1 bg-slate-100 rounded-full" />

                                <div className="space-y-12 relative z-10">

                                    {/* Step 1: Processing */}
                                    <div className="flex gap-6 sm:gap-8 group">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${['Pending', 'Processing', 'In Transit', 'Delivered'].includes(trackingOrder.status) ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                                            <Box className="h-5 w-5" />
                                        </div>
                                        <div className="pt-2">
                                            <h4 className={`text-lg font-black uppercase tracking-tight italic ${['Pending', 'Processing', 'In Transit', 'Delivered'].includes(trackingOrder.status) ? 'text-slate-900' : 'text-slate-400'}`}>Order Received</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Payment verified. Routing to fulfillment grid.</p>
                                        </div>
                                    </div>

                                    {/* Step 2: Regional Hub Assignment */}
                                    <div className="flex gap-6 sm:gap-8 group">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${['Processing', 'In Transit', 'Delivered'].includes(trackingOrder.status) || trackingOrder.rdc ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div className="pt-2">
                                            <h4 className={`text-lg font-black uppercase tracking-tight italic ${['Processing', 'In Transit', 'Delivered'].includes(trackingOrder.status) || trackingOrder.rdc ? 'text-slate-900' : 'text-slate-400'}`}>Nodes Assigned</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                {trackingOrder.rdc ? (
                                                    <span className="text-indigo-600 font-black">Regional Hub: {trackingOrder.rdc}</span>
                                                ) : "Awaiting assignment to logistics node."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 3: Out for Delivery */}
                                    <div className="flex gap-6 sm:gap-8 group">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${['In Transit', 'Delivered'].includes(trackingOrder.status) ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div className="pt-2">
                                            <h4 className={`text-lg font-black uppercase tracking-tight italic ${['In Transit', 'Delivered'].includes(trackingOrder.status) ? 'text-slate-900' : 'text-slate-400'}`}>In Transit</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                {trackingOrder.driver_name ? (
                                                    <span>Agent Assigned: <span className="text-amber-600 font-black">{trackingOrder.driver_name}</span></span>
                                                ) : "Waiting for driver dispatch."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 4: Completed */}
                                    <div className="flex gap-6 sm:gap-8 group">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${trackingOrder.status === 'Delivered' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div className="pt-2">
                                            <h4 className={`text-lg font-black uppercase tracking-tight italic ${trackingOrder.status === 'Delivered' ? 'text-emerald-600' : 'text-slate-400'}`}>Fulfillment Complete</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                {trackingOrder.status === 'Delivered' ? "Package securely handed over to destination." : "Awaiting final delivery."}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
