
"use client";

import Link from "next/link";
import { Home, Package, User, MapPin, LogOut } from "lucide-react";
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

export default function CustomerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang } = useTranslation();
  const auth = useAuth();
  const { user, loading } = useUser();

  const isLoginPage = pathname === '/account/login';

  const navItems = [
    { href: "/account/dashboard", icon: Home, label: t('dashboard'), exact: true },
    { href: "/account/orders", icon: Package, label: t('myOrders') },
    { href: "/account/profile", icon: User, label: t('myProfile') },
    { href: "/account/addresses", icon: MapPin, label: t('myAddresses') },
  ];
  
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
    if (!loading && !user && !isLoginPage) {
      router.replace('/account/login');
    }
  }, [user, loading, router, isLoginPage]);
  
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  if (loading || !user) {
    return null;
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <SidebarProvider>
        <Sidebar side={lang === 'ar' ? 'right' : 'left'}>
          <SidebarHeader>
             <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary">
                  <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold font-headline text-sidebar-foreground">{t('myAccount')}</h2>
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
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout}>
                      <LogOut />
                      <span>{t('logOut')}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <Link href="/account/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                {t('customerAccountDashboard')}
              </Link>
            </div>
            <LanguageSwitcher />
             <Button asChild variant="outline">
                <Link href="/store">
                    {t('backToStore')}
                </Link>
            </Button>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-muted/40">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
