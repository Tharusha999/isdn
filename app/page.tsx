"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Box, LayoutDashboard, Truck, User, ShieldCheck, Globe, Zap, Anchor } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'customer' | 'driver'>('admin');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('userRole');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('userRole', selectedRole);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Hero / Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-50 border-r border-black/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
              <Box className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">IslandLink</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-slate-900 border-black/10 bg-white font-black uppercase tracking-widest px-4 py-1 shadow-sm">Enterprise v4.0</Badge>
              <h1 className="text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase italic">
                Centralised <br />
                <span className="text-primary italic">Distribution</span> <br />
                Network.
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="p-8 rounded-[2.5rem] bg-white border border-black/[0.03] shadow-2xl shadow-black/5">
                <Globe className="h-8 w-8 text-indigo-600 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Regional Nodes</p>
                <p className="text-3xl font-black text-slate-900 italic tracking-tighter">05 RDCs</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white border border-black/[0.03] shadow-2xl shadow-black/5">
                <Zap className="h-8 w-8 text-amber-500 fill-current mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Daily Throughput</p>
                <p className="text-3xl font-black text-slate-900 italic tracking-tighter">Rs. 8.2M</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-slate-400 border-t border-black/5 pt-8">
            <p className="text-[10px] font-black uppercase tracking-widest italic tracking-tight">© 2026 IslandLink Distribution Network</p>
            <div className="flex gap-6">
              <Anchor className="h-4 w-4" />
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Abstract Map Graphic - Light Mode */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">Authentication</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Select your logistics clearance level</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'customer', label: 'Customer', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 'driver', label: 'Driver', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50' }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${selectedRole === role.id
                  ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-2xl scale-105 z-10'
                  : 'border-black/[0.03] hover:border-black/10 text-slate-400 hover:bg-slate-50/50'
                  }`}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${selectedRole === role.id ? role.bg : 'bg-slate-100 group-hover:bg-white'}`}>
                  <role.icon className={`h-6 w-6 ${selectedRole === role.id ? role.color : ''}`} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Network Identity</Label>
                <Input
                  className="h-16 rounded-2xl bg-slate-50 border-black/5 px-8 font-black text-slate-900 placeholder:text-slate-200 focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                  placeholder={selectedRole === 'admin' ? 'admin@islandlink.erp' : (selectedRole === 'customer' ? 'Customer@isdn.com' : 'Driver@isdn.com')}
                  type="email"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</Label>
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:underline underline-offset-4">
                    Recovery Protocol
                  </Link>
                </div>
                <Input
                  className="h-16 rounded-2xl bg-slate-50 border-black/5 px-8 font-black text-slate-900 placeholder:text-slate-200 focus:ring-2 focus:ring-slate-900/5 transition-all"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button disabled={isLoading} className="w-full h-16 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] group shadow-2xl shadow-black/20 group transition-all active:scale-95">
              {isLoading ? (
                <span className="flex items-center gap-3">Synchronising...</span>
              ) : (
                <>
                  Establish Secure Connection <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative pt-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-black/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-white px-6 text-slate-300">System Fallback</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="ghost" className="h-16 rounded-2xl border border-black/5 bg-slate-50/50 hover:bg-slate-900 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest group">
              <ShieldCheck className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> System Status
            </Button>
            <Button variant="ghost" className="h-16 rounded-2xl border border-black/5 bg-slate-50/50 hover:bg-slate-900 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
              Direct RDC Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Badge = ({ children, className }: { children: React.ReactNode, variant?: string, className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);
