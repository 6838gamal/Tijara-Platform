import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <StoreHeader />
      <main className="flex-1">{children}</main>iac
      <StoreFooter />
    </div>
  );
}
