
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Wallet, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const transactions = [
    { type: 'deposit', amount: 500.00, date: '2023-10-26', description: 'إيداع من مبيعات الطلب #1234' },
    { type: 'withdrawal', amount: 200.00, date: '2023-10-25', description: 'سحب إلى حساب بنكي' },
    { type: 'deposit', amount: 150.75, date: '2023-10-24', description: 'إيداع من مبيعات الطلب #1230' },
    { type: 'fee', amount: 15.00, date: '2023-10-23', description: 'رسوم اشتراك الباقة المميزة' },
];

export default function WalletPage() {
  const { t } = useTranslation();
  const currentBalance = 1250.50;

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الرصيد الحالي</CardTitle>
                <Wallet className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">${currentBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">الرصيد المتاح للسحب أو لاستخدامه في خدمات المنصة.</p>
                 <Button className="mt-4">طلب سحب الرصيد</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>سجل المعاملات</CardTitle>
                <CardDescription>عرض لآخر المعاملات في محفظتك.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>النوع</TableHead>
                            <TableHead>الوصف</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead className="text-right">المبلغ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {tx.type === 'deposit' && <ArrowUp className="h-4 w-4 text-green-500" />}
                                        {tx.type === 'withdrawal' && <ArrowDown className="h-4 w-4 text-red-500" />}
                                        {tx.type === 'fee' && <DollarSign className="h-4 w-4 text-muted-foreground" />}
                                        <span>{tx.type === 'deposit' ? 'إيداع' : tx.type === 'withdrawal' ? 'سحب' : 'رسوم'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{tx.description}</TableCell>
                                <TableCell>{tx.date}</TableCell>
                                <TableCell className={`text-right font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
