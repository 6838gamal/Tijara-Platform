
"use client";

import React, { useState, useMemo } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, PlusCircle, MoreHorizontal } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { addUser, updateUser, deleteUser } from "@/firebase/firestore/users";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase/auth/use-user";

type User = {
  id: string; // This will now be the email address
  name: string;
  email: string;
  role: "Admin" | "Merchant" | "Customer";
  status: "Active" | "Inactive" | "Suspended";
  createdAt: any; // Can be a server timestamp
  password?: string;
};

const statusVariant: { [key in User["status"]]: "default" | "secondary" | "destructive" } = {
  Active: "default",
  Inactive: "secondary",
  Suspended: "destructive",
};

const statusTranslation: { [key in User["status"]]: string } = {
    Active: 'نشط',
    Inactive: 'غير نشط',
    Suspended: 'موقوف',
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const { user: authUser, loading: authLoading } = useUser();

   const usersCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users = [], loading: dataLoading, error } = useCollection<User>(usersCollection);

  const loading = authLoading || dataLoading;

  const handleAdd = () => {
    setCurrentUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (userId: string) => {
    if (!firestore) return;
    try {
        await deleteUser(firestore, userId);
        toast({ title: "تم حذف المستخدم بنجاح" });
    } catch (e) {
        // Error is now handled globally by the emitter
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    const userData: Omit<User, 'id' | 'createdAt' | 'password'> = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as User['role'],
        status: formData.get('status') as User['status'],
    };

    try {
        if (currentUser) {
          if (password) {
            toast({ title: "لا يمكن تعديل كلمة المرور من هنا", variant: "destructive" });
            return;
          }
          await updateUser(firestore, currentUser.id, userData);
          toast({ title: "تم تعديل المستخدم بنجاح" });
        } else {
          if (!password) {
            toast({ title: "كلمة المرور مطلوبة", variant: "destructive" });
            return;
          }
          await addUser(firestore, { ...userData, password });
          toast({ title: "تمت إضافة المستخدم بنجاح" });
        }
        setIsFormOpen(false);
        setCurrentUser(null);
    } catch(err) {
      // Errors are now handled by the FirestorePermissionError emitter
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>إدارة المستخدمين</CardTitle>
          <CardDescription>
            عرض وإدارة جميع المستخدمين على المنصة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن مستخدم..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة مستخدم
            </Button>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>كلمة المرور</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>
                    <span className="sr-only">الإجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center">جار التحميل...</TableCell>
                    </TableRow>
                ) : error ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-destructive">حدث خطأ في جلب المستخدمين. تحقق من قواعد الأمان.</TableCell></TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="font-mono">********</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[user.status] || "default"}>
                          {statusTranslation[user.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : '...'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">قائمة الإجراءات</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>تعديل</DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">حذف</DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف المستخدم نهائيًا.
                                      </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive hover:bg-destructive/90">
                                          حذف
                                      </AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      لا يوجد مستخدمون حاليًا.
                    </TableCell>
                  </TableRow>
                )}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSave}>
              <DialogHeader>
                  <DialogTitle>{currentUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</DialogTitle>
                  <DialogDescription>
                    {currentUser ? 'قم بتحديث بيانات المستخدم هنا.' : 'أدخل بيانات المستخدم الجديد هنا.'}
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">الاسم</Label>
                      <Input id="name" name="name" defaultValue={currentUser?.name} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" name="email" type="email" defaultValue={currentUser?.email} required readOnly={!!currentUser}/>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور</Label>
                      <Input id="password" name="password" type="password" placeholder={currentUser ? 'اتركه فارغًا لعدم التغيير' : 'مطلوب عند الإنشاء'} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">الدور</Label>
                      <Select name="role" defaultValue={currentUser?.role || 'Customer'}>
                          <SelectTrigger>
                              <SelectValue placeholder="اختر دورًا" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Merchant">Merchant</SelectItem>
                              <SelectItem value="Customer">Customer</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                       <Select name="status" defaultValue={currentUser?.status || 'Active'}>
                          <SelectTrigger>
                              <SelectValue placeholder="اختر حالة" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Active">نشط</SelectItem>
                              <SelectItem value="Inactive">غير نشط</SelectItem>
                              <SelectItem value="Suspended">موقوف</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">إلغاء</Button>
                  </DialogClose>
                  <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>
    </>
  );
}
    

    
