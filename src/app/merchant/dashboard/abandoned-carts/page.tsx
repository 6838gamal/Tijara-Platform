
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { History } from "lucide-react";

export default function AbandonedCartsPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('abandonedCarts')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <History className="h-16 w-16 mb-4" />
            <p>ميزة استعادة السلات المتروكة قيد التطوير.</p>
        </div>
      </CardContent>
    </Card>
  );
}
