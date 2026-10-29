import Link from "next/link";
import { Suspense } from "react";
import { AccountNav } from "@/components/account-nav";
import { Logo } from "@/components/logo";

// The header and width shared by the account pages.
export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-2xl font-black tracking-tight">Stubby</span>
        </Link>
        <Suspense fallback={null}>
          <AccountNav />
        </Suspense>
      </header>
      <section className="mt-14">
        <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl">{title}</h1>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
