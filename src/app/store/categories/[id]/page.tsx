
"use client";

import { useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, query, where, doc } from 'firebase/firestore';
import { ProductCard } from '@/components/store/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type Category = {
    id: string;
    name: string;
};

export default function CategoryPage({ params: { id: categoryId } }: { params: { id: string } }) {
  const { t } = useTranslation();
  const firestore = useFirestore();
  const storeId = "store_1"; // Hardcoded for demo

  // Get Category Name
  const categoryDocRef = useMemo(() => {
    if (!firestore || categoryId === 'all') return null;
    return doc(firestore, 'stores', storeId, 'categories', categoryId);
  }, [firestore, categoryId]);

  const { data: category, loading: categoryLoading } = useDoc<Category>(categoryDocRef);

  // Get Products in Category
  const productsCollection = useMemo(() => {
    if (!firestore) return null;
    const baseCollection = collection(firestore, 'stores', storeId, 'products');
    if (categoryId === 'all') {
        return baseCollection;
    }
    return query(baseCollection, where('category', '==', categoryId));
  }, [firestore, categoryId]);

  const { data: products, loading: productsLoading } = useCollection<Product>(productsCollection);

  const categoryName = categoryId === 'all' ? t('allProducts', 'All Products') : category?.name;
  const loading = categoryLoading || productsLoading;
  
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          {categoryLoading ? <Skeleton className="h-12 w-1/2 mx-auto" /> : categoryName}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            {t('noProductsInCategory', 'No products found in this category.')}
          </p>
        )}
      </div>
    </div>
  );
}
