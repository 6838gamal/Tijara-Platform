
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Newspaper } from "lucide-react";

export default function BlogPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('blog')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Newspaper className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">{t('blogDevTitle')}</p>
            <p className="text-sm">{t('blogDevDesc')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
