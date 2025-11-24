
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function HeroSection() {
  const { t } = useTranslation();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <section className="relative w-full h-[60vh] bg-secondary">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative h-full flex flex-col items-center justify-center text-center text-primary-foreground p-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg">
          {t('heroTitle')}
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">
          {t('heroSubtitle')}
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/store/categories/all">{t('shopNowButton')}</Link>
        </Button>
      </div>
    </section>
  );
}
