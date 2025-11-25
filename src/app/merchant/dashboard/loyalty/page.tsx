
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Gem } from "lucide-react";

export default function LoyaltyPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('loyaltyProgram')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Gem className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">نظام ولاء العملاء قيد التطوير.</p>
            <p className="text-sm">ستتمكن هنا من إنشاء برنامج نقاط ومكافآت لعملائك الأوفياء.</p>
        </div>
      </CardContent>
    </Card>
  );
}
