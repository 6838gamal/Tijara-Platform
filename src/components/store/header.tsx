
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Search, ShoppingCart, Menu, User } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

// Use an alias to avoid conflict with the merchant Store concept
import { Store as StoreIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";


export function StoreHeader() {
  const { t, lang } = useTranslation();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center md:mr-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden mr-4 rtl:ml-4 rtl:mr-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === 'ar' ? 'right' : 'left'}>
              <SheetTitle className="sr-only">Main Menu</SheetTitle>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <SheetClose asChild>
                  <Link href="/store" className="flex items-center gap-2 text-lg font-semibold">
                    <StoreIcon className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline">عون</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild><Link href="/store" className="hover:text-foreground">{t('home')}</Link></SheetClose>
                <SheetClose asChild><Link href="/store/categories/all" className="text-muted-foreground hover:text-foreground">{t('categories')}</Link></SheetClose>
                <SheetClose asChild><Link href="#" className="text-muted-foreground hover:text-foreground">{t('newArrivals')}</Link></SheetClose>
                <SheetClose asChild><Link href="#" className="text-muted-foreground hover:text-foreground">{t('aboutUs')}</Link></SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/store" className="flex items-center gap-2">
            <StoreIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">عون</span>
          </Link>
        </div>


        <nav className="hidden md:flex items-center gap-6 text-sm font-medium mx-6">
          <Link href="/store" className="transition-colors hover:text-foreground/80 text-foreground">{t('home')}</Link>
          <Link href="/store/categories/all" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('categories')}</Link>
          <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('newArrivals')}</Link>
          <Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('aboutUs')}</Link>
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-4 ml-auto">
          <form className="hidden sm:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
              <Input type="search" placeholder={t('searchProductsPlaceholder')} className="pl-9 rtl:pr-9" />
            </div>
          </form>
          <Button asChild variant="ghost" size="icon">
            <Link href="/store/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">{t('shoppingCart')}</span>
            </Link>
          </Button>
          
          <LanguageSwitcher />

          <Button asChild>
            <Link href="/account/login">
                <User className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4"/>
                {t('myAccount')}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
