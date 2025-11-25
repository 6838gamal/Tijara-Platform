
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { FileText } from "lucide-react";

export default function ContentPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('content')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <FileText className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">{t('contentDevTitle')}</p>
            <p className="text-sm">{t('contentDevDesc')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
