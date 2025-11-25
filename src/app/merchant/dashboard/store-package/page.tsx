
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "الأساسية",
    price: "29",
    features: [
      "50 منتج",
      "تحليلات أساسية",
      "دعم عبر البريد الإلكتروني"
    ],
    isCurrent: false,
  },
  {
    name: "المميزة",
    price: "79",
    features: [
      "منتجات غير محدودة",
      "تحليلات متقدمة",
      "دعم ذكي بالذكاء الاصطناعي",
      "أدوات تسويق متكاملة"
    ],
    isCurrent: true,
  },
  {
    name: "الأعمال",
    price: "199",
    features: [
      "كل ميزات الباقة المميزة",
      "مدير حساب مخصص",
      "واجهة برمجة تطبيقات (API)",
      "دعم فوري على مدار الساعة"
    ],
    isCurrent: false,
  }
];

export default function StorePackagePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('storePackage')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
          اختر الخطة التي تناسب حجم أعمالك. يمكنك الترقية أو التخفيض في أي وقت.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <Card key={plan.name} className={cn("flex flex-col", plan.isCurrent && "border-primary ring-2 ring-primary")}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-4xl font-extrabold text-primary">${plan.price}<span className="text-sm font-normal text-muted-foreground">/شهريًا</span></CardDescription>
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
                {plan.isCurrent ? "باقتك الحالية" : "الترقية لهذه الباقة"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
