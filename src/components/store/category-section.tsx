
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, limit, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

type Category = {
  id: string;
  name: string;
};

export function CategorySection() {
  const { t } = useTranslation();
  const firestore = useFirestore();
  const storeId = "store_1"; // Hardcoded for demo

  const categoriesCollection = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'stores', storeId, 'categories'), limit(4));
  }, [firestore]);

  const { data: categories, loading: categoriesLoading } = useCollection<Category>(categoriesCollection);

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="container text-center">
        <h2 className="text-3xl font-bold font-headline mb-10">{t('shopByCategoryTitle')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : (
            categories.map(category => (
              <Link href={`/store/categories/${category.id}`} key={category.id}>
                <div className="p-8 rounded-lg bg-card hover:bg-card-foreground/5 transition-colors">
                  <span className="font-semibold">{category.name}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
