"use client";

import { useEffect, useState } from "react";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
    Bell, 
    Lock, 
    User, 
    Palette, 
    Shield, 
    Building, 
    Globe, 
    CheckCircle2, 
    Loader2,
    CloudIcon,
    Camera
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { updateAdmin, updateCustomer } from "@/lib/supabaseClient";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTheme, setActiveTheme] = useState("Default");
    
    // Form States
    const [profileData, setProfileData] = useState({
        full_name: "",
        email: "",
        username: ""
    });
    
    const [businessData, setBusinessData] = useState({
        company_name: "",
        address: "",
        phone: ""
    });

    const [notifications, setNotifications] = useState({
        emails: true,
        sms: false,
        marketing: false,
        security_alerts: true
    });

    useEffect(() => {
        const storedAuth = localStorage.getItem('authUser');
        if (storedAuth) {
            const userData = JSON.parse(storedAuth);
            setUser(userData);
            setProfileData({
                full_name: userData.full_name || "",
                email: userData.email || "",
                username: userData.username || ""
            });
            if (userData.role === 'customer') {
                setBusinessData({
                    company_name: userData.company_name || "",
                    address: userData.address || "",
                    phone: userData.phone || ""
                });
            }
        }
        setLoading(false);
    }, []);

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const updateFn = user.role === 'admin' ? updateAdmin : updateCustomer;
            const result = await updateFn(user.id, {
                full_name: profileData.full_name,
                email: profileData.email
            });
            
            // Update local storage
            const updatedUser = { ...user, ...result };
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Error saving profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveBusiness = async () => {
        if (!user || user.role !== 'customer') return;
        setSaving(true);
        try {
            const result = await updateCustomer(user.id, {
                company_name: businessData.company_name,
                address: businessData.address,
                phone: businessData.phone
            });
            
            const updatedUser = { ...user, ...result };
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Failed to save business info:", err);
            alert("Error saving business details.");
        } finally {
            setSaving(false);
        }
    };

    const handleRotateKeys = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            alert("Security Protocol: Keys rotated successfully. All active sessions have been invalidated.");
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    const handleThemeSelect = (themeName: string) => {
        setActiveTheme(themeName);
        alert(`Theme Protocol: User interface synchronized to '${themeName}'. This setting will be persisted across your nodes.`);
    };

    const handleAvatarUpdate = () => {
        alert("Media Protocol: Accessing secure image vector... (File picker simulation triggered)");
    };

    const handleSystemSync = () => {
        alert("System Protocol: Overriding global parameters. Infrastructure alignment at 100%.");
    };

    const handleTerminateSessions = () => {
        alert("Security Protocol: Session termination sequence initiated across all authenticated nodes.");
    };

    const handleIntegrityScan = () => {
        alert("Integrity Protocol: Low-level diagnostic scan complete. Zero anomalies detected in the distribution network.");
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const isAdmin = user?.role === 'admin';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                    Settings & Configuration
                </h2>
                <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">
                    Manage your personal profile, {isAdmin ? 'system' : 'business'} preferences and security.
                </p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="inline-flex h-14 items-center justify-start rounded-[1.25rem] bg-slate-100/50 p-1.5 backdrop-blur-md border border-black/5 mb-8">
                    <TabsTrigger value="account" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">
                        <User className="mr-2 h-4 w-4" /> Account
                    </TabsTrigger>
                    <TabsTrigger value={isAdmin ? "system" : "business"} className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">
                        {isAdmin ? <Globe className="mr-2 h-4 w-4" /> : <Building className="mr-2 h-4 w-4" />}
                        {isAdmin ? "System" : "Business"}
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">
                        <Bell className="mr-2 h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all">
                        <Shield className="mr-2 h-4 w-4" /> Security
                    </TabsTrigger>
                </TabsList>

                <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                    <div className="space-y-8">
                        {/* Account Tab Content */}
                        <TabsContent value="account" className="mt-0 space-y-8">
                            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden border border-black/5">
                                <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Personal Identity</CardTitle>
                                    <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                        Update your profile details and avatar visibility.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="flex flex-col sm:flex-row items-center gap-8">
                                        <div className="relative group">
                                            <div className="h-40 w-40 rounded-[3rem] bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center border-8 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                <img 
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            <button 
                                                onClick={handleAvatarUpdate}
                                                className={cn(
                                                    "absolute -bottom-2 -right-2 h-12 w-12 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:rotate-12 transition-all",
                                                    isAdmin ? "bg-indigo-600 hover:bg-indigo-700" : "bg-black hover:bg-slate-900"
                                                )}
                                            >
                                                <Camera className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="space-y-1 text-center sm:text-left">
                                            <h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">{profileData.full_name || user?.username}</h4>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Identity Node: {user?.role.toUpperCase()}</p>
                                            <Button 
                                                onClick={handleAvatarUpdate}
                                                variant="outline" 
                                                className="rounded-2xl border-black/10 bg-white hover:bg-slate-50 font-black uppercase text-[10px] tracking-widest h-12 px-8"
                                            >
                                                Sync Representation
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-10 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Full Name</Label>
                                            <Input 
                                                value={profileData.full_name}
                                                onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                                                className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-950 px-6 text-base" 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Network Identifier</Label>
                                            <Input 
                                                value={profileData.username}
                                                disabled
                                                className="h-16 bg-slate-100/50 border-transparent rounded-[1.25rem] font-bold text-slate-400 cursor-not-allowed px-6" 
                                            />
                                        </div>
                                        <div className="space-y-4 md:col-span-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Communication Vector (Email)</Label>
                                            <Input 
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                                className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-950 px-6 text-base" 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6">
                                        <Button 
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className={cn(
                                                "h-16 px-12 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all shadow-2xl",
                                                saved 
                                                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200" 
                                                    : (isAdmin 
                                                        ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" 
                                                        : "bg-black hover:bg-slate-900 shadow-slate-200")
                                            )}
                                        >
                                            {saving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : (saved ? <CheckCircle2 className="mr-3 h-5 w-5" /> : null)}
                                            {saving ? "Synchronising..." : (saved ? "Identity Committed" : "Authorize Changes")}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Business/System Tab Content */}
                        <TabsContent value={isAdmin ? "system" : "business"} className="mt-0 space-y-8">
                            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden border border-black/5">
                                <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">
                                        {isAdmin ? "Global Node Overrides" : "Enterprise Registry"}
                                    </CardTitle>
                                    <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                        {isAdmin ? "Low-level system parameters and maintenance triggers." : "Public business identity and logistical coordinates."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    {isAdmin ? (
                                        <div className="space-y-10">
                                            <div className="grid gap-8 md:grid-cols-2">
                                                <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-black/[0.03] group hover:bg-white hover:shadow-xl transition-all">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Maintenance Protocol</Label>
                                                        <p className="text-sm font-black italic text-slate-900">Public Access Toggle</p>
                                                    </div>
                                                    <Switch className="scale-125" />
                                                </div>
                                                <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-black/[0.03] group hover:bg-white hover:shadow-xl transition-all">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Debug Verbosity</Label>
                                                        <p className="text-sm font-black italic text-slate-900">Enhanced Telemetry</p>
                                                    </div>
                                                    <Switch className="scale-125" defaultChecked />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Central Dispatch Key (Level 4 Auth)</Label>
                                                <Input 
                                                    type="password"
                                                    value="************************"
                                                    disabled
                                                    className="h-16 bg-slate-100/50 border-transparent rounded-[1.25rem] font-black text-slate-300 px-6 tracking-widest" 
                                                />
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <Button 
                                                    onClick={handleSystemSync}
                                                    className="h-16 px-12 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-200"
                                                >
                                                    Authorise System Sync
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-10">
                                            <div className="grid gap-10 md:grid-cols-2">
                                                <div className="space-y-4 md:col-span-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Incorporated Entity Name</Label>
                                                    <Input 
                                                        value={businessData.company_name}
                                                        onChange={(e) => setBusinessData({...businessData, company_name: e.target.value})}
                                                        className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-950 px-6 text-base" 
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Contact Vector</Label>
                                                    <Input 
                                                        value={businessData.phone}
                                                        onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                                                        className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-950 px-6 text-base" 
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Logistical Fulfillment Center (Address)</Label>
                                                    <Input 
                                                        value={businessData.address}
                                                        onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                                                        className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-bold text-slate-950 px-6 text-base" 
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <Button 
                                                    onClick={handleSaveBusiness}
                                                    disabled={saving}
                                                    className="h-16 px-12 rounded-[1.5rem] bg-black hover:bg-slate-900 text-white font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-slate-200"
                                                >
                                                    {saving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : null}
                                                    Commit Business Identity
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab Content */}
                        <TabsContent value="notifications" className="mt-0 space-y-8">
                            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden border border-black/5">
                                <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Communication Grid</CardTitle>
                                            <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                                Optimise how the network synchronises telemetry to you.
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-600 font-black text-[8px] uppercase tracking-widest px-4 py-1.5 rounded-full border-none">Active Link</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    {[
                                        { id: "emails", label: "Email Transmissions", desc: "Receive automated digital transcripts and ledger updates.", state: notifications.emails },
                                        { id: "sms", label: "Cellular Flash Alerts", desc: "Urgent shipment dispatch and security node triggers.", state: notifications.sms },
                                        { id: "marketing", label: "Intelligence Briefs", desc: "Network expansion updates and new logistical modules.", state: notifications.marketing },
                                        { id: "security_alerts", label: "Security Breach Protocol", desc: "Critical authentication and session anomaly alerts.", state: notifications.security_alerts },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-black/[0.03] group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                                            <div className="space-y-1">
                                                <Label htmlFor={item.id} className="text-sm font-black uppercase tracking-tight text-slate-900 cursor-pointer">{item.label}</Label>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                                            </div>
                                            <Switch 
                                                id={item.id} 
                                                checked={item.state} 
                                                onCheckedChange={(checked) => setNotifications({...notifications, [item.id]: checked})} 
                                                className="scale-125 transition-all data-[state=active]:bg-primary"
                                            />
                                        </div>
                                    ))}
                                    <div className="flex justify-end pt-4">
                                        <Button 
                                            onClick={() => alert("Telemetry Protocol: Notification preferences synchronized across the grid.")}
                                            className={cn(
                                                "h-16 px-12 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl",
                                                isAdmin ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100" : "bg-black hover:bg-slate-900 text-white shadow-slate-200"
                                            )}
                                        >
                                            Authorise Grid Updates
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab Content */}
                        <TabsContent value="security" className="mt-0 space-y-8">
                            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden border border-black/5">
                                <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Security Vault</CardTitle>
                                    <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                                        Fortify your node access credentials and session keys.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Authorization Key</Label>
                                        <Input type="password" placeholder="••••••••••••" className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] font-bold px-6" />
                                    </div>
                                    <div className="grid gap-10 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Network Key</Label>
                                            <Input type="password" placeholder="••••••••••••" className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] font-bold px-6" />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verify Network Key</Label>
                                            <Input type="password" placeholder="••••••••••••" className="h-16 bg-slate-50 border-transparent rounded-[1.25rem] font-bold px-6" />
                                        </div>
                                    </div>
                                    <div className="p-10 bg-rose-50 rounded-[2.5rem] border border-rose-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Shield className="h-16 w-16 text-rose-500 rotate-12" />
                                        </div>
                                        <div className="flex gap-6 relative z-10">
                                            <div className="h-12 w-12 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0">
                                                <Shield className="h-6 w-6 text-rose-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-black uppercase text-rose-900 tracking-tight">Critical Security Override</p>
                                                <p className="text-[10px] font-bold text-rose-600/70 uppercase tracking-widest leading-relaxed">
                                                    Initiating a key rotation will immediately terminate all active session tokens and force a global re-authentication across all authenticated nodes.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                                        <Button 
                                            onClick={handleTerminateSessions}
                                            variant="ghost" 
                                            className="h-16 px-10 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                                        >
                                            Terminate Sessions
                                        </Button>
                                        <Button 
                                            onClick={handleRotateKeys}
                                            className={cn(
                                                "h-16 px-12 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl",
                                                isAdmin ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100" : "bg-black hover:bg-slate-900 text-white shadow-slate-200"
                                            )}
                                        >
                                            Authorize Key Rotation
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>

                    {/* Right Column: Analytics & Themes */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
                        <Card className="border-none shadow-2xl bg-slate-950 text-white rounded-[3rem] p-12 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Lock className="h-24 w-24 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                            </div>
                            <div className="relative z-10 space-y-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Operational Status</p>
                                    <div className="text-3xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                        <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                                        Secured Node
                                    </div>
                                </div>
                                <div className="space-y-1 p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Last Cryptographic Sync</p>
                                    <p className="text-xs font-black italic tracking-tight">{new Date().toLocaleTimeString()} @ Network Time</p>
                                </div>
                                <Button 
                                    onClick={handleIntegrityScan}
                                    className="w-full h-14 rounded-2xl bg-white text-slate-950 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                    Force Integrity Scan
                                </Button>
                            </div>
                        </Card>

                        <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-12 border border-black/5">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900 mb-10">Optical Interface</CardTitle>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { name: "Default", color: "bg-black", accent: "primary" },
                                    { name: "Nebula", color: "bg-indigo-600", accent: "indigo" },
                                    { name: "Emerald", color: "bg-emerald-600", accent: "emerald" },
                                    { name: "Crimson", color: "bg-rose-600", accent: "rose" },
                                ].map((theme) => (
                                    <button 
                                        key={theme.name}
                                        onClick={() => handleThemeSelect(theme.name)}
                                        className={cn(
                                            "group relative h-28 rounded-3xl border transition-all hover:shadow-2xl text-left p-6",
                                            activeTheme === theme.name ? "border-slate-900 shadow-xl ring-2 ring-slate-900/5 bg-slate-50" : "border-black/5 bg-white"
                                        )}
                                    >
                                        <div className={cn("h-6 w-6 rounded-xl mb-3 shadow-lg transition-transform group-hover:scale-110", theme.color)} />
                                        <p className={cn(
                                            "text-[10px] font-black uppercase tracking-tighter transition-colors",
                                            activeTheme === theme.name ? "text-slate-950" : "text-slate-400 group-hover:text-slate-900"
                                        )}>{theme.name}</p>
                                        {activeTheme === theme.name && (
                                            <div className="absolute top-4 right-4 text-slate-900">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <div className="p-10 bg-slate-50 rounded-[3rem] border border-black/[0.03] space-y-8 group hover:shadow-inner transition-all">
                            <div className="flex items-center gap-5">
                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                                    <CloudIcon className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-slate-950 italic">Supabase Sync Hub</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Latency: 24ms (Optimal)</p>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[98%] rounded-full" />
                            </div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Node synchronisation encrypted via AES-256</p>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
