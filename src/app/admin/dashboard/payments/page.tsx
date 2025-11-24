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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Search, MoreHorizontal, Download } from "lucide-react";

type Payment = {
  id: string;
  storeName: string;
  customerEmail: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  method: "Credit Card" | "PayPal" | "Bank Transfer";
  createdAt: string;
};

const initialPayments: Payment[] = [
  {
    id: "pay_001",
    storeName: "متجر الأزياء العصرية",
    customerEmail: "fatima@store.com",
    amount: 150.75,
    status: "Completed",
    method: "Credit Card",
    createdAt: "2023-09-10",
  },
  {
    id: "pay_002",
    storeName: "متجر الإلكترونيات الحديثة",
    customerEmail: "noura@another-store.com",
    amount: 499.99,
    status: "Completed",
    method: "PayPal",
    createdAt: "2023-09-11",
  },
  {
    id: "pay_003",
    storeName: "متجر الهدايا الفريدة",
    customerEmail: "ahmed@example.com",
    amount: 75.00,
    status: "Pending",
    method: "Bank Transfer",
    createdAt: "2023-09-12",
  },
  {
    id: "pay_004",
    storeName: "متجر الكتب النادرة",
    customerEmail: "youssef@example.com",
    amount: 35.50,
    status: "Failed",
    method: "Credit Card",
    createdAt: "2023-09-12",
  },
  {
    id: "pay_005",
    storeName: "متجر العطور الفاخرة",
    customerEmail: "sara@example.com",
    amount: 220.00,
    status: "Refunded",
    method: "Credit Card",
    createdAt: "2023-09-08",
  },
];

const statusVariant: { [key in Payment["status"]]: "default" | "secondary" | "destructive" | "outline" } = {
  Completed: "default",
  Pending: "secondary",
  Failed: "destructive",
  Refunded: "outline",
};

const statusTranslation: { [key in Payment["status"]]: string } = {
    Completed: 'مكتمل',
    Pending: 'قيد الانتظار',
    Failed: 'فشل',
    Refunded: 'مسترد',
};


export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRefund = (paymentId: string) => {
    setPayments(payments.map(p => p.id === paymentId ? { ...p, status: "Refunded" } : p));
  };

  const filteredPayments = payments.filter(payment =>
    payment.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المدفوعات</CardTitle>
        <CardDescription>
          عرض وإدارة جميع المدفوعات على المنصة.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="البحث عن دفعة (بالهوية، المتجر، العميل)..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            تصدير البيانات
          </Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>هوية الدفع</TableHead>
                <TableHead>اسم المتجر</TableHead>
                <TableHead>بريد العميل</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>طريقة الدفع</TableHead>
                <TableHead>تاريخ العملية</TableHead>
                <TableHead>
                  <span className="sr-only">الإجراءات</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                  <TableCell className="font-medium">{payment.storeName}</TableCell>
                  <TableCell>{payment.customerEmail}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[payment.status] || "default"}>
                      {statusTranslation[payment.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">قائمة الإجراءات</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                        {payment.status === 'Completed' && (
                           <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>إرجاع المبلغ</DropdownMenuItem>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                               <AlertDialogHeader>
                                   <AlertDialogTitle>هل أنت متأكد من إرجاع المبلغ؟</AlertDialogTitle>
                                   <AlertDialogDescription>
                                       سيتم تغيير حالة هذه الدفعة إلى "مسترد". هذا الإجراء لا يمكن التراجع عنه.
                                   </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                   <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                   <AlertDialogAction onClick={() => handleRefund(payment.id)}>
                                       تأكيد الإرجاع
                                   </AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">
                السابق
            </Button>
            <Button variant="outline" size="sm">
                التالي
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
