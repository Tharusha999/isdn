"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Truck,
    ArrowLeft,
    Navigation,
    Clock,
    ShieldCheck,
    Package,
    CheckCircle2,
    Calendar,
    Phone,
    User
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrackingPage() {
    const router = useRouter();
    const [progress, setProgress] = useState(65);

    // Minor progress simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => Math.min(100, p + 0.1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const order = {
        id: "#ORD-9945",
        status: "In Transit",
        eta: "Today, 15:45",
        driver: "Marcus Thorne",
        vehicle: "IS-VAN-782",
        origin: "Central RDC - Colombo 10",
        destination: "Cargills Food City - Nugegoda",
        history: [
            { time: "08:15 AM", event: "Order Dispatched from Central RDC", done: true },
            { time: "10:45 AM", event: "Keells Super Delivery Complete", done: true },
            { time: "12:30 PM", event: "En Route to Nugegoda Segment", done: true },
            { time: "03:45 PM", event: "Estimated Arrival", done: false },
        ]
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Back Navigation */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="h-12 w-12 rounded-2xl bg-white border border-black/5 shadow-sm hover:bg-slate-900 hover:text-white transition-all group"
                >
                    <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Shipment Tracker</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Order Index: {order.id}</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Live Tracking Visualization */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden group h-[500px] relative border border-slate-200">
                        {/* Map Texture Overlay - Blueprint Light Style */}
                        <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none" />
                        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent opacity-90 z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent opacity-90 z-10" />

                        {/* Status HUD */}
                        <div className="absolute top-10 left-10 right-10 z-20 flex justify-between items-start">
                            <div className="flex gap-6">
                                <div className="bg-white/70 backdrop-blur-xl border border-black/5 p-6 rounded-[2.5rem] shadow-xl">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Network Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <p className="text-xl font-black text-slate-900 italic leading-none">{order.status}</p>
                                    </div>
                                </div>
                            </div>
                            <Badge className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-full shadow-2xl group-hover:scale-105 transition-transform">
                                Live GPS Enabled
                            </Badge>
                        </div>

                        {/* Animated Tracker Element */}
                        <div className="absolute inset-0 flex items-center justify-center p-20">
                            <div className="relative w-full h-1 bg-slate-100 rounded-full">
                                <div
                                    className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                    style={{ width: `${progress}%` }}
                                />
                                {/* Vehicle Icon */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000"
                                    style={{ left: `${progress}%` }}
                                >
                                    <div className="relative -translate-x-1/2">
                                        <div className="absolute -inset-8 bg-primary/10 rounded-full animate-ping opacity-20" />
                                        <div className="h-16 w-16 bg-white rounded-[1.5rem] shadow-2xl flex items-center justify-center border border-black/5 rotate-6 hover:rotate-0 transition-all cursor-pointer">
                                            <Truck className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                </div>
                                {/* Nodes */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
                                    <div className="h-4 w-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg" />
                                    <p className="absolute top-full mt-4 text-[9px] font-black text-slate-400 uppercase whitespace-nowrap -translate-x-1/2">RDC Hub</p>
                                </div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                                    <div className="h-4 w-4 bg-slate-200 rounded-full border-4 border-white shadow-lg" />
                                    <p className="absolute top-full mt-4 text-[9px] font-black text-slate-400 uppercase whitespace-nowrap -translate-x-1/2 italic">Destination</p>
                                </div>
                            </div>
                        </div>

                        {/* Route Info Footer */}
                        <div className="absolute bottom-10 left-10 right-10 z-20">
                            <div className="bg-white/80 backdrop-blur-xl border border-black/5 p-8 rounded-[2.5rem] shadow-2xl">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Current Vector</p>
                                        <p className="text-lg font-black text-slate-800 italic leading-tight">{order.destination}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Estimated Arrival</p>
                                        <p className="text-3xl font-black text-slate-900 italic leading-none">{order.eta}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Logistics Assets Details */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                                    <User className="h-8 w-8 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Dispatch Officer</p>
                                    <p className="text-xl font-black italic text-slate-900">{order.driver}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-[8px] font-black uppercase border-none bg-emerald-50 text-emerald-600">ID Verified</Badge>
                                        <Badge variant="outline" className="text-[8px] font-black uppercase border-none bg-indigo-50 text-indigo-600">Top Rated</Badge>
                                    </div>
                                </div>
                                <Button size="icon" className="ml-auto h-12 w-12 rounded-xl bg-slate-900 text-white shadow-lg">
                                    <Phone className="h-5 w-5" />
                                </Button>
                            </div>
                        </Card>
                        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                                    <Truck className="h-8 w-8 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Assigned Vehicle</p>
                                    <p className="text-xl font-black italic text-slate-900">{order.vehicle}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Protocol: ISDN-GRID-X9</p>
                                </div>
                                <div className="ml-auto text-right">
                                    <ShieldCheck className="h-8 w-8 text-emerald-500 ml-auto mb-1" />
                                    <p className="text-[8px] font-black uppercase text-emerald-600 tracking-widest">Secure Link</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Shipment History */}
                <div className="space-y-8">
                    <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col h-full border border-black/5">
                        <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Shipment History</h3>
                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit log for chain-of-custody.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 flex-1">
                            <div className="space-y-10 relative">
                                <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100" />
                                {order.history.map((step, idx) => (
                                    <div key={idx} className="flex gap-8 relative items-start group">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center relative z-10 shadow-lg transition-all group-hover:scale-110 ${step.done ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-300'}`}>
                                            {step.done ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-black text-[13px] uppercase tracking-tight italic ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.event}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-3 w-3 text-slate-300" />
                                                <span className="text-[10px] font-black tabular-nums text-slate-400">{step.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="p-10 bg-slate-50 border-t border-black/5">
                            <Button className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20">
                                Contact Supply Chain Lead
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
