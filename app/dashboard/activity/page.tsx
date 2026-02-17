"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">
          System Activity
        </h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          Real-time log of all system events and user actions.
        </p>
      </div>

      <Card className="border-none shadow-sm bg-white/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-tight">
            Recent Activity
          </CardTitle>
          <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Activity feed data is loading...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
