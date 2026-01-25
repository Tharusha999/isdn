import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Filter, Plus } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";

// Mock Data
const orders = [
    {
        id: "ORD-001",
        customer: "Keells Super - Colombo 03",
        date: "2024-03-10",
        total: "Rs. 1,250.00",
        status: "Pending",
        items: 45,
    },
    {
        id: "ORD-002",
        customer: "Cargills Food City - Nugegoda",
        date: "2024-03-09",
        total: "Rs. 3,420.50",
        status: "Processing",
        items: 120,
    },
    {
        id: "ORD-003",
        customer: "Sathosa - Pettah",
        date: "2024-03-08",
        total: "Rs. 850.00",
        status: "Delivered",
        items: 30,
    },
    {
        id: "ORD-004",
        customer: "Laugfs Super - Rajagiriya",
        date: "2024-03-08",
        total: "Rs. 2,100.00",
        status: "Cancelled",
        items: 85,
    },
    {
        id: "ORD-005",
        customer: "Arpico Supercentre - Hyde Park",
        date: "2024-03-07",
        total: "Rs. 5,600.00",
        status: "Delivered",
        items: 240,
    },
];

export default function OrdersPage() {
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
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> New Order
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Orders</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                            <Input
                                placeholder="Search orders..."
                                className="h-8 w-[150px] lg:w-[250px]"
                            />
                        </div>
                    </div>
                    <CardDescription>
                        A list of recent orders including customer details and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.items}</TableCell>
                                    <TableCell>{order.total}</TableCell>
                                    <TableCell>
                                        <OrderStatusBadge status={order.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <span className="text-lg">...</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
