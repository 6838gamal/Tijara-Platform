
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const services = [
    { nameKey: "govTaxAuthority", descKey: "govTaxAuthorityDesc", link: "#" },
    { nameKey: "govBusinessRegistration", descKey: "govBusinessRegistrationDesc", link: "#" },
    { nameKey: "govImportExport", descKey: "govImportExportDesc", link: "#" },
];

export default function GovServicesPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('governmentServices')}</h1>
            <p className="text-muted-foreground">{t('govServicesPageDesc')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
                <Card key={service.nameKey} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-primary" />
                            {t(service.nameKey)}
                        </CardTitle>
                        <CardDescription>{t(service.descKey)}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                        <Button asChild variant="outline" className="w-full">
                            <Link href={service.link} target="_blank">
                                {t('govVisitWebsite')}
                                <ExternalLink className="mr-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
