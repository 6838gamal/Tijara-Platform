"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Settings, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AiService = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  provider: "Google AI" | "Internal";
  apiKey?: string;
};

const initialServices: AiService[] = [
  {
    id: "service_001",
    name: "منشئ وصف المنتج",
    description: "يولد أوصاف منتجات تسويقية وجذابة تلقائيًا.",
    status: "Active",
    provider: "Google AI",
    apiKey: "gsk_...xyz",
  },
  {
    id: "service_002",
    name: "محرك توصيات المنتجات",
    description: "يقدم توصيات منتجات مخصصة للعملاء.",
    status: "Active",
    provider: "Internal",
  },
  {
    id: "service_003",
    name: "خدمة العملاء الذكية (شات بوت)",
    description: "يجيب على استفسارات العملاء الشائعة على مدار الساعة.",
    status: "Inactive",
    provider: "Google AI",
  },
  {
    id: "service_004",
    name: "تحسين صور المنتجات",
    description: "يحسن جودة الصور ويزيل الخلفيات تلقائيًا.",
    status: "Inactive",
    provider: "Internal",
  },
];

const statusVariant: { [key in AiService["status"]]: "default" | "secondary" } = {
  Active: "default",
  Inactive: "secondary",
};

const statusTranslation: { [key in AiService["status"]]: string } = {
    Active: 'نشط',
    Inactive: 'غير نشط',
};

export default function AiServicesPage() {
  const [services, setServices] = useState<AiService[]>(initialServices);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentService, setCurrentService] = useState<AiService | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (service: AiService, checked: boolean) => {
    const newStatus = checked ? "Active" : "Inactive";
    setServices(services.map(s => s.id === service.id ? { ...s, status: newStatus } : s));
    toast({
        title: `تم تحديث خدمة "${service.name}"`,
        description: `الحالة الجديدة: ${statusTranslation[newStatus]}.`
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
    const apiKey = formData.get('apiKey') as string;

    setServices(services.map(s => s.id === currentService.id ? { ...s, apiKey: apiKey } : s));
    toast({ title: "تم حفظ الإعدادات بنجاح" });
    setIsConfigOpen(false);
    setCurrentService(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>إدارة خدمات الذكاء الاصطناعي</CardTitle>
              <CardDescription>
                تفعيل وإعداد الخدمات الذكية المتاحة على المنصة.
              </CardDescription>
            </div>
            <BrainCircuit className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الخدمة</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>المزود</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{service.description}</TableCell>
                    <TableCell>{service.provider}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[service.status] || "default"}>
                        {statusTranslation[service.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Switch
                          checked={service.status === "Active"}
                          onCheckedChange={(checked) => handleStatusChange(service, checked)}
                          aria-label={`تفعيل أو تعطيل ${service.name}`}
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleConfigure(service)}>
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">إعدادات</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSaveConfig}>
              <DialogHeader>
                  <DialogTitle>إعدادات خدمة: {currentService?.name}</DialogTitle>
                  <DialogDescription>
                    أدخل المعلومات المطلوبة لضبط إعدادات هذه الخدمة.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                {currentService?.provider === "Google AI" && (
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">مفتاح API الخاص بـ Google AI</Label>
                        <Input 
                          id="apiKey" 
                          name="apiKey" 
                          defaultValue={currentService?.apiKey} 
                          placeholder="أدخل مفتاح API هنا..."
                        />
                    </div>
                )}
                 {currentService?.provider === "Internal" && (
                    <p className="text-sm text-muted-foreground">
                        هذه الخدمة داخلية ولا تتطلب إعدادات خارجية.
                    </p>
                )}
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">إلغاء</Button>
                  </DialogClose>
                  <Button type="submit">حفظ الإعدادات</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
