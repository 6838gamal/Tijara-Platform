
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Palette } from "lucide-react";

export default function StoreDesignPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('storeDesign')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Palette className="h-16 w-16 mb-4" />
            <p>أدوات تصميم المتجر قيد التطوير.</p>
        </div>
      </CardContent>
    </Card>
  );
}
