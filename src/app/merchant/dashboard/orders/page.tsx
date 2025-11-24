
"use client";

import React, { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MoreHorizontal } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { type Order, type OrderStatus, updateOrderStatus } from "@/firebase/firestore/orders";
import { useToast } from "@/hooks/use-toast";
import { useMerchantStore } from "@/hooks/use-merchant-store";


export default function OrdersPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<{ search: string; status: OrderStatus | "all" }>({ search: "", status: "all" });
  const { toast } = useToast();

  const firestore = useFirestore();
  const { storeId, loading: storeLoading, error: storeError, noStore } = useMerchantStore();

  const ordersCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'orders');
  }, [firestore, storeId]);

  const { data: orders = [], loading: dataLoading, error: ordersError } = useCollection<Order>(ordersCollection);
  const loading = storeLoading || dataLoading;
  const error = storeError || ordersError;

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

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    if (!firestore || !storeId) return;
    try {
        await updateOrderStatus(firestore, storeId, orderId, newStatus);
        toast({ title: "تم تحديث حالة الطلب" });
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchMatch = (order.id ? order.id.toLowerCase().includes(filter.search.toLowerCase()) : false) || order.customerName.toLowerCase().includes(filter.search.toLowerCase());
    const statusMatch = filter.status === "all" || order.status === filter.status;
    return searchMatch && statusMatch;
  });

  const renderTableBody = () => {
    if (loading) {
      return <TableRow><TableCell colSpan={6} className="text-center">جار التحميل...</TableCell></TableRow>;
    }
    if (error) {
      return <TableRow><TableCell colSpan={6} className="text-center text-destructive">حدث خطأ أثناء جلب البيانات. ({error.message})</TableCell></TableRow>;
    }
    if (noStore) {
      return <TableRow><TableCell colSpan={6} className="text-center">لم يتم العثور على متجر لهذا الحساب. يرجى إنشاء متجر أولاً من صفحة "متجري".</TableCell></TableRow>;
    }
    if (filteredOrders.length === 0) {
      return <TableRow><TableCell colSpan={6} className="text-center">لا توجد طلبات حاليًا.</TableCell></TableRow>;
    }
    return filteredOrders.map((order) => (
      <TableRow key={order.id}>
          <TableCell className="font-mono font-medium">{order.id}</TableCell>
          <TableCell>{order.customerName}</TableCell>
          <TableCell>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : '...'}</TableCell>
          <TableCell>${order.total.toFixed(2)}</TableCell>
          <TableCell>
          <Badge variant={statusVariant[order.status]}>
              {statusTranslation[order.status]}
          </Badge>
          </TableCell>
          <TableCell className="text-right rtl:text-left">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">{t('actionsMenu')}</span>
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
              <DropdownMenuItem>{t('actionViewDetails')}</DropdownMenuItem>
              <DropdownMenuSub>
                      <DropdownMenuSubTrigger>{t('actionUpdateStatus')}</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                              {(['Pending', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(status => (
                                  <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(order.id, status)}>
                                      {statusTranslation[status]}
                                  </DropdownMenuItem>
                              ))}
                          </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                  </DropdownMenuSub>
              </DropdownMenuContent>
          </DropdownMenu>
          </TableCell>
      </TableRow>
    ));
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('orders')}</CardTitle>
          <CardDescription>{t('ordersPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input
                placeholder={t('searchOrdersPlaceholder')}
                className="pl-9 rtl:pr-9"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({...prev, search: e.target.value}))}
                disabled={noStore || loading}
              />
            </div>
            <Select 
              value={filter.status}
              onValueChange={(value: OrderStatus | "all") => setFilter(prev => ({...prev, status: value}))}
              disabled={noStore || loading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('filterByStatusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="Pending">{t('statusPending')}</SelectItem>
                <SelectItem value="Shipped">{t('statusShipped')}</SelectItem>
                <SelectItem value="Delivered">{t('statusDelivered')}</SelectItem>
                <SelectItem value="Cancelled">{t('statusCancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('orderId')}</TableHead>
                  <TableHead>{t('orderCustomer')}</TableHead>
                  <TableHead>{t('orderDate')}</TableHead>
                  <TableHead>{t('orderTotal')}</TableHead>
                  <TableHead>{t('productStatus')}</TableHead>
                  <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
            <div className="flex items-center justify-end space-x-2 py-4 rtl:space-x-reverse mt-4">
              <Button variant="outline" size="sm" disabled={noStore || loading || orders.length === 0}>
                  {t('paginationPrevious')}
              </Button>
              <Button variant="outline" size="sm" disabled={noStore || loading || orders.length === 0}>
                  {t('paginationNext')}
              </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
