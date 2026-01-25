"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, Calendar, MoreHorizontal, ArrowRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const shipments = [
    {
        id: "SH-2024-001",
        destination: "Colombo, Western Province",
        status: "In Transit",
        vehicle: "Canter (WP-1234)",
        eta: "Today, 4:00 PM",
    },
    {
        id: "SH-2024-002",
        destination: "Kandy, Central Province",
        status: "Pending",
        vehicle: "Lorry (CP-5678)",
        eta: "Tomorrow, 10:00 AM",
    },
    {
        id: "SH-2024-003",
        destination: "Galle, Southern Province",
        status: "Delivered",
        vehicle: "Van (SP-9012)",
        eta: "Delivered",
    },
    {
        id: "SH-2024-004",
        destination: "Negombo, Western Province",
        status: "Processing",
        vehicle: "Bike (WP-3456)",
        eta: "Today, 6:00 PM",
    },
];

export default function LogisticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Logistics</h2>
                <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                    New Shipment
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Active Fleet</p>
                                        <h3 className="text-2xl font-bold">12</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Routes Active</p>
                                        <h3 className="text-2xl font-bold">8</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                                        <Calendar className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">On Time</p>
                                        <h3 className="text-2xl font-bold">98%</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-sm bg-white/60">
                        <CardHeader>
                            <CardTitle>Recent Shipments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {shipments.map((shipment) => (
                                    <div
                                        key={shipment.id}
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-black/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Truck className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{shipment.destination}</p>
                                                <p className="text-sm text-muted-foreground">{shipment.vehicle} • {shipment.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="font-medium text-sm">{shipment.eta}</p>
                                                <Badge
                                                    variant="secondary"
                                                    className={`
                                        mt-1 font-medium
                                        ${shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${shipment.status === 'Delivered' ? 'bg-green-100 text-green-700' : ''}
                                        ${shipment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    `}
                                                >
                                                    {shipment.status}
                                                </Badge>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="group-hover:bg-white/50">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-lg bg-white/90 backdrop-blur-md">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Track live</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>

                        <CardHeader>
                            <CardTitle className=" text-white">Live Tracking</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 flex flex-col items-center justify-center text-center h-[300px]">
                            <MapPin className="h-16 w-16 mb-4 text-white/80" />
                            <h3 className="text-xl font-bold">Map Preview</h3>
                            <p className="text-blue-100 mt-2 max-w-[200px]">Interactive map integration would go here.</p>
                            <Button variant="secondary" className="mt-6 rounded-full bg-white text-blue-600 hover:bg-blue-50">
                                Open Full Map <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
