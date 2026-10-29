"use client";

import { useState } from "react";

// A copy of Stubby's forgot-password page that runs only in this browser: nothing is sent to Stubby's server.
// The answers are the real ones from ep2-broken and ep2-fixed, and the waits copy the medians we measured on the
// real app (2026-10-29, production build): before the fix 1.38 s with an account and 0.28 s without, after the fix 0.63 s for both.
const PRETEND_ACCOUNTS = ["ana@example.com", "sam@example.com"];

const VERSIONS = {
  before: {
    label: "Before the fix",
    answer: (hasAccount: boolean) => (hasAccount ? "Check your inbox for a reset link." : "No account found with that email."),
    waitMs: (hasAccount: boolean) => (hasAccount ? 1380 : 280),
  },
  after: {
    label: "After the fix",
    answer: () => "If that email has an account, a reset link is on its way.",
    waitMs: () => 630,
  },
} as const;

type Version = keyof typeof VERSIONS;
type Try = { version: Version; email: string; answer: string; ms: number };

// Real servers never answer in exactly the same time, so each wait wobbles by up to 10%.
const wobble = (ms: number) => ms * (0.9 + Math.random() * 0.2);

export function ResetSandbox() {
  const [version, setVersion] = useState<Version>("before");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [tries, setTries] = useState<Try[]>([]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean) return;
    const hasAccount = PRETEND_ACCOUNTS.includes(clean);
    const page = VERSIONS[version];
    setBusy(true);
    const start = performance.now();
    await new Promise((resolve) => setTimeout(resolve, wobble(page.waitMs(hasAccount))));
    const ms = performance.now() - start;
    setTries((done) => [{ version, email: clean, answer: page.answer(hasAccount), ms }, ...done]);
    setBusy(false);
  }

  return (
    <div className="rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-ink)]">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Which version">
        {(Object.keys(VERSIONS) as Version[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setVersion(key)}
            aria-pressed={version === key}
            className={`rounded-xl border-[3px] border-ink px-4 py-1.5 font-bold ${version === key ? (key === "before" ? "bg-tomato" : "bg-butter") : "bg-white"}`}
          >
            {VERSIONS[key].label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted">
        Pretend accounts in this copy: <span className="font-mono text-ink">{PRETEND_ACCOUNTS.join(", ")}</span>. Try one
        of them, then a made-up email, and compare the answer and the time.
      </p>

      <form onSubmit={send} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="sandbox-email" className="sr-only">Email</label>
        <input
          id="sandbox-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ana@example.com"
          className="min-w-0 flex-1 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-mono text-base outline-none focus:shadow-[4px_4px_0_var(--color-ink)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-2xl border-[3px] border-ink bg-tomato px-6 py-3 font-bold shadow-[4px_4px_0_var(--color-ink)] disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>

      {tries.length > 0 && (
        <table className="mt-6 w-full font-mono text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="py-1 font-normal">Version</th>
              <th className="py-1 font-normal">Email</th>
              <th className="py-1 font-normal">Answer</th>
              <th className="py-1 text-right font-normal">Time</th>
            </tr>
          </thead>
          <tbody>
            {tries.map((t, index) => (
              <tr key={index} className="border-t-2 border-ink/10 align-top">
                <td className="py-1.5 pr-3">{t.version}</td>
                <td className="py-1.5 pr-3 break-all">{t.email}</td>
                <td className="py-1.5 pr-3">{t.answer}</td>
                <td className="py-1.5 text-right font-bold">{(t.ms / 1000).toFixed(2)} s</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
