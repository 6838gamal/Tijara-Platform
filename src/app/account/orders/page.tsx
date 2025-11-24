"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
};

const initialOrders: Order[] = [
  {
    id: "ORD001",
    date: "2023-10-26",
    total: 129.99,
    status: "Delivered",
  },
  {
    id: "ORD002",
    date: "2023-10-25",
    total: 89.50,
    status: "Shipped",
  },
  {
    id: "ORD003",
    date: "2023-10-25",
    total: 250.00,
    status: "Pending",
  },
  {
    id: "ORD004",
    date: "2023-10-24",
    total: 45.00,
    status: "Cancelled",
  },
];

export default function CustomerOrdersPage() {
  const { t } = useTranslation();

  const statusVariant: { [key in OrderStatus]: "default" | "secondary" | "outline" | "destructive" } = {
    Pending: "secondary",
    Shipped: "default",
    Delivered: "outline",
    Cancelled: "destructive",
  };

  const statusTranslation: { [key in OrderStatus]: string } = {
    Pending: t('statusPending'),
    Shipped: t('statusShipped'),
    Delivered: t('statusDelivered'),
    Cancelled: t('statusCancelled'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('myOrders')}</CardTitle>
        <CardDescription>{t('myOrdersDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('orderId')}</TableHead>
                <TableHead>{t('orderDate')}</TableHead>
                <TableHead>{t('productStatus')}</TableHead>
                <TableHead className="text-right rtl:text-left">{t('orderTotal')}</TableHead>
                <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status]}>
                      {statusTranslation[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right rtl:text-left">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right rtl:text-left">
                    <Button variant="outline" size="sm">{t('viewOrder')}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
