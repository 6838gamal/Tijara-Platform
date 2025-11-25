
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { AppWindow } from "lucide-react";

export default function AppStorePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('visitAppStore')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <AppWindow className="h-16 w-16 mb-4" />
            <p>متجر التطبيقات قيد التطوير.</p>
        </div>
      </CardContent>
    </Card>
  );
}
