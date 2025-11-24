
"use client";

import Link from "next/link";
import {
  Bell,
  Home,
  Users,
  Store,
  CreditCard,
  Tag,
  Cpu,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronDown,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";

export default function AdminDashboardLayout({
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
    { href: "/admin/dashboard", icon: Home, label: t('dashboard'), exact: true },
    { href: "/admin/dashboard/users", icon: Users, label: t('userManagement') },
    { href: "/admin/dashboard/stores", icon: Store, label: t('storeManagement') },
    { href: "/admin/dashboard/subscriptions", icon: CreditCard, label: t('subscriptions') },
    { href: "/admin/dashboard/payments", icon: CreditCard, label: t('payments') },
    { href: "/admin/dashboard/notifications", icon: Bell, label: t('notifications') },
    { href: "/admin/dashboard/coupons", icon: Tag, label: t('coupons') },
    { href: "/admin/dashboard/ai-services", icon: Cpu, label: t('aiServices') },
  ];
  
  const checkActive = (item: { href: string, exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };
  
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (auth) {
      await signOut(auth);
    }
    // The useEffect below will handle the redirect
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
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
              <h2 className="text-lg font-semibold font-headline text-sidebar-foreground">منصة عون | مشرف</h2>
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start items-center gap-2 px-2">
                        <Settings className="h-4 w-4" />
                        <span className="flex-grow text-left">{t('systemSettings')}</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[var(--sidebar-width)] mb-2">
                    <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t('systemSettings')}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                         <Link href="/admin/dashboard/support">
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            <span>{t('technicalSupport')}</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <Link href="/admin/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                {t('adminDashboard')}
              </Link>
            </div>
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-muted/40">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
