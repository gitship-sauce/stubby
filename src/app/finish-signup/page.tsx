import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Finish signing up · Stubby" };

export default function FinishSignup({ searchParams }: PageProps<"/finish-signup">) {
  return (
    <PageShell title="Finish signing up.">
      <Suspense fallback={null}>
        <FinishForm searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}

async function FinishForm({ searchParams }: Pick<PageProps<"/finish-signup">, "searchParams">) {
  const { token } = await searchParams;
  if (typeof token !== "string" || token === "") {
    return (
      <p className="text-lg">
        This link is broken. Open the link from your email again, or{" "}
        <Link href="/signup" className="font-semibold underline decoration-2 underline-offset-2">sign up again</Link>.
      </p>
    );
  }
  return <AuthForm endpoint="/api/auth/finish-signup" fields={[]} submit="Make my account" busyText="Making your account…" extra={{ token }} goTo="/" />;
}
