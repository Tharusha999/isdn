"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Plus, Search, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { staff } from "../../staff/data";

export default function StaffPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">Staff Directory</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Manage and monitor team performance across all branches.</p>
                </div>
                <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6">
                    <Plus className="mr-2 h-4 w-4" /> Add Team Member
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-1 rounded-xl w-full md:w-[400px] border border-black/5">
                <Search className="ml-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or role..."
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70 text-sm font-medium"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-black/5 pt-6">
                {staff.map((member, index) => (
                    <Card key={index} className="group border-none shadow-sm bg-white/50 hover:bg-white hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="pt-6 relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
                                    <DropdownMenuItem className="font-bold text-xs uppercase tracking-wider">Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 font-bold text-xs uppercase tracking-wider">Remove</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-xl font-black text-primary mb-4 shadow-sm border border-primary/5">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="font-black text-base uppercase tracking-tight">{member.name}</h3>
                                <p className="text-[10px] text-muted-foreground mb-3 font-bold uppercase tracking-widest">{member.role}</p>
                                <Badge
                                    className={`
                                rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest
                                ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : ''}
                                ${member.status === 'Away' ? 'bg-amber-500/10 text-amber-600' : ''}
                                ${member.status === 'On Route' ? 'bg-indigo-500/10 text-indigo-600' : ''}
                                ${member.status === 'Offline' ? 'bg-slate-500/10 text-slate-600' : ''}
                            `}
                                >
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

                <button className="flex flex-col items-center justify-center h-full min-h-[340px] border-2 border-dashed border-black/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group">
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-all shadow-sm border border-black/5">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary">Add New Member</p>
                </button>
            </div>
        </div>
    );
}
