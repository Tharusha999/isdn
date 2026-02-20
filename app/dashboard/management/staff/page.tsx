"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Plus, Search, MoreHorizontal, X, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { fetchStaff, createStaffMember, updateStaffMember, deleteStaffMember } from "@/public/src/supabaseClient";
import { StaffMember, StaffStatusType } from "@/lib/database-types";

export default function StaffPage() {
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editMember, setEditMember] = useState<StaffMember | null>(null);
    const [search, setSearch] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState<{
        name: string;
        role: string;
        status: StaffMember['status'];
        email: string;
        phone: string;
    }>({
        name: "",
        role: "",
        status: "Active" as StaffStatusType,
        email: "",
        phone: "",
    });

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        try {
            setLoading(true);
            const data = await fetchStaff();
            setStaffList(data || []);
            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching staff:", err);
            setError("Failed to load staff directory. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!form.name || !form.role || !form.email || !form.phone) return;

        try {
            setIsSaving(true);
            if (editMember) {
                // Update existing member in Supabase
                const staffData = {
                    ...form,
                };
                await updateStaffMember(editMember.id, staffData);
            } else {
                // Add new member to Supabase
                const newId = `STF-${Math.floor(Math.random() * 9000) + 1000}`;
                const staffData = {
                    id: newId,
                    ...form,
                    join_date: new Date().toISOString().split('T')[0],
                    department: "General",
                    location: "Main Branch",
                };

                await createStaffMember(staffData);
            }

            await loadStaff();
            setForm({ name: "", role: "", status: "Active", email: "", phone: "" });
            setEditMember(null);
            setShowModal(false);
        } catch (err) {
            console.error("Error saving staff member:", err);
            alert("Failed to save staff member. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (member: StaffMember) => {
        setForm({
            name: member.name,
            role: member.role,
            status: member.status,
            email: member.email || "",
            phone: member.phone || "",
        });
        setEditMember(member);
        setShowModal(true);
    };

    const openAddModal = () => {
        setForm({ name: "", role: "", status: "Active" as StaffStatusType, email: "", phone: "" });
        setEditMember(null);
        setShowModal(true);
    };

    const handleRemove = async (id: string) => {
        if (!confirm("Are you sure you want to terminate this staff sync?")) return;
        try {
            await deleteStaffMember(id);
            await loadStaff();
        } catch (err) {
            console.error("Error deleting staff member:", err);
            alert("Failed to delete staff member.");
        }
    };

    const filtered = staffList.filter(
        (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">Staff Directory</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Manage and monitor team performance across all branches.</p>
                </div>
                <Button onClick={openAddModal} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6">
                    <Plus className="mr-2 h-4 w-4" /> Add Team Member
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-1 rounded-xl w-full md:w-[400px] border border-black/5">
                <Search className="ml-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or role..."
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
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center animate-pulse">
                                            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                                            <p className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">Synchronizing personnel node...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <p className="font-bold text-red-600 text-sm mb-4">{error}</p>
                                        <Button onClick={loadStaff} variant="outline" className="rounded-xl font-bold h-9">Retry Sync</Button>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">No matching personnel identified.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((member, index) => (
                                    <tr key={index} className="group hover:bg-black/[0.01] transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-[10px] font-black text-slate-400">{member.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-bold text-sm text-slate-900">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-medium text-slate-600">{member.role}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={`rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest
                                                ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : ''}
                                                ${member.status === 'Away' ? 'bg-amber-500/10 text-amber-600' : ''}
                                                ${member.status === 'On Route' ? 'bg-indigo-500/10 text-indigo-600' : ''}
                                                ${member.status === 'Offline' ? 'bg-slate-500/10 text-slate-600' : ''}
                                            `}>
                                                {member.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center text-[10px] font-bold text-slate-500">
                                                    <Mail className="mr-2 h-3 w-3 opacity-40" /> {member.email}
                                                </div>
                                                <div className="flex items-center text-[10px] font-bold text-slate-400">
                                                    <Phone className="mr-2 h-3 w-3 opacity-40" /> {member.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/staff/${member.name}`}>
                                                    <Button variant="ghost" className="h-8 px-3 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all">Profile</Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
                                                        <DropdownMenuItem onClick={() => handleEdit(member)} className="font-bold text-xs uppercase tracking-wider cursor-pointer">Edit Node</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRemove(member.id)} className="text-red-600 font-bold text-xs uppercase tracking-wider cursor-pointer">Delete</DropdownMenuItem>
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

            {/* Add/Edit Staff Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                        >
                            <X className="h-4 w-4 text-slate-600" />
                        </button>

                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-1">
                            {editMember ? 'Edit Staff Details' : 'Add New Staff'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                            {editMember ? 'Update the member information below' : 'Fill in the details to add a new team member'}
                        </p>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                <Input
                                    placeholder="e.g. Athula Perera"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role / Position</Label>
                                <Input
                                    placeholder="e.g. Warehouse Manager"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</Label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as StaffStatusType })}
                                    className="w-full h-12 rounded-xl bg-slate-50 border border-black/5 px-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Away">Away</option>
                                    <option value="On Route">On Route</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</Label>
                                <Input
                                    placeholder="e.g. john@isdn.lk"
                                    type="email"
                                    value={form.email || ""}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</Label>
                                <Input
                                    placeholder="e.g. +94 77 123 4567"
                                    value={form.phone || ""}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                className="flex-1 h-12 rounded-xl border-black/5 font-black text-[10px] uppercase tracking-widest"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAdd}
                                disabled={!form.name || !form.role || !form.email || !form.phone}
                                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
                            >
                                {editMember ? 'Update Member' : 'Add Member'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
