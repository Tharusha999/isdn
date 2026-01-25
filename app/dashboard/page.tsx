import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Dashboard</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tighter">Rs. 45,231.89</div>
                        <p className="text-xs font-medium text-emerald-600 mt-1">
                            +20.1% <span className="text-muted-foreground font-normal">from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Orders
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tighter">+2350</div>
                        <p className="text-xs font-medium text-emerald-600 mt-1">
                            +180.1% <span className="text-muted-foreground font-normal">from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Sales</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tighter">+12,234</div>
                        <p className="text-xs font-medium text-emerald-600 mt-1">
                            +19% <span className="text-muted-foreground font-normal">from last month</span>
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white/50 hover:bg-white/80 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Now
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tighter">+573</div>
                        <p className="text-xs font-medium text-emerald-600 mt-1">
                            +201 <span className="text-muted-foreground font-normal">since last hour</span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
