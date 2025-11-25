
"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { Palette, Type } from 'lucide-react';

const fonts = [
  { name: "PT Sans", value: "'PT Sans', sans-serif" },
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
  { name: "Lato", value: "'Lato', sans-serif" },
];

export default function StoreDesignPage() {
  const { t } = useTranslation();
  const [primaryColor, setPrimaryColor] = useState("#10b981");
  const [backgroundColor, setBackgroundColor] = useState("#f8fafc");
  const [font, setFont] = useState(fonts[0].value);

  const handleSave = () => {
    toast({
      title: t('designSavedToastTitle'),
      description: t('designSavedToastDesc')
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> {t('colorCustomization')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">{t('primaryColor')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="p-1 h-10 w-16"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="background-color">{t('backgroundColor')}</Label>
               <div className="flex items-center gap-2">
                 <Input
                    id="background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="p-1 h-10 w-16"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
               </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Type className="h-5 w-5" /> {t('fontCustomization')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="font-select">{t('storeFont')}</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger id="font-select">
                  <SelectValue placeholder={t('selectFontPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((f) => (
                    <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleSave} className="w-full">{t('saveChangesButton')}</Button>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('livePreview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-background">
                <div style={{ "--preview-primary": primaryColor, "--preview-bg": backgroundColor, fontFamily: font } as React.CSSProperties}>
                    <div className="h-16 flex items-center justify-between px-6" style={{ backgroundColor: "var(--preview-bg)", borderBottom: '1px solid #e2e8f0' }}>
                        <div className="font-bold text-lg" style={{ color: "var(--preview-primary)" }}>{t('myStore')}</div>
                        <div className="flex items-center gap-4 text-sm">
                            <span>{t('home')}</span>
                            <span>{t('products')}</span>
                            <span>{t('contactUs')}</span>
                        </div>
                    </div>
                    <div className="p-8" style={{ backgroundColor: "var(--preview-bg)"}}>
                        <h1 className="text-4xl font-bold mb-4" style={{ color: "hsl(var(--foreground))" }}>{t('welcomeToMyStore')}</h1>
                        <p className="mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>{t('previewSubtitle')}</p>
                        <div className="grid grid-cols-2 gap-6">
                            {[1, 2].map(i => (
                                <div key={i} className="border rounded-lg">
                                    <div className="h-40 bg-muted"></div>
                                    <div className="p-4">
                                        <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
                                        <div className="h-6 w-1/4 bg-muted rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <Button className="mt-8 w-1/2" style={{ backgroundColor: "var(--preview-primary)", color: 'white' }}>{t('shopNowButton')}</Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
