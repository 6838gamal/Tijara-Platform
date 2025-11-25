
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { LayoutGrid } from "lucide-react";

export default function MarketplacePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('marketplace')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <LayoutGrid className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">{t('marketplaceDevTitle')}</p>
            <p className="text-sm">{t('marketplaceDevDesc')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
