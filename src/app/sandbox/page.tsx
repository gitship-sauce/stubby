import type { Metadata } from "next";
import Link from "next/link";
import { ChannelLink } from "@/components/channel-link";
import { Logo } from "@/components/logo";
import { NumberSandbox } from "@/components/number-sandbox";
import { RegexSandbox } from "@/components/regex-sandbox";
import { ResetSandbox } from "@/components/reset-sandbox";
import { SwitchSandbox } from "@/components/switch-sandbox";

export const metadata: Metadata = {
  title: "Stubby sandbox: break it yourself",
  description: "Try each episode's failure on your own device. Nothing here runs on Stubby's server.",
};

export default function Sandbox() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10">
      <header className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-2xl font-black tracking-tight">Stubby</span>
        </Link>
        <span className="rounded-full border-[3px] border-ink bg-butter px-3 py-0.5 text-sm font-bold">Sandbox</span>
      </header>

      <section className="mt-14">
        <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl">Break it yourself.</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Everything on this page runs on your own device, not on Stubby&apos;s server. If something gets slow, only
          this page is busy, and you can stop it.
        </p>
      </section>

      <section className="mt-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Episode 1</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">One regex froze the whole app</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Stubby once checked every link with <code className="font-mono text-ink">/.*=.*/</code>. On a long link with
          no &ldquo;=&rdquo;, it tries every way to split the link. Double the length and it takes about four times
          longer. On the server, every other visitor had to wait too.
        </p>
        <div className="mt-6">
          <RegexSandbox />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Episode 2</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">The forgot-password page that said who has an account</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Before the fix, Stubby answered &ldquo;No account found&rdquo; for a made-up email, and took about a second
          longer for a real account, because it sent the email first. This is a copy of that page, running on your
          device: nothing is sent to Stubby. The waits copy the times we measured on the real app.
        </p>
        <div className="mt-6">
          <ResetSandbox />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Episode 3</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">The old switch that broke every link</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Before the fix, the safe sign-up reply was put behind an old switch called BETA. A shelved link preview,
          with no button to go on, still checked that switch. Turn the switch on, click the link, and see where you
          end up. This copy runs on your device: nothing is sent to Stubby.
        </p>
        <div className="mt-6">
          <SwitchSandbox />
        </div>
      </section>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Episode 4</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">The user number Stubby believed</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Before the fix, Show more sent your user number with the request, and the server believed it. Change the
          number, and you got someone else&apos;s list. Heartbleed made the same kind of mistake with a length. This
          copy runs on your device: nothing is sent to Stubby.
        </p>
        <div className="mt-6">
          <NumberSandbox />
        </div>
      </section>

      <footer className="mt-auto pt-16 text-sm text-muted">
        Want the real app in its broken state? Clone the code and check out the <code className="font-mono">ep1-broken</code>, <code className="font-mono">ep2-broken</code>, <code className="font-mono">ep3-broken</code> or <code className="font-mono">ep4-broken</code> tag.
        Watch every episode on <ChannelLink>Gitship Sauce</ChannelLink>.
      </footer>
    </main>
  );
}
