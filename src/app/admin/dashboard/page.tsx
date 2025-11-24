
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Sector } from "recharts"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Users, Store, DollarSign, Activity } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import React from "react";

const revenueChartData = [
  { month: "يناير", revenue: 18600 },
  { month: "فبراير", revenue: 30500 },
  { month: "مارس", revenue: 23700 },
  { month: "أبريل", revenue: 17300 },
  { month: "مايو", revenue: 20900 },
  { month: "يونيو", revenue: 21400 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;

const usersChartData = [
  { month: "يناير", newUsers: 50 },
  { month: "فبراير", newUsers: 75 },
  { month: "مارس", newUsers: 150 },
  { month: "أبريل", newUsers: 120 },
  { month: "مايو", newUsers: 180 },
  { month: "يونيو", newUsers: 210 },
]

const usersChartConfig = {
  newUsers: {
    label: "New Users",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig


const roleChartData = [
    { name: "Admins", value: 5, fill: "hsl(var(--chart-1))" },
    { name: "Merchants", value: 342, fill: "hsl(var(--chart-2))" },
    { name: "Customers", value: 1257, fill: "hsl(var(--chart-3))" },
]

const roleChartConfig = {
  value: {
    label: "Users",
  },
  Admins: {
    label: "Admins",
    color: "hsl(var(--chart-1))",
  },
  Merchants: {
    label: "Merchants",
    color: "hsl(var(--chart-2))",
  },
  Customers: {
    label: "Customers",
    color: "hsl(var(--chart-3))",
  },
} satisfies import("@/components/ui/chart").ChartConfig


const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} Users`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = React.useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('totalRevenue')}</CardTitle>
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">{t('totalRevenueDesc')}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('totalUsers')}</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+1602</div>
                    <p className="text-xs text-muted-foreground">{t('totalUsersDesc')}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('activeStores')}</CardTitle>
                    <Store className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+342</div>
                    <p className="text-xs text-muted-foreground">{t('activeStoresDesc')}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('platformHealth')}</CardTitle>
                    <Activity className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">99.8%</div>
                    <p className="text-xs text-muted-foreground">{t('platformHealthDesc')}</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>{t('revenueOverview')}</CardTitle>
                    <CardDescription>{t('revenueOverviewDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={revenueChartConfig} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={revenueChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`}/>
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>{t('userRoleDistribution')}</CardTitle>
                    <CardDescription>{t('userRoleDistributionDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={roleChartConfig} className="min-h-[300px] w-full">
                        <PieChart>
                             <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={roleChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                             />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
                <CardTitle>{t('userGrowth')}</CardTitle>
                <CardDescription>{t('userGrowthDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={usersChartConfig} className="min-h-[300px] w-full">
                <LineChart
                    accessibilityLayer
                    data={usersChartData}
                    margin={{
                    left: 12,
                    right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    />
                    <YAxis />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Line
                        dataKey="newUsers"
                        type="natural"
                        stroke="var(--color-newUsers)"
                        strokeWidth={2}
                        dot={true}
                    />
                </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}

    