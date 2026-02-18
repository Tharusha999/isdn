"use client";

import { cn } from "@/lib/utils";
import {
    BarChart3,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Package,
    Settings,
    ShoppingCart,
    Truck,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Products", href: "/dashboard/products", icon: Package },
    { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { title: "Inventory", href: "/dashboard/inventory", icon: Package },
    { title: "Delivery", href: "/dashboard/logistics", icon: Truck },
    { title: "Billing", href: "/dashboard/finance", icon: CreditCard },
    { title: "Reporting", href: "/dashboard/reports", icon: BarChart3 },
    { title: "Staff", href: "/dashboard/management/staff", icon: Users },
    { title: "RDC Partners", href: "/dashboard/management/partners", icon: Truck },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        const timer = setTimeout(() => {
            setRole(storedRole);
            setIsLoaded(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('userRole');
    };

    const filteredItems = sidebarItems.filter(item => {
        if (!isLoaded) return false;
        if (role === 'customer') {
            return ['Dashboard', 'Products', 'Orders', 'Settings'].includes(item.title);
        }
        if (role === 'driver') {
            return ['Dashboard', 'Logistics', 'Settings'].includes(item.title);
        }
        return true;
    });

    return (
        <div className="flex h-full w-full flex-col border-r border-black/5 bg-white text-card-foreground">
            <div className="flex h-24 items-center px-6 border-b border-black/5">
                <Link href="/dashboard" className="flex items-center gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <LayoutDashboard className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight leading-none text-foreground">IslandLink</span>
                        <span className="text-[10px] text-muted-foreground font-semibold mt-1.5 uppercase tracking-wider">
                            {!isLoaded ? 'Loading...' : (role === 'customer' ? 'Customer Portal' : (role === 'driver' ? 'Driver Portal' : 'Head Office Admin'))}
                        </span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 overflow-auto py-8 px-4">
                <nav className="grid gap-2">
                    {filteredItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 relative",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                <span className="flex-1">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4 space-y-4 border-t border-black/5">
                <Link
                    href="/"
                    onClick={handleSignOut}
                    className="flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-bold text-muted-foreground transition-all hover:bg-rose-50 hover:text-rose-600 group"
                >
                    <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                        <LogOut className="h-5 w-5" />
                    </div>
                    Sign Out
                </Link>
            </div>
        </div>
    );
}

