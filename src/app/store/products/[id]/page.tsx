
"use client";

import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore, useDoc } from "@/firebase";
import { doc, collection, query, where, limit } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/store/product-card';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    details?: string[];
    // Mock data for display
    rating?: number;
    reviews?: number;
};

const isColor = (str: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);

export default function ProductDetailPage({ params: { id: productId } }: { params: { id: string } }) {
  const { t } = useTranslation();
  const firestore = useFirestore();
  const storeId = "store_1"; // Hardcoded for demo

  const productDocRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'stores', storeId, 'products', productId);
  }, [firestore, productId]);

  const { data: product, loading: productLoading } = useDoc<Product>(productDocRef);

  const relatedProductsQuery = useMemo(() => {
    if (!firestore || !product) return null;
    return query(
        collection(firestore, 'stores', storeId, 'products'),
        where('category', '==', product.category),
        where('__name__', '!=', product.id),
        limit(4)
    );
  }, [firestore, product]);

  const { data: relatedProducts, loading: relatedLoading } = useCollection<Product>(relatedProductsQuery);

  if (productLoading) {
    return (
        <div className="container py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <div>
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="aspect-square w-full rounded-lg" />
                        <Skeleton className="aspect-square w-full rounded-lg" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                    <Separator />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!product) {
    return <div className="container py-12 text-center"><h2>{t('productNotFound', 'Product not found')}</h2></div>
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <div className="grid grid-cols-1 gap-4">
            <div className="aspect-square relative w-full overflow-hidden rounded-lg">
                {isColor(product.image) ? (
                    <div className="w-full h-full" style={{ backgroundColor: product.image }} />
                ) : (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            {/* Mocking additional images for now */}
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square relative w-full overflow-hidden rounded-lg bg-muted">
                         <Image
                            src={`https://picsum.photos/seed/${product.id}_${i}/600/600`}
                            alt={`${product.name} alt view ${i}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>
            <div className="flex items-center gap-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                </div>
                <span className="text-muted-foreground text-sm">({product.reviews || 0} {t('reviews')})</span>
            </div>
          </div>

          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          
          <Separator />

          <p className="text-muted-foreground">{product.description}</p>
          
          {product.details && (
            <ul className="list-disc list-inside space-y-2 text-muted-foreground rtl:list-outside rtl:pr-4">
                {product.details.map((detail, i) => <li key={i}>{detail}</li>)}
            </ul>
          )}

          <div className="flex items-center gap-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
              {t('addToCart')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16 pt-12 border-t">
         <h2 className="text-3xl font-bold font-headline text-center mb-10">{t('youMightAlsoLike')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedLoading ? (
                 Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                ))
            ) : (
                relatedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))
            )}
          </div>
      </div>
    </div>
  );
}
