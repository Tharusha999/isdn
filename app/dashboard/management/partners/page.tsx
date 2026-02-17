"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Mail,
    Phone,
    Plus,
    Search,
    MoreHorizontal,
    MapPin,
    Truck,
    ShieldCheck,
    Star
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const partners = [
    {
        name: "Lanka Logistics & Co.",
        type: "Prime Logistics",
        hub: "Central Hub",
        contact: "Damien Silva",
        email: "contact@lanka-log.lk",
        phone: "+94 11 234 5678",
        status: "Active",
        rating: 4.8
    },
    {
        name: "Island Wide Distributors",
        type: "Regional Distributor",
        hub: "North (Jaffna)",
        contact: "K. Rathnam",
        email: "jaffna-dist@iwd.lk",
        phone: "+94 21 888 1234",
        status: "Active",
        rating: 4.5
    },
    {
        name: "Eco-Fleet Express",
        type: "Eco Delivery Partner",
        hub: "West (Colombo)",
        contact: "Sarah Perera",
        email: "fleet@ecofleet.com",
        phone: "+94 77 123 4455",
        status: "Review",
        rating: 4.2
    },
    {
        name: "Southern Speed Logistics",
        type: "Prime Logistics",
        hub: "South (Galle)",
        contact: "Roshan Kumara",
        email: "ops@southernspeed.lk",
        phone: "+94 91 555 6789",
        status: "Active",
        rating: 4.9
    }
];

export default function PartnersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">RDC Partners</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Manage external logistics and distribution partners per region.</p>
                </div>
                <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold px-6">
                    <Plus className="mr-2 h-4 w-4" /> Register New Partner
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-white/60 p-1 rounded-xl w-full md:w-[400px] border border-black/5">
                <Search className="ml-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by partner name or region..."
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/70 text-sm font-medium"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-black/5 pt-6">
                {partners.map((partner, index) => (
                    <Card key={index} className="group border-none shadow-sm bg-white/50 hover:bg-white hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="pt-6 relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl bg-white/90 backdrop-blur-md">
                                    <DropdownMenuItem className="font-bold text-xs uppercase tracking-wider">Edit Agreement</DropdownMenuItem>
                                    <DropdownMenuItem className="font-bold text-xs uppercase tracking-wider">Performance Audit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 font-bold text-xs uppercase tracking-wider">Terminate Contract</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 mb-4 shadow-sm border border-black/5 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/5 transition-colors">
                                    <Truck className="h-10 w-10" />
                                </div>
                                <h3 className="font-black text-base uppercase tracking-tight">{partner.name}</h3>
                                <p className="text-[10px] text-muted-foreground mb-3 font-bold uppercase tracking-widest">{partner.type}</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                                        <MapPin className="mr-1 h-3 w-3" /> {partner.hub}
                                    </Badge>
                                    <Badge className={`rounded-lg border-none px-3 py-1 text-[9px] font-black uppercase tracking-widest ${partner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                        {partner.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-black/5">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-muted-foreground flex items-center gap-2 uppercase tracking-tighter">
                                        <ShieldCheck className="h-3.5 w-3.5 text-primary/40" /> Performance
                                    </span>
                                    <span className="flex items-center gap-1 text-emerald-600">
                                        <Star className="h-3 w-3 fill-emerald-600" /> {partner.rating}
                                    </span>
                                </div>
                                <div className="flex items-center text-[11px] font-bold text-muted-foreground">
                                    <Mail className="mr-3 h-3.5 w-3.5 text-primary/40" />
                                    {partner.email}
                                </div>
                                <div className="flex items-center text-[11px] font-bold text-muted-foreground">
                                    <Phone className="mr-3 h-3.5 w-3.5 text-primary/40" />
                                    {partner.phone}
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button variant="outline" className="w-full rounded-xl border-black/5 hover:bg-black/5 transition-all font-black text-[10px] uppercase tracking-widest h-11 shadow-sm active:scale-95">
                                    View Contract Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <button className="flex flex-col items-center justify-center h-full min-h-[360px] border-2 border-dashed border-black/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all group">
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center group-hover:scale-110 transition-all shadow-sm border border-black/5">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary">Register New Partner</p>
                </button>
            </div>
        </div>
    );
}
