"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const getTitle = () => {
        if (pathname === "/dashboard") {
            if (role === 'customer') return "My Orders";
            if (role === 'driver') return "Driver Dispatch";
            return "Management Dashboard";
        }
        if (pathname === "/dashboard/staff") return "Retailer Portal";
        if (pathname === "/dashboard/logistics") return "RDC Management Portal";
        if (pathname === "/dashboard/management/staff") return "Staff Directory";
        if (pathname === "/dashboard/activity") return "System Activity Feed";
        if (pathname === "/dashboard/notifications") return "Alert Center";
        if (pathname === "/dashboard/management/partners") return "RDC Partners Directory";
        return "ISDN Dashboard";
    };

    const [globalSearch, setGlobalSearch] = useState("");
    const [role, setRole] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (!isLoaded) {
            const timer = setTimeout(() => {
                setRole(storedRole);
                setIsLoaded(true);
            }, 0);
            return () => clearTimeout(timer);
        }

        if (!storedRole && pathname !== '/') {
            router.push('/');
        }
    }, [pathname, router, isLoaded]);

    const roleInfo = {
        admin: {
            name: "Alex Rivera",
            label: "Global Admin",
            avatar: "Alex"
        },
        customer: {
            name: "Guest Customer",
            label: "Customer",
            avatar: "Guest"
        },
        driver: {
            name: "Sam Perera",
            label: "Logistics Driver",
            avatar: "Sam"
        },
        loading: {
            name: "Loading...",
            label: "...",
            avatar: "placeholder"
        }
    };

    const currentInfo = role === 'customer' ? roleInfo.customer : (role === 'admin' ? roleInfo.admin : (role === 'driver' ? roleInfo.driver : roleInfo.loading));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (globalSearch.trim()) {
            alert(`Searching for: ${globalSearch}\nThis feature will be fully implemented soon.`);
        }
    };

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-background">
            <div className="hidden border-r border-black/5 bg-background lg:block">
                <div className="fixed inset-y-0 left-0 z-10 hidden w-[280px] lg:block">
                    <Sidebar />
                </div>
            </div>
            <div className="flex flex-col min-w-0">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 nav-glass px-4 lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 lg:hidden hover:bg-black/5"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-0 border-r-0 bg-transparent shadow-none w-[280px]">
                            <div className="h-full w-full sidebar-glass">
                                <Sidebar />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex-1 flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-2">
                            <h1 className="text-lg font-bold tracking-tight text-foreground uppercase">
                                {getTitle()}
                            </h1>
                        </div>
                        <div className="flex-1 max-w-xl ml-auto md:ml-0">
                            <form onSubmit={handleSearch} className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="search"
                                    placeholder="Global Search..."
                                    className="w-full bg-black/5 border-transparent shadow-none pl-10 rounded-xl focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 h-10"
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4 ml-auto">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-black/5 relative">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
                            <span className="sr-only">Notifications</span>
                        </Button>

                        <div className="flex items-center gap-3 pl-2 border-l border-black/5">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold leading-none">{currentInfo.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-bold">{currentInfo.label}</p>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center text-xs font-semibold text-primary shadow-sm border border-primary/10 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentInfo.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6 xl:p-8 min-w-0">
                    {isLoaded ? children : <div className="flex-1 flex items-center justify-center font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Portal...</div>}
                </main>
            </div>
        </div>
    );
}
