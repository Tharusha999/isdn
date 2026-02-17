"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ArrowRightLeft,
    MapPin,
    Package,
    RefreshCcw,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Zap
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

// Mock Inventory Data
const INITIAL_INVENTORY = [
    {
        sku: "PRD-001",
        name: "Premium Ceylon Tea (Export Grade)",
        category: "Beverages",
        rdc: "North (Jaffna)",
        stock: 450,
        status: "In Stock",
    },
    {
        sku: "PRD-002",
        name: "Organic Coconut Oil (500ml)",
        category: "Cooking",
        rdc: "South (Galle)",
        stock: 25,
        status: "Low Stock",
    },
    {
        sku: "PRD-003",
        name: "Whole Wheat Pasta (Pack of 5)",
        category: "Pantry",
        rdc: "West (Colombo)",
        stock: 0,
        status: "Out of Stock",
    },
    {
        sku: "PRD-004",
        name: "Spices Selection - Gourmet Box",
        category: "Spices",
        rdc: "Central (Kandy)",
        stock: 1200,
        status: "In Stock",
    },
    {
        sku: "PRD-005",
        name: "Basmati Rice (Bulk 5kg)",
        category: "Pantry",
        rdc: "East (Trincomalee)",
        stock: 85,
        status: "In Stock",
    },
];

const RDCS = ["North (Jaffna)", "South (Galle)", "West (Colombo)", "Central (Kandy)", "East (Trincomalee)"];

export default function InventoryPage() {
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [transferData, setTransferData] = useState({
        sku: "",
        from: "",
        to: "",
        amount: 0
    });
    const [transferStatus, setTransferStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const handleSync = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleTransfer = () => {
        setTransferStatus('processing');
        setTimeout(() => {
            setInventory(prev => prev.map(item => {
                if (item.sku === transferData.sku && item.rdc === transferData.from) {
                    return { ...item, stock: Math.max(0, item.stock - transferData.amount) };
                }
                if (item.sku === transferData.sku && item.rdc === transferData.to) {
                    return { ...item, stock: item.stock + transferData.amount };
                }
                return item;
            }));
            setTransferStatus('success');
            setTimeout(() => {
                setTransferStatus('idle');
                setTransferData({ sku: "", from: "", to: "", amount: 0 });
            }, 2000);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Inventory Hub</h2>
                        <div className={`h-2 w-2 rounded-full bg-emerald-500 ${isRefreshing ? 'animate-ping' : ''}`} />
                    </div>
                    <p className="text-muted-foreground font-bold text-sm">
                        Enterprise-grade stock management across the ISDN regional network.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleSync}
                        className="rounded-2xl border-black/5 bg-white shadow-sm font-black uppercase text-[10px] tracking-widest h-14 px-8 group transition-all"
                    >
                        <RefreshCcw className={`mr-2 h-4 w-4 text-primary group-hover:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Sync All RDCs
                    </Button>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="rounded-2xl bg-black text-white shadow-xl hover:shadow-black/20 font-black uppercase text-[10px] tracking-widest h-14 px-10 group transition-all">
                                <ArrowRightLeft className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                Inter-Branch Transfer
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-md border-none p-0">
                            <div className="flex flex-col h-full">
                                <SheetHeader className="p-8 border-b border-black/5 bg-black/[0.02]">
                                    <SheetTitle className="text-2xl font-black uppercase tracking-tighter italic">Stock Transfer Tool</SheetTitle>
                                    <SheetDescription className="font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest">
                                        Authorise stock movement between regional warehouses.
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="p-8 space-y-8 flex-1">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Product</Label>
                                        <select
                                            className="w-full h-14 rounded-2xl border-black/5 bg-black/[0.02] px-4 font-bold outline-none focus:ring-1 focus:ring-primary/20"
                                            value={transferData.sku}
                                            onChange={(e) => setTransferData({ ...transferData, sku: e.target.value })}
                                        >
                                            <option value="">Choose a product...</option>
                                            {inventory.map(i => <option key={i.sku} value={i.sku}>{i.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source RDC</Label>
                                            <select
                                                className="w-full h-14 rounded-2xl border-black/5 bg-black/[0.02] px-4 font-bold outline-none focus:ring-1 focus:ring-primary/20"
                                                value={transferData.from}
                                                onChange={(e) => setTransferData({ ...transferData, from: e.target.value })}
                                            >
                                                <option value="">Source...</option>
                                                {RDCS.map(rdc => <option key={rdc} value={rdc}>{rdc}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target RDC</Label>
                                            <select
                                                className="w-full h-14 rounded-2xl border-black/5 bg-black/[0.02] px-4 font-bold outline-none focus:ring-1 focus:ring-primary/20"
                                                value={transferData.to}
                                                onChange={(e) => setTransferData({ ...transferData, to: e.target.value })}
                                            >
                                                <option value="">Target...</option>
                                                {RDCS.map(rdc => <option key={rdc} value={rdc}>{rdc}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transfer Quantity</Label>
                                        <Input
                                            type="number"
                                            placeholder="Enter amount..."
                                            className="h-14 rounded-2xl bg-black/[0.02] border-black/5 px-4 font-bold"
                                            value={transferData.amount}
                                            onChange={(e) => setTransferData({ ...transferData, amount: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="p-8 border-t border-black/5 bg-black/[0.02]">
                                    {transferStatus === 'success' ? (
                                        <Button className="w-full h-16 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest pointer-events-none">
                                            <CheckCircle2 className="mr-2 h-5 w-5" /> Transfer Authorised
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={transferStatus === 'processing' || !transferData.sku || !transferData.from || !transferData.to || !transferData.amount}
                                            onClick={handleTransfer}
                                            className="w-full h-16 rounded-2xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-widest shadow-xl group"
                                        >
                                            {transferStatus === 'processing' ? "Syncing RDC Nodes..." : "Initialise Transfer"}
                                            {transferStatus !== 'processing' && <ArrowRightLeft className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                    <CardHeader className="p-0 mb-4">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global SKU Count</p>
                            <Package className="h-6 w-6 text-primary/20" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-4xl font-black italic tracking-tighter uppercase leading-none">1,204</div>
                        <div className="flex items-center gap-1 mt-4 text-emerald-500">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase">+12 New This Month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2rem] p-8 overflow-hidden group">
                    <CardHeader className="p-0 mb-4">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Alerts</p>
                            <AlertTriangle className="h-6 w-6 text-rose-500/20" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-rose-500">08</div>
                        <div className="flex items-center gap-1 mt-4 text-rose-500">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Action Required</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-primary rounded-[2rem] p-8 overflow-hidden group">
                    <CardHeader className="p-0 mb-4">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Network Valuation</p>
                            <Zap className="h-6 w-6 text-white/20" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-4xl font-black italic tracking-tighter uppercase leading-none text-white">Rs. 4.8M</div>
                        <div className="flex items-center gap-1 mt-4 text-white/60">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Optimized Across Network</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 pb-0">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Regional Stock Levels</CardTitle>
                            <CardDescription className="font-bold text-muted-foreground/60 text-[10px] uppercase tracking-widest">
                                Live data synchronized with local RDC edge servers.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-10 pt-8">
                    <div className="rounded-3xl border border-black/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-black text-white">
                                <TableRow className="hover:bg-black/90">
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">SKU / ID</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">Product Description</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">Location (RDC)</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">In Stock</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">Current Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory.map((item) => (
                                    <TableRow key={`${item.sku}-${item.rdc}`} className="group hover:bg-black/[0.02] transition-colors border-black/5">
                                        <TableCell className="font-black font-mono text-xs">{item.sku}</TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <div className="font-bold tracking-tight text-sm">{item.name}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{item.category}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-3 w-3 text-primary" />
                                                <span className="font-bold text-xs">{item.rdc}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-black italic text-lg">{item.stock.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest border-none ${item.status === "In Stock" ? "bg-emerald-500/10 text-emerald-600" :
                                                        item.status === "Low Stock" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"
                                                    }`}
                                            >
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
