
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

const tools = [
    { titleKey: "marketingEmail", descKey: "marketingEmailDesc", icon: Mail, ctaKey: "marketingCreateCampaign" },
    { titleKey: "marketingSms", descKey: "marketingSmsDesc", icon: MessageCircle, ctaKey: "marketingCreateCampaign" },
    { titleKey: "marketingAnalytics", descKey: "marketingAnalyticsDesc", icon: BarChart, ctaKey: "marketingViewReports" },
];

export default function MarketingToolsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('marketingTools')}</h1>
        <p className="text-muted-foreground">{t('marketingPageDesc')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.titleKey} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <tool.icon className="h-6 w-6 text-primary" />
                <span>{t(tool.titleKey)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{t(tool.descKey)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                {t(tool.ctaKey)}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
