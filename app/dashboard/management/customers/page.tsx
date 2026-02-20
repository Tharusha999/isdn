"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Search,
    Plus,
    X,
    Loader2,
    AlertTriangle,
    Edit2,
    Trash2,
    Users,
    Mail,
    Phone,
    MapPin,
    MoreHorizontal
} from "lucide-react";
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/public/src/supabaseClient";
import type { Customer } from "@/lib/database-types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
};

export default function CustomersManagementPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchCustomers();
            setCustomers(data || []);
            setError(null);
        } catch (err: any) {
            console.error("Error loading customers:", err);
            setError("Failed to load customer directory.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setForm(EMPTY_FORM);
        setIsEditing(false);
        setCurrentId(null);
        setShowModal(true);
    };

    const handleOpenEdit = (customer: Customer) => {
        setForm({
            name: customer.name,
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
            city: customer.city || "",
        });
        setIsEditing(true);
        setCurrentId(customer.id);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name) return;
        setIsSaving(true);
        try {
            if (isEditing && currentId) {
                await updateCustomer(currentId, form);
            } else {
                const newId = `CUST-${Math.floor(Math.random() * 9000) + 1000}`;
                await createCustomer({ id: newId, ...form });
            }
            await loadData();
            setShowModal(false);
        } catch (err: any) {
            console.error("Error saving customer:", err);
            alert("Failed to save customer. Please check the details.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to terminate this customer sync? This action is permanent.")) return;
        try {
            await deleteCustomer(id);
            await loadData();
        } catch (err: any) {
            console.error("Error deleting customer:", err);
            alert("Failed to delete customer.");
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Client <span className="text-primary">Registry</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Consolidated directory of registered network service recipients.</p>
                </div>
                <Button onClick={handleOpenAdd} className="bg-slate-900 text-white hover:bg-black h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 shadow-2xl shadow-black/20">
                    <Plus className="mr-3 h-4 w-4" /> Add Partner Node
                </Button>
            </div>

            <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Identify customer node..."
                                className="pl-12 h-12 rounded-xl bg-white border-black/5 font-bold focus:ring-1 focus:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-slate-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{filteredCustomers.length} Total Nodes</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                            <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">Synchronizing customer matrix...</p>
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <AlertTriangle className="h-12 w-12 text-slate-200 mb-4" />
                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No matching customer nodes found in current sector.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black/5">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Vector</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deployment Logic</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="group hover:bg-slate-50 transition-colors border-b border-black/[0.02]">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs shadow-sm ring-1 ring-black/5">
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 italic tracking-tight uppercase">{customer.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref ID: {customer.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="text-xs font-bold">{customer.email || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Phone className="h-3 w-3" />
                                                        <span className="text-[10px] font-bold">{customer.phone || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-4 w-4 text-slate-300" />
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-600">{customer.city || "Unknown"}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{customer.address || "No address vector"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-black/5">
                                                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-black/5 shadow-2xl">
                                                        <DropdownMenuItem onClick={() => handleOpenEdit(customer)} className="rounded-xl px-4 py-3 cursor-pointer group">
                                                            <Edit2 className="mr-3 h-4 w-4 text-slate-400 group-hover:text-slate-900" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Edit Node</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="rounded-xl px-4 py-3 cursor-pointer text-rose-600 group focus:bg-rose-50 focus:text-rose-600">
                                                            <Trash2 className="mr-3 h-4 w-4 text-rose-400 group-hover:text-rose-600" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Customer Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-10 relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all"
                        >
                            <X className="h-5 w-5 text-slate-600" />
                        </button>

                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
                                {isEditing ? "Modify Node" : "Register Node"}
                            </h3>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 pl-1">
                            {isEditing ? "Synchronizing updated identity parameters." : "Establishing new customer network connection."}
                        </p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity Name *</Label>
                                <Input
                                    placeholder="e.g. Retail Partner HQ"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Vector</Label>
                                    <Input
                                        placeholder="partner@network.lk"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Line</Label>
                                    <Input
                                        placeholder="+94 XX XXX XXXX"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sector / City</Label>
                                <Input
                                    placeholder="e.g. Colombo, Kandy"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Physical Address Vector</Label>
                                <textarea
                                    placeholder="Complete street location..."
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="w-full min-h-[100px] rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 p-6 focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all resize-none outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                className="flex-1 h-16 rounded-2xl border-black/5 font-black text-[10px] uppercase tracking-widest"
                            >
                                Abort
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSaving || !form.name}
                                className="flex-1 h-16 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-2xl"
                            >
                                {isSaving ? (
                                    <><Loader2 className="mr-3 h-4 w-4 animate-spin" />Syncing...</>
                                ) : (
                                    <>{isEditing ? "Commit Changes" : "Authorize Node"}</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
