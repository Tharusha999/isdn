"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, CreditCard, Download } from "lucide-react";

export default function FinancePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Finance</h2>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full border-gray-200">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                        <DollarSign className="mr-2 h-4 w-4" /> Add Transaction
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none shadow-sm bg-black text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
                        <CardTitle className="text-sm font-medium text-gray-300">
                            Total Revenue
                        </CardTitle>
                        <div className="p-2 bg-white/10 rounded-full">
                            <DollarSign className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="z-10 relative">
                        <div className="text-3xl font-bold mt-2">Rs. 8,245,231.89</div>
                        <p className="text-xs text-green-400 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Expenses
                        </CardTitle>
                        <div className="p-2 bg-red-100 rounded-full">
                            <Wallet className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2 tracking-tight">Rs. 1,204,500.00</div>
                        <p className="text-xs text-red-600 flex items-center mt-1">
                            <ArrowDownRight className="h-3 w-3 mr-1" /> +4.5% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Net Profit
                        </CardTitle>
                        <div className="p-2 bg-green-100 rounded-full">
                            <CreditCard className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2 tracking-tight">Rs. 7,040,731.89</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +12.3% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2 border-none shadow-sm bg-white/60">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Transactions</CardTitle>
                            <Button variant="link" className="text-primary">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                            INV
                                        </div>
                                        <div>
                                            <p className="font-semibold">Invoice #2024-{100 + i}</p>
                                            <p className="text-sm text-muted-foreground">Singer Mega - Colombo 03</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">Rs. 145,000.00</p>
                                        <p className="text-xs text-muted-foreground">Today, 2:30 PM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/60">
                    <CardHeader>
                        <CardTitle>Quick Transfer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-center">
                            <p className="text-sm text-muted-foreground mb-4">Select a beneficiary to start a transfer</p>
                            <div className="flex justify-center -space-x-2 overflow-hidden mb-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">U{i}</div>
                                ))}
                                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">+</div>
                            </div>
                            <Button className="w-full rounded-lg">Send Money</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
