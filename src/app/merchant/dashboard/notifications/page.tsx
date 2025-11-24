
"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
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
import { useTranslation } from "@/hooks/use-translation";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { addMerchantNotification, deleteMerchantNotification } from "@/firebase/firestore/merchantNotifications";
import { useMerchantStore } from "@/hooks/use-merchant-store";


type Notification = {
  id: string;
  title: string;
  message: string;
  sentAt: any;
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [newNotification, setNewNotification] = useState({ title: "", message: "" });
  const { toast } = useToast();

  const firestore = useFirestore();
  const { storeId, loading: storeLoading, error: storeError, noStore } = useMerchantStore();

  const notificationsCollection = useMemo(() => {
    if (!firestore || !storeId) return null;
    return collection(firestore, 'stores', storeId, 'notifications');
  }, [firestore, storeId]);

  const { data: notifications = [], loading: dataLoading, error: notificationsError } = useCollection<Notification>(notificationsCollection);
  const loading = storeLoading || dataLoading;
  const error = storeError || notificationsError;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !storeId) {
        toast({
            variant: "destructive",
            title: "لا يوجد متجر",
            description: "يجب عليك إنشاء متجر أولاً قبل إرسال إشعار.",
        });
        return;
    }
    
    if(!newNotification.title || !newNotification.message) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: t('toastInvalidNotificationFields')
        });
        return;
    }
    
    try {
        await addMerchantNotification(firestore, storeId, newNotification);
        setNewNotification({ title: "", message: "" });
        toast({
            title: t('toastNotificationSentSuccess'),
            description: `${t('toastNotificationSentDesc')} "${newNotification.title}".`,
        });
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!firestore || !storeId) return;
    try {
        await deleteMerchantNotification(firestore, storeId, notificationId);
        toast({
            title: t('toastNotificationDeletedSuccess'),
        });
    } catch(e: any) {
        toast({
            variant: "destructive",
            title: t('toastErrorTitle'),
            description: e.message
        });
    }
  };
  
  const renderTableBody = () => {
    if (loading) {
      return <TableRow><TableCell colSpan={3} className="text-center h-24">جار التحميل...</TableCell></TableRow>;
    }
    if (error) {
      return <TableRow><TableCell colSpan={3} className="text-center h-24 text-destructive">حدث خطأ أثناء جلب البيانات. ({error.message})</TableCell></TableRow>;
    }
    if (noStore) {
      return <TableRow><TableCell colSpan={3} className="text-center h-24">لم يتم العثور على متجر لهذا الحساب. يرجى إنشاء متجر أولاً.</TableCell></TableRow>;
    }
    if (notifications.length === 0) {
      return <TableRow><TableCell colSpan={3} className="text-center h-24">لا توجد إشعارات مرسلة.</TableCell></TableRow>;
    }
    return notifications.map((notification) => (
      <TableRow key={notification.id}>
        <TableCell className="font-medium">{notification.title}</TableCell>
        <TableCell>{notification.sentAt?.toDate ? notification.sentAt.toDate().toLocaleDateString() : '...'}</TableCell>
        <TableCell className="text-right rtl:text-left">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">{t('actionDelete')}</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteNotificationConfirmDescription')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(notification.id)} className="bg-destructive hover:bg-destructive/90">
                        {t('confirmDeleteButton')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TableCell>
      </TableRow>
    ));
  };


  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('sendNewNotificationTitle')}</CardTitle>
          <CardDescription>
            {t('sendNewNotificationDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t('notificationTitleLabel')}</Label>
              <Input 
                id="title" 
                placeholder={t('notificationTitlePlaceholder')} 
                value={newNotification.title}
                onChange={(e) => setNewNotification(prev => ({...prev, title: e.target.value}))}
                disabled={noStore || loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t('notificationMessageLabel')}</Label>
              <Textarea
                id="message"
                placeholder={t('notificationMessagePlaceholder')}
                className="min-h-[120px]"
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({...prev, message: e.target.value}))}
                disabled={noStore || loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={noStore || loading}>
              <Send className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t('sendNotificationButton')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('sentNotificationsTitle')}</CardTitle>
          <CardDescription>{t('sentNotificationsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('notificationTitleLabel')}</TableHead>
                            <TableHead className="w-[30%]">{t('notificationDateSent')}</TableHead>
                            <TableHead className="text-right rtl:text-left">{t('productActions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {renderTableBody()}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
