
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
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
import { addStore, updateStore, deleteStore } from "@/firebase/firestore/stores";
import { uploadImage } from "@/firebase/storage";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase/auth/use-user";

type Store = {
  id: string;
  name: string;
  ownerId: string;
  status: "Active" | "Inactive" | "Suspended";
  plan: "Basic" | "Premium" | "Enterprise";
  createdAt: any;
  image: string;
};

const statusVariant: { [key in Store["status"]]: "default" | "secondary" | "destructive" } = {
  Active: "default",
  Inactive: "secondary",
  Suspended: "destructive",
};

const statusTranslation: { [key in Store["status"]]: string } = {
    Active: 'نشط',
    Inactive: 'غير نشط',
    Suspended: 'موقوف',
};

const planTranslation: { [key in Store["plan"]]: string } = {
    Basic: 'أساسية',
    Premium: 'مميزة',
    Enterprise: 'أعمال',
};


export default function StoreManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { user: authUser, loading: authLoading } = useUser();

  const storesCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'stores');
  }, [firestore]);

  const { data: stores = [], loading: dataLoading, error } = useCollection<Store>(storesCollection);

  const loading = authLoading || dataLoading;

  const handleAdd = () => {
    setCurrentStore(null);
    setPreviewImage(null);
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleEdit = (store: Store) => {
    setCurrentStore(store);
    setPreviewImage(store.image);
    setSelectedFile(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (storeId: string) => {
    if (!firestore) return;
    try {
      await deleteStore(firestore, storeId);
      toast({ title: "تم حذف المتجر بنجاح" });
    } catch (e) {
      // Error is now handled globally by the emitter
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !authUser?.email) return;
    
    setIsUploading(true);

    let imageUrl = currentStore?.image || "https://picsum.photos/seed/newstore/400/400";
    if (selectedFile) {
        const imagePath = `stores/${Date.now()}_${selectedFile.name}`;
        try {
            imageUrl = await uploadImage(selectedFile, imagePath);
        } catch (error) {
            console.error("Error uploading image:", error);
            toast({
                variant: "destructive",
                title: "فشل رفع الصورة",
                description: "حدث خطأ أثناء محاولة رفع صورة المتجر.",
            });
            setIsUploading(false);
            return;
        }
    }

    const formData = new FormData(e.currentTarget);
    const storeData = {
      name: formData.get('name') as string,
      ownerId: formData.get('ownerId') as string, // Get owner from form
      plan: formData.get('plan') as Store['plan'],
      status: formData.get('status') as Store['status'],
      image: imageUrl,
    };

    try {
      if (currentStore) {
        await updateStore(firestore, currentStore.id, storeData);
        toast({ title: "تم تعديل المتجر بنجاح" });
      } else {
        await addStore(firestore, { 
            ...storeData, 
            createdAt: serverTimestamp() 
        });
        toast({ title: "تمت إضافة المتجر بنجاح" });
      }
      setIsFormOpen(false);
      setCurrentStore(null);
      setPreviewImage(null);
      setSelectedFile(null);
    } catch(err) {
      // Errors are now handled by the FirestorePermissionError emitter
    } finally {
      setIsUploading(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة المتاجر</CardTitle>
          <CardDescription>
            عرض وإدارة جميع المتاجر على المنصة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن متجر..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة متجر
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">صورة المتجر</TableHead>
                  <TableHead>اسم المتجر</TableHead>
                  <TableHead>صاحب المتجر (Email)</TableHead>
                  <TableHead>الخطة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>
                    <span className="sr-only">الإجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center">جار التحميل...</TableCell></TableRow>
                ) : error ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-destructive">حدث خطأ في جلب المتاجر. تحقق من قواعد الأمان.</TableCell></TableRow>
                ) : filteredStores.length > 0 ? (
                  filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <Image
                          alt={store.name}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={store.image}
                          width="64"
                          unoptimized // Recommended for external images that might not have a predictable pattern
                        />
                      </TableCell>
                      <TableCell className="font-medium">{store.name}</TableCell>
                      <TableCell className="font-mono text-xs">{store.ownerId}</TableCell>
                      <TableCell>{planTranslation[store.plan]}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[store.status] || "default"}>
                          {statusTranslation[store.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{store.createdAt?.toDate ? store.createdAt.toDate().toLocaleDateString() : '...'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">قائمة الإجراءات</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(store)}>تعديل</DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">حذف</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المتجر وجميع بياناته نهائيًا.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(store.id)} className="bg-destructive hover:bg-destructive/90">
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
                    <TableCell colSpan={7} className="text-center">
                      لا توجد متاجر حاليًا.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentStore ? 'تعديل المتجر' : 'إضافة متجر جديد'}</DialogTitle>
                  <DialogDescription>
                    {currentStore ? 'قم بتحديث بيانات المتجر هنا.' : 'أدخل بيانات المتجر الجديد هنا.'}
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">اسم المتجر</Label>
                      <Input id="name" name="name" defaultValue={currentStore?.name} required />
                  </div>
                  
                   <div className="space-y-2">
                      <Label htmlFor="ownerId">بريد المالك الإلكتروني</Label>
                      <Input id="ownerId" name="ownerId" type="email" defaultValue={currentStore?.ownerId ?? authUser?.email ?? ''} required />
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="image">صورة المتجر</Label>
                      <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                      {previewImage && (
                        <div className="mt-2">
                            <Image src={previewImage} alt="معاينة الصورة" width={100} height={100} className="rounded-md object-cover" />
                        </div>
                      )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">الخطة</Label>
                      <Select name="plan" defaultValue={currentStore?.plan || "Basic"}>
                          <SelectTrigger id="plan">
                              <SelectValue placeholder="اختر خطة" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Basic">أساسية</SelectItem>
                              <SelectItem value="Premium">مميزة</SelectItem>
                              <SelectItem value="Enterprise">أعمال</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                       <Select name="status" defaultValue={currentStore?.status || "Active"}>
                          <SelectTrigger id="status">
                              <SelectValue placeholder="اختر حالة" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Active">نشط</SelectItem>
                              <SelectItem value="Inactive">غير نشط</SelectItem>
                              <SelectItem value="Suspended">موقوف</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isUploading}>إلغاء</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? "جار الحفظ..." : "حفظ التغييرات"}
                  </Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
    
