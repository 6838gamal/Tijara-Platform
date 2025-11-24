
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
import { Textarea } from "@/components/ui/textarea";
import { Search, PlusCircle, MoreHorizontal } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addPlan, updatePlan, deletePlan } from "@/firebase/firestore/plans";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase/auth/use-user";

type Plan = {
  id: string;
  name: string;
  price: number;
  features: string;
  status: "Active" | "Archived";
  createdAt: any;
};

const statusVariant: { [key in Plan["status"]]: "default" | "secondary" } = {
  Active: "default",
  Archived: "secondary",
};

const statusTranslation: { [key in Plan["status"]]: string } = {
    Active: 'نشطة',
    Archived: 'مؤرشفة',
};

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { user: authUser, loading: authLoading } = useUser();

  const plansCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'plans');
  }, [firestore]);

  const { data: plans = [], loading: dataLoading, error } = useCollection<Plan>(plansCollection);

  const loading = authLoading || dataLoading;

  const handleAdd = () => {
    setCurrentPlan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (planId: string) => {
    if (!firestore) return;
    try {
        await deletePlan(firestore, planId);
        toast({ title: "تم حذف الخطة بنجاح" });
    } catch (error) {
        // Error is handled by emitter
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const planData = {
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        features: formData.get('features') as string,
        status: formData.get('status') as Plan['status'],
    }

    try {
        if (currentPlan) {
            // Edit plan
            await updatePlan(firestore, currentPlan.id, planData);
            toast({ title: "تم تعديل الخطة بنجاح" });
        } else {
            // Add new plan
            await addPlan(firestore, { 
                ...planData, 
                createdAt: serverTimestamp() 
            });
            toast({ title: "تمت إضافة الخطة بنجاح" });
        }
        setIsFormOpen(false);
        setCurrentPlan(null);
    } catch(err) {
      // Errors are now handled by the FirestorePermissionError emitter
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة الخطط والاشتراكات</CardTitle>
          <CardDescription>
            عرض وإدارة خطط الاشتراك المتاحة للمتاجر.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن خطة..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة خطة جديدة
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الخطة</TableHead>
                  <TableHead>السعر (شهريًا)</TableHead>
                  <TableHead className="w-[40%]">الميزات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>
                    <span className="sr-only">الإجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center">جار التحميل...</TableCell></TableRow>
                ) : error ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-destructive">حدث خطأ في جلب الخطط. تحقق من قواعد الأمان.</TableCell></TableRow>
                ) : filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>${plan.price.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{plan.features}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[plan.status] || "default"}>
                          {statusTranslation[plan.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{plan.createdAt?.toDate ? plan.createdAt.toDate().toLocaleDateString() : '...'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">قائمة الإجراءات</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(plan)}>تعديل</DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">حذف</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الخطة نهائيًا.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(plan.id)} className="bg-destructive hover:bg-destructive/90">
                                          حذف
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
                      <TableCell colSpan={6} className="text-center">لا توجد خطط حاليًا.</TableCell>
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
                  <DialogTitle>{currentPlan ? 'تعديل الخطة' : 'إضافة خطة جديدة'}</DialogTitle>
                  <DialogDescription>
                    {currentPlan ? 'قم بتحديث بيانات الخطة هنا.' : 'أدخل بيانات الخطة الجديدة هنا.'}
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">اسم الخطة</Label>
                      <Input id="name" name="name" defaultValue={currentPlan?.name} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="price">السعر (بالدولار شهريًا)</Label>
                      <Input id="price" name="price" type="number" step="0.01" defaultValue={currentPlan?.price} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="features">الميزات (افصل بينها بفاصلة)</Label>
                      <Textarea id="features" name="features" defaultValue={currentPlan?.features} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                       <Select name="status" defaultValue={currentPlan?.status || 'Active'}>
                          <SelectTrigger>
                              <SelectValue placeholder="اختر حالة" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Active">نشطة</SelectItem>
                              <SelectItem value="Archived">مؤرشفة</SelectItem>
                          </SelectContent>
                      </Select>
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
