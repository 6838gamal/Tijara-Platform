
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Building } from "lucide-react";

export default function GovServicesPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('governmentServices')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Building className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">الربط مع الخدمات الحكومية قيد التطوير.</p>
            <p className="text-sm">ستتمكن هنا من ربط متجرك بالخدمات الحكومية مثل الضرائب والتراخيص التجارية.</p>
        </div>
      </CardContent>
    </Card>
  );
}
