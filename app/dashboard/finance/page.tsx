"use client";

import { useState } from "react";
import {
    INITIAL_TRANSACTIONS,
    INITIAL_PRODUCTS,
    INITIAL_ORDERS,
    Transaction,
    Product,
    Order
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    DollarSign,
    Wallet,
    Zap,
    ArrowUpRight,
    CheckCircle2,
    FileText,
    Download,
    Plus,
    RefreshCw,
    ExternalLink,
    ArrowRight,
    CreditCard as CardIcon,
    Banknote,
    Smartphone,
    HandCoins
} from "lucide-react";

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [paySuccess, setPaySuccess] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useState(() => {
        if (typeof window !== 'undefined') {
            setRole(localStorage.getItem('userRole'));
        }
    });

    const handlePayment = () => {
        setIsPaying(true);
        setTimeout(() => {
            setIsPaying(false);
            setPaySuccess(true);
            setTimeout(() => {
                setPaySuccess(false);
                const updatedStatus: "PAID" = "PAID";
                setTransactions(prev => prev.map(t =>
                    t.id === selectedInvoice?.id ? { ...t, status: updatedStatus } : t
                ));
                setSelectedInvoice(prev => prev ? { ...prev, status: updatedStatus } : null);
            }, 2000);
        }, 2000);
    };

    const handleExport = () => {
        setIsExporting(true);
        alert("Exporting Ledger... \nYour transaction history is being compiled into a secure PDF.");
        setTimeout(() => setIsExporting(false), 3000);
    };

    const handleMethodSelect = (methodName: string) => {
        setSelectedMethod(methodName);
        alert(`Payment method selected: ${methodName}\nThis will be set as your preferred settlement vector.`);
    };

    const handleDownloadReceipt = (invoiceId: string) => {
        alert(`Generating Receipt for ${invoiceId}...\nYour digital transcript is being prepared for download.`);
    };

    const handleTopUp = () => {
        alert("Wallet Top-Up Initiated\nSynchronizing with secure payment gateway...");
    };

    const handleManualTransaction = () => {
        alert("Manual Transaction Protocol\nOpening secure entry interface...");
    };

    const handleBulkPayout = () => {
        alert("Bulk Payout Protocol\nSystem checking node status and account balances...");
    };

    const getOrderDetails = (orderId?: string) => {
        if (!orderId) return null;
        const order = INITIAL_ORDERS.find(o => o.id === orderId);
        if (!order) return null;

        const items = order.items.map(item => {
            const product = INITIAL_PRODUCTS.find(p => p.id === item.productId);
            return {
                name: product?.name || "Unknown Product",
                qty: item.quantity,
                price: product?.price || 0
            };
        });

        return { ...order, items };
    };

    const totalReceivables = transactions.reduce((acc, t) => t.status === "PENDING" ? acc + t.amount : acc, 0);
    const totalRevenue = transactions.reduce((acc, t) => t.status === "PAID" ? acc + t.amount : acc, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
                        {role === 'customer' ? 'Payment Method' : 'Finance Hub'}
                    </h2>
                    <p className="text-muted-foreground font-bold text-sm">
                        {role === 'customer'
                            ? "View and manage your digital invoices and payment settlements."
                            : "Enterprise treasury management and automated merchant billing."}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={isExporting}
                        className="rounded-2xl border-black/5 bg-white shadow-sm font-black uppercase text-[10px] tracking-widest h-14 px-8"
                    >
                        {isExporting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        {isExporting ? "Compiling Ledger..." : "Export Ledger"}
                    </Button>
                    <Button className="rounded-2xl bg-black text-white shadow-xl hover:shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10 group transition-all" onClick={handleManualTransaction}>
                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                        Manual Transaction
                    </Button>
                </div>
            </div>

            {/* Conditional Content: Customer vs Admin */}
            {role === 'customer' ? (
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column: Payment Methods and History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Available Methods */}
                        <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                            <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Available Methods</CardTitle>
                                <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                    Authorised vectors for digital and physical settlements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="grid gap-6 md:grid-cols-2">
                                    {[
                                        { name: "Credit/Debit Card", desc: "Visa, Mastercard, Amex", icon: CardIcon, color: "bg-indigo-50", text: "text-indigo-600" },
                                        { name: "Bank Transfer", desc: "Direct SLIPS/CEFT transfer", icon: Banknote, color: "bg-emerald-50", text: "text-emerald-600" },
                                        { name: "Online Banking", desc: "Instantly via payment gateway", icon: Smartphone, color: "bg-amber-50", text: "text-amber-600" },
                                        { name: "Cash on Delivery", desc: "Settlement upon arrival", icon: HandCoins, color: "bg-rose-50", text: "text-rose-600" }
                                    ].map((method) => (
                                        <div
                                            key={method.name}
                                            onClick={() => handleMethodSelect(method.name)}
                                            className={`flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border transition-all cursor-pointer group hover:shadow-xl ${selectedMethod === method.name ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-black/[0.03]'}`}
                                        >
                                            <div className={`h-14 w-14 rounded-2xl ${method.color} flex items-center justify-center transition-all group-hover:scale-110`}>
                                                <method.icon className={`h-7 w-7 ${method.text}`} />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm uppercase text-slate-900 italic tracking-tight">{method.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{method.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment History */}
                        <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                            <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">My Ledger</CardTitle>
                                <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                    Historical record of your settlements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 text-white">
                                        <tr>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">ID / Date</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Amount</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-right">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {transactions.map((inv) => (
                                            <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-10 py-6">
                                                    <p className="font-black text-xs uppercase text-slate-900">{inv.id}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{inv.date}</p>
                                                </td>
                                                <td className="px-10 py-6 font-black italic text-lg text-slate-900">
                                                    Rs. {inv.amount.toLocaleString()}
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex justify-center">
                                                        <Badge className={`rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest border-none ${inv.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                                                            {inv.status}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        className="h-10 w-10 p-0 rounded-xl border border-black/5 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                        onClick={() => handleDownloadReceipt(inv.id)}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Wallet Info */}
                    <div className="space-y-8">
                        <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[3rem] p-10 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Zap className="h-24 w-24 rotate-12" />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Network Credit</p>
                                    <div className="text-4xl font-black italic tracking-tighter uppercase">Rs. 0.00</div>
                                </div>
                                <div className="space-y-4">
                                    <Button className="w-full h-16 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest text-[10px] shadow-xl" onClick={handleTopUp}>
                                        Top Up Wallet
                                    </Button>
                                    <p className="text-center text-[10px] font-bold text-white/40 uppercase tracking-widest">Secure node synchronization enabled.</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-10 border border-black/5">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900 mb-8">Security Hub</CardTitle>
                            <div className="space-y-6">
                                {[
                                    { label: "Two-Factor Auth", status: "Enabled", color: "text-emerald-500" },
                                    { label: "IP Whitelisting", status: "Inactive", color: "text-slate-300" },
                                    { label: "Payment Alerts", status: "Active", color: "text-emerald-500" }
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-black/[0.03]">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <>
                    {/* Smart KPI Cards */}
                    <div className="grid gap-8 md:grid-cols-3">
                        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 overflow-hidden group relative border border-slate-200">
                            <div className="absolute top-0 right-0 p-8">
                                <DollarSign className="h-12 w-12 text-slate-100 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Receivables</p>
                            <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                                Rs. {(totalReceivables / 1000).toFixed(1)}K
                            </div>
                            <div className="flex items-center gap-1 mt-6 text-amber-500">
                                <ArrowUpRight className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Active Billing</span>
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-10 overflow-hidden group border border-black/5">
                            <div className="absolute top-0 right-0 p-8">
                                <Wallet className="h-12 w-12 text-rose-500/5 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Settled Tokens</p>
                            <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-emerald-600">
                                Rs. {(totalRevenue / 1000).toFixed(1)}K
                            </div>
                            <div className="flex items-center gap-1 mt-6 text-emerald-500">
                                <ArrowUpRight className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">+12.5% vs Prev</span>
                            </div>
                        </Card>

                        <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-10 overflow-hidden group relative border border-black/5">
                            <div className="absolute top-0 right-0 p-8">
                                <Zap className="h-12 w-12 text-indigo-500/10 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Net Cash Flow</p>
                            <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                                Rs. {((totalRevenue - 120000) / 1000).toFixed(1)}K
                            </div>
                            <div className="flex items-center gap-1 mt-6 text-emerald-500">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Treasury Optimal</span>
                            </div>
                        </Card>
                    </div>

                    {/* Invoices and Ledger */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        <Card className="lg:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                            <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Merchant Ledger</CardTitle>
                                        <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                            Automated billing and payment settlement records.
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all rounded-xl h-10 border border-black/5 px-6">
                                        View Full History
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 text-white">
                                        <tr>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Invoice / Customer</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest">Value</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5">
                                        {transactions.map((inv) => (
                                            <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="px-10 py-6">
                                                    <div className="space-y-1">
                                                        <p className="font-black text-xs uppercase text-slate-900">{inv.id}</p>
                                                        <p className="font-bold text-sm tracking-tight text-slate-600">{inv.customer}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{inv.date}</p>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 font-black italic text-lg text-slate-900">
                                                    Rs. {inv.amount.toLocaleString()}
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex justify-center">
                                                        <Badge className={`rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest border-none ${inv.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
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
                                                                className="h-12 w-12 p-0 rounded-2xl border border-black/5 hover:bg-slate-900 hover:text-white transition-all shadow-sm group"
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                            </Button>
                                                        </SheetTrigger>
                                                        <SheetContent side="right" className="w-full sm:max-w-xl border-none p-0 overflow-y-auto bg-white">
                                                            {selectedInvoice && (() => {
                                                                const details = getOrderDetails(selectedInvoice.orderId);
                                                                return (
                                                                    <div className="flex flex-col h-full">
                                                                        {/* Digital Receipt Design */}
                                                                        <div className="p-12 space-y-12">
                                                                            <div className="flex justify-between items-start">
                                                                                <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl">
                                                                                    <Zap className="h-10 w-10 text-white fill-current" />
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-slate-900">ISDN</h3>
                                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Ledger</p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-2 pb-8 border-b border-black/5">
                                                                                <div className="flex justify-between items-baseline">
                                                                                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Digital Invoice</h2>
                                                                                    <Badge className={`rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest border-none ${selectedInvoice.status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                                                                        {selectedInvoice.status === "PAID" ? "Settled" : "Awaiting Payout"}
                                                                                    </Badge>
                                                                                </div>
                                                                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                                    <span># {selectedInvoice.id}</span>
                                                                                    <span>ISSUED {selectedInvoice.date}</span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="grid grid-cols-2 gap-12">
                                                                                <div className="space-y-4">
                                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient Node</p>
                                                                                    <div>
                                                                                        <p className="font-black text-lg text-slate-900 uppercase italic">{selectedInvoice.customer}</p>
                                                                                        <p className="text-xs font-bold text-slate-500 mt-1 leading-relaxed">Verification ID: CUST-88029<br />Assigned RDC: West (Colombo)</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-black/[0.03]">
                                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Vector</p>
                                                                                    <div>
                                                                                        <p className="font-black text-sm text-slate-900">{selectedInvoice.method}</p>
                                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Auth Code: 99x-1022</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-6">
                                                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consignment Breakdown</p>
                                                                                <div className="space-y-4">
                                                                                    {details ? details.items.map((item, idx) => (
                                                                                        <div key={idx} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0 group">
                                                                                            <div>
                                                                                                <p className="font-black text-xs text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">{item.name}</p>
                                                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.qty} units @ Rs. {item.price.toLocaleString()}</p>
                                                                                            </div>
                                                                                            <p className="font-black italic text-sm text-slate-900">Rs. {(item.qty * item.price).toLocaleString()}</p>
                                                                                        </div>
                                                                                    )) : (
                                                                                        <div className="py-8 bg-slate-50 rounded-2xl text-center border border-dashed border-black/10">
                                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legacy Record / Direct Credit</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8 relative overflow-hidden">
                                                                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                                                                    <Zap className="h-16 w-16 rotate-12" />
                                                                                </div>
                                                                                <div className="space-y-4 relative z-10">
                                                                                    <div className="flex justify-between items-baseline opacity-40">
                                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Transactional Gross</span>
                                                                                        <span className="font-bold text-sm">Rs. {(selectedInvoice.amount * 0.95).toLocaleString()}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between items-baseline opacity-40">
                                                                                        <span className="text-[10px] font-black uppercase tracking-widest">Processing (5%)</span>
                                                                                        <span className="font-bold text-sm">Rs. {(selectedInvoice.amount * 0.05).toLocaleString()}</span>
                                                                                    </div>
                                                                                    <div className="h-px bg-white/10" />
                                                                                    <div className="flex justify-between items-center pt-2">
                                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Settlement</span>
                                                                                        <span className="text-4xl font-black italic tracking-tighter">Rs. {selectedInvoice.amount.toLocaleString()}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="p-10 bg-slate-50 border-t border-black/5 mt-auto sticky bottom-0 backdrop-blur-md bg-white/80">
                                                                            {selectedInvoice.status === "PENDING" ? (
                                                                                <div className="space-y-4">
                                                                                    {paySuccess ? (
                                                                                        <Button className="w-full h-20 rounded-[2.5rem] bg-emerald-500 text-white font-black uppercase tracking-widest pointer-events-none shadow-2xl scale-105 transition-all">
                                                                                            <CheckCircle2 className="mr-3 h-6 w-6" /> Node Synchronisation Active
                                                                                        </Button>
                                                                                    ) : (
                                                                                        <Button
                                                                                            onClick={handlePayment}
                                                                                            disabled={isPaying}
                                                                                            className="w-full h-20 rounded-[2rem] bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] group"
                                                                                        >
                                                                                            {isPaying ? "Verifying..." : "Authorise Digital Payout"}
                                                                                            {!isPaying && <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />}
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex gap-4">
                                                                                    <Button className="flex-1 h-18 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest shadow-xl group" onClick={() => handleDownloadReceipt(selectedInvoice.id)}>
                                                                                        <Download className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" /> Save Receipt
                                                                                    </Button>
                                                                                    <Button variant="outline" className="flex-1 h-18 rounded-2xl border-black/5 bg-white font-black uppercase tracking-widest shadow-sm"
                                                                                        onClick={() => alert("Verification Proof Protocol\nFetching blockchain transaction confirmation...")}>
                                                                                        <ExternalLink className="mr-2 h-4 w-4" /> Proof of Payment
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
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
                            <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-10 overflow-hidden border border-black/5">
                                <CardHeader className="p-0 mb-8">
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Payout Velocity</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Target Compliance</span>
                                            <span className="text-slate-900 italic">94%</span>
                                        </div>
                                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-black/5">
                                            <div className="h-full bg-primary rounded-full w-[94%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Settlement Delay</span>
                                            <span className="text-emerald-500 italic">Optimal (1.2 days)</span>
                                        </div>
                                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-black/5">
                                            <div className="h-full bg-emerald-500 rounded-full w-[20%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-2xl bg-slate-50 rounded-[3rem] p-10 overflow-hidden relative border border-black/5 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent" />
                                <CardHeader className="p-0 mb-10 relative z-10">
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Quick Settlement</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 relative z-10 space-y-8">
                                    <div className="flex justify-center -space-x-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-14 w-14 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center font-black italic text-[10px] text-slate-400 transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-sm">M{i}</div>
                                        ))}
                                        <div className="h-14 w-14 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center font-black text-xs text-white shadow-xl hover:scale-110 transition-transform cursor-pointer">+</div>
                                    </div>
                                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Secure rapid-transfer to verified RDC partners and vendors.</p>
                                    <Button className="w-full h-18 rounded-[2rem] bg-slate-900 text-white hover:bg-black font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all hover:scale-[1.02]" onClick={handleBulkPayout}>
                                        Initialise Bulk Payout <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
