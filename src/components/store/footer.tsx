
"use client";

import Link from "next/link";
import { Twitter, Facebook, Instagram } from "lucide-react";
import { Store as StoreIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export function StoreFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/store" className="flex items-center gap-2">
              <StoreIcon className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">عون</span>
            </Link>
            <p className="text-muted-foreground text-sm">{t('platformSlogan')}</p>
            <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('shopTitle')}</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('categories')}</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('newArrivals')}</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('bestSellers')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('customerServiceTitle')}</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('contactUs')}</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('faq')}</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('trackOrder')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t('legalTitle')}</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('privacyPolicy')}</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('termsOfService')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
