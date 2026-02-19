"use client";

import { useState, useEffect } from "react";
import { INITIAL_MISSIONS, Mission, MissionTask } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Truck,
    Navigation,
    CheckCircle2,
    Plus,
    Clock,
    User,
    MapPin,
    ShieldCheck,
    X,
    Save,
    ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DispatchManagementPage() {
    const router = useRouter();
    const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [newTask, setNewTask] = useState<MissionTask>({ time: "", label: "", location: "", done: false });
    const [role, setRole] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Role check
    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const timer = setTimeout(() => {
            setRole(storedRole);
            setIsLoaded(true);
        }, 0);

        if (storedRole !== 'admin') {
            router.push('/dashboard');
        }
        return () => clearTimeout(timer);
    }, [router]);

    // Load missions from localStorage on mount
    useEffect(() => {
        const savedMissions = localStorage.getItem('isdn_missions');
        if (savedMissions) {
            const timer = setTimeout(() => {
                try {
                    setMissions(JSON.parse(savedMissions));
                } catch (e) {
                    console.error("Failed to parse missions", e);
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, []);

    // Save missions to localStorage on change
    useEffect(() => {
        localStorage.setItem('isdn_missions', JSON.stringify(missions));
    }, [missions]);

    // Find the latest version of the selected mission from the main missions list
    const currentSelectedMission = selectedMission
        ? missions.find(m => m.id === selectedMission.id) || null
        : null;

    const handleUpdateTask = (missionId: string, taskIndex: number, done: boolean) => {
        setMissions(prev => prev.map(m => {
            if (m.id === missionId) {
                const updatedTasks = [...m.tasks];
                updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], done };
                return { ...m, tasks: updatedTasks };
            }
            return m;
        }));
    };

    const handleAddTask = (missionId: string) => {
        if (!newTask.time || !newTask.label) return;
        setMissions(prev => prev.map(m => {
            if (m.id === missionId) {
                return { ...m, tasks: [...m.tasks, newTask] };
            }
            return m;
        }));
        setNewTask({ time: "", label: "", location: "", done: false });
    };

    const handleUpdateLocation = (missionId: string, location: string) => {
        setMissions(prev => prev.map(m => {
            if (m.id === missionId) {
                return { ...m, currentLocation: location };
            }
            return m;
        }));
    };

    const handleSaveMission = () => {
        // In a real app, this would be an API call
        alert("Mission configuration saved to cloud sync.");
        setSelectedMission(null);
    };

    if (!isLoaded || role !== 'admin') return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">Fleet Commander</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                        Regional logistics grid coordination and high-level mission oversight.
                    </p>
                </div>
            </div>

            {/* Live Monitoring Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live Mission Monitoring</h3>
                </div>
                {missions.length > 0 && (
                    <div className="space-y-8">
                        <OperationsCockpit
                            activeRoute={currentSelectedMission || missions[0]}
                            onUpdateLocation={(loc) => handleUpdateLocation((currentSelectedMission || missions[0]).id, loc)}
                        />
                        <div className="grid gap-10 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <MissionTimeline
                                    activeRoute={currentSelectedMission || missions[0]}
                                    fullWidth={true}
                                    onToggleTask={(idx, done) => handleUpdateTask((currentSelectedMission || missions[0]).id, idx, done)}
                                />
                            </div>
                            <div>
                                <GridStatusFeed />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Mission List */}
                <Card className="lg:col-span-1 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                    <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Active Missions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {missions.map(mission => (
                            <div
                                key={mission.id}
                                onClick={() => setSelectedMission(mission)}
                                className={`p-6 rounded-[2rem] border cursor-pointer transition-all ${selectedMission?.id === mission.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white border-black/5 hover:bg-slate-50'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${selectedMission?.id === mission.id ? 'bg-white/10' : 'bg-primary/10 text-primary'}`}>
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <Badge className={`font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full ${mission.status === 'In Transit' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                        {mission.status}
                                    </Badge>
                                </div>
                                <h4 className="font-black italic text-lg tracking-tight uppercase">{mission.id}</h4>
                                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedMission?.id === mission.id ? 'text-white/60' : 'text-slate-400'}`}>
                                    Driver: {mission.driverName}
                                </p>
                                <div className="mt-4 space-y-2">
                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${selectedMission?.id === mission.id ? 'bg-white/20' : 'bg-slate-200/20'}`}>
                                        <div className={`h-full rounded-full ${selectedMission?.id === mission.id ? 'bg-white' : 'bg-primary'}`} style={{ width: `${mission.progress}%` }} />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-right">{mission.progress}% Complete</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Mission Editor */}
                <div className="lg:col-span-2">
                    {currentSelectedMission ? (
                        <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden border border-black/5">
                            <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Mission Details: {currentSelectedMission.id}</CardTitle>
                                    <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Update tasks and parameters for {currentSelectedMission.driverName}.</CardDescription>
                                </div>
                                <Button onClick={handleSaveMission} className="rounded-xl bg-slate-900 text-white hover:bg-black font-black uppercase text-[10px] tracking-widest px-6 h-12 shadow-xl shadow-black/10">
                                    <Save className="mr-2 h-4 w-4" /> Save Configuration
                                </Button>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Current Vector (Location)</Label>
                                        <Input
                                            value={currentSelectedMission.currentLocation}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setMissions(prev => prev.map(m => m.id === currentSelectedMission.id ? { ...m, currentLocation: val } : m));
                                            }}
                                            className="h-14 rounded-2xl bg-slate-50 border-black/5 font-bold text-slate-900 text-lg shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Mission Progress (%)</Label>
                                        <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-black/5 h-14">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentSelectedMission.progress}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setMissions(prev => prev.map(m => m.id === currentSelectedMission.id ? { ...m, progress: val } : m));
                                                }}
                                                className="flex-1 accent-indigo-500 h-1.5"
                                            />
                                            <span className="font-black italic text-xl tabular-nums text-indigo-600 w-12 text-right">{currentSelectedMission.progress}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-4 flex items-center gap-2">
                                        <Navigation className="h-4 w-4" /> Mission Timeline
                                    </h5>
                                    <div className="space-y-4">
                                        {currentSelectedMission.tasks.map((task, idx) => (
                                            <div key={idx} className="flex items-center gap-6 p-6 rounded-3xl bg-white border border-black/5 hover:border-indigo-500/20 hover:bg-slate-50/50 transition-all group">
                                                <button
                                                    onClick={() => handleUpdateTask(currentSelectedMission.id, idx, !task.done)}
                                                    className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all ${task.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}
                                                >
                                                    <CheckCircle2 className="h-6 w-6" />
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h6 className={`font-black uppercase tracking-tight text-base italic truncate ${task.done ? 'text-slate-900 group-hover:text-indigo-600 transition-colors' : 'text-slate-400'}`}>{task.label}</h6>
                                                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg tabular-nums shrink-0">{task.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <MapPin className="h-3 w-3" /> {task.location}
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Task Form */}
                                    <div className="p-10 rounded-[3rem] border-2 border-dashed border-black/5 space-y-8 bg-slate-50/20">
                                        <div className="text-center space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Inject Component</p>
                                            <h6 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Assign New Dispatch Node</h6>
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Planned Time</Label>
                                                <Input
                                                    placeholder="e.g. 14:15"
                                                    value={newTask.time}
                                                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                                    className="h-12 rounded-xl bg-white border-black/5 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Mission Activity</Label>
                                                <Input
                                                    placeholder="Client or Operation"
                                                    value={newTask.label}
                                                    onChange={(e) => setNewTask({ ...newTask, label: e.target.value })}
                                                    className="h-12 rounded-xl bg-white border-black/5 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Grid Coordinates</Label>
                                                <Input
                                                    placeholder="City or Hub"
                                                    value={newTask.location}
                                                    onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                                                    className="h-12 rounded-xl bg-white border-black/5 font-bold"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleAddTask(currentSelectedMission.id)}
                                            disabled={!newTask.time || !newTask.label}
                                            className="w-full h-16 rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-500/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                                        >
                                            <Plus className="mr-3 h-5 w-5" /> Integrate Node into Timeline
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-[600px] border-none shadow-2xl bg-white rounded-[4rem] flex flex-col items-center justify-center p-20 text-center border-dashed border-2 border-black/5 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="h-32 w-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500 border border-black/5">
                                    <Navigation className="h-12 w-12 text-slate-200" />
                                </div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-300">Awaiting Target Selection</h3>
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-4 max-w-sm leading-relaxed">System is idle. Select an active mission from the control panel to initiate synchronization and coordinate regional dispatch nodes.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

const OperationsCockpit = ({ activeRoute, onUpdateLocation }: { activeRoute: Mission, onUpdateLocation?: (loc: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(activeRoute.currentLocation);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVal(activeRoute.currentLocation);
        }, 0);
        return () => clearTimeout(timer);
    }, [activeRoute.currentLocation]);

    const handleSave = () => {
        if (onUpdateLocation && val !== activeRoute.currentLocation) {
            onUpdateLocation(val);
        }
        setIsEditing(false);
    };

    return (
        <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] p-8 group relative overflow-hidden border border-black/[0.03]">
                <Truck className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-100 -rotate-12 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Asset</p>
                    <div className="text-2xl font-black tracking-tight uppercase italic mb-4 text-slate-900">{activeRoute.vehicle}</div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                        <ShieldCheck className="h-3 w-3" /> System Secure
                    </div>
                </div>
            </Card>

            <Card
                className={`border-none shadow-xl bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-black/[0.03] transition-all ${onUpdateLocation ? 'hover:bg-slate-50' : ''}`}
            >
                <div className="relative group/edit">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Vector</p>
                    {isEditing ? (
                        <input
                            autoFocus
                            value={val}
                            onChange={(e) => setVal(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="text-xl font-black tracking-tighter uppercase italic text-slate-900 bg-transparent border-b-2 border-indigo-500 outline-none w-full"
                        />
                    ) : (
                        <div
                            onClick={() => onUpdateLocation && setIsEditing(true)}
                            className="flex items-baseline gap-2 cursor-pointer"
                        >
                            <div className="text-xl font-black tracking-tighter uppercase mb-1 leading-tight line-clamp-1 italic text-slate-900 group-hover/edit:text-indigo-600 transition-colors">{activeRoute.currentLocation}</div>
                            {onUpdateLocation && <Plus className="h-3 w-3 text-indigo-500 opacity-0 group-hover/edit:opacity-100 transition-opacity" />}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-500">
                    <MapPin className="h-3 w-3" /> Sector S-02
                </div>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] p-8 flex flex-col justify-between border border-black/[0.03]">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Telemetry Index</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Fuel</p>
                            <p className="font-black italic text-lg leading-none text-slate-900">{activeRoute.telemetry.fuel}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Load</p>
                            <p className="font-black italic text-lg leading-none text-slate-900">{activeRoute.telemetry.load}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="border-none shadow-xl bg-slate-50 rounded-[2.5rem] p-8 flex flex-col justify-between group">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Daily Traverse</p>
                    <div className="text-2xl font-black tracking-tighter text-slate-900 italic leading-none">{activeRoute.kmTraversed}</div>
                </div>
                <Navigation className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
            </Card>
        </div>
    );
};

const MissionTimeline = ({ activeRoute, fullWidth, onToggleTask }: { activeRoute: Mission, fullWidth?: boolean, onToggleTask?: (idx: number, done: boolean) => void }) => (
    <Card className={`${fullWidth ? 'w-full' : 'w-full max-w-2xl'} border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden flex flex-col border border-black/[0.03]`}>
        <CardHeader className="p-10 border-b border-black/5 bg-slate-50/50">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Mission Timeline</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Route Sync: {activeRoute.id} | Priority High</CardDescription>
                </div>
                <div className="h-10 w-10 bg-white shadow-md rounded-xl flex items-center justify-center border border-black/5">
                    <Clock className="h-5 w-5 text-slate-400" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-10">
            <div className="space-y-10 relative">
                <div className="absolute left-6 top-2 bottom-2 w-px bg-slate-100" />
                {activeRoute.tasks.map((task, idx) => (
                    <div key={idx} className="flex gap-8 relative items-start group">
                        <button
                            disabled={!onToggleTask}
                            onClick={() => onToggleTask?.(idx, !task.done)}
                            className={`h-12 w-12 rounded-2xl flex items-center justify-center relative z-10 shadow-lg transition-all ${onToggleTask ? 'hover:scale-110 active:scale-95' : ''} ${task.done ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-slate-300'}`}
                        >
                            {task.done ? <ShieldCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </button>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className={`font-black text-sm uppercase tracking-tight italic ${task.done ? 'text-slate-900' : 'text-slate-400'}`}>{task.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{task.location}</p>
                                </div>
                                <span className="text-[10px] font-black tabular-nums text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{task.time}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest px-3 border-none ${task.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                    {task.done ? 'Operations Complete' : 'Awaiting Arrival'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const GridStatusFeed = () => {
    const [statuses, setStatuses] = useState([
        { id: 1, title: "System Integrity: High", desc: "ALL NODES REPORT SUCCESSFUL SYNC. PROTOCOL SIGMA-9 ACTIVE.", type: "emerald" },
        { id: 2, title: "Route Efficiency: 94%", desc: "AUTOMATED ROUTE OPTIMIZATION HAS REDUCED TRAVERSAL TIME BY 12M.", type: "indigo" }
    ]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editVal, setEditVal] = useState({ title: "", desc: "" });

    interface GridStatus {
        id: number;
        title: string;
        desc: string;
        type: string;
    }

    const handleStartEdit = (s: GridStatus) => {
        setEditingId(s.id);
        setEditVal({ title: s.title, desc: s.desc });
    };

    const handleSave = () => {
        if (editingId !== null) {
            setStatuses(prev => prev.map(s => s.id === editingId ? { ...s, ...editVal } : s));
            setEditingId(null);
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-white rounded-[3rem] p-10 h-full border border-black/[0.03]">
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8">Grid Status Feed</h3>
            <div className="space-y-6">
                {statuses.map(s => (
                    <div
                        key={s.id}
                        className={`p-6 rounded-2xl border transition-all ${editingId === s.id ? 'ring-2 ring-indigo-500' : 'cursor-pointer hover:scale-[1.02] active:scale-95'} ${s.type === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                        onClick={() => editingId !== s.id && handleStartEdit(s)}
                    >
                        {editingId === s.id ? (
                            <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                                <input
                                    autoFocus
                                    value={editVal.title}
                                    onChange={(e) => setEditVal({ ...editVal, title: e.target.value })}
                                    className="w-full bg-white/50 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none outline-none ring-1 ring-black/5"
                                />
                                <textarea
                                    value={editVal.desc}
                                    onChange={(e) => setEditVal({ ...editVal, desc: e.target.value })}
                                    className="w-full bg-white/50 rounded-lg px-3 py-2 text-[10px] font-bold leading-relaxed border-none outline-none ring-1 ring-black/5 min-h-[60px]"
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} size="sm" className="h-8 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase">Save</Button>
                                    <Button onClick={() => setEditingId(null)} variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    {s.type === 'emerald' ? <ShieldCheck className="h-4 w-4" /> : <Navigation className="h-4 w-4" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{s.title}</span>
                                </div>
                                <p className={`text-[10px] font-bold leading-relaxed ${s.type === 'emerald' ? 'text-emerald-600/70' : 'text-indigo-600/70'}`}>{s.desc}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}
