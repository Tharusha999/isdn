"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Box, LayoutDashboard, Truck, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'customer' | 'driver'>('admin');

  useEffect(() => {
    localStorage.removeItem('userRole');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userRole', selectedRole);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <Box className="h-4 w-4" />
        </div>
        <span className="font-semibold tracking-tight text-lg">ISDN</span>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to the distribution network portal.</p>
        </div>

        <Card className="border-border/50 shadow-lg shadow-black/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Choose your role and enter credentials to access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-2">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedRole === 'admin'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border/50 hover:border-border hover:bg-muted/50 text-muted-foreground'
                  }`}
              >
                <ShieldCheck className={`h-6 w-6 mb-2 ${selectedRole === 'admin' ? 'text-primary' : ''}`} />
                <span className="text-sm font-semibold">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedRole === 'customer'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border/50 hover:border-border hover:bg-muted/50 text-muted-foreground'
                  }`}
              >
                <User className={`h-6 w-6 mb-2 ${selectedRole === 'customer' ? 'text-primary' : ''}`} />
                <span className="text-sm font-semibold">Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('driver')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedRole === 'driver'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border/50 hover:border-border hover:bg-muted/50 text-muted-foreground'
                  }`}
              >
                <Truck className={`h-6 w-6 mb-2 ${selectedRole === 'driver' ? 'text-primary' : ''}`} />
                <span className="text-sm font-semibold">Driver</span>
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder={selectedRole === 'admin' ? 'admin@islandlink.com' : 'customer@demo.com'} type="email" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full">
                Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 p-6">
            <div className="text-xs text-muted-foreground text-center mb-2">
              Quick Access (Demo)
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => {
                localStorage.setItem('userRole', 'admin');
                router.push('/dashboard');
              }}>
                <LayoutDashboard className="mr-2 h-3 w-3" /> Admin
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => {
                localStorage.setItem('userRole', 'customer');
                router.push('/dashboard');
              }}>
                <User className="mr-2 h-3 w-3" /> Customer
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => {
                localStorage.setItem('userRole', 'driver');
                router.push('/dashboard');
              }}>
                <Truck className="mr-2 h-3 w-3" /> Driver
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
