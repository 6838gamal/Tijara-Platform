
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const offers = [
    { title: "خصم 20% على الإلكترونيات", type: "Percentage", status: "Active" },
    { title: "اشترِ واحدًا واحصل على الآخر مجانًا على القمصان", type: "BOGO", status: "Active" },
    { title: "شحن مجاني للطلبات فوق 200 دولار", type: "Free Shipping", status: "Expired" },
];

export default function OffersPage() {
  const { t } = useTranslation();
  
  const statusTranslation: { [key: string]: string } = {
    "Active": t('statusActive'),
    "Expired": t('offerStatusExpired'),
  };
  
  const statusVariant: { [key: string]: "default" | "secondary" } = {
    "Active": "default",
    "Expired": "secondary",
  };
  
  const typeTranslation: { [key: string]: string } = {
    "Percentage": t('offerTypePercentage'),
    "BOGO": t('offerTypeBogo'),
    "Free Shipping": t('offerTypeFreeShipping'),
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>{t('specialOffers')}</CardTitle>
            <CardDescription>{t('offersPageDesc')}</CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('offersNewOffer')}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('offerTitle')}</TableHead>
              <TableHead>{t('offerType')}</TableHead>
              <TableHead>{t('productStatus')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.title}>
                <TableCell className="font-medium">{offer.title}</TableCell>
                <TableCell>{typeTranslation[offer.type]}</TableCell>
                <TableCell>
                    <Badge variant={statusVariant[offer.status]}>{statusTranslation[offer.status]}</Badge>
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
