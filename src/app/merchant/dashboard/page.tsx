
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DollarSign, ShoppingCart, Users, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const chartData = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 173 },
  { month: "May", sales: 209 },
  { month: "June", sales: 214 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

const topProducts = [
    { id: "prod_004", name: "Smartwatch SE", sales: 25, revenue: 6975.00 },
    { id: "prod_002", name: "Wireless Headphones", sales: 40, revenue: 5999.60 },
    { id: "prod_001", name: "Modern Desk Lamp", sales: 50, revenue: 3999.50 },
]

export default function MerchantDashboardPage() {
  const { t } = useTranslation();

  const stats = [
    { title: t('reportsTotalSales'), value: "$25,231.89", icon: <DollarSign className="h-5 w-5 text-muted-foreground" />, description: t('reportsTotalSalesDesc') },
    { title: t('reportsAverageOrderValue'), value: "$128.50", icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />, description: t('reportsAverageOrderValueDesc')},
    { title: t('reportsTotalOrders'), value: "1,257", icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />, description: t('reportsTotalOrdersDesc')},
    { title: t('reportsNewCustomers'), value: "89", icon: <Users className="h-5 w-5 text-muted-foreground" />, description: t('reportsNewCustomersDesc')},
  ];

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
            <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
            </Card>
            ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t('reportsSalesOverview')}</CardTitle>
                    <CardDescription>{t('reportsSalesOverviewDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t('reportsTopSellingProducts')}</CardTitle>
                    <CardDescription>{t('reportsTopSellingProductsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('productName')}</TableHead>
                                <TableHead className="text-right">{t('reportsSalesCount')}</TableHead>
                                <TableHead className="text-right">{t('reportsRevenue')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="text-right">{product.sales}</TableCell>
                                <TableCell className="text-right">${product.revenue.toFixed(2)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
