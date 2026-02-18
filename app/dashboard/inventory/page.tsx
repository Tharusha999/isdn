"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Search,
    RefreshCw,
    ArrowRightLeft,
    AlertTriangle,
    Package,
    ArrowUpRight,
    Building2,
    ShieldAlert,
    TrendingUp,
    MapPin,
    Zap
} from "lucide-react";
import { INITIAL_PRODUCTS, RDCS, RDC } from "@/lib/data";

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRDC, setSelectedRDC] = useState<RDC | "All">("All");
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 2000);
    };

    const filteredInventory = INITIAL_PRODUCTS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const hasStockInRDC = selectedRDC === "All" || p.stock[selectedRDC] > 0;
        return matchesSearch && hasStockInRDC;
    });

    const totalStock = INITIAL_PRODUCTS.reduce((acc, p) => {
        if (selectedRDC === "All") {
            return acc + Object.values(p.stock).reduce((a, b) => a + b, 0);
        }
        return acc + p.stock[selectedRDC];
    }, 0);

    const lowStockCount = INITIAL_PRODUCTS.filter(p => {
        if (selectedRDC === "All") {
            return Object.values(p.stock).some(s => s < 500);
        }
        return p.stock[selectedRDC] < 500;
    }).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Intelligent Oversight Headers */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-[2rem] border-black/5 shadow-sm bg-white/50 backdrop-blur-md">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="h-6 w-6" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Global Consignment</p>
                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-900">{totalStock.toLocaleString()}</h3>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-black/5 shadow-sm bg-white/50 backdrop-blur-md">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black text-rose-600">CRITICAL</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Low Stock Alerts</p>
                        <h3 className="text-3xl font-black italic tracking-tighter text-rose-600">{lowStockCount}</h3>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-none shadow-2xl bg-white col-span-2 border border-black/5 overflow-hidden group">
                    <CardHeader className="p-8 border-b border-black/5 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-black italic tracking-tighter uppercase leading-tight text-slate-900">Node Synchronization Status</h3>
                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-2">{RDCS.length} ACTIVE DISTRIBUTION CORES</p>
                            </div>
                            <Button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="bg-slate-900 hover:bg-black text-white rounded-xl h-12 px-6 font-black uppercase text-[10px] shadow-lg shadow-black/10"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                                {isSyncing ? "Syncing..." : "Sync Network"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex gap-3">
                            {RDCS.map(rdc => (
                                <div key={rdc} className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden border border-black/[0.03]">
                                    <div className="h-full bg-emerald-500 animate-pulse transition-all duration-1000" style={{ width: '100%' }} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                            <span>Latency: 12ms</span>
                            <span className="text-emerald-500">All Nodes Operational</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Controls */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 p-1.5 bg-black/5 rounded-2xl w-fit overflow-x-auto">
                    <button
                        onClick={() => setSelectedRDC("All")}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedRDC === "All"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        Master Inventory
                    </button>
                    {RDCS.map(rdc => (
                        <button
                            key={rdc}
                            onClick={() => setSelectedRDC(rdc)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedRDC === rdc
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            {rdc.split(" ")[0]}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Locate Consignment..."
                            className="pl-12 pr-6 h-14 rounded-2xl bg-white border-black/5 shadow-sm w-full lg:w-[300px] font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Consignment Matrix */}
            <Card className="rounded-[2.5rem] border-black/5 shadow-2xl overflow-hidden bg-white">
                <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Regional Stock Allocation</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Real-time oversight across the 5 distribution hubs.</CardDescription>
                    </div>
                    {selectedRDC !== "All" && (
                        <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-4 py-2 rounded-xl">
                            {selectedRDC.toUpperCase()} ACTIVE
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="p-10">
                    <div className="rounded-3xl border border-black/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="hover:bg-slate-50 border-black/5">
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 h-auto">Consignment Identity</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 h-auto">Category</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 h-auto">
                                        {selectedRDC === "All" ? "RDC Allocation Matrix" : "Available Stock"}
                                    </TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 h-auto">Synchronicity</TableHead>
                                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 h-auto text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInventory.map(product => (
                                    <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors group border-black/5">
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl border border-black/5 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img src={product.image} className="h-full w-full object-cover mix-blend-multiply opacity-80" />
                                                </div>
                                                <div>
                                                    <p className="font-bold tracking-tight text-slate-900 leading-none mb-1">{product.name}</p>
                                                    <p className="text-[10px] font-black text-primary font-mono opacity-60 uppercase">{product.sku}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase tracking-widest border-black/10 px-3">
                                                {product.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            {selectedRDC === "All" ? (
                                                <div className="flex gap-1.5 h-8 items-end">
                                                    {RDCS.map(rdc => {
                                                        const stock = product.stock[rdc];
                                                        const height = Math.max(10, (stock / 2000) * 100);
                                                        return (
                                                            <div
                                                                key={rdc}
                                                                className={`w-4 rounded-t-sm transition-all duration-500 hover:opacity-100 opacity-60 ${stock < 500 ? "bg-rose-500" : "bg-primary group-hover:opacity-80"}`}
                                                                style={{ height: `${height}%` }}
                                                                title={`${rdc}: ${stock} units`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="space-y-1.5">
                                                    <p className="text-xl font-black tabular-nums tracking-tighter italic text-slate-900">
                                                        {product.stock[selectedRDC].toLocaleString()}
                                                    </p>
                                                    <div className="h-1 w-24 bg-black/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${product.stock[selectedRDC] < 500 ? "bg-rose-500" : "bg-emerald-500"}`}
                                                            style={{ width: `${Math.min(100, (product.stock[selectedRDC] / 2000) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">LIVE NODE</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/5"
                                            >
                                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                                Transfer
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Transfer Dock - Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-[280px] bg-white border-t border-black/5 p-6 z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl bg-white/90">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Inter-Branch Bridge</span>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 border border-black/5 rounded-xl text-slate-900">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <ArrowRightLeft className="h-4 w-4 text-slate-300" />
                                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                                    <Building2 className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        <div className="h-12 w-px bg-black/5 hidden md:block" />
                        <div className="hidden md:block">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Stock Rebalancing Active</p>
                            <p className="font-bold text-slate-600 text-sm italic tracking-tight">Enterprise-grade cross-node inventory movement enabled.</p>
                        </div>
                    </div>
                    <Button className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-black/20 group">
                        Authorize Global Adjustment <Zap className="ml-2 h-4 w-4 text-primary fill-current group-hover:scale-125 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
