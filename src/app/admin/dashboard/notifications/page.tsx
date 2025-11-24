"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NotificationTarget = "all" | "merchants" | "customers";

type Notification = {
  id: string;
  title: string;
  message: string;
  target: NotificationTarget;
  sentAt: string;
};

const initialNotifications: Notification[] = [
    {
        id: "notif_001",
        title: "صيانة مجدولة",
        message: "سيتم إجراء صيانة للمنصة يوم الجمعة القادم من الساعة 2 صباحًا حتى 4 صباحًا.",
        target: "all",
        sentAt: "2023-09-15"
    },
    {
        id: "notif_002",
        title: "ميزات جديدة للتجار",
        message: "تم إطلاق أدوات تحليلية جديدة لمساعدتك في تتبع مبيعاتك بشكل أفضل.",
        target: "merchants",
        sentAt: "2023-09-10"
    },
     {
        id: "notif_003",
        title: "عروض نهاية الأسبوع",
        message: "لا تفوتوا عروض نهاية الأسبوع! خصومات تصل إلى 50% على منتجات مختارة.",
        target: "customers",
        sentAt: "2023-09-08"
    }
];

const targetTranslation: { [key in NotificationTarget]: string } = {
    all: 'جميع المستخدمين',
    merchants: 'التجار فقط',
    customers: 'العملاء فقط',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [newNotification, setNewNotification] = useState({ title: "", message: "", target: "all" as NotificationTarget });
  const { toast } = useToast();
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newNotification.title || !newNotification.message || !newNotification.target) {
        toast({
            variant: "destructive",
            title: "خطأ",
            description: "يرجى ملء جميع الحقول لإرسال الإشعار."
        });
        return;
    }
    
    const sentNotification: Notification = {
        id: `notif_${String(notifications.length + 1).padStart(3, '0')}`,
        ...newNotification,
        sentAt: new Date().toISOString().split("T")[0]
    };

    setNotifications([sentNotification, ...notifications]);
    setNewNotification({ title: "", message: "", target: "all" });

    toast({
        title: "تم إرسال الإشعار بنجاح",
        description: `تم إرسال إشعار بعنوان "${sentNotification.title}" إلى ${targetTranslation[sentNotification.target]}.`,
    });
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast({
        title: "تم حذف الإشعار",
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
            <CardHeader>
            <CardTitle>إرسال إشعار جديد</CardTitle>
            <CardDescription>
                قم بصياغة وإرسال إشعار للمستخدمين على المنصة.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSend} className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="target">إرسال إلى</Label>
                <Select 
                    value={newNotification.target}
                    onValueChange={(value: NotificationTarget) => setNewNotification(prev => ({...prev, target: value}))}
                >
                    <SelectTrigger id="target">
                    <SelectValue placeholder="اختر الفئة المستهدفة" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">جميع المستخدمين</SelectItem>
                    <SelectItem value="merchants">التجار فقط</SelectItem>
                    <SelectItem value="customers">العملاء فقط</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                <Label htmlFor="title">عنوان الإشعار</Label>
                <Input 
                    id="title" 
                    placeholder="مثال: تحديثات هامة" 
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({...prev, title: e.target.value}))}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="message">نص الإشعار</Label>
                <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    className="min-h-[120px]"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({...prev, message: e.target.value}))}
                />
                </div>
            </form>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSend} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    إرسال الإشعار
                </Button>
            </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
            <CardHeader>
            <CardTitle>الإشعارات المرسلة</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4">
                        <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{targetTranslation[notification.target]} - {notification.sentAt}</p>
                        </div>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">حذف</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    هذا الإجراء سيحذف الإشعار من السجل. لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(notification.id)} className="bg-destructive hover:bg-destructive/90">
                                    حذف
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
