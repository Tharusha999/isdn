"use client";

import { cn } from "@/lib/utils";
import {
    BarChart3,
    Box,
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

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
    },
    {
        title: "Inventory",
        href: "/dashboard/inventory",
        icon: Package,
    },
    {
        title: "Logistics",
        href: "/dashboard/logistics",
        icon: Truck,
    },
    {
        title: "Finance",
        href: "/dashboard/finance",
        icon: CreditCard,
    },
    {
        title: "Staff",
        href: "/dashboard/staff",
        icon: Users,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-full flex-col border-r bg-sidebar text-card-foreground sidebar-glass">
            <div className="flex h-16 items-center px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <Box className="h-4 w-4" />
                    </div>
                    <span className="text-xl tracking-tight">ISDN</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4 px-3">
                <nav className="grid items-start gap-1">
                    {sidebarItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground active:scale-[0.98]"
                                )}
                            >
                                <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-white" : "")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto border-t border-black/5 p-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}

