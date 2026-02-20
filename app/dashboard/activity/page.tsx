"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Circle, User, Truck, Package, Activity, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchAllStaffActivity } from "@/public/src/supabaseClient";

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const data = await fetchAllStaffActivity();
      setActivities(data || []);
    } catch (err) {
      console.error("Failed to load activity feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('driver') || lowerAction.includes('staff')) return <User className="h-4 w-4" />;
    if (lowerAction.includes('mission') || lowerAction.includes('shipment')) return <Truck className="h-4 w-4" />;
    if (lowerAction.includes('product') || lowerAction.includes('order')) return <Package className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getColors = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('created') || lowerAction.includes('completed')) return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (lowerAction.includes('updated') || lowerAction.includes('modified')) return "bg-amber-50 text-amber-600 border-amber-100";
    if (lowerAction.includes('deleted') || lowerAction.includes('removed')) return "bg-rose-50 text-rose-600 border-rose-100";
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div>
        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">System <span className="text-primary">Registry</span></h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Authoritative log of node status and operational vectors.</p>
      </div>

      <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-black/5 bg-slate-50/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tight italic">Live Activity Pulse</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time telemetry from all system nodes.</CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Network Secure</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center opacity-30">
              <Activity className="h-12 w-12 animate-pulse mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Accessing Audit Database...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-20 text-center">
              <Info className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">No activity logs recorded in the current session.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {activities.map((item) => (
                <div key={item.id} className="p-8 hover:bg-slate-50/50 transition-colors flex items-start gap-6 group">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 ${getColors(item.action)}`}>
                    {getIcon(item.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-black text-sm text-slate-900 italic uppercase tracking-tight">
                        {item.action}
                      </p>
                      <span className="text-[10px] font-black tabular-nums text-slate-400">
                        {item.activity_date} @ {item.activity_time}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      Actor: <span className="text-slate-900">{item.staff?.name || 'System Auto'}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-200" />
                      Protocol: ISDN-LOG-{item.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
