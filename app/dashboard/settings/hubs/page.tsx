"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Building2,
    Plus,
    Trash2,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    MapPin,
    Network
} from "lucide-react";
import { fetchRDCHubs, createRDCHub, deleteRDCHub } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RDCHubsSettingsPage() {
    const router = useRouter();
    const [hubs, setHubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Add Hub Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHubName, setNewHubName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Delete Hub state
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        if (authUser.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        setIsAdmin(true);
        loadHubs();
    }, [router]);

    const loadHubs = async () => {
        try {
            setLoading(true);
            const data = await fetchRDCHubs();
            setHubs(data || []);
        } catch (err) {
            console.error("Failed to load hubs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHub = async () => {
        if (!newHubName.trim()) return;
        setIsSaving(true);
        try {
            await createRDCHub(newHubName.trim());
            setNewHubName("");
            setShowAddModal(false);
            await loadHubs();
        } catch (err: any) {
            console.error("Error creating hub:", err);
            if (err.code === '23505') {
                alert("A logistics hub with this exact nomenclature already exists in the distribution lattice.");
            } else {
                alert("Failed to initialize new logistical node.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteHub = async (id: string, name: string) => {
        if (!confirm(`CRITICAL ACTION: Are you absolutely certain you wish to permanently decommission the ${name} node?\n\nWARNING: Operations tied exclusively to this node may experience disruption.`)) {
            return;
        }

        setIsDeleting(id);
        try {
            await deleteRDCHub(id);
            await loadHubs();
        } catch (err) {
            console.error("Error deleting hub:", err);
            alert("Decommissioning failed. The node may still have dependencies linked to it.");
        } finally {
            setIsDeleting(null);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Global <span className="text-indigo-600">Distribution Nodes</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">Manage the foundational infrastructure of the logistics lattice.</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-200 transition-all"
                >
                    <Plus className="mr-3 h-5 w-5" /> Initialize New Node
                </Button>
            </div>

            <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                {/* Active Hubs List */}
                <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                    <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900 flex items-center gap-3">
                            <Network className="h-6 w-6 text-indigo-600" />
                            Active Nodes Network
                        </CardTitle>
                        <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">
                            Live visualization of operational fulfillment centers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-10">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                                <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Scanning network topology...</p>
                            </div>
                        ) : hubs.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem]">
                                <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="font-bold text-slate-500 text-xs uppercase tracking-widest">Grid Empty. No active nodes.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {hubs.map((hub) => (
                                    <div key={hub.id} className="group relative p-6 bg-slate-50 rounded-[2rem] border border-black/[0.03] hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all outline-none overflow-hidden">
                                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                                            <Building2 className="h-20 w-20 text-indigo-600 -rotate-12" />
                                        </div>
                                        <div className="relative z-10 flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center shadow-sm shrink-0">
                                                    <MapPin className="h-5 w-5 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tight text-slate-900 leading-none mb-1.5">{hub.name}</h3>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Operational Sync</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteHub(hub.id, hub.name)}
                                                disabled={isDeleting === hub.id}
                                                className="h-10 w-10 shrink-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                {isDeleting === hub.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Intelligence Side Panel */}
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
                    <Card className="border-none shadow-2xl bg-indigo-950 text-white rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Network className="h-32 w-32 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/80 mb-2">Network Capacity</p>
                                <div className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                                    {loading ? "-" : hubs.length} Nodes
                                </div>
                            </div>
                            <div className="space-y-2 p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-md">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Architecture Warning</p>
                                </div>
                                <p className="text-xs font-bold leading-relaxed text-indigo-100/70">
                                    Modifying the structural designation of these hubs may implicitly isolate unassigned operators across the global registry.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl p-12 w-full max-w-lg space-y-10 animate-in zoom-in-95 duration-200 border border-black/5">
                        <div className="text-center">
                            <div className="mx-auto h-20 w-20 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-sm">
                                <Building2 className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">New Node Initialization</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-3">Register a new logistical checkpoint into the matrix.</p>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Node Designation (Ex: North (Jaffna))</Label>
                            <Input
                                placeholder="Enter structural label..."
                                value={newHubName}
                                onChange={(e) => setNewHubName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateHub()}
                                className="h-16 px-6 font-bold text-lg rounded-2xl bg-slate-50 border-black/5 shadow-inner focus:bg-white transition-all text-center"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAddModal(false)}
                                disabled={isSaving}
                                className="flex-1 h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-slate-100"
                            >
                                Abort
                            </Button>
                            <Button
                                onClick={handleCreateHub}
                                disabled={isSaving || !newHubName.trim()}
                                className="flex-1 h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-200"
                            >
                                {isSaving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-3 h-5 w-5" />}
                                Commit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
