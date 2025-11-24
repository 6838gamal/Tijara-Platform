
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useUser, useFirestore, useDoc } from '@/firebase';
import { updateUser } from '@/firebase/firestore/users';
import { Skeleton } from '@/components/ui/skeleton';

type UserProfile = {
    id: string;
    name: string;
    email: string;
};

export default function CustomerProfilePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: authUser, loading: authLoading } = useUser();

  const userDocRef = useMemo(() => {
    if (!firestore || !authUser?.email) return null;
    return doc(firestore, 'users', authUser.email);
  }, [firestore, authUser?.email]);
  
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(userDocRef);

  const [name, setName] = useState('');
  
  useEffect(() => {
    if (userProfile) {
      // The name is split for first/last name fields, but our model has one 'name' field.
      // We will use the full name in a single field for simplicity.
      setName(userProfile.name);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !authUser?.email) {
        toast({ variant: 'destructive', title: 'خطأ', description: 'المستخدم غير مصادق عليه.' });
        return;
    }

    try {
        await updateUser(firestore, authUser.email, { name });
        toast({
            title: t('toastProfileUpdatedSuccess'),
            description: t('toastProfileUpdatedDesc'),
        });
    } catch (error) {
        toast({ variant: 'destructive', title: 'خطأ', description: 'فشل تحديث الملف الشخصي.' });
    }
  };

  const loading = authLoading || profileLoading;

  if (loading) {
      return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
      )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t('myProfile')}</CardTitle>
          <CardDescription>{t('myProfileDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
              <Label htmlFor="name">{t('customerName')}</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('customerEmail')}</Label>
            <Input id="email" type="email" value={authUser?.email || ''} readOnly disabled />
          </div>
           <div className="space-y-2">
            <p className='text-sm font-medium'>{t('newPassword')}</p>
            <Button variant="outline" type="button" onClick={() => toast({title: "ميزة قيد التطوير"})}>
                {t('changePasswordButton', 'Change Password')}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{t('saveChangesButton')}</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
