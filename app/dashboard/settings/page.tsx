"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, User, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground/90">Settings</h2>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-4 bg-white/60 p-1 rounded-full border border-black/5">
                    <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Profile</TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Security</TabsTrigger>
                </TabsList>

                <div className="grid gap-6 md:grid-cols-[250px_1fr]">
                    <Card className="h-fit border-none shadow-sm bg-white/60">
                        <CardContent className="p-4">
                            <nav className="space-y-1">
                                <Button variant="ghost" className="w-full justify-start rounded-lg hover:bg-black/5">
                                    <User className="mr-2 h-4 w-4" /> Account
                                </Button>
                                <Button variant="ghost" className="w-full justify-start rounded-lg hover:bg-black/5">
                                    <Bell className="mr-2 h-4 w-4" /> Notifications
                                </Button>
                                <Button variant="ghost" className="w-full justify-start rounded-lg hover:bg-black/5">
                                    <Palette className="mr-2 h-4 w-4" /> Appearance
                                </Button>
                                <Button variant="ghost" className="w-full justify-start rounded-lg hover:bg-black/5">
                                    <Lock className="mr-2 h-4 w-4" /> Security
                                </Button>
                            </nav>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <TabsContent value="profile" className="mt-0 space-y-6">
                            <Card className="border-none shadow-sm bg-white/50">
                                <CardHeader>
                                    <CardTitle>Profile Details</CardTitle>
                                    <CardDescription>Manage your public profile information.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow-sm"></div>
                                        <Button variant="outline" className="rounded-full border-gray-300">Change Avatar</Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" defaultValue="John" className="bg-white/50 border-gray-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" defaultValue="Doe" className="bg-white/50 border-gray-200" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" defaultValue="john.doe@isdn.lk" className="bg-white/50 border-gray-200" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" className="rounded-lg">Cancel</Button>
                                        <Button className="rounded-lg">Save Changes</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notifications" className="mt-0 space-y-6">
                            <Card className="border-none shadow-sm bg-white/50">
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="emails" className="flex flex-col space-y-1">
                                            <span>Email Notifications</span>
                                            <span className="font-normal text-xs text-muted-foreground">Receive daily summaries via email.</span>
                                        </Label>
                                        <Switch id="emails" />
                                    </div>
                                    <div className="flex items-center justify-between space-x-2">
                                        <Label htmlFor="sms" className="flex flex-col space-y-1">
                                            <span>SMS Alerts</span>
                                            <span className="font-normal text-xs text-muted-foreground">Get urgent alerts for shipments.</span>
                                        </Label>
                                        <Switch id="sms" defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
