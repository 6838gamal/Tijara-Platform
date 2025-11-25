
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const pages = [
    { title: "من نحن", path: "/about-us", lastUpdated: "2023-10-01" },
    { title: "سياسة الخصوصية", path: "/privacy-policy", lastUpdated: "2023-09-15" },
    { title: "شروط الخدمة", path: "/terms-of-service", lastUpdated: "2023-09-15" },
    { title: "اتصل بنا", path: "/contact", lastUpdated: "2023-09-01" },
];

export default function PagesPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>{t('informationalPages')}</CardTitle>
            <CardDescription>{t('pagesPageDesc')}</CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('pagesNewPage')}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('pagesPageTitle')}</TableHead>
              <TableHead>{t('pagesPath')}</TableHead>
              <TableHead>{t('pagesLastUpdated')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.title}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{page.path}</TableCell>
                <TableCell>{page.lastUpdated}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('actionsMenu')}</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t('actionEdit')}</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">{t('actionDelete')}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
