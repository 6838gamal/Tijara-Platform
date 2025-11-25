
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Mail, BarChart2, MoreVertical, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const installedApps = [
    { titleKey: "appMailCampaigns", icon: Mail, active: true },
    { titleKey: "appAdvancedAnalytics", icon: BarChart2, active: false },
];

export default function InstalledAppsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('installedApps')}</h1>
            <p className="text-muted-foreground">{t('installedAppsPageDesc')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {installedApps.map(app => (
                <Card key={app.titleKey}>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <app.icon className="h-8 w-8 text-primary" />
                                <h3 className="font-semibold">{t(app.titleKey)}</h3>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        {t('settingsButton')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {t('appUninstallButton')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('status')}</span>
                        <Switch defaultChecked={app.active} />
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
