
import { HeroSection } from "@/components/store/hero-section";
import { FeaturedProducts } from "@/components/store/featured-products";
import { CategorySection } from "@/components/store/category-section";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoreHomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<ProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategorySection />
      </Suspense>
    </div>
  );
}


function ProductsSkeleton() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container">
        <Skeleton className="h-9 w-1/3 mx-auto mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSkeleton() {
    return (
        <section className="bg-muted py-16 sm:py-24">
            <div className="container text-center">
                <Skeleton className="h-9 w-1/3 mx-auto mb-10" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                       <Skeleton key={i} className="h-24 w-full" />
                    ))}
                </div>
            </div>
        </section>
    )
}
