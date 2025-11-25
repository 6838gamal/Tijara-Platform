
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Star, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const reviews = [
    { id: 1, customer: "نورة عبد العزيز", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", rating: 5, product: "سماعات رأس لاسلكية", comment: "جودة صوت ممتازة وبطارية تدوم طويلاً. أنصح بها بشدة!", date: "2023-10-25" },
    { id: 2, customer: "خالد الغامدي", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d", rating: 4, product: "مصباح مكتب عصري", comment: "تصميم جميل وإضاءة جيدة، لكن كنت أتمنى أن يكون السلك أطول.", date: "2023-10-22" },
    { id: 3, customer: "فاطمة الزهراني", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d", rating: 5, product: "ساعة ذكية SE", comment: "أفضل ساعة ذكية استخدمتها حتى الآن!", date: "2023-10-20" },
];

export default function ReviewsPage() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('questionsAndReviews')}</CardTitle>
        <CardDescription>{t('reviewsPageDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={review.avatar} alt={review.customer} />
              <AvatarFallback>{review.customer.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">{review.customer}</p>
                    <p className="text-sm text-muted-foreground">{t('reviewsProduct')}: {review.product}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t('actionsMenu')}</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem>{t('reviewsReply')}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">{t('reviewsDelete')}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-1 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                ))}
              </div>
              <p className="text-sm">{review.comment}</p>
              <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
