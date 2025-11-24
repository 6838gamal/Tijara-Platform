
import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <LoginForm role="Admin" onSuccessRedirect="/admin/dashboard" />
    </main>
  );
}
