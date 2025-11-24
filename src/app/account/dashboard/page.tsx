"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, User, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function CustomerDashboardPage() {
  const { t } = useTranslation();

  const latestOrder = {
    id: "ORD001",
    date: "2023-10-26",
    status: "Delivered",
    total: 129.99,
  };
  
  const statusTranslation: { [key: string]: string } = {
    Delivered: t('statusDelivered'),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">{t('welcomeBackCustomer')}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('latestOrder')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('orderId')}: <span className="font-mono">{latestOrder.id}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {t('orderDate')}: {latestOrder.date}
            </p>
             <p className="text-sm text-muted-foreground">
              {t('orderTotal')}: ${latestOrder.total.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('productStatus')}: <span className="font-medium text-primary">{statusTranslation[latestOrder.status]}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('accountOverview')}</CardTitle>
             <CardDescription>{t('accountOverviewDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Link href="/account/profile" className="flex items-center gap-3 hover:text-primary transition-colors">
                <User className="h-5 w-5 text-muted-foreground"/>
                <span>{t('profileInformation')}</span>
            </Link>
             <Link href="/account/orders" className="flex items-center gap-3 hover:text-primary transition-colors">
                <ShoppingCart className="h-5 w-5 text-muted-foreground"/>
                <span>{t('myOrders')}</span>
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 hover:text-primary transition-colors">
                <MapPin className="h-5 w-5 text-muted-foreground"/>
                <span>{t('myAddresses')}</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
