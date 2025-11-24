
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
import { Textarea } from "@/components/ui/textarea";
import { Search, PlusCircle, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { addBrand, updateBrand, deleteBrand } from "@/firebase/firestore/brands";
import { useMerchantStore } from "@/hooks/use-merchant-store";

type Brand = {
  id: string;
  name: string;
  description: string;
  productCount: number;
};

export default function BrandsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const { toast } = useToast();
  
  const firestore = useFirestore();
  const { storeId, loading: storeLoading, error: storeError, noStore } = useMerchantStore();

  const brandsCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'brands');
  }, [firestore, storeId]);

  const { data: brands = [], loading: brandsLoading, error: brandsError } = useCollection<Brand>(brandsCollection);
  
  const loading = storeLoading || brandsLoading;
  const error = storeError || brandsError;

  const handleAdd = () => {
    setCurrentBrand(null);
    setIsFormOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setCurrentBrand(brand);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (brandId: string) => {
    if (!firestore || !storeId) return;
    try {
        await deleteBrand(firestore, storeId, brandId);
        toast({ title: t('toastBrandDeletedSuccess') });
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
        description: "يجب عليك إنشاء متجر أولاً قبل إضافة علامة تجارية.",
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const brandData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
    };

    if (!brandData.name) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: t('toastInvalidBrandName') });
        return;
    }

    try {
        if (currentBrand) {
          await updateBrand(firestore, storeId, currentBrand.id, brandData);
          toast({ title: t('toastBrandUpdatedSuccess') });
        } else {
          await addBrand(firestore, storeId, { ...brandData, productCount: 0 });
          toast({ title: t('toastBrandAddedSuccess') });
        }
        setIsFormOpen(false);
        setCurrentBrand(null);
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const renderTableBody = () => {
    if (loading) {
      return <TableRow><TableCell colSpan={4} className="text-center">جار التحميل...</TableCell></TableRow>;
    }
    if (error) {
      return <TableRow><TableCell colSpan={4} className="text-center text-destructive">حدث خطأ أثناء جلب البيانات. ({error.message})</TableCell></TableRow>;
    }
    if (noStore) {
      return <TableRow><TableCell colSpan={4} className="text-center">لم يتم العثور على متجر لهذا الحساب. يرجى إنشاء متجر أولاً من صفحة "متجري".</TableCell></TableRow>;
    }
    if (filteredBrands.length === 0) {
      return <TableRow><TableCell colSpan={4} className="text-center">لا توجد علامات تجارية حاليًا.</TableCell></TableRow>;
    }
    return filteredBrands.map((brand) => (
      <TableRow key={brand.id}>
        <TableCell className="font-medium">{brand.name}</TableCell>
        <TableCell className="text-muted-foreground">{brand.description}</TableCell>
        <TableCell>{brand.productCount || 0}</TableCell>
        <TableCell className="text-right rtl:text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t('actionsMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(brand)}>{t('actionEdit')}</DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">{t('actionDelete')}</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteBrandConfirmDescription')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(brand.id)} className="bg-destructive hover:bg-destructive/90">{t('confirmDeleteButton')}</AlertDialogAction>
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
          <CardTitle>{t('brands')}</CardTitle>
          <CardDescription>{t('brandsPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input 
                placeholder={t('searchBrandsPlaceholder')}
                className="pl-9 rtl:pr-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} disabled={noStore || loading}>
              <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t('addBrandButton')}
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('brandName')}</TableHead>
                  <TableHead>{t('brandDescription')}</TableHead>
                  <TableHead>{t('brandProductCount')}</TableHead>
                  <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled={!brands || brands.length === 0}>
                  {t('paginationPrevious')}
              </Button>
              <Button variant="outline" size="sm" disabled={!brands || brands.length === 0}>
                  {t('paginationNext')}
              </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentBrand ? t('editBrandTitle') : t('addBrandTitle')}</DialogTitle>
                  <DialogDescription>{currentBrand ? t('editBrandDescription') : t('addBrandDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">{t('brandNameLabel')}</Label>
                      <Input id="name" name="name" defaultValue={currentBrand?.name} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="description">{t('brandDescriptionLabel')}</Label>
                      <Textarea id="description" name="description" defaultValue={currentBrand?.description} placeholder={t('brandDescriptionPlaceholder')} />
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

    
