
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { addMerchantCoupon, updateMerchantCoupon, deleteMerchantCoupon } from "@/firebase/firestore/merchantCoupons";
import { useMerchantStore } from "@/hooks/use-merchant-store";


type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  expiryDate: string;
};

export default function CouponsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { storeId, loading: storeLoading, error: storeError, noStore } = useMerchantStore();

  const couponsCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'coupons');
  }, [firestore, storeId]);

  const { data: coupons = [], loading: dataLoading, error: couponsError } = useCollection<Coupon>(couponsCollection);
  const loading = storeLoading || dataLoading;
  const error = storeError || couponsError;

  const typeTranslation: { [key in Coupon["type"]]: string } = {
      percentage: t('couponTypePercentage'),
      fixed: t('couponTypeFixed'),
  };


  const handleAdd = () => {
    setCurrentCoupon(null);
    setIsFormOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setCurrentCoupon(coupon);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (couponId: string) => {
    if (!firestore || !storeId) return;
    try {
        await deleteMerchantCoupon(firestore, storeId, couponId);
        toast({ title: t('toastCouponDeletedSuccess') });
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !storeId) {
      toast({
        variant: "destructive",
        title: "لا يوجد متجر",
        description: "يجب عليك إنشاء متجر أولاً قبل إضافة كوبون.",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const couponData = {
        code: formData.get('code') as string,
        type: formData.get('type') as Coupon['type'],
        value: parseFloat(formData.get('value') as string),
        expiryDate: formData.get('expiryDate') as string,
    }

    if (!couponData.code || !couponData.type || !couponData.value || !couponData.expiryDate) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: t('toastInvalidFields') });
        return;
    }

    try {
        if (currentCoupon) {
          await updateMerchantCoupon(firestore, storeId, currentCoupon.id, couponData);
          toast({ title: t('toastCouponUpdatedSuccess') });
        } else {
          await addMerchantCoupon(firestore, storeId, couponData);
          toast({ title: t('toastCouponAddedSuccess') });
        }
        setIsFormOpen(false);
        setCurrentCoupon(null);
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTableBody = () => {
    if (loading) {
      return <TableRow><TableCell colSpan={5} className="text-center">جار التحميل...</TableCell></TableRow>;
    }
    if (error) {
      return <TableRow><TableCell colSpan={5} className="text-center text-destructive">حدث خطأ أثناء جلب البيانات. ({error.message})</TableCell></TableRow>;
    }
    if (noStore) {
      return <TableRow><TableCell colSpan={5} className="text-center">لم يتم العثور على متجر لهذا الحساب. يرجى إنشاء متجر أولاً من صفحة "متجري".</TableCell></TableRow>;
    }
    if (filteredCoupons.length === 0) {
      return <TableRow><TableCell colSpan={5} className="text-center">لا توجد كوبونات حاليًا.</TableCell></TableRow>;
    }
    return filteredCoupons.map((coupon) => (
      <TableRow key={coupon.id}>
        <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
        <TableCell>{typeTranslation[coupon.type]}</TableCell>
        <TableCell>
          {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
        </TableCell>
        <TableCell>{coupon.expiryDate}</TableCell>
        <TableCell className="text-right rtl:text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t('actionsMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(coupon)}>{t('actionEdit')}</DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">{t('actionDelete')}</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteCouponConfirmDescription')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(coupon.id)} className="bg-destructive hover:bg-destructive/90">{t('confirmDeleteButton')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
          <CardTitle>{t('coupons')}</CardTitle>
          <CardDescription>{t('couponsPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input 
                placeholder={t('searchCouponsPlaceholder')} 
                className="pl-9 rtl:pr-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={noStore || loading}
              />
            </div>
            <Button onClick={handleAdd} disabled={noStore || loading}>
              <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t('addCouponButton')}
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('couponCode')}</TableHead>
                  <TableHead>{t('couponType')}</TableHead>
                  <TableHead>{t('couponValue')}</TableHead>
                  <TableHead>{t('couponExpiryDate')}</TableHead>
                  <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
           <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled={noStore || loading || coupons.length === 0}>
                  {t('paginationPrevious')}
              </Button>
              <Button variant="outline" size="sm" disabled={noStore || loading || coupons.length === 0}>
                  {t('paginationNext')}
              </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentCoupon ? t('editCouponTitle') : t('addCouponTitle')}</DialogTitle>
                  <DialogDescription>{t('addCouponDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="code">{t('couponCodeLabel')}</Label>
                      <Input id="code" name="code" defaultValue={currentCoupon?.code} className="font-mono" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">{t('couponTypeLabel')}</Label>
                        <Select name="type" defaultValue={currentCoupon?.type || "percentage"}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder={t('couponTypePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">{t('couponTypePercentage')}</SelectItem>
                                <SelectItem value="fixed">{t('couponTypeFixed')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="value">{t('couponValueLabel')}</Label>
                        <Input id="value" name="value" type="number" step="0.01" defaultValue={currentCoupon?.value} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="expiryDate">{t('couponExpiryDateLabel')}</Label>
                      <Input id="expiryDate" name="expiryDate" type="date" defaultValue={currentCoupon?.expiryDate} required />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">{t('cancelButton')}</Button>
                  </DialogClose>
                  <Button type="submit">{t('saveChangesButton')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
