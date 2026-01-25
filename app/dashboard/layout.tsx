import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-background">
            <div className="hidden border-r border-black/5 bg-background lg:block">
                <div className="fixed inset-y-0 left-0 z-10 hidden w-[280px] lg:block">
                    <Sidebar />
                </div>
            </div>
            <div className="flex flex-col">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-4 nav-glass px-6">
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
                        <SheetContent side="left" className="flex flex-col p-0 border-r-0 bg-transparent shadow-none">
                            <div className="h-full w-full sidebar-glass rounded-r-2xl">
                                <Sidebar />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full bg-black/5 border-transparent shadow-none appearance-none pl-10 md:w-2/3 lg:w-1/3 rounded-xl focus:bg-white focus:border-input transition-all placeholder:text-muted-foreground/70"
                                />
                            </div>
                        </form>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-xs font-semibold text-white shadow-md shadow-blue-500/20">
                        JD
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
