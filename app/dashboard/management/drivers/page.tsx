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
    MoreHorizontal,
    Truck,
    ShieldCheck
} from "lucide-react";
import { fetchAllDriverUsers, createDriverUser, updateDriverUser, deleteDriverUser } from "@/public/src/supabaseClient";
import type { DriverUser, RDCType } from "@/lib/database-types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EMPTY_FORM = {
    full_name: "",
    username: "",
    email: "",
    phone: "",
    license_number: "",
    rdc_hub: "West (Colombo)" as RDCType,
    password: "driver123", // Default password
};

export default function DriversManagementPage() {
    const [drivers, setDrivers] = useState<DriverUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<any>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchAllDriverUsers();
            setDrivers((data || []) as DriverUser[]);
            setError(null);
        } catch (err: any) {
            console.error("Error loading drivers:", err);
            setError("Failed to load driver directory.");
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

    const handleOpenEdit = (driver: DriverUser) => {
        setForm({
            full_name: driver.full_name,
            username: driver.username,
            email: driver.email || "",
            phone: driver.phone || "",
            license_number: driver.license_number || "",
            rdc_hub: driver.rdc_hub || "West (Colombo)",
            password: "", // Keep password empty when editing unless we want to allow reset
        });
        setIsEditing(true);
        setCurrentId(driver.id);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.full_name || !form.username) return;
        setIsSaving(true);
        try {
            const payload: any = { ...form };

            if (isEditing && currentId) {
                if (!payload.password) delete payload.password;
                await updateDriverUser(currentId, payload);
            } else {
                await createDriverUser({
                    ...payload,
                    is_active: true
                });
            }
            await loadData();
            setShowModal(false);
        } catch (err: any) {
            console.error("Error saving driver:", err);
            alert("Failed to save driver. Please check the details.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (!confirm("Are you sure you want to terminate this driver node? This action is permanent.")) return;
        try {
            await deleteDriverUser(id);
            await loadData();
        } catch (err: any) {
            console.error("Error deleting driver:", err);
            alert("Failed to delete driver.");
        }
    };

    const filteredDrivers = drivers.filter(d =>
        d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.username || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Driver <span className="text-indigo-600">Registry</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Consolidated directory of registered logistics personnel nodes.</p>
                </div>
                <Button onClick={handleOpenAdd} className="bg-indigo-600 text-white hover:bg-indigo-700 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] px-8 shadow-2xl shadow-indigo-500/20">
                    <Plus className="mr-3 h-4 w-4" /> Add Driver Node
                </Button>
            </div>

            <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                <CardHeader className="p-10 border-b border-black/5 bg-indigo-50/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <Input
                                placeholder="Identify driver node..."
                                className="pl-12 h-12 rounded-xl bg-white border-black/5 font-bold focus:ring-1 focus:ring-indigo-500/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-indigo-400 shadow-sm">
                                <Truck className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{filteredDrivers.length} Total Nodes</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                            <p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">Synchronizing driver matrix...</p>
                        </div>
                    ) : (error && filteredDrivers.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{error}</p>
                        </div>
                    ) : filteredDrivers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Truck className="h-12 w-12 text-slate-200 mb-4" />
                            <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No matching driver nodes found in current sector.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black/5 bg-slate-50/50">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Data</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Sector Hub</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDrivers.map((driver) => (
                                        <tr key={driver.id} className="group hover:bg-indigo-50/30 transition-colors border-b border-black/[0.02]">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/20">
                                                        {driver.full_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 italic tracking-tight uppercase leading-none">{driver.full_name}</p>
                                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-2">{driver.username}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">Ref ID: {driver.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                                        <span className="text-xs font-black italic uppercase tracking-tight">License: {driver.license_number || "PENDING"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Phone className="h-3 w-3" />
                                                        <span className="text-[10px] font-bold">{driver.phone || "N/A"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-4 w-4 text-indigo-500" />
                                                    <div>
                                                        <p className="text-xs font-black uppercase italic text-slate-700">{driver.rdc_hub || "UNASSIGNED"}</p>
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
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-black/5 shadow-2xl bg-white/90 backdrop-blur-md">
                                                        <DropdownMenuItem onClick={() => handleOpenEdit(driver)} className="rounded-xl px-4 py-3 cursor-pointer group hover:bg-indigo-50">
                                                            <Edit2 className="mr-3 h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
                                                            <span className="text-xs font-black uppercase tracking-widest">Update</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(driver.id)} className="rounded-xl px-4 py-3 cursor-pointer text-rose-600 group focus:bg-rose-50 focus:text-rose-600">
                                                            <Trash2 className="mr-3 h-4 w-4 text-rose-400 group-hover:text-rose-600" />
                                                            <span className="text-xs font-black uppercase tracking-widest">DELETE</span>
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

            {/* Driver Modal */}
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
                                <Truck className="h-6 w-6" />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
                                {isEditing ? "Modify Driver" : "Enlist Driver"}
                            </h3>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 pl-1">
                            {isEditing ? "Synchronizing updated logistics personnel parameters." : "Enlisting new personnel into the logistics grid."}
                        </p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name *</Label>
                                <Input
                                    placeholder="e.g. Kasun Kalhara"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                    className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Callsign / Username *</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="e.g. kasun"
                                            value={form.username.replace('@driver.ISDN', '').replace('@driver.isdn', '')}
                                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                                            className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 pl-6 pr-24 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                                            @driver.ISDN
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Logistics Hub</Label>
                                    <select
                                        value={form.rdc_hub}
                                        onChange={(e) => setForm({ ...form, rdc_hub: e.target.value as RDCType })}
                                        className="w-full h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all outline-none text-sm appearance-none"
                                    >
                                        <option value="West (Colombo)">West (Colombo)</option>
                                        <option value="Central (Kandy)">Central (Kandy)</option>
                                        <option value="South (Galle)">South (Galle)</option>
                                        <option value="North (Jaffna)">North (Jaffna)</option>
                                        <option value="East (Trincomalee)">East (Trincomalee)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">License Vector</Label>
                                    <Input
                                        placeholder="ABC-1234567"
                                        value={form.license_number}
                                        onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                                        className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Line</Label>
                                    <Input
                                        placeholder="+94 XX XXX XXXX"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    {isEditing ? "Reset Credentials (Optional)" : "Access Credentials *"}
                                </Label>
                                <Input
                                    type="password"
                                    placeholder={isEditing ? "Enter new password to reset" : "Secure password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold text-slate-900 px-6 focus:bg-white focus:ring-1 focus:ring-indigo-500/20 transition-all"
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
                                disabled={isSaving || !form.full_name || !form.username || (!isEditing && !form.password)}
                                className="flex-1 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-500/20"
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
