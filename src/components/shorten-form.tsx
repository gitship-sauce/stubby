"use client";

import { useState } from "react";
import { MAX_LINK_LENGTH } from "@/lib/clean-link";

type Result = { code: string; url: string };

export function ShortenForm() {
  const [link, setLink] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function shorten(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    setCopied(false);
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const body = await response.json();
      if (!response.ok) setError(body.error ?? "Something went wrong.");
      else setResult(body);
    } catch {
      setError("Stubby didn't answer. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const shortLink = result ? `${window.location.host}/${result.code}` : "";

  return (
    <div>
      <form onSubmit={shorten} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="link" className="sr-only">Long link</label>
        <input
          id="link"
          type="text"
          required
          maxLength={MAX_LINK_LENGTH}
          aria-describedby="link-hint"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://a-very-long-link.com/that/goes/on?and=on"
          className="min-w-0 flex-1 rounded-2xl border-[3px] border-ink bg-white px-5 py-4 font-mono text-base outline-none placeholder:text-muted/60 focus:shadow-[4px_4px_0_var(--color-ink)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-2xl border-[3px] border-ink bg-tomato px-7 py-4 text-lg font-bold text-ink shadow-[4px_4px_0_var(--color-ink)] transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
        >
          {busy ? "Shortening…" : "Shorten"}
        </button>
      </form>
      <p id="link-hint" className="mt-2 text-sm text-muted">
        Links up to {MAX_LINK_LENGTH.toLocaleString("en-GB")} characters.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-medium">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 rounded-3xl border-[3px] border-ink bg-butter p-6 shadow-[6px_6px_0_var(--color-ink)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">Your Stubby link</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a href={`/${result.code}`} className="font-mono text-2xl font-bold underline decoration-[3px] underline-offset-4 sm:text-3xl">
              {shortLink}
            </a>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(`${window.location.origin}/${result.code}`);
                setCopied(true);
              }}
              className="rounded-xl border-[3px] border-ink bg-white px-4 py-1.5 font-bold"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-4 break-all font-mono text-sm text-ink/70">Goes to: {result.url}</p>
        </div>
      )}
    </div>
  );
}
