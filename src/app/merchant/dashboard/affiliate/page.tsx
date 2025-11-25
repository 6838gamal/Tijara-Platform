
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Share2, Users, MousePointerClick, DollarSign, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const topAffiliates = [
    { name: "Sami Advertising", clicks: 1250, signups: 150, revenue: 2350.50 },
    { name: "Digital Influencers Inc.", clicks: 980, signups: 120, revenue: 1980.00 },
    { name: "Marketing Gurus", clicks: 750, signups: 80, revenue: 1500.75 },
];

export default function AffiliatePage() {
  const { t } = useTranslation();

  const stats = [
    { titleKey: "affiliatesTotal", value: "25", icon: Users },
    { titleKey: "affiliatesTotalClicks", value: "4,820", icon: MousePointerClick },
    { titleKey: "affiliatesTotalRevenue", value: "$8,250.75", icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t('affiliateMarketing')}</h1>
                <p className="text-muted-foreground">{t('affiliatePageDesc')}</p>
            </div>
            <Button>
                <Share2 className="mr-2 h-4 w-4" />
                {t('affiliateAddButton')}
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            {stats.map(stat => (
                <Card key={stat.titleKey}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t(stat.titleKey)}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t('affiliatesTopPerformers')}</CardTitle>
                    <CardDescription>{t('affiliatesTopPerformersDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('affiliatesName')}</TableHead>
                                <TableHead className="text-right">{t('affiliatesClicks')}</TableHead>
                                <TableHead className="text-right">{t('affiliatesRevenue')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topAffiliates.map(affiliate => (
                                <TableRow key={affiliate.name}>
                                    <TableCell className="font-medium">{affiliate.name}</TableCell>
                                    <TableCell className="text-right">{affiliate.clicks}</TableCell>
                                    <TableCell className="text-right font-semibold">${affiliate.revenue.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5"/>{t('affiliateSettings')}</CardTitle>
                    <CardDescription>{t('affiliateSettingsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="commission-rate">{t('affiliateCommissionRate')}</Label>
                        <div className="flex items-center">
                            <Input id="commission-rate" type="number" defaultValue="15" className="w-24" />
                            <span className="ml-2">%</span>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="referral-link">{t('affiliateReferralLink')}</Label>
                        <Input id="referral-link" defaultValue="https://mystore.aoun.com/home?ref=" readOnly />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>{t('saveChangesButton')}</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
