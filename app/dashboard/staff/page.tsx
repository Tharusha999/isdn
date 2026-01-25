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

const staff = [
    { name: "John Doe", role: "Warehouse Manager", status: "Active", email: "john@isdn.lk", phone: "+94 77 123 4567" },
    { name: "Jane Smith", role: "Logistics Coordinator", status: "Away", email: "jane@isdn.lk", phone: "+94 77 234 5678" },
    { name: "Mike Johnson", role: "Driver", status: "On Route", email: "mike@isdn.lk", phone: "+94 77 345 6789" },
    { name: "Sarah Williams", role: "Inventory Specialist", status: "Active", email: "sarah@isdn.lk", phone: "+94 77 456 7890" },
    { name: "David Brown", role: "Driver", status: "Active", email: "david@isdn.lk", phone: "+94 77 567 8901" },
    { name: "Emily Davis", role: "Finance Officer", status: "Offline", email: "emily@isdn.lk", phone: "+94 77 678 9012" },
];

export default function StaffPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Staff Directory</h2>
                <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Team Member
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-1 rounded-xl w-full md:w-[400px] border border-gray-200/50">
                <Search className="ml-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or role..."
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {staff.map((member, index) => (
                    <Card key={index} className="group border-none shadow-sm bg-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-300">
                        <CardContent className="pt-6 relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-lg bg-white/90 backdrop-blur-md">
                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 mb-4 shadow-inner">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                                <Badge
                                    variant="outline"
                                    className={`
                                rounded-full border-none px-3 py-1 text-xs font-medium
                                ${member.status === 'Active' ? 'bg-green-100 text-green-700' : ''}
                                ${member.status === 'Away' ? 'bg-yellow-100 text-yellow-700' : ''}
                                ${member.status === 'On Route' ? 'bg-blue-100 text-blue-700' : ''}
                                ${member.status === 'Offline' ? 'bg-gray-100 text-gray-600' : ''}
                            `}
                                >
                                    {member.status}
                                </Badge>
                            </div>

                            <div className="mt-6 space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Mail className="mr-3 h-4 w-4 text-gray-400" />
                                    {member.email}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Phone className="mr-3 h-4 w-4 text-gray-400" />
                                    {member.phone}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button variant="outline" className="w-full rounded-lg border-gray-200 hover:bg-black/5 hover:text-black hover:border-transparent transition-colors">
                                    View Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all shadow-sm">
                        <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                    </div>
                    <p className="mt-4 font-medium text-gray-500 group-hover:text-primary">Add New Member</p>
                </button>
            </div>
        </div>
    );
}
