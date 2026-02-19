"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ShieldCheck,
    Plus,
    Trash2,
    Edit2,
    Key,
    Copy,
    Check,
    Search,
    Loader2,
    AlertTriangle,
    UserPlus
} from "lucide-react";
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from "@/public/src/supabaseClient";

const generateAdminKey = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ISDN-ADMIN-${randomSuffix}`;
};

export default function AdminsManagementPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const [form, setForm] = useState({
        full_name: "",
        username: "",
        password: "",
        admin_key: ""
    });

    const loadAdmins = async () => {
        try {
            setLoading(true);
            const data = await fetchAdmins();
            setAdmins(data);
        } catch (err) {
            setError("Failed to fetch administrative records.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleOpenAdd = () => {
        setEditingAdmin(null);
        setForm({
            full_name: "",
            username: "",
            password: "",
            admin_key: generateAdminKey()
        });
        setSaveError(null);
        setShowModal(true);
    };

    const handleOpenEdit = (admin: any) => {
        setEditingAdmin(admin);
        setForm({
            full_name: admin.full_name,
            username: admin.username,
            password: admin.password,
            admin_key: admin.admin_key
        });
        setSaveError(null);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            if (editingAdmin) {
                await updateAdmin(editingAdmin.id, form);
            } else {
                await createAdmin(form);
            }
            await loadAdmins();
            setShowModal(false);
        } catch (err: any) {
            setSaveError(err.message || "Failed to commit administrative change.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (admins.length <= 1) {
            alert("Security Protocol: You cannot terminate the last remaining administrator.");
            return;
        }

        if (!confirm(`Are you sure you want to revoke administrative access for "${name}"?`)) return;

        try {
            setLoading(true);
            await deleteAdmin(id);
            await loadAdmins();
        } catch (err) {
            alert("Failed to revoke access.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(text);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const filteredAdmins = admins.filter(a =>
        a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Access <span className="text-primary">Registry</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Manage global system administrators and security protocols.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Filter by name/ID..."
                            className="pl-12 pr-6 h-12 rounded-xl bg-slate-50 border-black/5 w-64 font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleOpenAdd} className="h-12 px-6 rounded-xl bg-slate-900 border-none hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Authorize New Admin
                    </Button>
                </div>
            </div>

            {/* Admin Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center opacity-50">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Accessing secure database...</span>
                    </div>
                ) : filteredAdmins.length === 0 ? (
                    <Card className="col-span-full border-dashed border-2 bg-transparent py-12 flex flex-col items-center justify-center">
                        <ShieldCheck className="h-12 w-12 text-slate-200 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No matching administrators found.</p>
                    </Card>
                ) : (
                    filteredAdmins.map((admin) => (
                        <Card key={admin.id} className="group rounded-[2rem] border-black/5 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(admin)} className="h-10 w-10 rounded-xl hover:bg-slate-100">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(admin.id, admin.full_name)} className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">{admin.full_name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@{admin.username}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-50 border border-black/5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Security Token</span>
                                        <button
                                            onClick={() => copyToClipboard(admin.admin_key)}
                                            className="text-primary hover:text-black transition-colors"
                                        >
                                            {copiedKey === admin.admin_key ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Key className="h-3 w-3 text-primary" />
                                        <code className="text-xs font-black font-mono tracking-tighter text-slate-900">{admin.admin_key}</code>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-black/10">Active Session</Badge>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(admin.created_at).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Management Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-slate-900 px-8 py-10 text-white relative">
                            <ShieldCheck className="h-12 w-12 text-white/20 absolute right-8 top-10" />
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase whitespace-nowrap">
                                {editingAdmin ? "Update Account" : "Access Authorization"}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-2">Provisioning global administrative protocols.</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                    <Input
                                        placeholder="e.g. Sarah Connor"
                                        value={form.full_name}
                                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                        className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</Label>
                                        <Input
                                            placeholder="sarah_c"
                                            value={form.username}
                                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Generated Security Token</span>
                                        <p className="text-xl font-black font-mono tracking-tighter text-amber-900 group-hover:scale-105 transition-transform">{form.admin_key}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copyToClipboard(form.admin_key)}
                                        className="h-12 w-12 rounded-xl hover:bg-amber-100 text-amber-600"
                                    >
                                        {copiedKey === form.admin_key ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>

                            {saveError && (
                                <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">{saveError}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 h-14 rounded-2xl border-black/5 font-black text-[10px] uppercase tracking-widest"
                                >
                                    Terminate
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || !form.username || !form.password || !form.full_name}
                                    className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
                                >
                                    {isSaving ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Committing...</>
                                    ) : (
                                        <><ShieldCheck className="mr-2 h-4 w-4" />Confirm Access</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
