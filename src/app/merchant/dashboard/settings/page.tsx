
"use client";

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

export default function StoreSettingsPage() {
  const { t } = useTranslation();

  const handleSave = (e: React.FormEvent<HTMLFormElement>, tabNameKey: string) => {
      e.preventDefault();
      toast({
          title: t('toastSettingsSaved'),
          description: `${t('toastSettingsSavedDesc')} "${t(tabNameKey)}".`,
      });
  };

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('storeSettings')}</h1>
            <p className="text-muted-foreground">
                {t('storeSettingsPageDescription')}
            </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">{t('settingsGeneralTab')}</TabsTrigger>
                <TabsTrigger value="logo">{t('settingsLogoTab')}</TabsTrigger>
                <TabsTrigger value="social">{t('settingsSocialTab')}</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
                <form onSubmit={(e) => handleSave(e, "settingsGeneralTab")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settingsGeneralTab')}</CardTitle>
                            <CardDescription>{t('settingsGeneralTabDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="storeName">{t('settingsStoreNameLabel')}</Label>
                                <Input id="storeName" defaultValue="My Awesome Store" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="storeDescription">{t('settingsStoreDescriptionLabel')}</Label>
                                <Textarea id="storeDescription" placeholder={t('settingsStoreDescriptionPlaceholder')} defaultValue="The best place to find amazing products." />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">{t('saveChangesButton')}</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>

            <TabsContent value="logo">
                 <form onSubmit={(e) => handleSave(e, "settingsLogoTab")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settingsLogoTab')}</CardTitle>
                            <CardDescription>{t('settingsLogoTabDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="logoUrl">{t('settingsLogoUrlLabel')}</Label>
                                <Input id="logoUrl" placeholder="https://example.com/logo.png" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">{t('saveChangesButton')}</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>

            <TabsContent value="social">
                <form onSubmit={(e) => handleSave(e, "settingsSocialTab")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settingsSocialTab')}</CardTitle>
                            <CardDescription>{t('settingsSocialTabDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="twitterUrl">Twitter</Label>
                                <Input id="twitterUrl" placeholder="https://twitter.com/yourstore" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="facebookUrl">Facebook</Label>
                                <Input id="facebookUrl" placeholder="https://facebook.com/yourstore" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="instagramUrl">Instagram</Label>
                                <Input id="instagramUrl" placeholder="https://instagram.com/yourstore" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">{t('saveChangesButton')}</Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
        </Tabs>
    </div>
  );
}
