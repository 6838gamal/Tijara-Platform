
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { PlusCircle, Trash2 } from 'lucide-react';

export default function PaymentsAndShippingPage() {
  const { t } = useTranslation();

  const handleSave = (e: React.FormEvent<HTMLFormElement>, tabNameKey: string) => {
      e.preventDefault();
      toast({
          title: t('toastSettingsSaved'),
          description: `${t('toastSettingsSavedDesc')} "${t(tabNameKey)}".`,
      });
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('paymentsAndShipping')}</h1>
            <p className="text-muted-foreground">
                {t('paymentsAndShippingDesc')}
            </p>
        </div>

        <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="payments">{t('paymentMethodsTab')}</TabsTrigger>
                <TabsTrigger value="shipping">{t('shippingSettingsTab')}</TabsTrigger>
            </TabsList>

            <TabsContent value="payments">
                <form onSubmit={(e) => handleSave(e, "paymentMethodsTab")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('paymentMethodsTab')}</CardTitle>
                            <CardDescription>{t('paymentGatewaysDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                             <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="text-lg font-medium">Stripe</h3>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Switch id="stripe-enabled" />
                                    <Label htmlFor="stripe-enabled">{t('enableStripe')}</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stripe-pk">{t('stripePublishableKey')}</Label>
                                    <Input id="stripe-pk" placeholder="pk_test_..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stripe-sk">{t('stripeSecretKey')}</Label>
                                    <Input id="stripe-sk" type="password" placeholder="sk_test_..." />
                                </div>
                            </div>
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="text-lg font-medium">PayPal</h3>
                                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <Switch id="paypal-enabled" defaultChecked />
                                    <Label htmlFor="paypal-enabled">{t('enablePayPal')}</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paypal-client-id">{t('paypalClientId')}</Label>
                                    <Input id="paypal-client-id" placeholder="A..." />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">{t('saveChangesButton')}</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>

            <TabsContent value="shipping">
                 <form onSubmit={(e) => handleSave(e, "shippingSettingsTab")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('shippingSettingsTab')}</CardTitle>
                            <CardDescription>{t('shippingSettingsDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('shippingZonesTitle')}</CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='p-4 border rounded-md'>
                                        <div className='flex justify-between items-center'>
                                            <h4 className='font-semibold'>{t('domesticShippingZone')}</h4>
                                            <Button variant="ghost" size="icon"><Trash2 className='h-4 w-4 text-destructive' /></Button>
                                        </div>
                                        <p className='text-sm text-muted-foreground'>{t('domesticShippingZoneDesc')}</p>
                                        <div className='mt-4 space-y-2'>
                                            <div className='flex items-center justify-between'>
                                                <p>{t('standardShipping')}</p>
                                                <p className='font-medium'>$5.00</p>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <p>{t('expressShipping')}</p>
                                                <p className='font-medium'>$15.00</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-4 border rounded-md'>
                                         <div className='flex justify-between items-center'>
                                            <h4 className='font-semibold'>{t('internationalShippingZone')}</h4>
                                            <Button variant="ghost" size="icon"><Trash2 className='h-4 w-4 text-destructive' /></Button>
                                        </div>
                                        <p className='text-sm text-muted-foreground'>{t('internationalShippingZoneDesc')}</p>
                                        <div className='mt-4 space-y-2'>
                                             <div className='flex items-center justify-between'>
                                                <p>{t('standardShipping')}</p>
                                                <p className='font-medium'>$25.00</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className='w-full'>
                                        <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                        {t('addShippingZoneButton')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">{t('saveChangesButton')}</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
        </Tabs>
    </div>
  );
}
