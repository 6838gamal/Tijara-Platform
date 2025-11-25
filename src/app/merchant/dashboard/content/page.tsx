
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { FileText, Type, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const contentTypes = [
    { titleKey: "pages", descKey: "pagesDesc", icon: FileText, href: "/merchant/dashboard/pages" },
    { titleKey: "blog", descKey: "blogDesc", icon: Type, href: "/merchant/dashboard/blog" },
    { titleKey: "storeDesign", descKey: "storeDesignDesc", icon: LayoutTemplate, href: "/merchant/dashboard/store-design" },
]

export default function ContentPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('content')}</h1>
            <p className="text-muted-foreground">{t('contentPageDesc')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contentTypes.map((item) => (
                <Card key={item.titleKey} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <item.icon className="h-6 w-6 text-primary" />
                            <span>{t(item.titleKey)}</span>
                        </CardTitle>
                        <CardDescription>{t(item.descKey)}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild className="w-full">
                            <Link href={item.href}>{t('contentManageButton')}</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
