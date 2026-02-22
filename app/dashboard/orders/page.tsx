"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Filter, Plus, Search, Calendar, ChevronRight, Loader2, MoreHorizontal, ShoppingBag, MapPin, Truck, CheckCircle2, Box, X, ArrowRight } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { useRouter } from "next/navigation";
import { fetchOrders } from "@/lib/supabaseClient";
import type { OrderWithDetails } from "@/lib/database-types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function OrdersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trackingOrder, setTrackingOrder] = useState<OrderWithDetails | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Get user context for role-based filtering
            const authUserJson = localStorage.getItem('authUser');
            let userId = null;
            let userRole = null;

            if (authUserJson) {
                const authUser = JSON.parse(authUserJson);
                userId = authUser.id;
                userRole = authUser.role;
            }

            // @ts-ignore - Parameters are allowed in the updated JS client
            const data = await fetchOrders(userId, userRole);
            setOrders(data || []);
            setError(null);
        } catch (err: any) {
            console.error("Error loading orders:", err);
            setError(err.message || "Failed to synchronize order registry.");
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const customerName = order.customers?.name || order.customer_id || "General Distribution";
        return customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.id || "").toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Order ID,Customer,Date,Total,Status\n"
            + filteredOrders.map(o => `${o.id},${o.customers?.name || o.customer_id || 'N/A'},${o.date},${o.total},${o.status}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNewOrder = () => {
        router.push("/dashboard/products");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                    <h2 className="text-3xl font-black tracking-tight uppercase italic text-slate-900 leading-none">Order Registry</h2>
                    <p className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-widest text-[10px]">
                        Historical node synchronisation & requisition logs.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="rounded-xl border-black/5 bg-white shadow-sm font-black uppercase text-[10px] tracking-widest h-11 px-6 hover:bg-slate-50 transition-all"
                    >
                        <Download className="mr-2 h-4 w-4 opacity-40" /> Archive Logs
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-black/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Identify Requisition ID or Customer..."
                        className="pl-12 h-12 rounded-2xl bg-white border-black/5 shadow-sm font-bold text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="h-12 w-12 rounded-2xl border-black/5 bg-white flex items-center justify-center p-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={handleNewOrder}
                        className="flex-1 md:flex-none h-12 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] px-8 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Button>
                </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-black/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/5 bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Req. ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Origin / Customer</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Volume</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Value</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03]">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center animate-pulse">
                                            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                                            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Querying central ledger...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <p className="font-bold text-red-600 text-sm mb-4">{error}</p>
                                        <Button onClick={loadData} variant="outline" className="rounded-xl font-bold h-9">Retry Connection</Button>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No transaction records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <tr key={order.id} className="group hover:bg-black/[0.01] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-[10px] font-black text-primary">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <ShoppingBag className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-sm text-slate-900 truncate max-w-[200px]">
                                                    {order.customers?.name ||
                                                        (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('authUser') || '{}').id === order.customer_id ? JSON.parse(localStorage.getItem('authUser') || '{}').full_name : null) ||
                                                        order.customer_id || "Retail Partner"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-600">
                                            {order.items || "1"} Units
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-black italic tracking-tighter">Rs. {Number(order.total).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" className="h-8 px-3 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">Manifest</Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
                                                        <DropdownMenuItem className="font-bold text-xs uppercase tracking-wider cursor-pointer">Print Invoice</DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setTrackingOrder(order)}
                                                            className="font-bold text-xs uppercase tracking-wider cursor-pointer"
                                                        >
                                                            Track Logistics
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 font-bold text-xs uppercase tracking-wider cursor-pointer">Flag Issue</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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
                                    <ShoppingBag className="h-8 w-8 text-primary/60" />
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
        </div >
    );
}
