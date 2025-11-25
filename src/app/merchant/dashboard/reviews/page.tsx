
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { MessageSquareQuote } from "lucide-react";

export default function ReviewsPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('questionsAndReviews')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <MessageSquareQuote className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg">{t('reviewsDevTitle')}</p>
            <p className="text-sm">{t('reviewsDevDesc')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
