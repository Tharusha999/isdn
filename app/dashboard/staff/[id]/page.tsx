"use client";

import { use, useState, useEffect } from "react";
import { supabase } from "@/public/src/supabaseClient";
import type { StaffWithDetails, StaffActivity } from "@/lib/database-types";
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
    Loader2
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function StaffProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [member, setMember] = useState<StaffWithDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMember = async () => {
            try {
                setLoading(true);
                const decodedName = decodeURIComponent(id);

                const { data, error: staffError } = await supabase
                    .from("staff")
                    .select(`
                            *,
                            staff_performance (*),
                            staff_activity (*)
                        `)
                    .eq("name", decodedName)
                    .single();

                if (staffError) throw staffError;
                setMember(data as StaffWithDetails);
            } catch (err: unknown) {
                console.error("Error fetching staff member:", err);
                setError("Member not found");
            } finally {
                setLoading(false);
            }
        };

        loadMember();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="font-bold text-muted-foreground uppercase tracking-widest">Loading Profile...</p>
            </div>
        );
    }

    if (!member || error) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/management/staff">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Staff Profile</h1>
                    <p className="text-sm text-muted-foreground">View and manage staff details</p>
                </div>
            </div>

            {/* Profile Hero */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                <div className="h-32 bg-gradient-to-r from-gray-900 to-black"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-500 shadow-md">
                                {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="mb-1">
                                <h2 className="text-2xl font-bold">{member.name}</h2>
                                <p className="text-muted-foreground">{member.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-1">
                            <Badge
                                variant="outline"
                                className={`
                                    px-3 py-1 text-sm font-medium rounded-full
                                    ${member.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                    ${member.status === 'Away' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
                                    ${member.status === 'On Route' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                                    ${member.status === 'Offline' ? 'bg-gray-100 text-gray-600 border-gray-200' : ''}
                                `}
                            >
                                {member.status}
                            </Badge>
                            <Button>Edit Profile</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" /> Contact Information
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email Address</p>
                                            <p className="font-medium">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone Number</p>
                                            <p className="font-medium">{member.phone}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-sm">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Location</p>
                                            <p className="font-medium">{member.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" /> Work Details
                                </h3>
                                <div className="space-y-2 text-sm border-l-2 border-gray-100 pl-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Department</p>
                                        <p className="font-medium">{member.department}</p>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-xs text-muted-foreground">Joined Date</p>
                                        <p className="font-medium">{member.join_date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="bg-gray-50 border-gray-200 shadow-sm">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <CheckCircle2 className="h-6 w-6 text-gray-900 mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{member.staff_performance?.deliveries_completed || 0}</p>
                                        <p className="text-xs font-medium text-gray-600">Tasks Done</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-50 border-gray-200 shadow-sm">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <TrendingUp className="h-6 w-6 text-gray-900 mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{member.staff_performance?.on_time_rate || 'N/A'}</p>
                                        <p className="text-xs font-medium text-gray-600">On-Time Rate</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-50 border-gray-200 shadow-sm">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <Clock className="h-6 w-6 text-gray-900 mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{member.staff_performance?.hours_worked || 0}</p>
                                        <p className="text-xs font-medium text-gray-600">Hours (Mo)</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-50 border-gray-200 shadow-sm">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <Star className="h-6 w-6 text-gray-900 mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{member.staff_performance?.rating || 0}</p>
                                        <p className="text-xs font-medium text-gray-600">Rating</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card className="border-gray-100 shadow-sm">
                                <CardHeader className="pb-3 border-b border-gray-50">
                                    <CardTitle className="text-base font-medium flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary" /> Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="space-y-0">
                                        {member.staff_activity && member.staff_activity.length > 0 ? member.staff_activity.map((activity: StaffActivity, i: number) => (
                                            <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
                                                {i !== member.staff_activity.length - 1 && (
                                                    <div className="absolute left-[7px] top-7 bottom-0 w-[2px] bg-gray-100"></div>
                                                )}
                                                <div className="h-4 w-4 rounded-full bg-black border-[3px] border-white ring-1 ring-gray-200 mt-1.5 z-10 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{activity.action}</p>
                                                    <p className="text-xs text-muted-foreground">{activity.activity_date} at {activity.activity_time}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-xs text-muted-foreground italic py-4">No recent activity recorded.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                                <h4 className="font-medium text-sm mb-2">About</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {member.bio || "No biography available."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
