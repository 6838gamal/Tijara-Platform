
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { Badge } from "@/components/ui/badge";

type Address = {
  id: string;
  label: string;
  recipient: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
};

const initialAddresses: Address[] = [
  {
    id: "addr_001",
    label: "المنزل",
    recipient: "خالد أحمد",
    street: "123 شارع الملك فهد",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    isDefault: true,
  },
  {
    id: "addr_002",
    label: "العمل",
    recipient: "خالد أحمد",
    street: "456 طريق العليا العام",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    isDefault: false,
  },
];


export default function CustomerAddressesPage() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setCurrentAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: Address) => {
    setCurrentAddress(address);
    setIsFormOpen(true);
  };
  
  const handleDelete = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    toast({ title: t('toastAddressDeleted') });
  };
  
  const handleSetDefault = (addressId: string) => {
    setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === addressId })));
    toast({ title: t('toastDefaultAddressUpdated') });
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const addressData = {
        label: formData.get('label') as string,
        recipient: formData.get('recipient') as string,
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        country: formData.get('country') as string,
    };

    if (!addressData.label || !addressData.recipient || !addressData.street || !addressData.city || !addressData.country) {
        toast({ variant: 'destructive', title: t('toastErrorTitle'), description: t('toastInvalidAddressFields') });
        return;
    }

    if (currentAddress) {
      setAddresses(addresses.map(a => a.id === currentAddress.id ? { ...currentAddress, ...addressData } : a));
      toast({ title: t('toastAddressUpdated') });
    } else {
      const newAddress: Address = {
        id: `addr_${String(addresses.length + 1).padStart(3, '0')}`,
        ...addressData,
        isDefault: addresses.length === 0, // Make first address default
      };
      setAddresses([newAddress, ...addresses]);
      toast({ title: t('toastAddressAdded') });
    }
    setIsFormOpen(false);
    setCurrentAddress(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">{t('myAddresses')}</h2>
                <p className="text-muted-foreground">{t('myAddressesDesc')}</p>
            </div>
            <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0"/>
                {t('addAddressButton')}
            </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{address.label}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('actionsMenu')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(address)}>{t('actionEdit')}</DropdownMenuItem>
                          {!address.isDefault && (
                             <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>{t('actionSetAsDefault')}</DropdownMenuItem>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">{t('actionDelete')}</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                                    <AlertDialogDescription>{t('deleteAddressConfirmDescription')}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(address.id)} className="bg-destructive hover:bg-destructive/90">{t('confirmDeleteButton')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                </CardTitle>
                {address.isDefault && <Badge variant="outline">{t('defaultAddressBadge')}</Badge>}
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>{address.recipient}</p>
                <p>{address.street}</p>
                <p>{`${address.city}, ${address.country}`}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentAddress ? t('editAddressTitle') : t('addAddressTitle')}</DialogTitle>
                  <DialogDescription>{currentAddress ? t('editAddressDescription') : t('addAddressDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="label">{t('addressLabelLabel')}</Label>
                          <Input id="label" name="label" defaultValue={currentAddress?.label} placeholder={t('addressLabelPlaceholder')} required />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="recipient">{t('addressRecipientLabel')}</Label>
                          <Input id="recipient" name="recipient" defaultValue={currentAddress?.recipient} required />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="street">{t('addressStreetLabel')}</Label>
                      <Input id="street" name="street" defaultValue={currentAddress?.street} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="city">{t('addressCityLabel')}</Label>
                        <Input id="city" name="city" defaultValue={currentAddress?.city} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="country">{t('addressCountryLabel')}</Label>
                        <Input id="country" name="country" defaultValue={currentAddress?.country} required />
                    </div>
                  </div>
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

    