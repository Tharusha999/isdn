"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    BarChart3,
    LineChart,
    PieChart,
    TrendingUp,
    Download,
    Calendar,
    Filter
} from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Reporting & Analytics</h2>
                    <p className="text-muted-foreground mt-1">Detailed insights into system performance and sales.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-black/5 bg-white shadow-sm">
                        <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
                    </Button>
                    <Button variant="outline" className="rounded-xl border-black/5 bg-white shadow-sm">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button className="rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <Download className="mr-2 h-4 w-4" /> Generate PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">Rs. 12.4M</div>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1">+12.5% vs prev. month</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Orders Done</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">1,284</div>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1">+5.2% vs prev. month</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Customers</CardTitle>
                        <Users className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">450</div>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1">+2.1% vs prev. month</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Avg. Order Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">Rs. 14,500</div>
                        <p className="text-[10px] font-bold text-rose-600 mt-1">-1.2% vs prev. month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-sm bg-white/50 h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center flex-wrap gap-2">
                            {[80, 45, 90, 60, 75, 50, 85].map((h, i) => (
                                <div key={i} className="w-8 bg-primary/20 rounded-t-lg relative flex items-end h-32">
                                    <div className="w-full bg-primary rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Sales Trend Visualization</p>
                    </div>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 h-[400px] flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="relative w-48 h-48 rounded-full border-[16px] border-primary/10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[16px] border-primary border-t-transparent -rotate-45"></div>
                            <div className="text-2xl font-black">74%</div>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Revenue Distribution</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

import { ShoppingCart, Users, DollarSign } from "lucide-react";
