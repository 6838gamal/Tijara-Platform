

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, PlusCircle, MoreHorizontal, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { type ProductData, addProduct, updateProduct, deleteProduct } from "@/firebase/firestore/products";
import { uploadImage } from "@/firebase/storage";
import { useMerchantStore } from "@/hooks/use-merchant-store";
import { useCollection } from "@/firebase/firestore/use-collection";


type ProductStatus = "Published" | "Draft";
type Product = ProductData & { id: string };

type Brand = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

const isColor = (str: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);

export default function ProductsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [imageOrColor, setImageOrColor] = useState<"image" | "color">("image");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { storeId, loading, error, noStore } = useMerchantStore();

  const productsCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'products');
  }, [firestore, storeId]);

  const brandsCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'brands');
  }, [firestore, storeId]);
  
  const categoriesCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'categories');
  }, [firestore, storeId]);

  const { data: products = [], loading: productsLoading, error: productsError } = useCollection<Product>(productsCollection);
  const { data: brands = [] } = useCollection<Brand>(brandsCollection);
  const { data: categories = [] } = useCollection<Category>(categoriesCollection);

  const pageLoading = loading || productsLoading;
  const pageError = error || productsError;

  const statusVariant: { [key in ProductStatus]: "default" | "secondary" } = {
    Published: "default",
    Draft: "secondary",
  };
  
  const statusTranslation: { [key in ProductStatus]: string } = {
      Published: t('statusPublished'),
      Draft: t('statusDraft'),
  };

  const handleAdd = () => {
    setCurrentProduct(null);
    setPreviewImage(null);
    setSelectedFile(null);
    setSelectedColor("#FFFFFF");
    setImageOrColor("image");
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    if (isColor(product.image)) {
        setImageOrColor("color");
        setSelectedColor(product.image);
        setPreviewImage(null);
    } else {
        setImageOrColor("image");
        setPreviewImage(product.image);
        setSelectedColor("#FFFFFF");
    }
    setSelectedFile(null);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (productId: string) => {
    if (!firestore || !storeId) return;
    try {
        await deleteProduct(firestore, storeId, productId);
        toast({ title: t('toastProductDeletedSuccess') });
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
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
    if (!firestore || !storeId) {
      toast({
        variant: "destructive",
        title: "لا يوجد متجر",
        description: "يجب عليك إنشاء متجر أولاً قبل إضافة منتج.",
      });
      setIsUploading(false);
      return;
    }
    
    setIsUploading(true);

    let finalImageValue = `https://picsum.photos/seed/${Date.now()}/400/400`;

    if (imageOrColor === 'color') {
        finalImageValue = selectedColor;
    } else if (selectedFile) {
        const imagePath = `products/${storeId}/${Date.now()}_${selectedFile.name}`;
        try {
            finalImageValue = await uploadImage(selectedFile, imagePath);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "فشل رفع الصورة",
                description: "حدث خطأ أثناء محاولة رفع صورة المنتج.",
            });
            setIsUploading(false);
            return;
        }
    } else if (currentProduct?.image) {
        finalImageValue = currentProduct.image;
    }

    const formData = new FormData(e.currentTarget);
    const productData: ProductData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        image: finalImageValue,
        price: parseFloat(formData.get('price') as string),
        cost: parseFloat(formData.get('cost') as string) || undefined,
        discountPrice: parseFloat(formData.get('discountPrice') as string) || undefined,
        discountEndDate: formData.get('discountEndDate') as string,
        stock: parseInt(formData.get('stock') as string),
        sku: formData.get('sku') as string,
        productLink: formData.get('productLink') as string,
        weight: parseFloat(formData.get('weight') as string) || undefined,
        requiresShipping: (formData.get('requiresShipping') === 'on'),
        maxQuantityPerCustomer: parseInt(formData.get('maxQuantityPerCustomer') as string) || undefined,
        category: formData.get('category') as string,
        brand: formData.get('brand') as string,
        options: formData.get('options') as string,
        status: formData.get('status') as ProductStatus,
    };

    if (!productData.name || isNaN(productData.price) || isNaN(productData.stock) || !productData.category || !productData.brand) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: t('toastInvalidFields') });
        setIsUploading(false);
        return;
    }

    try {
      if (currentProduct) {
        await updateProduct(firestore, storeId, currentProduct.id, productData);
        toast({ title: t('toastProductUpdatedSuccess') });
      } else {
        await addProduct(firestore, storeId, productData);
        toast({ title: t('toastProductAddedSuccess') });
      }
      setIsFormOpen(false);
      setCurrentProduct(null);
    } catch (err: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: err.message
        });
    } finally {
        setIsUploading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const canAddProduct = brands.length > 0 && categories.length > 0;

  if (noStore) {
    return (
      <div className="flex h-full items-center justify-center">
        <Alert variant="default" className="max-w-md text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-primary" />
          <AlertTitle className="font-bold text-lg mb-2">
            لا يوجد متجر مرتبط بهذا الحساب
          </AlertTitle>
          <AlertDescription className="mb-4">
            لإدارة المنتجات، يجب عليك إنشاء متجر أولاً.
          </AlertDescription>
          <Button asChild>
            <Link href="/merchant/dashboard/my-store">إنشاء متجر</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  const renderTableBody = () => {
    if (pageLoading) {
      return <TableRow><TableCell colSpan={7} className="text-center h-24">جار التحميل...</TableCell></TableRow>;
    }
    if (pageError) {
      return <TableRow><TableCell colSpan={7} className="text-center h-24 text-destructive">حدث خطأ أثناء جلب البيانات. ({pageError.message})</TableCell></TableRow>;
    }
    if (filteredProducts.length === 0) {
      return <TableRow><TableCell colSpan={7} className="text-center h-24">لا توجد منتجات حاليًا.</TableCell></TableRow>;
    }
    return filteredProducts.map((product) => (
      <TableRow key={product.id}>
        <TableCell>
            {isColor(product.image) ? (
                <div className="h-16 w-16 rounded-md" style={{ backgroundColor: product.image }} />
            ) : (
                <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image}
                    width="64"
                    unoptimized
                />
            )}
        </TableCell>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>
          <Badge variant={statusVariant[product.status] || "default"}>
            {statusTranslation[product.status]}
          </Badge>
        </TableCell>
        <TableCell>{product.sku || 'N/A'}</TableCell>
        <TableCell>${product.price.toFixed(2)}</TableCell>
        <TableCell>{product.stock}</TableCell>
        <TableCell className="text-right rtl:text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t('actionsMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(product)}>{t('actionEdit')}</DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">{t('actionDelete')}</DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteProductConfirmDescription')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive hover:bg-destructive/90">{t('confirmDeleteButton')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('products')}</CardTitle>
          <CardDescription>{t('productsPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input 
                placeholder={t('searchProductsPlaceholder')}
                className="pl-9 rtl:pr-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t('addProductButton')}
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">{t('productImage')}</TableHead>
                  <TableHead>{t('productName')}</TableHead>
                  <TableHead>{t('productStatus')}</TableHead>
                  <TableHead>{t('productSKU')}</TableHead>
                  <TableHead>{t('productPrice')}</TableHead>
                  <TableHead>{t('productStock')}</TableHead>
                  <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" size="sm">
                  {t('paginationPrevious')}
              </Button>
              <Button variant="outline" size="sm">
                  {t('paginationNext')}
              </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-3xl">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentProduct ? t('editProductTitle') : t('addProductTitle')}</DialogTitle>
                  {currentProduct && <DialogDescription>{t('editProductDescription')}</DialogDescription>}
              </DialogHeader>

              {!canAddProduct && !currentProduct && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    يجب عليك إضافة علامة تجارية وفئة واحدة على الأقل قبل إضافة منتج جديد.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-1">
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right rtl:text-left">{t('productNameLabel')}</Label>
                    <Input id="name" name="name" defaultValue={currentProduct?.name} required className="col-span-3"/>
                 </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right rtl:text-left pt-2">{t('productDescriptionLabel')}</Label>
                    <Textarea id="description" name="description" placeholder={t('productDescriptionPlaceholder')} defaultValue={currentProduct?.description} className="col-span-3"/>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right rtl:text-left">{t('productImage')}</Label>
                    <div className="col-span-3">
                         <Tabs value={imageOrColor} onValueChange={(value) => setImageOrColor(value as "image" | "color")}>
                             <TabsList className="grid w-full grid-cols-2">
                                 <TabsTrigger value="image">صورة</TabsTrigger>
                                 <TabsTrigger value="color">لون</TabsTrigger>
                             </TabsList>
                             <TabsContent value="image" className="mt-4">
                                <div className="flex items-center gap-4">
                                    <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                                    {previewImage && (
                                    <div className="mt-2">
                                        <Image src={previewImage} alt="Image preview" width={60} height={60} className="rounded-md object-cover" unoptimized/>
                                    </div>
                                    )}
                                </div>
                             </TabsContent>
                             <TabsContent value="color" className="mt-4">
                                  <div className="flex items-center gap-4">
                                      <Input id="color" name="color" type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="p-1 h-10 w-16"/>
                                      <Input value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
                                  </div>
                             </TabsContent>
                         </Tabs>
                    </div>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right rtl:text-left">{t('productPriceLabel')}</Label>
                    <Input id="price" name="price" type="number" step="0.01" defaultValue={currentProduct?.price} required className="col-span-3"/>
                 </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="discountPrice" className="text-right rtl:text-left">{t('productDiscountPriceLabel')}</Label>
                    <Input id="discountPrice" name="discountPrice" type="number" step="0.01" defaultValue={currentProduct?.discountPrice} placeholder="0.00" className="col-span-3"/>
                 </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right rtl:text-left">{t('productStockLabel')}</Label>
                    <Input id="stock" name="stock" type="number" defaultValue={currentProduct?.stock} required className="col-span-3"/>
                 </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right rtl:text-left">{t('productSKULabel')}</Label>
                    <Input id="sku" name="sku" defaultValue={currentProduct?.sku} placeholder="e.g., TSHIRT-RED-L" className="col-span-3"/>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productLink" className="text-right rtl:text-left">{t('productLinkLabel')}</Label>
                    <Input id="productLink" name="productLink" type="url" defaultValue={currentProduct?.productLink} placeholder="https://example.com/product-page" className="col-span-3"/>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right rtl:text-left">{t('productCategoryLabel')}</Label>
                    <Select name="category" defaultValue={currentProduct?.category} disabled={!canAddProduct && !currentProduct} required>
                        <SelectTrigger id="category" className="col-span-3"><SelectValue placeholder={t('productCategoryPlaceholder')} /></SelectTrigger>
                        <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="brand" className="text-right rtl:text-left">{t('brandName')}</Label>
                     <Select name="brand" defaultValue={currentProduct?.brand} disabled={!canAddProduct && !currentProduct} required>
                        <SelectTrigger id="brand" className="col-span-3"><SelectValue placeholder={t('brandName')} /></SelectTrigger>
                        <SelectContent>{brands.map(brand => <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right rtl:text-left">{t('productStatusLabel')}</Label>
                    <Select name="status" defaultValue={currentProduct?.status || 'Published'}>
                        <SelectTrigger id="status" className="col-span-3"><SelectValue placeholder={t('productStatusPlaceholder')} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Published">{t('statusPublished')}</SelectItem>
                            <SelectItem value="Draft">{t('statusDraft')}</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="options" className="text-right rtl:text-left pt-2">{t('productOptionsLabel')}</Label>
                    <Textarea id="options" name="options" defaultValue={currentProduct?.options} placeholder={t('productOptionsPlaceholder')} className="col-span-3"/>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="requiresShipping" className="text-right rtl:text-left">{t('shippingSection')}</Label>
                     <div className="col-span-3 flex items-center space-x-2 rtl:space-x-reverse">
                          <Switch id="requiresShipping" name="requiresShipping" defaultChecked={currentProduct?.requiresShipping ?? true}/>
                          <Label htmlFor="requiresShipping">{t('productRequiresShippingLabel')}</Label>
                     </div>
                  </div>
              </div>
              <DialogFooter className="pt-4 border-t">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isUploading}>{t('cancelButton')}</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isUploading || (!canAddProduct && !currentProduct)}>
                    {isUploading ? "جار الحفظ..." : t('saveChangesButton')}
                  </Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}

    

    