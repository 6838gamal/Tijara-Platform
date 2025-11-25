
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Search, Mail, BarChart2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const apps = [
    { titleKey: "appMailCampaigns", descKey: "appMailCampaignsDesc", icon: Mail, priceKey: "free" },
    { titleKey: "appAdvancedAnalytics", descKey: "appAdvancedAnalyticsDesc", icon: BarChart2, priceKey: "monthlyFee", price: "15" },
    { titleKey: "appShippingPro", descKey: "appShippingProDesc", icon: Truck, priceKey: "monthlyFee", price: "25" },
    { titleKey: "appSocialProof", descKey: "appSocialProofDesc", icon: "💬", priceKey: "free" },
];

export default function AppStorePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('visitAppStore')}</h1>
            <p className="text-muted-foreground">{t('appStorePageDesc')}</p>
        </div>
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
            <Input 
                placeholder={t('appStoreSearchPlaceholder')}
                className="pl-9 rtl:pr-9"
            />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map(app => (
                <Card key={app.titleKey} className="flex flex-col">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                         <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                            {typeof app.icon === 'string' ? (
                                <span className="text-2xl">{app.icon}</span>
                            ) : (
                                <app.icon className="h-6 w-6 text-primary" />
                            )}
                        </div>
                        <div>
                            <CardTitle>{t(app.titleKey)}</CardTitle>
                            <CardDescription>{t(app.descKey)}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="font-semibold">
                            {t(app.priceKey)} {app.price && `$${app.price}`}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">{t('appInstallButton')}</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
