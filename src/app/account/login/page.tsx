
import { LoginForm } from "@/components/login-form";

export default function CustomerLoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <LoginForm role="Customer" onSuccessRedirect="/account/dashboard" />
    </main>
  );
}
