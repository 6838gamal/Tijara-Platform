
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Download } from "lucide-react";

export default function InstalledAppsPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('installedApps')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Download className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">عرض وإدارة التطبيقات المثبتة قيد التطوير.</p>
            <p className="text-sm">ستتمكن هنا من رؤية جميع التطبيقات التي قمت بتثبيتها على متجرك وإدارة إعداداتها.</p>
        </div>
      </CardContent>
    </Card>
  );
}
