
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const abandonedCarts = [
    { customer: "sara.k@example.com", date: "2023-10-27", value: 129.99, items: 2, status: "Not Sent" },
    { customer: "ahmed.m@example.com", date: "2023-10-26", value: 75.50, items: 1, status: "Sent" },
    { customer: "layla.h@example.com", date: "2023-10-25", value: 250.00, items: 3, status: "Recovered" },
    { customer: "omar.f@example.com", date: "2023-10-24", value: 45.00, items: 1, status: "Sent" },
];

export default function AbandonedCartsPage() {
  const { t } = useTranslation();

  const statusTranslation: { [key: string]: string } = {
      "Not Sent": t('cartStatusNotSent'),
      "Sent": t('cartStatusSent'),
      "Recovered": t('cartStatusRecovered'),
  };

  const statusVariant: { [key: string]: "secondary" | "outline" | "default" } = {
      "Not Sent": "secondary",
      "Sent": "outline",
      "Recovered": "default",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('abandonedCarts')}</CardTitle>
        <CardDescription>{t('abandonedCartsPageDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('customer')}</TableHead>
              <TableHead>{t('cartDate')}</TableHead>
              <TableHead className="text-right">{t('cartValue')}</TableHead>
              <TableHead className="text-center">{t('cartItems')}</TableHead>
              <TableHead>{t('cartRecoveryStatus')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abandonedCarts.map((cart, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{cart.customer}</TableCell>
                <TableCell>{cart.date}</TableCell>
                <TableCell className="text-right">${cart.value.toFixed(2)}</TableCell>
                <TableCell className="text-center">{cart.items}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[cart.status]}>{statusTranslation[cart.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {cart.status === "Not Sent" && <Button variant="outline" size="sm">{t('cartSendReminder')}</Button>}
                  {cart.status !== "Not Sent" && <Button variant="ghost" size="sm" disabled>{t('actionViewDetails')}</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
