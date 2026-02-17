"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">Notifications</h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">Stay updated with system alerts and message broadcasts.</p>
            </div>

            <Card className="border-none shadow-sm bg-white/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold tracking-tight">Alert Center</CardTitle>
                    <Bell className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">You have no new notifications.</p>
                </CardContent>
            </Card>
        </div>
    );
}
