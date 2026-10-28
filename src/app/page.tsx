import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { ShortenForm } from "@/components/shorten-form";
import { getStats } from "@/lib/links";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10">
      <header className="flex items-center gap-3">
        <Logo />
        <span className="text-2xl font-black tracking-tight">Stubby</span>
      </header>

      <section className="mt-16 sm:mt-24">
        <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl">
          Long link in.
          <br />
          <span className="text-tomato [-webkit-text-stroke:4px_var(--color-ink)] [paint-order:stroke_fill]">Stubby</span> link out.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Paste any link. Stubby makes it short, and removes the tracking junk on the way.
        </p>
      </section>

      <section className="mt-10">
        <ShortenForm />
      </section>

      <Suspense fallback={<p className="mt-10 h-6" />}>
        <Stats />
      </Suspense>

      <footer className="mt-auto pt-16 text-sm text-muted">
        Stubby is a real app from the Gitship Sauce channel. Each episode, a famous real failure breaks it,
        and we fix it on camera.
      </footer>
    </main>
  );
}

async function Stats() {
  const { links, clicks } = await getStats();
  return (
    <p className="mt-10 font-mono text-sm">
      <span className="font-bold">{links.toLocaleString("en-GB")}</span> {links === 1 ? "link" : "links"} shortened ·{" "}
      <span className="font-bold">{clicks.toLocaleString("en-GB")}</span> {clicks === 1 ? "click" : "clicks"} followed
    </p>
  );
}
