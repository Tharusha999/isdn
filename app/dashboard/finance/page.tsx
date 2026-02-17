"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    Wallet,
    Download,
    FileText,
    CheckCircle2,
    Zap,
    ExternalLink,
    Shield,
    Plus,
    ArrowRight
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const TRANSACTIONS = [
    {
        id: "INV-2024-101",
        customer: "Singer Mega - Colombo 03",
        amount: 145000.00,
        date: "Today, 2:30 PM",
        status: "PAID",
        method: "Credit Card",
        items: [
            { name: "Premium Ceylon Tea", qty: 40, price: 2450 },
            { name: "Organic Coconut Oil", qty: 20, price: 1800 }
        ]
    },
    {
        id: "INV-2024-102",
        customer: "Softlogic Retail - Galle",
        amount: 82400.00,
        date: "Today, 11:15 AM",
        status: "PENDING",
        method: "Bank Transfer",
        items: [
            { name: "Basmati Rice 5kg", qty: 5, price: 12500 },
            { name: "Natural Honey", qty: 5, price: 3800 }
        ]
    },
    {
        id: "INV-2024-103",
        customer: "Abans PLC - Kandy",
        amount: 212500.00,
        date: "Yesterday, 4:45 PM",
        status: "PAID",
        method: "Online Banking",
        items: [
            { name: "Gourmet Spices Box", qty: 20, price: 4500 },
            { name: "Whole Wheat Pasta", qty: 30, price: 3200 }
        ]
    }
];

export default function FinancePage() {
    const [selectedInvoice, setSelectedInvoice] = useState<typeof TRANSACTIONS[0] | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [paySuccess, setPaySuccess] = useState(false);

    const handlePayment = () => {
        setIsPaying(true);
        setTimeout(() => {
            setIsPaying(false);
            setPaySuccess(true);
            // Updating local state would normally happen here
            setTimeout(() => {
                setPaySuccess(false);
                setSelectedInvoice(prev => prev ? { ...prev, status: 'PAID' } : null);
            }, 2000);
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Finance Hub</h2>
                    <p className="text-muted-foreground font-bold text-sm">
                        Enterprise treasury management and automated merchant billing.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-black/5 bg-white shadow-sm font-black uppercase text-[10px] tracking-widest h-14 px-8">
                        <Download className="mr-2 h-4 w-4" /> Export Ledger
                    </Button>
                    <Button className="rounded-2xl bg-black text-white shadow-xl hover:shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10 group transition-all">
                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                        Manual Transaction
                    </Button>
                </div>
            </div>

            {/* Smart KPI Cards */}
            <div className="grid gap-8 md:grid-cols-3">
                <Card className="border-none shadow-sm bg-black text-white rounded-[2.5rem] p-8 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <DollarSign className="h-12 w-12 text-white/10 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Total Receivables</p>
                    <div className="text-4xl font-black italic tracking-tighter uppercase leading-none">Rs. 8.2M</div>
                    <div className="flex items-center gap-1 mt-6 text-emerald-400">
                        <ArrowUpRight className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase">+20.1% Growth</span>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <Wallet className="h-12 w-12 text-rose-500/10 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Operating Expenses</p>
                    <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-rose-500">Rs. 1.2M</div>
                    <div className="flex items-center gap-1 mt-6 text-rose-500">
                        <ArrowDownRight className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Optimized: -4.5%</span>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-primary rounded-[2rem] p-8 overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <Zap className="h-12 w-12 text-white/10 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Net Cash Flow</p>
                    <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">Rs. 7.0M</div>
                    <div className="flex items-center gap-1 mt-6 text-white/60">
                        <span className="text-[10px] font-black uppercase tracking-widest">Payout Ready</span>
                    </div>
                </Card>
            </div>

            {/* Invoices and Ledger */}
            <div className="grid gap-8 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 border-b border-black/5 bg-black/[0.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-black">Merchant Ledger</CardTitle>
                                <CardDescription className="font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest mt-1">
                                    Automated billing and payment settlement records.
                                </CardDescription>
                            </div>
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-xl h-10">
                                View Full History
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-left">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Invoice / Customer</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Value</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {TRANSACTIONS.map((inv) => (
                                    <tr key={inv.id} className="group hover:bg-black/[0.02] transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="space-y-1">
                                                <p className="font-black text-xs uppercase text-primary">{inv.id}</p>
                                                <p className="font-bold text-sm tracking-tight">{inv.customer}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground/60">{inv.date}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 font-black italic text-lg">
                                            Rs. {inv.amount.toLocaleString()}
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex justify-center">
                                                <Badge className={`rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest border-none ${inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                                                    }`}>
                                                    {inv.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <Sheet onOpenChange={(open) => !open && setSelectedInvoice(null)}>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        onClick={() => setSelectedInvoice(inv)}
                                                        variant="ghost"
                                                        className="h-10 w-10 p-0 rounded-xl hover:bg-black hover:text-white transition-transform active:scale-95 shadow-sm"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent side="right" className="w-full sm:max-w-md border-none p-0">
                                                    {selectedInvoice && (
                                                        <div className="flex flex-col h-full bg-white">
                                                            <SheetHeader className="p-8 border-b border-black/5 bg-black/[0.02]">
                                                                <div className="flex justify-between items-start mb-6">
                                                                    <div className="h-12 w-12 bg-black rounded-2xl flex items-center justify-center">
                                                                        <Zap className="h-6 w-6 text-white italic" />
                                                                    </div>
                                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[8px] uppercase px-3 h-6">Verified Invoice</Badge>
                                                                </div>
                                                                <SheetTitle className="text-3xl font-black uppercase tracking-tighter italic">Invoice Summary</SheetTitle>
                                                                <SheetDescription className="font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest">
                                                                    ID: {selectedInvoice.id} • Generated {selectedInvoice.date}
                                                                </SheetDescription>
                                                            </SheetHeader>

                                                            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                                                                <div className="space-y-4">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Billed To</p>
                                                                    <div className="p-6 rounded-[2rem] bg-black/[0.03] border border-black/5">
                                                                        <p className="font-black text-lg italic tracking-tight">{selectedInvoice.customer}</p>
                                                                        <p className="text-xs font-bold text-muted-foreground mt-1">Registered Merchant #ISDN-88{selectedInvoice.id.slice(-2)}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payload Breakdown</p>
                                                                    <div className="space-y-3">
                                                                        {selectedInvoice.items.map((item, idx) => (
                                                                            <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-black/5">
                                                                                <div>
                                                                                    <p className="font-bold text-sm tracking-tight">{item.name}</p>
                                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Qty: {item.qty} units</p>
                                                                                </div>
                                                                                <p className="font-black italic text-xs">Rs. {(item.qty * item.price).toLocaleString()}</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Details</p>
                                                                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                                        <div className="flex items-center gap-2">
                                                                            <Shield className="h-4 w-4 text-emerald-500" /> Secure {selectedInvoice.method}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="p-8 border-t border-black/5 bg-black/[0.02] space-y-4">
                                                                <div className="flex justify-between items-baseline mb-4">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Payable</span>
                                                                    <span className="text-4xl font-black italic tracking-tighter">Rs. {selectedInvoice.amount.toLocaleString()}</span>
                                                                </div>

                                                                {selectedInvoice.status === "PENDING" ? (
                                                                    <div className="space-y-3">
                                                                        {paySuccess ? (
                                                                            <Button className="w-full h-16 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest pointer-events-none">
                                                                                <CheckCircle2 className="mr-2 h-5 w-5" /> Transaction Success
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                onClick={handlePayment}
                                                                                disabled={isPaying}
                                                                                className="w-full h-16 rounded-2xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-widest shadow-xl group"
                                                                            >
                                                                                {isPaying ? "Processing Gateway..." : "Pay Now (Safe Checkout)"}
                                                                                {!isPaying && <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                                                            </Button>
                                                                        )}
                                                                        <Button variant="outline" className="w-full h-14 rounded-2xl border-black/5 bg-white font-black uppercase text-[10px] tracking-widest">
                                                                            <Download className="mr-2 h-4 w-4" /> Download PDF Invoice
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <Button disabled className="w-full h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black uppercase tracking-widest border-none pointer-events-none">
                                                                        <CheckCircle2 className="mr-2 h-5 w-5" /> Invoice Settled
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </SheetContent>
                                            </Sheet>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-8 overflow-hidden">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-lg font-black uppercase tracking-tighter italic">Payout Velocity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    <span>Target Compliance</span>
                                    <span className="text-black italic">94%</span>
                                </div>
                                <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full w-[94%]" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                    <span>Settlement Delay</span>
                                    <span className="text-emerald-500 italic">Optimal (1.2 days)</span>
                                </div>
                                <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full w-[20%]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-black text-white rounded-[2.5rem] p-8 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                        <CardHeader className="p-0 mb-8 relative z-10">
                            <CardTitle className="text-lg font-black uppercase tracking-tighter italic">Quick Settlement</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 relative z-10 space-y-6">
                            <div className="flex justify-center -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-12 w-12 rounded-full ring-4 ring-black bg-white/10 flex items-center justify-center font-black italic text-xs">M{i}</div>
                                ))}
                                <div className="h-12 w-12 rounded-full ring-4 ring-black bg-primary flex items-center justify-center font-black text-xs text-white shadow-xl">+</div>
                            </div>
                            <p className="text-center text-[10px] font-bold text-white/40 uppercase tracking-widest">Rapid transfer to verified partners</p>
                            <Button className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95">
                                Initialise Payout <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
