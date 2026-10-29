import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Set a new password · Stubby" };

export default function ResetPassword({ searchParams }: PageProps<"/reset-password">) {
  return (
    <PageShell title="Set a new password.">
      <Suspense fallback={null}>
        <ResetForm searchParams={searchParams} />
      </Suspense>
      <p className="mt-6 text-sm">
        <Link href="/login" className="font-semibold underline decoration-2 underline-offset-2">Back to log in</Link>
      </p>
    </PageShell>
  );
}

async function ResetForm({ searchParams }: Pick<PageProps<"/reset-password">, "searchParams">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || token === "") {
    return (
      <p className="text-lg">
        This link is broken. Open the link from your email again, or{" "}
        <Link href="/forgot-password" className="font-semibold underline decoration-2 underline-offset-2">ask for a new one</Link>.
      </p>
    );
  }
  return (
    <AuthForm
      endpoint="/api/auth/reset-password"
      fields={[{ name: "password", label: "New password (8 characters or more)", type: "password", autoComplete: "new-password" }]}
      submit="Save new password"
      busyText="Saving…"
      extra={{ token }}
    />
  );
}
