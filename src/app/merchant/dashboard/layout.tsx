
"use client";

import Link from "next/link";
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Cpu,
  CreditCard,
  Settings,
  LineChart,
  Shapes,
  Award,
  Store,
  LogOut,
  FileText,
  LayoutGrid,
  Share2,
  Gem,
  Gift,
  Megaphone,
  History,
  MessageSquareQuote,
  File,
  Newspaper,
  Building,
  Palette,
  Wallet,
  PackageCheck,
  AppWindow,
  Download,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";

export default function MerchantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang } = useTranslation();
  const auth = useAuth();
  const { user, loading } = useUser();

  const navItems = [
    { href: "/merchant/dashboard", icon: Home, label: t('dashboard'), exact: true },
    { href: "/merchant/dashboard/my-store", icon: Store, label: "متجري" },
    { href: "/merchant/dashboard/products", icon: Package, label: t('products') },
    { href: "/merchant/dashboard/categories", icon: Shapes, label: t('categories') },
    { href: "/merchant/dashboard/brands", icon: Award, label: t('brands') },
    { href: "/merchant/dashboard/orders", icon: ShoppingCart, label: t('orders') },
    { href: "/merchant/dashboard/customers", icon: Users, label: t('customers') },
    { href: "/merchant/dashboard/content", icon: FileText, label: t('content') },
    { href: "/merchant/dashboard/marketplace", icon: LayoutGrid, label: t('marketplace') },
    { href: "/merchant/dashboard/affiliate", icon: Share2, label: t('affiliateMarketing') },
    { href: "/merchant/dashboard/loyalty", icon: Gem, label: t('loyaltyProgram') },
    { href: "/merchant/dashboard/offers", icon: Gift, label: t('specialOffers') },
    { href: "/merchant/dashboard/marketing-tools", icon: Megaphone, label: t('marketingTools') },
    { href: "/merchant/dashboard/abandoned-carts", icon: History, label: t('abandonedCarts') },
    { href: "/merchant/dashboard/reviews", icon: MessageSquareQuote, label: t('questionsAndReviews') },
    { href: "/merchant/dashboard/pages", icon: File, label: t('informationalPages') },
    { href: "/merchant/dashboard/blog", icon: Newspaper, label: t('blog') },
    { href: "/merchant/dashboard/gov-services", icon: Building, label: t('governmentServices') },
    { href: "/merchant/dashboard/store-design", icon: Palette, label: t('storeDesign') },
    { href: "/merchant/dashboard/wallet", icon: Wallet, label: t('walletAndSavings') },
    { href: "/merchant/dashboard/coupons", icon: Tag, label: t('coupons') },
    { href: "/merchant/dashboard/notifications", icon: Bell, label: t('notifications') },
    { href: "/merchant/dashboard/ai-services", icon: Cpu, label: t('aiServices') },
  ];
  
  const bottomNavItems = [
      { href: "/merchant/dashboard/store-package", icon: PackageCheck, label: t('storePackage') },
      { href: "/merchant/dashboard/app-store", icon: AppWindow, label: t('visitAppStore') },
      { href: "/merchant/dashboard/installed-apps", icon: Download, label: t('installedApps') },
      { href: "/merchant/dashboard/settings", icon: Settings, label: t('storeSettings') },
      { href: "/merchant/dashboard/payments", icon: CreditCard, label: t('paymentsAndShipping') },
  ]

  const checkActive = (item: { href: string, exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };
  
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (auth) {
      await signOut(auth);
    }
    // The useEffect below will handle the redirect
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/merchant/login");
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <SidebarProvider>
        <Sidebar side={lang === 'ar' ? 'right' : 'left'}>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary">
                  <Store className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold font-headline text-sidebar-foreground">{t('yourStore')}</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={checkActive(item)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={checkActive(item)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <Link href="/merchant/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                {t('merchantDashboard')}
              </Link>
            </div>
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0"/>
                {t('logOut')}
            </Button>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-muted/40">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
