
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Wallet } from "lucide-react";

export default function WalletPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('walletAndSavings')}</CardTitle>
        <CardDescription>{t('contentComingSoon')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
            <Wallet className="h-16 w-16 mb-4" />
            <p>إدارة المحفظة والتوفير قيد التطوير.</p>
        </div>
      </CardContent>
    </Card>
  );
}
