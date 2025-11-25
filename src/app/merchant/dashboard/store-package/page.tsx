
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

export default function StorePackagePage() {
  const { t } = useTranslation();

  const plans = [
    {
      nameKey: "basicPlan",
      price: "29",
      features: [
        t('planFeature50Products'),
        t('planFeatureBasicAnalytics'),
        t('planFeatureEmailSupport')
      ],
      isCurrent: false,
    },
    {
      nameKey: "premiumPlan",
      price: "79",
      features: [
        t('planFeatureUnlimitedProducts'),
        t('planFeatureAdvancedAnalytics'),
        t('planFeatureAiSupport'),
        t('planFeatureMarketingTools')
      ],
      isCurrent: true,
    },
    {
      nameKey: "businessPlan",
      price: "199",
      features: [
        t('planFeatureAllPremium'),
        t('planFeatureDedicatedManager'),
        t('planFeatureApiAccess'),
        t('planFeature247Support')
      ],
      isCurrent: false,
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('storePackage')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          {t('storePackageDesc')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <Card key={plan.nameKey} className={cn("flex flex-col", plan.isCurrent && "border-primary ring-2 ring-primary")}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{t(plan.nameKey)}</CardTitle>
              <CardDescription className="text-4xl font-extrabold text-primary">${plan.price}<span className="text-sm font-normal text-muted-foreground">/{t('monthly')}</span></CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={plan.isCurrent}>
                {plan.isCurrent ? t('currentPlan') : t('upgradeToPlan')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
