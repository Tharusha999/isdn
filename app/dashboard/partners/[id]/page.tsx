"use client";

import { use, useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RDCPartner } from "@/lib/database-types";
import { fetchPartners } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Building,
    Activity,
    Clock,
    CheckCircle2,
    TrendingUp,
    Star,
    ShieldCheck,
    FileText,
    Calendar,
    Briefcase,
    Truck,
    Save
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerStatusType } from "@/lib/database-types";

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const decodedName = decodeURIComponent(id);

    const [partner, setPartner] = useState<RDCPartner | null>(null);
    const [loading, setLoading] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        const loadPartner = async () => {
            try {
                setLoading(true);
                const data = await fetchPartners();
                const found = (data || []).find((p: any) => p.name === decodedName);
                if (found) {
                    setPartner(found as RDCPartner);
                }
            } catch (err) {
                console.error("Failed to fetch partner:", err);
            } finally {
                setLoading(false);
            }
        };

        const savedData = localStorage.getItem(`partner_${decodedName}`);
        if (savedData) {
            setPartner(JSON.parse(savedData));
            setLoading(false);
        } else {
            loadPartner();
        }
    }, [decodedName]);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Activity className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!partner) {
        notFound();
    }

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            localStorage.setItem(`partner_${decodedName}`, JSON.stringify(partner));
            setIsSaving(false);
            setIsSheetOpen(false);
        }, 800);
    };

    return (
        <div className="space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/management/partners">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Partner Contract Details</h1>
                    <p className="text-sm text-muted-foreground">Detailed agreement and performance overview</p>
                </div>
            </div>

            {/* Partner Hero */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-primary to-primary/80"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="h-24 w-24 rounded-2xl border-4 border-white bg-white flex items-center justify-center text-4xl font-bold text-primary shadow-md">
                                <Building className="h-12 w-12" />
                            </div>
                            <div className="mb-1">
                                <h2 className="text-2xl font-black uppercase tracking-tight">{partner.name}</h2>
                                <p className="text-muted-foreground font-medium">{partner.type}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-1">
                            <Badge
                                variant="outline"
                                className={`
                                    px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border-none
                                    ${partner.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                                `}
                            >
                                {partner.status}
                            </Badge>

                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button className="rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-all shadow-lg active:scale-95">
                                        Manage Agreement
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-[400px] sm:w-[540px] rounded-l-[3rem] border-none shadow-2xl p-0 overflow-hidden">
                                    <div className="h-full flex flex-col bg-white">
                                        <SheetHeader className="p-10 bg-slate-50/50 border-b border-black/5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-indigo-500 rounded-lg text-white">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <SheetTitle className="text-2xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Agreement Panel</SheetTitle>
                                            </div>
                                            <SheetDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Update contract terms and partner distribution status.</SheetDescription>
                                        </SheetHeader>

                                        <div className="flex-1 overflow-y-auto p-10 space-y-10">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operation Status</Label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['Active', 'Review'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => setPartner({ ...partner, status: status as PartnerStatusType })}
                                                            className={`h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border ${partner.status === status ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-black/10 hover:border-black/20'}`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agreement Type</Label>
                                                <Input
                                                    value={partner.agreementType || ""}
                                                    onChange={(e) => setPartner({ ...partner, agreementType: e.target.value })}
                                                    className="h-14 rounded-xl border-black/10 font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500/10"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contract Start</Label>
                                                    <Input
                                                        value={partner.contractStart || ""}
                                                        onChange={(e) => setPartner({ ...partner, contractStart: e.target.value })}
                                                        className="h-14 rounded-xl border-black/10 font-bold text-slate-900"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contract End</Label>
                                                    <Input
                                                        value={partner.contractEnd || ""}
                                                        onChange={(e) => setPartner({ ...partner, contractEnd: e.target.value })}
                                                        className="h-14 rounded-xl border-black/10 font-bold text-slate-900"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-6 border-t border-dashed border-black/10">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Internal Bio / Compliance Memo</Label>
                                                <textarea
                                                    value={partner.bio || ""}
                                                    onChange={(e) => setPartner({ ...partner, bio: e.target.value })}
                                                    className="w-full h-40 rounded-2xl border border-black/10 p-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-10 bg-slate-50 border-t border-black/5">
                                            <Button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="w-full h-16 rounded-2xl bg-slate-900 text-white hover:bg-black font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-500/20 group"
                                            >
                                                {isSaving ? "Synchronizing Data..." : "Update Agreement Config"}
                                                {!isSaving && <Save className="ml-3 h-4 w-4 group-hover:scale-110 transition-transform" />}
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            {/* Contact Details */}
                            <Card className="border-none bg-slate-50/50 shadow-none rounded-2xl">
                                <CardHeader className="pb-3 px-6 pt-6">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="h-3.5 w-3.5 text-primary" /> Contact Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-black/5">
                                            <Briefcase className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Main Contact</p>
                                            <p className="text-sm font-bold">{partner.contact}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-black/5">
                                            <Mail className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-bold truncate">{partner.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-black/5">
                                            <Phone className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Phone Number</p>
                                            <p className="text-sm font-bold">{partner.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-black/5">
                                            <MapPin className="h-4 w-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Base Hub</p>
                                            <p className="text-sm font-bold">{partner.hub}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contract Terms */}
                            <Card className="border-none bg-slate-50/50 shadow-none rounded-2xl">
                                <CardHeader className="pb-3 px-6 pt-6">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5 text-primary" /> Contract Terms
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Agreement Period</p>
                                            <p className="text-sm font-bold">{partner.contractStart} — {partner.contractEnd}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Agreement Type</p>
                                            <p className="text-sm font-bold">{partner.agreementType}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            {/* Performance Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="bg-white border-black/5 shadow-sm rounded-2xl">
                                    <CardContent className="p-5 flex flex-col items-center text-center">
                                        <Star className="h-6 w-6 text-amber-500 mb-2" />
                                        <p className="text-2xl font-black">{partner.rating}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Rating</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-black/5 shadow-sm rounded-2xl">
                                    <CardContent className="p-5 flex flex-col items-center text-center">
                                        <Activity className="h-6 w-6 text-emerald-500 mb-2" />
                                        <p className="text-2xl font-black">{partner.complianceScore}%</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Compliance</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-black/5 shadow-sm rounded-2xl">
                                    <CardContent className="p-5 flex flex-col items-center text-center">
                                        <ShieldCheck className="h-6 w-6 text-indigo-500 mb-2" />
                                        <p className="text-2xl font-black">{partner.recentAudits?.length || 0}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Audits (Year)</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-black/5 shadow-sm rounded-2xl">
                                    <CardContent className="p-5 flex flex-col items-center text-center">
                                        <Truck className="h-6 w-6 text-primary mb-2" />
                                        <p className="text-2xl font-black">2.4k</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Shipments</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Audit History */}
                            <Card className="border-black/5 shadow-sm rounded-2xl overflow-hidden">
                                <CardHeader className="border-b border-black/5 pb-4">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" /> Compliance Audit logs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        {partner.recentAudits?.map((audit, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-black/5">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h4 className="font-bold text-sm">Routine Performance Audit</h4>
                                                        <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[8px] uppercase tracking-widest px-2">{audit.result}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">Conducted by <span className="text-foreground font-bold">{audit.inspector}</span> on {audit.date || audit.audit_date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* About / Bio */}
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-dashed border-black/10">
                                <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Partner Bio & Overview
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {partner.bio}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
