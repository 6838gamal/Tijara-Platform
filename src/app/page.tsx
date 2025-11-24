
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Store, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/hooks/use-translation";

export default function RoleSelectionPage() {
  const { t } = useTranslation();

  const roles = [
    {
      name: t('admin'),
      description: t('adminDescription'),
      icon: <Shield className="w-12 h-12 mb-4 text-primary" />,
      href: "/admin/login",
    },
    {
      name: t('merchant'),
      description: t('merchantDescription'),
      icon: <Store className="w-12 h-12 mb-4 text-primary" />,
      href: "/merchant/login",
    },
    {
      name: t('customer'),
      description: t('customerDescription'),
      icon: <ShoppingCart className="w-12 h-12 mb-4 text-primary" />,
      href: "/store",
    },
  ];

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl md:text-6xl">
          منصة عون
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('platformSubtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {roles.map((role) => (
          <Link href={role.href} key={role.name} className="block group">
            <Card className="text-center p-8 h-full transition-all duration-300 bg-muted/40 hover:bg-card hover:shadow-2xl hover:border-primary group-hover:-translate-y-2">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 transition-colors duration-300 group-hover:bg-primary">
                    {React.cloneElement(role.icon, { className: "w-10 h-10 text-primary transition-colors duration-300 group-hover:text-primary-foreground"})}
                </div>
                <CardTitle className="text-2xl font-headline">{role.name}</CardTitle>
                <CardDescription className="mt-2 text-base">{role.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
