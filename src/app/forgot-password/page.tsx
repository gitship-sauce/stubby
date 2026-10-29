import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Forgot password · Stubby" };

export default function ForgotPassword() {
  return (
    <PageShell title="Forgot your password?">
      <p className="mb-6 max-w-xl text-lg text-muted">Type your email and we&apos;ll send you a link to set a new one.</p>
      <AuthForm
        endpoint="/api/auth/forgot-password"
        fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
        submit="Send reset link"
        busyText="Sending…"
      />
    </PageShell>
  );
}
