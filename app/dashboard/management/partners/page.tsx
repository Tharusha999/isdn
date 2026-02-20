"use client";
import { RDCPartner, RDCType, PartnerStatusType } from "@/lib/database-types";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Mail,
    Phone,
    Plus,
    Search,
    MoreHorizontal,
    MapPin,
    Truck,
    ShieldCheck,
    Star,
    X,
    User
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { fetchPartners, fetchAllProductStocks, createPartner, updatePartner, deletePartner } from "@/public/src/supabaseClient";

export default function PartnersPage() {
    const [partnerList, setPartnerList] = useState<RDCPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [rdcs, setRdcs] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState<RDCPartner>({
        id: "",
        name: "",
        type: "",
        hub: "" as RDCType,
        contact: "",
        email: "",
        phone: "",
        status: "Active" as PartnerStatusType,
        rating: 5.0,
        contract_start: "",
        contract_end: "",
        agreement_type: "",
        compliance_score: 0,
        bio: "",
        created_at: "",
        updated_at: "",
        recentAudits: []
    });

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = async () => {
        try {
            setLoading(true);
            const [partnerData, stocksData] = await Promise.all([
                fetchPartners(),
                fetchAllProductStocks()
            ]);
            setPartnerList(partnerData as RDCPartner[] || []);

            // Derive unique RDCs from the database
            const uniqueRdcs = Array.from(new Set((stocksData || []).map((s: any) => s.rdc))).sort();
            setRdcs(uniqueRdcs);
        } catch (err) {
            console.error("Error loading partners:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({
            id: "",
            name: "",
            type: "",
            hub: "" as RDCType,
            contact: "",
            email: "",
            phone: "",
            status: "Active" as PartnerStatusType,
            rating: 5.0,
            contract_start: "",
            contract_end: "",
            agreement_type: "",
            compliance_score: 0,
            bio: "",
            created_at: "",
            updated_at: "",
            recentAudits: []
        });
        setEditingIndex(null);
        setShowModal(false);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setForm(partnerList[index]);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.type || !form.hub || !form.email || !form.phone) return;

        setIsSaving(true);
        try {
            if (editingIndex !== null) {
                const partnerId = partnerList[editingIndex].id;
                await updatePartner(partnerId, {
                    name: form.name,
                    type: form.type,
                    hub: form.hub,
                    contact: form.contact,
                    email: form.email,
                    phone: form.phone,
                    status: form.status,
                    updated_at: new Date().toISOString()
                });
            } else {
                const newId = `RDC-${Math.floor(Math.random() * 899) + 101}`;
                await createPartner({
                    id: newId,
                    name: form.name,
                    type: form.type,
                    hub: form.hub,
                    contact: form.contact,
                    email: form.email,
                    phone: form.phone,
                    status: form.status,
                    rating: 5.0,
                    contract_start: new Date().toISOString().split('T')[0],
                    contract_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                    agreement_type: "Standard",
                    compliance_score: 100
                });
            }
            await loadPartners();
            handleClose();
        } catch (err: any) {
            console.error("Error saving partner:", err);
            const detail = err.message || "Unknown database error";
            alert(`Failed to save partner: ${detail}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async (index: number) => {
        if (!confirm("Are you sure you want to terminate this partnership sync?")) return;

        try {
            const partnerId = partnerList[index].id;
            await deletePartner(partnerId);
            await loadPartners();
        } catch (err) {
            console.error("Error removing partner:", err);
            alert("Failed to remove partner from the database.");
        }
    };

    const filtered = partnerList.filter(
        (p) =>
            (p.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (p.hub?.toLowerCase() || "").includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Syncing Partner Network...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">RDC Partners</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Manage external logistics and distribution partners per region.</p>
                </div>
                <Button onClick={() => setShowModal(true)} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6">
                    <Plus className="mr-2 h-4 w-4" /> Register New Partner
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-1 rounded-xl w-full md:w-[400px] border border-black/5">
                <Search className="ml-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by partner name or region..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70 text-sm font-medium"
                />
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-black/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/5 bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Node ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Region / Hub</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No matching logistical partners identified.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((partner, index) => (
                                    <tr key={index} className="group hover:bg-black/[0.01] transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-[10px] font-black text-slate-400">{partner.id || `RDC-${index + 101}`}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Truck className="h-4 w-4" />
                                                </div>
                                                <span className="font-bold text-sm text-slate-900">{partner.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-medium text-slate-600">{partner.type}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="outline" className="rounded-lg border-black/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-white text-slate-600">
                                                <MapPin className="mr-1 h-3 w-3 opacity-40" /> {partner.hub}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={`rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest
                                                ${partner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}
                                            `}>
                                                {partner.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {partner.rating}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/partners/${partner.id || partner.name}`}>
                                                    <Button variant="ghost" className="h-8 px-3 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">Agreement</Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
                                                        <DropdownMenuItem onClick={() => handleEdit(index)} className="font-bold text-xs uppercase tracking-wider cursor-pointer">Edit </DropdownMenuItem>
                                                        <DropdownMenuItem className="font-bold text-xs uppercase tracking-wider cursor-pointer">Performance Audit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRemove(index)} className="text-red-600 font-bold text-xs uppercase tracking-wider cursor-pointer">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RDC Partner Modal (Register/Edit) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={handleClose}
                            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                        >
                            <X className="h-4 w-4 text-slate-600" />
                        </button>

                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-1">
                            {editingIndex !== null ? "Edit Partner Agreement" : "Register New Partner"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                            {editingIndex !== null ? "Update the partnership details and hub region" : "Fill in the details to onboard an external logistics partner"}
                        </p>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partner Organization Name</Label>
                                <Input
                                    placeholder="e.g. Lanka Logistics & Co."
                                    value={form.name || ""}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Service Type</Label>
                                <Input
                                    placeholder="e.g. Prime Logistics"
                                    value={form.type || ""}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regional Distribution Center (RDC)</Label>
                                <select
                                    value={form.hub || ""}
                                    onChange={(e) => setForm({ ...form, hub: e.target.value as RDCType })}
                                    className="w-full h-12 rounded-xl bg-slate-50 border border-black/5 px-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 cursor-pointer"
                                >
                                    <option value="">Select a Hub</option>
                                    {rdcs.map(rdc => (
                                        <option key={rdc} value={rdc}>{rdc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact Person</Label>
                                <Input
                                    placeholder="e.g. Damien Silva"
                                    value={form.contact || ""}
                                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regional Status</Label>
                                <select
                                    value={form.status || "Active"}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as PartnerStatusType })}
                                    className="w-full h-12 rounded-xl bg-slate-50 border border-black/5 px-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 cursor-pointer"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Review">Review</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                                    <Input
                                        placeholder="ops@partner.lk"
                                        type="email"
                                        value={form.email || ""}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</Label>
                                    <Input
                                        placeholder="+94 11 234 5678"
                                        value={form.phone || ""}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1 h-12 rounded-xl border-black/5 font-black text-[10px] uppercase tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSaving || !form.name || !form.type || !form.hub || !form.email || !form.phone}
                                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl px-2"
                            >
                                {isSaving ? <Plus className="h-4 w-4 animate-spin" /> : (editingIndex !== null ? "Save Changes" : "Register Partner")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


