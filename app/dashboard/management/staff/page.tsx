"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Plus, Search, MoreHorizontal, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { staff as initialStaff } from "../../staff/data";

type StaffMember = {
    name: string;
    role: string;
    status: string;
    email: string;
    phone: string;
};

export default function StaffPage() {
    const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        name: "",
        role: "",
        status: "Active",
        email: "",
        phone: "",
    });

    const handleAdd = () => {
        if (!form.name || !form.role || !form.email || !form.phone) return;

        if (editIndex !== null) {
            // Update existing member
            const updatedList = [...staffList];
            updatedList[editIndex] = form;
            setStaffList(updatedList);
        } else {
            // Add new member
            setStaffList([...staffList, form]);
        }

        setForm({ name: "", role: "", status: "Active", email: "", phone: "" });
        setEditIndex(null);
        setShowModal(false);
    };

    const handleEdit = (member: StaffMember, index: number) => {
        setForm(member);
        setEditIndex(index);
        setShowModal(true);
    };

    const openAddModal = () => {
        setForm({ name: "", role: "", status: "Active", email: "", phone: "" });
        setEditIndex(null);
        setShowModal(true);
    };

    const handleRemove = (index: number) => {
        setStaffList(staffList.filter((_, i) => i !== index));
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-black/5 pt-6">
                {filtered.map((member, index) => (
                    <Card key={index} className="group border-none shadow-sm bg-white/50 hover:bg-white hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="pt-6 relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
                                    <DropdownMenuItem onClick={() => handleEdit(member, index)} className="font-bold text-xs uppercase tracking-wider cursor-pointer">Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRemove(index)} className="text-red-600 font-bold text-xs uppercase tracking-wider cursor-pointer">Remove</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-xl font-black text-primary mb-4 shadow-sm border border-primary/5">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="font-black text-base uppercase tracking-tight">{member.name}</h3>
                                <p className="text-[10px] text-muted-foreground mb-3 font-bold uppercase tracking-widest">{member.role}</p>
                                <Badge className={`rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest
                                    ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : ''}
                                    ${member.status === 'Away' ? 'bg-amber-500/10 text-amber-600' : ''}
                                    ${member.status === 'On Route' ? 'bg-indigo-500/10 text-indigo-600' : ''}
                                    ${member.status === 'Offline' ? 'bg-slate-500/10 text-slate-600' : ''}
                                `}>
                                    {member.status}
                                </Badge>
                            </div>

                            <div className="mt-6 space-y-3 pt-4 border-t border-black/5">
                                <div className="flex items-center text-[11px] font-bold text-muted-foreground">
                                    <Mail className="mr-3 h-3.5 w-3.5 text-primary/40" />
                                    {member.email}
                                </div>
                                <div className="flex items-center text-[11px] font-bold text-muted-foreground">
                                    <Phone className="mr-3 h-3.5 w-3.5 text-primary/40" />
                                    {member.phone}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link href={`/dashboard/staff/${member.name}`}>
                                    <Button variant="outline" className="w-full rounded-xl border-black/5 hover:bg-primary hover:text-white hover:border-transparent transition-all font-black text-[10px] uppercase tracking-widest h-10 shadow-sm active:scale-95">
                                        View Profile
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button
                    onClick={openAddModal}
                    className="flex flex-col items-center justify-center h-full min-h-[340px] border-2 border-dashed border-black/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group"
                >
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-all shadow-sm border border-black/5">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary">Add New Member</p>
                </button>
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
                            {editIndex !== null ? 'Edit Staff Details' : 'Add New Staff'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                            {editIndex !== null ? 'Update the member information below' : 'Fill in the details to add a new team member'}
                        </p>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                                <Input
                                    placeholder="e.g. John Doe"
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
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-black/5 font-bold text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</Label>
                                <Input
                                    placeholder="e.g. +94 77 123 4567"
                                    value={form.phone}
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
                                {editIndex !== null ? 'Update Member' : 'Add Member'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
