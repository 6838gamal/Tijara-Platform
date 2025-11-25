
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { BarChart, Percent, Eye } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis
} from "@/components/ui/chart";

const chartData = [
  { month: "يناير", views: 1860 },
  { month: "فبراير", views: 3050 },
  { month: "مارس", views: 2370 },
  { month: "أبريل", views: 1730 },
  { month: "مايو", views: 2090 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
};

export default function MarketplacePage() {
  const { t } = useTranslation();

  const stats = [
      { titleKey: "marketplaceImpressions", value: "85,430", icon: Eye },
      { titleKey: "marketplaceConversionRate", value: "2.5%", icon: Percent },
  ];

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('marketplace')}</h1>
            <p className="text-muted-foreground">{t('marketplacePageDesc')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {stats.map(stat => (
                <Card key={stat.titleKey}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t(stat.titleKey)}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{t('marketplacePerformance')}</CardTitle>
                <CardDescription>{t('marketplacePerformanceDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <RechartsBarChart data={chartData}>
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
