"use client";

import { useState } from "react";
import { LinkRow } from "@/components/link-row";
import type { SavedLink } from "@/lib/show-more";

// Loads Your links 20 at a time, after the first 20 the page drew.
export function ShowMore({ userId }: { userId: number }) {
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [page, setPage] = useState(2);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/links/mine?user=${userId}&page=${page}`);
      const body = await response.json();
      if (!response.ok) setError(body.error ?? "Something went wrong.");
      else {
        setLinks([...links, ...body.links]);
        setPage(page + 1);
      }
    } catch {
      setError("Stubby didn't answer. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {links.length > 0 && (
        <ul className="mt-3 divide-y-[3px] divide-ink rounded-3xl border-[3px] border-ink bg-white">
          {links.map((link) => (
            <LinkRow key={link.code} link={link} />
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={load}
        disabled={busy}
        className="mt-3 rounded-xl border-[3px] border-ink bg-white px-4 py-1.5 font-bold disabled:opacity-60"
      >
        {busy ? "Loading…" : "Show more"}
      </button>
      {error && (
        <p role="alert" className="mt-3 rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-medium">
          {error}
        </p>
      )}
    </>
  );
}
