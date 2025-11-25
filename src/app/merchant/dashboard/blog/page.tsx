
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const posts = [
    { title: "10 نصائح لتحسين متجرك الإلكتروني", author: "فريق عون", date: "2023-10-20", status: "Published" },
    { title: "كيف تستخدم وسائل التواصل الاجتماعي لزيادة المبيعات", author: "فريق عون", date: "2023-10-15", status: "Published" },
    { title: "دليل المبتدئين للتجارة الإلكترونية", author: "فريق عون", date: "2023-10-10", status: "Draft" },
];

export default function BlogPage() {
  const { t } = useTranslation();
  
  const statusTranslation: { [key: string]: string } = {
    "Published": t('statusPublished'),
    "Draft": t('statusDraft'),
  };
  
  const statusVariant: { [key: string]: "default" | "secondary" } = {
    "Published": "default",
    "Draft": "secondary",
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>{t('blog')}</CardTitle>
            <CardDescription>{t('blogPageDesc')}</CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('blogNewPost')}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('blogPostTitle')}</TableHead>
              <TableHead>{t('blogPostAuthor')}</TableHead>
              <TableHead>{t('blogPostDate')}</TableHead>
              <TableHead>{t('productStatus')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.title}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                    <Badge variant={statusVariant[post.status]}>{statusTranslation[post.status]}</Badge>
                </TableCell>
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
