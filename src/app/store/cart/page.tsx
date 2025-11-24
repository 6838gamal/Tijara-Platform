
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for the cart, in a real app this would come from state management
const cartItems = [
    {
        id: "prod_001",
        name: "Modern Desk Lamp",
        price: 79.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1543349639-5d393f9a1f2c?q=80&w=400&h=400&auto=format&fit=crop"
    },
    {
        id: "prod_002",
        name: "Wireless Headphones",
        price: 149.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&h=400&auto=format&fit=crop"
    }
];

export default function CartPage() {
  const { t } = useTranslation();
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 5.00; // Mock shipping cost
  const total = subtotal + shipping;

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold font-headline text-center mb-12">{t('shoppingCart', 'Shopping Cart')}</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
            <p className="text-muted-foreground mb-4">{t('cartIsEmpty', 'Your cart is empty.')}</p>
            <Button asChild>
                <Link href="/store">{t('continueShopping', 'Continue Shopping')}</Link>
            </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                        <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 grid gap-1">
                            <Link href={`/store/products/${item.id}`} className="font-semibold hover:underline">{item.name}</Link>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                             <div className="flex items-center gap-2 mt-2">
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    readOnly
                                    className="h-8 w-14 text-center"
                                />
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                             </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="md:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('orderSummary', 'Order Summary')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span>{t('subtotal', 'Subtotal')}</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('shipping', 'Shipping')}</span>
                            <span>${shipping.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>{t('total', 'Total')}</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Button className="w-full" size="lg">{t('proceedToCheckout', 'Proceed to Checkout')}</Button>
                    </CardContent>
                 </Card>
            </div>
        </div>
      )}
    </div>
  );
}

