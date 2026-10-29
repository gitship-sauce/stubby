import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Log in · Stubby" };

export default function LogIn() {
  return (
    <PageShell title="Log in.">
      <AuthForm
        endpoint="/api/auth/login"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
        ]}
        submit="Log in"
        busyText="Logging in…"
        goTo="/"
      />
      <p className="mt-6 flex gap-6 text-sm">
        <Link href="/forgot-password" className="font-semibold underline decoration-2 underline-offset-2">Forgot password?</Link>
        <Link href="/signup" className="font-semibold underline decoration-2 underline-offset-2">Make an account</Link>
      </p>
    </PageShell>
  );
}
