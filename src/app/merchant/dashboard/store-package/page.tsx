
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { PackageCheck } from "lucide-react";

export default function StorePackagePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('storePackage')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <PackageCheck className="h-16 w-16 mb-4" />
            <p>إدارة باقة المتجر قيد التطوير.</p>
        </div>
      </CardContent>
    </Card>
  );
}
