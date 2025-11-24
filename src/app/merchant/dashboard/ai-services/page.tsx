"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Wand2, Bot, PencilRuler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";

type AiService = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  icon: React.ElementType;
  status: "Active" | "Inactive";
  settings: {
    writingTone?: "professional" | "creative" | "friendly";
  };
};

const initialServices: AiService[] = [
  {
    id: "service_001",
    nameKey: "aiProductNameGenerator",
    descriptionKey: "aiProductNameGeneratorDesc",
    icon: Wand2,
    status: "Active",
    settings: {
      writingTone: "creative",
    },
  },
  {
    id: "service_002",
    nameKey: "aiCustomerInquiryResponder",
    descriptionKey: "aiCustomerInquiryResponderDesc",
    icon: Bot,
    status: "Inactive",
    settings: {},
  },
  {
    id: "service_003",
    nameKey: "aiImageEnhancer",
    descriptionKey: "aiImageEnhancerDesc",
    icon: PencilRuler,
    status: "Inactive",
    settings: {},
  },
];

export default function AiServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<AiService[]>(initialServices);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentService, setCurrentService] = useState<AiService | null>(null);
  const { toast } = useToast();
  
  const statusTranslation: { [key in AiService["status"]]: string } = {
      Active: t('statusActive'),
      Inactive: t('statusInactive'),
  };

  const handleStatusChange = (service: AiService, checked: boolean) => {
    const newStatus = checked ? "Active" : "Inactive";
    setServices(services.map(s => s.id === service.id ? { ...s, status: newStatus } : s));
    toast({
        title: `${t('toastServiceUpdated')}: "${t(service.nameKey)}"`,
        description: `${t('newStatusLabel')}: ${statusTranslation[newStatus]}.`
    });
  };

  const handleConfigure = (service: AiService) => {
    setCurrentService(service);
    setIsConfigOpen(true);
  };

  const handleSaveConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentService) return;

    const formData = new FormData(e.currentTarget);
    const writingTone = formData.get('writingTone') as AiService['settings']['writingTone'];

    setServices(services.map(s => s.id === currentService.id ? { ...s, settings: { ...s.settings, writingTone } } : s));
    toast({ title: t('toastSettingsSaved') });
    setIsConfigOpen(false);
    setCurrentService(null);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">{t('aiServices')}</h1>
            <p className="text-muted-foreground">{t('aiServicesPageDescription')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2">
                        <service.icon className="h-6 w-6 text-primary" />
                        {t(service.nameKey)}
                    </CardTitle>
                    <CardDescription>{t(service.descriptionKey)}</CardDescription>
                  </div>
                   <Switch
                      checked={service.status === "Active"}
                      onCheckedChange={(checked) => handleStatusChange(service, checked)}
                      aria-label={`Toggle ${t(service.nameKey)}`}
                    />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                    {service.status === "Active" ? 
                        ( <span className="text-green-600 font-medium">{t('statusActive')}</span> ) 
                        : ( <span>{t('statusInactive')}</span> )
                    }
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleConfigure(service)}>
                  <Settings className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                  {t('settingsButton')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSaveConfig}>
              <DialogHeader>
                  <DialogTitle>{t('serviceSettingsTitle')}: {currentService ? t(currentService.nameKey) : ''}</DialogTitle>
                  <DialogDescription>{t('serviceSettingsDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                {currentService?.id === "service_001" && (
                    <div className="space-y-2">
                        <Label htmlFor="writingTone">{t('writingToneLabel')}</Label>
                        <Select name="writingTone" defaultValue={currentService.settings.writingTone}>
                            <SelectTrigger id="writingTone">
                                <SelectValue placeholder={t('writingTonePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="professional">{t('writingToneProfessional')}</SelectItem>
                                <SelectItem value="creative">{t('writingToneCreative')}</SelectItem>
                                <SelectItem value="friendly">{t('writingToneFriendly')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                 {currentService && currentService.id !== "service_001" && (
                    <p className="text-sm text-muted-foreground">{t('noExternalSettings')}</p>
                )}
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">{t('cancelButton')}</Button>
                  </DialogClose>
                  <Button type="submit">{t('saveChangesButton')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
