"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
};

const isColor = (str: string) => str && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
const isHttp = (str: string) => str && str.startsWith('http');

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const showImage = isHttp(product.image);

  return (
    <Link href={`/store/products/${product.id}`} className="block group">
      <div className="space-y-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          {isColor(product.image) ? (
            <div className="w-full h-full" style={{ backgroundColor: product.image }} />
          ) : showImage ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>
        <h3 className="font-semibold text-md text-foreground truncate text-center">{product.name}</h3>
      </div>
    </Link>
  );
}
