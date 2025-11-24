
"use client";

import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/store/product-card';
import { useTranslation } from '@/hooks/use-translation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  status: "Published" | "Draft";
  isFeatured?: boolean;
};

const mockProducts: Product[] = [
    { id: 'prod_001', name: 'مصباح مكتب عصري', price: 79.99, image: 'https://images.unsplash.com/photo-1543349639-5d393f9a1f2c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', status: 'Published', isFeatured: true },
    { id: 'prod_002', name: 'سماعات رأس لاسلكية', price: 149.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', status: 'Published', isFeatured: true },
    { id: 'prod_004', name: 'ساعة ذكية SE', price: 279.00, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', status: 'Published', isFeatured: true },
    { id: 'prod_005', name: 'حقيبة ظهر أنيقة', price: 89.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb68c6a62?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', status: 'Published', isFeatured: true },
];


export function FeaturedProducts() {
  const { t } = useTranslation();
  
  // We will use the mock products for now.
  const productsLoading = false;
  const featuredProducts = mockProducts;

  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <h2 className="text-3xl font-bold font-headline text-center mb-10">{t('featuredProductsTitle')}</h2>
        
        {productsLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('noFeaturedProducts', 'No featured products to display at the moment.')}</p>
        ) : (
            <Carousel
                opts={{
                    align: "start",
                    loop: featuredProducts.length > 3,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {featuredProducts.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/3">
                            <div className="p-1">
                                <ProductCard product={product} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        )}
      </div>
    </section>
  );
}
