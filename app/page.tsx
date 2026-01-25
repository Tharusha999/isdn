import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Box, LayoutDashboard, Truck } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="name@islandlink.com" type="email" />
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
            <Button className="w-full" asChild>
              <Link href="/dashboard">
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 p-6">
            <div className="text-xs text-muted-foreground text-center mb-2">
              Quick Access (Demo)
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-3 w-3" /> Manager
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <Link href="/dashboard">
                  <Truck className="mr-2 h-3 w-3" /> Logistics
                </Link>
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
