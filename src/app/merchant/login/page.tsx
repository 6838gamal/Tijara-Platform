import { LoginForm } from "@/components/login-form";

export default function MerchantLoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <LoginForm role="Merchant" onSuccessRedirect="/merchant/dashboard" />
    </main>
  );
}
