
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Gift } from "lucide-react";

export default function OffersPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('specialOffers')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Gift className="h-16 w-16 mb-4" />
            <p>إدارة العروض الخاصة قيد التطوير.</p>
        </div>
      </CardContent>
    </Card>
  );
}
