
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
import { useFirestore, useCollection } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addCoupon, updateCoupon, deleteCoupon } from "@/firebase/firestore/coupons";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase/auth/use-user";

type Coupon = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  status: "Active" | "Inactive" | "Expired";
  expiryDate: string;
  createdAt: any;
};

const statusVariant: { [key in Coupon["status"]]: "default" | "secondary" | "destructive" } = {
  Active: "default",
  Inactive: "secondary",
  Expired: "destructive",
};

const statusTranslation: { [key in Coupon["status"]]: string } = {
    Active: 'نشط',
    Inactive: 'غير نشط',
    Expired: 'منتهي الصلاحية',
};

const typeTranslation: { [key in Coupon["type"]]: string } = {
    percentage: 'نسبة مئوية',
    fixed: 'مبلغ ثابت',
};


export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { user: authUser, loading: authLoading } = useUser();

  const couponsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'coupons');
  }, [firestore]);

  const { data: coupons = [], loading: dataLoading, error } = useCollection<Coupon>(couponsCollection);

  const loading = authLoading || dataLoading;

  const handleAdd = () => {
    setCurrentCoupon(null);
    setIsFormOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setCurrentCoupon(coupon);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (couponId: string) => {
    if (!firestore) return;
    try {
        await deleteCoupon(firestore, couponId);
        toast({ title: "تم حذف الكوبون بنجاح" });
    } catch (error) {
        // Error is handled by emitter
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const couponData = {
        code: formData.get('code') as string,
        type: formData.get('type') as Coupon['type'],
        value: parseFloat(formData.get('value') as string),
        status: formData.get('status') as Coupon['status'],
        expiryDate: formData.get('expiryDate') as string,
    }

    if (!couponData.code || !couponData.type || !couponData.value || !couponData.expiryDate) {
        toast({ variant: 'destructive', title: 'خطأ', description: 'يرجى ملء جميع الحقول المطلوبة.' });
        return;
    }

    try {
        if (currentCoupon) {
            // Edit coupon
            await updateCoupon(firestore, currentCoupon.id, couponData);
            toast({ title: "تم تعديل الكوبون بنجاح" });
        } else {
            // Add new coupon
            await addCoupon(firestore, couponData);
            toast({ title: "تمت إضافة الكوبون بنجاح" });
        }
        setIsFormOpen(false);
        setCurrentCoupon(null);
    } catch(err) {
      // Errors are now handled by the FirestorePermissionError emitter
    }
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة الكوبونات والخصومات</CardTitle>
          <CardDescription>
            إنشاء وإدارة كوبونات الخصم للمتاجر والمنتجات.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن كوبون بالكود..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة كوبون
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الكود</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>القيمة</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center">جار التحميل...</TableCell></TableRow>
                ) : error ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-destructive">حدث خطأ في جلب الكوبونات. تحقق من قواعد الأمان.</TableCell></TableRow>
                ) : filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                        <TableCell>{typeTranslation[coupon.type]}</TableCell>
                        <TableCell>
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                        </TableCell>
                        <TableCell>{coupon.expiryDate}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[coupon.status] || "default"}>
                            {statusTranslation[coupon.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">قائمة الإجراءات</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(coupon)}>تعديل</DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">حذف</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الكوبون نهائيًا.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(coupon.id)} className="bg-destructive hover:bg-destructive/90">
                                            تأكيد الحذف
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">لا توجد كوبونات حاليًا.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentCoupon ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}</DialogTitle>
                  <DialogDescription>
                    أدخل تفاصيل الكوبون هنا. انقر على "حفظ" عند الانتهاء.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="code">كود الكوبون</Label>
                      <Input id="code" name="code" defaultValue={currentCoupon?.code} className="font-mono" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">نوع الخصم</Label>
                        <Select name="type" defaultValue={currentCoupon?.type || "percentage"}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">نسبة مئوية</SelectItem>
                                <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="value">قيمة الخصم</Label>
                        <Input id="value" name="value" type="number" step="0.01" defaultValue={currentCoupon?.value} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                        <Input id="expiryDate" name="expiryDate" type="date" defaultValue={currentCoupon?.expiryDate} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">الحالة</Label>
                        <Select name="status" defaultValue={currentCoupon?.status || 'Active'}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="اختر الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">نشط</SelectItem>
                                <SelectItem value="Inactive">غير نشط</SelectItem>
                                <SelectItem value="Expired">منتهي الصلاحية</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">إلغاء</Button>
                  </DialogClose>
                  <Button type="submit">حفظ</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
