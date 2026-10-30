import Link from "next/link";
import { Suspense } from "react";
import { AccountNav } from "@/components/account-nav";
import { ChannelLink } from "@/components/channel-link";
import { Logo } from "@/components/logo";
import { LinkRow } from "@/components/link-row";
import { ShortenForm } from "@/components/shorten-form";
import { ShowMore } from "@/components/show-more";
import { currentUser } from "@/lib/auth";
import { getStats, listLinks } from "@/lib/links";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-2xl font-black tracking-tight">Stubby</span>
        </div>
        <Suspense fallback={null}>
          <AccountNav />
        </Suspense>
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

      <Suspense fallback={null}>
        <YourLinks />
      </Suspense>

      <Suspense fallback={<p className="mt-10 h-6" />}>
        <Stats />
      </Suspense>

      <footer className="mt-auto pt-16 text-sm text-muted">
        Stubby is a real app from the <ChannelLink>Gitship Sauce</ChannelLink> YouTube channel. Each episode, a famous real failure breaks it,
        and we fix it on camera.{" "}
        <Link href="/sandbox" className="font-semibold text-ink underline decoration-2 underline-offset-2">
          Break it yourself in the sandbox.
        </Link>
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

async function YourLinks() {
  const user = await currentUser();
  if (!user) return null;
  const links = await listLinks(user.id);
  return (
    <section className="mt-12">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Your links</h2>
      {links.length === 0 ? (
        <p className="mt-3 text-muted">Links you shorten while logged in show up here.</p>
      ) : (
        <>
          <ul className="mt-3 divide-y-[3px] divide-ink rounded-3xl border-[3px] border-ink bg-white">
            {links.map((link) => (
              <LinkRow key={link.code} link={link} />
            ))}
          </ul>
          <ShowMore userId={user.id} />
        </>
      )}
    </section>
  );
}
