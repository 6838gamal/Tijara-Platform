"use client";

import React, { useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MoreHorizontal, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TicketStatus = "Open" | "In Progress" | "Closed";

type Ticket = {
  id: string;
  subject: string;
  user: string;
  status: TicketStatus;
  lastUpdate: string;
  description: string;
};

const initialTickets: Ticket[] = [
  {
    id: "tkt_001",
    subject: "مشكلة في تسجيل الدخول",
    user: "ali.k@customer.com",
    status: "Open",
    lastUpdate: "2023-09-15",
    description: "لا أستطيع تسجيل الدخول إلى حسابي. تظهر لي رسالة خطأ في كلمة المرور مع أنني متأكد أنها صحيحة.",
  },
  {
    id: "tkt_002",
    subject: "استفسار عن خطط الاشتراك",
    user: "fatima@store.com",
    status: "In Progress",
    lastUpdate: "2023-09-14",
    description: "أرغب في معرفة المزيد من التفاصيل حول الفروقات بين الخطة المميزة وخطة الأعمال قبل الترقية.",
  },
  {
    id: "tkt_003",
    subject: "تأخر في توصيل الطلب #12345",
    user: "m.hassan@customer.com",
    status: "Closed",
    lastUpdate: "2023-09-12",
    description: "طلبي لم يصل بعد على الرغم من مرور أسبوع على تاريخ الشراء.",
  },
  {
    id: "tkt_004",
    subject: "اقتراح إضافة ميزة جديدة",
    user: "noura@another-store.com",
    status: "Closed",
    lastUpdate: "2023-09-10",
    description: "أقترح إضافة إمكانية تصدير تقارير المبيعات بصيغة PDF.",
  },
];

const statusVariant: { [key in TicketStatus]: "destructive" | "secondary" | "default" } = {
  Open: "destructive",
  "In Progress": "secondary",
  Closed: "default",
};

const statusTranslation: { [key in TicketStatus]: string } = {
  Open: 'مفتوحة',
  "In Progress": 'قيد المعالجة',
  Closed: 'مغلقة',
};

export default function TechnicalSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<{ search: string; status: TicketStatus | "all" }>({ search: "", status: "all" });
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const { toast } = useToast();

  const handleViewDetails = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    setIsReplyOpen(true);
  };
  
  const handleSendReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentTicket) return;

    const formData = new FormData(e.currentTarget);
    const reply = formData.get('reply') as string;
    
    if(!reply) {
        toast({ variant: 'destructive', title: "خطأ", description: "لا يمكن إرسال رد فارغ." });
        return;
    }

    // In a real app, this would send the reply to the user.
    console.log(`Replying to ticket ${currentTicket.id}: ${reply}`);

    toast({ title: "تم إرسال الرد بنجاح" });
    setIsReplyOpen(false);
    setCurrentTicket(null);
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchMatch = ticket.subject.toLowerCase().includes(filter.search.toLowerCase()) || ticket.user.toLowerCase().includes(filter.search.toLowerCase());
    const statusMatch = filter.status === "all" || ticket.status === filter.status;
    return searchMatch && statusMatch;
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>مركز الدعم الفني</CardTitle>
          <CardDescription>
            إدارة تذاكر الدعم الفني والرد على استفسارات المستخدمين.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في التذاكر..."
                className="pl-9"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({...prev, search: e.target.value}))}
              />
            </div>
            <Select 
              value={filter.status}
              onValueChange={(value: TicketStatus | "all") => setFilter(prev => ({...prev, status: value}))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="Open">مفتوحة</SelectItem>
                <SelectItem value="In Progress">قيد المعالجة</SelectItem>
                <SelectItem value="Closed">مغلقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموضوع</TableHead>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{ticket.user}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[ticket.status] || "default"}>
                        {statusTranslation[ticket.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.lastUpdate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">قائمة الإجراءات</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(ticket)}>
                            عرض والرد
                          </DropdownMenuItem>
                          {/* More actions can be added here */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSendReply}>
              <DialogHeader>
                  <DialogTitle>تذكرة دعم: {currentTicket?.subject}</DialogTitle>
                  <DialogDescription>
                    من: {currentTicket?.user} | آخر تحديث: {currentTicket?.lastUpdate}
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                 <div className="space-y-4">
                    <Label className="font-semibold">وصف المشكلة:</Label>
                    <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md min-h-[100px]">
                        {currentTicket?.description}
                    </p>
                 </div>
                  <div className="space-y-2">
                      <Label htmlFor="reply">كتابة رد</Label>
                      <Textarea 
                        id="reply" 
                        name="reply" 
                        placeholder="اكتب ردك هنا..." 
                        className="min-h-[150px]"
                        required
                      />
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">إغلاق</Button>
                  </DialogClose>
                  <Button type="submit">
                      <Send className="mr-2 h-4 w-4" />
                      إرسال الرد
                  </Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
