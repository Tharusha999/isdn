"use client";

import { useState } from "react";
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

import { RDCPartner, partners as initialPartners } from "../../partners/data";
import Link from "next/link";

export default function PartnersPage() {
    const [partnerList, setPartnerList] = useState<RDCPartner[]>(initialPartners);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<RDCPartner>({
        name: "",
        type: "",
        hub: "",
        contact: "",
        email: "",
        phone: "",
        status: "Active",
        rating: 5.0,
        contractStart: "",
        contractEnd: "",
        agreementType: "",
        complianceScore: 0,
        bio: "",
        recentAudits: []
    });

    const handleClose = () => {
        setForm({
            name: "",
            type: "",
            hub: "",
            contact: "",
            email: "",
            phone: "",
            status: "Active",
            rating: 5.0,
            contractStart: "",
            contractEnd: "",
            agreementType: "",
            complianceScore: 0,
            bio: "",
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

    const handleSubmit = () => {
        if (!form.name || !form.type || !form.hub || !form.email || !form.phone) return;

        if (editingIndex !== null) {
            const updated = [...partnerList];
            updated[editingIndex] = form;
            setPartnerList(updated);
        } else {
            setPartnerList([...partnerList, form]);
        }
        handleClose();
    };

    const handleRemove = (index: number) => {
        setPartnerList(partnerList.filter((_, i) => i !== index));
    };

    const filtered = partnerList.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.hub.toLowerCase().includes(search.toLowerCase())
    );

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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-black/5 pt-6">
                {filtered.map((partner, index) => (
                    <Card key={index} className="group border-none shadow-sm bg-white/50 hover:bg-white hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="pt-6 relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
                                    <DropdownMenuItem onClick={() => handleEdit(index)} className="font-bold text-xs uppercase tracking-wider cursor-pointer">Edit Agreement</DropdownMenuItem>
                                    <DropdownMenuItem className="font-bold text-xs uppercase tracking-wider cursor-pointer">Performance Audit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRemove(index)} className="text-red-600 font-bold text-xs uppercase tracking-wider cursor-pointer">Terminate Contract</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 mb-4 shadow-sm border border-black/5 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/5 transition-colors">
                                    <Truck className="h-10 w-10" />
                                </div>
                                <h3 className="font-black text-base uppercase tracking-tight">{partner.name}</h3>
                                <p className="text-[10px] text-muted-foreground mb-3 font-bold uppercase tracking-widest">{partner.type}</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                                        <MapPin className="mr-1 h-3 w-3" /> {partner.hub}
                                    </Badge>
                                    <Badge className={`rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest ${partner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                        {partner.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-black/5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-muted-foreground flex items-center gap-2 uppercase tracking-tighter">
                                        <ShieldCheck className="h-3.5 w-3.5 text-primary/40" /> Performance
                                    </span>
                                    <span className="flex items-center gap-1 text-emerald-600">
                                        <Star className="h-3 w-3 fill-emerald-600" /> {partner.rating}
                                    </span>
                                </div>
                                <div className="flex items-center text-[11px] font-bold text-muted-foreground">
                                    <Mail className="mr-3 h-3.5 w-3.5 text-primary/40" />
                                    {partner.email}
                                </div>
                                <div className="flex items-center text-[11px] font-bold text-muted-foreground">
                                    <Phone className="mr-3 h-3.5 w-3.5 text-primary/40" />
                                    {partner.phone}
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link href={`/dashboard/partners/${partner.name}`}>
                                    <Button variant="outline" className="w-full rounded-xl border-black/5 hover:bg-black/5 transition-all font-black text-[10px] uppercase tracking-widest h-11 shadow-sm active:scale-95">
                                        View Contract Details
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button
                    onClick={() => setShowModal(true)}
                    className="flex flex-col items-center justify-center h-full min-h-[360px] border-2 border-dashed border-black/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-all shadow-sm border border-black/5">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary">Register New Partner</p>
                </button>
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
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Service Type</Label>
                                <Input
                                    placeholder="e.g. Prime Logistics"
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Designated Hub / Region</Label>
                                <Input
                                    placeholder="e.g. Central Hub"
                                    value={form.hub}
                                    onChange={(e) => setForm({ ...form, hub: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact Person</Label>
                                <Input
                                    placeholder="e.g. Damien Silva"
                                    value={form.contact}
                                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Regional Status</Label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full h-12 rounded-xl bg-slate-50 border border-black/5 px-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 cursor-pointer"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Review">Review</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                                    <Input
                                        placeholder="ops@partner.lk"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</Label>
                                    <Input
                                        placeholder="+94 11 234 5678"
                                        value={form.phone}
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
                                disabled={!form.name || !form.type || !form.hub || !form.email || !form.phone}
                                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl px-2"
                            >
                                {editingIndex !== null ? "Save Changes" : "Register Partner"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


