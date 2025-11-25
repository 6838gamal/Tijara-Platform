
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Gem, Settings, Gift, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LoyaltyPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('loyaltyProgram')}</h1>
            <p className="text-muted-foreground">{t('loyaltyPageDesc')}</p>
        </div>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('loyaltyProgramStatus')}</CardTitle>
                <Switch defaultChecked={true} />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{t('loyaltyProgramStatusDesc')}</p>
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CircleDollarSign className="h-5 w-5"/>{t('loyaltyEarningPoints')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t('loyaltyPointsPerAmount')}</Label>
                        <div className="flex items-center gap-2">
                            <span>{t('loyaltyEarn')}</span>
                            <Input type="number" defaultValue="1" className="w-16 text-center" />
                            <span>{t('loyaltyPointForEvery')}</span>
                            <Input type="number" defaultValue="1" className="w-16 text-center" />
                            <span>$</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5"/>{t('loyaltyRedeemingPoints')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t('loyaltyRedemptionRate')}</Label>
                        <div className="flex items-center gap-2">
                            <Input type="number" defaultValue="100" className="w-16 text-center" />
                            <span>{t('loyaltyPointsEquals')}</span>
                            <Input type="number" defaultValue="1" className="w-16 text-center" />
                            <span>$</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="flex justify-end">
            <Button>{t('saveChangesButton')}</Button>
        </div>
    </div>
  );
}
