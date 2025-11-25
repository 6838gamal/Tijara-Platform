
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Megaphone } from "lucide-react";

export default function MarketingToolsPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('marketingTools')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Megaphone className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">أدوات التسويق قيد التطوير.</p>
            <p className="text-sm">ستجد هنا أدوات لإدارة حملاتك التسويقية عبر البريد الإلكتروني ووسائل التواصل الاجتماعي.</p>
        </div>
      </CardContent>
    </Card>
  );
}
