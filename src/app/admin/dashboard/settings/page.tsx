"use client";

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function SystemSettingsPage() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const handleSave = (e: React.FormEvent<HTMLFormElement>, tabName: string) => {
        e.preventDefault();
        toast({
            title: "تم حفظ الإعدادات",
            description: `تم حفظ إعدادات "${tabName}" بنجاح.`,
        });
    };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">إعدادات النظام</h1>
            <p className="text-muted-foreground">
                قم بإدارة الإعدادات والتكوينات العامة للمنصة.
            </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">الإعدادات العامة</TabsTrigger>
                <TabsTrigger value="maintenance">وضع الصيانة</TabsTrigger>
                <TabsTrigger value="payments">بوابات الدفع</TabsTrigger>
                <TabsTrigger value="email">البريد الإلكتروني</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
                <form onSubmit={(e) => handleSave(e, "الإعدادات العامة")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>الإعدادات العامة</CardTitle>
                            <CardDescription>تحديث المعلومات الأساسية للمنصة.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="platformName">اسم المنصة</Label>
                                <Input id="platformName" defaultValue="عون" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platformLogo">شعار المنصة (رابط)</Label>
                                <Input id="platformLogo" placeholder="https://example.com/logo.png" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="supportEmail">البريد الإلكتروني للدعم</Label>
                                <Input id="supportEmail" type="email" defaultValue="support@aoun.com" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">حفظ التغييرات</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>

            <TabsContent value="maintenance">
                <Card>
                    <CardHeader>
                        <CardTitle>وضع الصيانة</CardTitle>
                        <CardDescription>
                            عند تفعيل وضع الصيانة، سيتم عرض صفحة صيانة لجميع المستخدمين.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="flex items-center space-x-4 rounded-md border p-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                تفعيل وضع الصيانة
                                </p>
                                <p className="text-sm text-muted-foreground">
                                سيؤدي هذا إلى جعل واجهة المتجر غير متاحة للعملاء.
                                </p>
                            </div>
                            <Switch
                                checked={maintenanceMode}
                                onCheckedChange={setMaintenanceMode}
                                aria-label="Maintenance mode"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maintenanceMessage">رسالة الصيانة</Label>
                            <Textarea 
                                id="maintenanceMessage" 
                                placeholder="سنعود قريباً..." 
                                defaultValue="الموقع قيد الصيانة حاليًا. نعتذر عن الإزعاج وسنعود للعمل في أقرب وقت ممكن."
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => toast({title: "تم تحديث وضع الصيانة"})}>حفظ الإعدادات</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="payments">
                 <form onSubmit={(e) => handleSave(e, "بوابات الدفع")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>بوابات الدفع</CardTitle>
                            <CardDescription>
                                قم بتكوين وتفعيل بوابات الدفع التي تريد دعمها.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             <div className="space-y-4">
                                <h3 className="text-lg font-medium">Stripe</h3>
                                <div className="flex items-center space-x-2">
                                    <Switch id="stripe-enabled" />
                                    <Label htmlFor="stripe-enabled">تفعيل Stripe</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stripe-pk">Publishable Key</Label>
                                    <Input id="stripe-pk" placeholder="pk_test_..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stripe-sk">Secret Key</Label>
                                    <Input id="stripe-sk" type="password" placeholder="sk_test_..." />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">PayPal</h3>
                                <div className="flex items-center space-x-2">
                                    <Switch id="paypal-enabled" defaultChecked />
                                    <Label htmlFor="paypal-enabled">تفعيل PayPal</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paypal-client-id">Client ID</Label>
                                    <Input id="paypal-client-id" placeholder="A..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paypal-client-secret">Client Secret</Label>
                                    <Input id="paypal-client-secret" type="password" placeholder="E..." />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">حفظ إعدادات الدفع</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>

            <TabsContent value="email">
                <form onSubmit={(e) => handleSave(e, "إعدادات البريد الإلكتروني")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>إعدادات البريد الإلكتروني (SMTP)</CardTitle>
                            <CardDescription>
                                تكوين إعدادات خادم البريد الصادر لإرسال الإشعارات والرسائل.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-host">المضيف (Host)</Label>
                                    <Input id="smtp-host" placeholder="smtp.example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">المنفذ (Port)</Label>
                                    <Input id="smtp-port" type="number" placeholder="587" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="smtp-user">اسم المستخدم</Label>
                                <Input id="smtp-user" placeholder="user@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smtp-pass">كلمة المرور</Label>
                                <Input id="smtp-pass" type="password" placeholder="••••••••" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="smtp-from">عنوان المرسل</Label>
                                <Input id="smtp-from" type="email" placeholder="noreply@aoun.com" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">حفظ إعدادات البريد</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
        </Tabs>
    </div>
  );
}
