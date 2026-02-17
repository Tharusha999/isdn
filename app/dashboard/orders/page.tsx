"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Plus, Search } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

// Mock Data
const initialOrders = [
    {
        id: "ORD-001",
        customer: "Keells Super - Colombo 03",
        date: "2025-03-10",
        total: "Rs. 1,250.00",
        status: "Pending",
        items: 45,
    },
    {
        id: "ORD-002",
        customer: "Cargills Food City - Nugegoda",
        date: "2025-03-09",
        total: "Rs. 3,420.50",
        status: "Processing",
        items: 120,
    },
    {
        id: "ORD-003",
        customer: "Sathosa - Pettah",
        date: "2025-03-08",
        total: "Rs. 850.00",
        status: "Delivered",
        items: 30,
    },
    {
        id: "ORD-004",
        customer: "Laugfs Super - Rajagiriya",
        date: "2025-03-08",
        total: "Rs. 2,100.00",
        status: "Cancelled",
        items: 85,
    },
    {
        id: "ORD-005",
        customer: "Arpico Supercentre - Hyde Park",
        date: "2025-03-07",
        total: "Rs. 5,600.00",
        status: "Delivered",
        items: 240,
    },
];

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState(initialOrders);

    const filteredOrders = orders.filter((order) =>
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Order ID,Customer,Date,Items,Total,Status\n"
            + filteredOrders.map(o => `${o.id},${o.customer},${o.date},${o.items},${o.total},${o.status}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNewOrder = () => {
        alert("A new order form would normally appear here. This functionality will be fully implemented once the database is connected.");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">
                        Manage incoming orders from retail outlets.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl border-black/5 bg-white shadow-sm">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button size="sm" onClick={handleNewOrder} className="rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> New Order
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm bg-white/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-black/5">
                                <Filter className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders..."
                                    className="h-9 w-[150px] lg:w-[250px] pl-8 rounded-xl bg-white border-black/5 focus:bg-white transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <CardDescription>
                        A list of recent orders including customer details and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-black/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-black/[0.02]">
                                <TableRow>
                                    <TableHead className="w-[100px] font-bold text-[10px] uppercase tracking-widest">Order ID</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Customer</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Date</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Items</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Total</TableHead>
                                    <TableHead className="font-bold text-[10px] uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="text-right font-bold text-[10px] uppercase tracking-widest">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-black/[0.01]">
                                            <TableCell className="font-bold text-primary">{order.id}</TableCell>
                                            <TableCell className="font-semibold">{order.customer}</TableCell>
                                            <TableCell className="text-muted-foreground">{order.date}</TableCell>
                                            <TableCell>{order.items}</TableCell>
                                            <TableCell className="font-bold">{order.total}</TableCell>
                                            <TableCell>
                                                <OrderStatusBadge status={order.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                                    <span className="sr-only">Open menu</span>
                                                    <span className="text-lg font-bold">...</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground font-medium">
                                            No orders found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
