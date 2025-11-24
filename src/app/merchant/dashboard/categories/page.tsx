
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, PlusCircle, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { addCategory, updateCategory, deleteCategory } from "@/firebase/firestore/categories";
import { useMerchantStore } from "@/hooks/use-merchant-store";

type Category = {
  id: string;
  name: string;
  description: string;
  productCount: number;
  parentId?: string;
};

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { storeId, loading: storeLoading, error: storeError, noStore } = useMerchantStore();

  const categoriesCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'categories');
  }, [firestore, storeId]);

  const { data: categories = [], loading: categoriesLoading, error: categoriesError } = useCollection<Category>(categoriesCollection);
  
  const loading = storeLoading || categoriesLoading;
  const error = storeError || categoriesError;

  const handleAdd = () => {
    setCurrentCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (categoryId: string) => {
    if (!firestore || !storeId) return;
    try {
        await deleteCategory(firestore, storeId, categoryId);
        toast({ title: t('toastCategoryDeletedSuccess') });
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
        description: "يجب عليك إنشاء متجر أولاً قبل إضافة فئة.",
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const parentId = formData.get('parentId') as string;
    
    const categoryData: {
        name: string;
        description: string;
        parentId?: string;
    } = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
    };

    if (parentId && parentId !== 'none') {
        categoryData.parentId = parentId;
    }

    if (!categoryData.name) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: t('toastInvalidCategoryName') });
        return;
    }

    try {
        if (currentCategory) {
          await updateCategory(firestore, storeId, currentCategory.id, categoryData);
          toast({ title: t('toastCategoryUpdatedSuccess') });
        } else {
          await addCategory(firestore, storeId, { ...categoryData, productCount: 0 });
          toast({ title: t('toastCategoryAddedSuccess') });
        }
        setIsFormOpen(false);
        setCurrentCategory(null);
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };

  const getCategoryName = (categoryId?: string) => {
      if (!categoryId) return t('noParentCategory');
      return categories.find(c => c.id === categoryId)?.name || 'N/A';
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const mainCategories = categories.filter(c => !c.parentId);

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
    if (filteredCategories.length === 0) {
      return <TableRow><TableCell colSpan={5} className="text-center">لا توجد فئات حاليًا.</TableCell></TableRow>;
    }
    return filteredCategories.map((category) => (
        <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground">{category.description}</TableCell>
            <TableCell>{getCategoryName(category.parentId)}</TableCell>
            <TableCell>{category.productCount || 0}</TableCell>
            <TableCell className="text-right rtl:text-left">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{t('actionsMenu')}</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(category)}>{t('actionEdit')}</DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">{t('actionDelete')}</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('deleteCategoryConfirmDescription')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-destructive hover:bg-destructive/90">{t('confirmDeleteButton')}</AlertDialogAction>
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
          <CardTitle>{t('categories')}</CardTitle>
          <CardDescription>{t('categoriesPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input 
                placeholder={t('searchCategoriesPlaceholder')}
                className="pl-9 rtl:pr-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd} disabled={noStore || loading}>
              <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t('addCategoryButton')}
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('categoryName')}</TableHead>
                  <TableHead>{t('categoryDescription')}</TableHead>
                  <TableHead>{t('categoryParent')}</TableHead>
                  <TableHead>{t('categoryProductCount')}</TableHead>
                  <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm" disabled={!categories || categories.length === 0}>
                  {t('paginationPrevious')}
              </Button>
              <Button variant="outline" size="sm" disabled={!categories || categories.length === 0}>
                  {t('paginationNext')}
              </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentCategory ? t('editCategoryTitle') : t('addCategoryTitle')}</DialogTitle>
                  <DialogDescription>{currentCategory ? t('editCategoryDescription') : t('addCategoryDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">{t('categoryNameLabel')}</Label>
                      <Input id="name" name="name" defaultValue={currentCategory?.name} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="description">{t('categoryDescriptionLabel')}</Label>
                      <Textarea id="description" name="description" defaultValue={currentCategory?.description} placeholder={t('categoryDescriptionPlaceholder')} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="parentId">{t('categoryParentLabel')}</Label>
                    <Select name="parentId" defaultValue={currentCategory?.parentId || 'none'}>
                        <SelectTrigger id="parentId">
                            <SelectValue placeholder={t('categoryParentPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">{t('noParentCategory')}</SelectItem>
                            {mainCategories.filter(c => c.id !== currentCategory?.id).map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
