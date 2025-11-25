
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { File } from "lucide-react";

export default function PagesPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('informationalPages')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <File className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">{t('pagesDevTitle')}</p>
            <p className="text-sm">{t('pagesDevDesc')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
