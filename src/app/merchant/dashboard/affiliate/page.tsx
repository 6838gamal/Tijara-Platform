
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Share2 } from "lucide-react";

export default function AffiliatePage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('affiliateMarketing')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Share2 className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">نظام التسويق بالعمولة قيد التطوير.</p>
            <p className="text-sm">ستتمكن هنا من إنشاء وإدارة برنامج التسويق بالعمولة الخاص بمتجرك.</p>
        </div>
      </CardContent>
    </Card>
  );
}
