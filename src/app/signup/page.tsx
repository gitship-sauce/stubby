import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Sign up · Stubby" };

export default function SignUp() {
  return (
    <PageShell title="Make an account.">
      <p className="mb-6 max-w-xl text-lg text-muted">With an account, Stubby keeps a list of the links you shorten.</p>
      <AuthForm
        endpoint="/api/auth/signup"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Password (8 characters or more)", type: "password", autoComplete: "new-password" },
        ]}
        submit="Sign up"
        busyText="Making your account…"
        goTo="/"
      />
      <p className="mt-6 text-sm">
        Already have one?{" "}
        <Link href="/login" className="font-semibold underline decoration-2 underline-offset-2">Log in</Link>
      </p>
    </PageShell>
  );
}
