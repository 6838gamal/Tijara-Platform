
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle, MoreHorizontal, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { addCustomer, updateCustomer, deleteCustomer } from "@/firebase/firestore/customers";
import { useMerchantStore } from "@/hooks/use-merchant-store";


type Customer = {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: any;
  password?: string;
};

export default function CustomersPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { storeId, loading: storeLoading, error: storeError, noStore } = useMerchantStore();

  const customersCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'customers');
  }, [firestore, storeId]);

  const { data: customers = [], loading: dataLoading, error: customersError } = useCollection<Customer>(customersCollection);
  const loading = storeLoading || dataLoading;
  const error = storeError || customersError;


  const handleAdd = () => {
    setCurrentCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (customerId: string) => {
    if (!firestore || !storeId) return;
    try {
        await deleteCustomer(firestore, storeId, customerId);
        toast({ title: t('toastCustomerDeletedSuccess') });
    } catch (e: any) {
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
        description: "يجب عليك إنشاء متجر أولاً قبل إضافة عميل.",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const customerData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
    };

    if (!customerData.name || !customerData.email) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: t('toastInvalidCustomerFields') });
        return;
    }

    try {
        if (currentCustomer) {
          // Password cannot be updated from here for security reasons
          await updateCustomer(firestore, storeId, currentCustomer.id, customerData);
          toast({ title: t('toastCustomerUpdatedSuccess') });
        } else {
           if (!password) {
                toast({ title: "كلمة المرور مطلوبة لإنشاء عميل جديد", variant: "destructive" });
                return;
            }
          await addCustomer(firestore, storeId, {
              ...customerData,
              password,
          });
          toast({ title: t('toastCustomerAddedSuccess') });
        }
        setIsFormOpen(false);
        setCurrentCustomer(null);
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (noStore && !loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Alert variant="default" className="max-w-md text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-primary" />
          <AlertTitle className="font-bold text-lg mb-2">
            لا يوجد متجر مرتبط بهذا الحساب
          </AlertTitle>
          <AlertDescription className="mb-4">
            لإدارة العملاء، يجب عليك إنشاء متجر أولاً.
          </AlertDescription>
          <Button asChild>
            <Link href="/merchant/dashboard/my-store">إنشاء متجر</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  const renderTableBody = () => {
    if (loading) {
      return <TableRow><TableCell colSpan={7} className="text-center h-24">جار التحميل...</TableCell></TableRow>;
    }
    if (error) {
      return <TableRow><TableCell colSpan={7} className="text-center h-24 text-destructive">حدث خطأ أثناء جلب البيانات. ({error.message})</TableCell></TableRow>;
    }
    if (filteredCustomers.length === 0) {
      return <TableRow><TableCell colSpan={7} className="text-center h-24">لا يوجد عملاء حاليًا.</TableCell></TableRow>;
    }
    return filteredCustomers.map((customer) => (
      <TableRow key={customer.id}>
        <TableCell className="font-medium">{customer.name}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell className="font-mono">********</TableCell>
        <TableCell>{customer.totalOrders}</TableCell>
        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
        <TableCell>{customer.joinedDate?.toDate ? customer.joinedDate.toDate().toLocaleDateString() : '...'}</TableCell>
        <TableCell className="text-right rtl:text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t('actionsMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem onClick={() => handleEdit(customer)}>{t('actionEdit')}</DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">{t('actionDelete')}</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteCustomerConfirmDescription')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(customer.id)} className="bg-destructive hover:bg-destructive/90">{t('confirmDeleteButton')}</AlertDialogAction>
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
          <CardTitle>{t('customers')}</CardTitle>
          <CardDescription>{t('customersPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input 
                placeholder={t('searchCustomersPlaceholder')}
                className="pl-9 rtl:pr-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button onClick={handleAdd} disabled>
              <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t('addCustomerButton')}
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('customerName')}</TableHead>
                  <TableHead>{t('customerEmail')}</TableHead>
                  <TableHead>{t('passwordLabel')}</TableHead>
                  <TableHead>{t('customerTotalOrders')}</TableHead>
                  <TableHead>{t('customerTotalSpent')}</TableHead>
                  <TableHead>{t('customerJoinedDate')}</TableHead>
                  <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled={loading || customers.length === 0}>
                  {t('paginationPrevious')}
              </Button>
              <Button variant="outline" size="sm" disabled={loading || customers.length === 0}>
                  {t('paginationNext')}
              </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentCustomer ? t('editCustomerTitle') : t('addCustomerTitle')}</DialogTitle>
                  <DialogDescription>{currentCustomer ? t('editCustomerDescription') : t('addCustomerDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">{t('customerNameLabel')}</Label>
                      <Input id="name" name="name" defaultValue={currentCustomer?.name} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email">{t('customerEmailLabel')}</Label>
                      <Input id="email" name="email" type="email" defaultValue={currentCustomer?.email} required readOnly={!!currentCustomer} />
                  </div>
                   {!currentCustomer && (
                    <div className="space-y-2">
                        <Label htmlFor="password">{t('passwordLabel')}</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                   )}
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

    
