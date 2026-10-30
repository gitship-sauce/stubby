"use client";

import { useState } from "react";

// Two made-up accounts and their lists, kept in this browser: nothing is sent to Stubby's server. It copies the real
// behaviour of ep4-broken and ep4-fixed: before the fix, Show more lists whichever user number the request sends;
// after the fix, it lists the logged-in user's links and ignores the number.
const LISTS: Record<number, { who: string; links: string[] }> = {
  3: { who: "Ana", links: ["docs.example.com/team/salaries-draft", "example.com/flat-viewing-friday", "example.com/surprise-party-plans"] },
  7: { who: "you", links: ["example.com/recipes/pancakes", "example.com/bike-for-sale", "example.com/holiday-photos"] },
};

const LOGGED_IN = 7;

const VERSIONS = {
  before: { label: "Before the fix", believesNumber: true },
  after: { label: "After the fix", believesNumber: false },
} as const;

type Version = keyof typeof VERSIONS;

export function NumberSandbox() {
  const [version, setVersion] = useState<Version>("before");
  const [asked, setAsked] = useState("7");
  const [shown, setShown] = useState<number | null>(null);

  function pick(next: Version) {
    setVersion(next);
    setShown(null);
  }

  function send() {
    const number = Number(asked);
    setShown(VERSIONS[version].believesNumber ? number : LOGGED_IN);
  }

  const list = shown === null ? null : LISTS[shown];

  return (
    <div className="rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-ink)]">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Which version">
        {(Object.keys(VERSIONS) as Version[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => pick(key)}
            aria-pressed={version === key}
            className={`rounded-xl border-[3px] border-ink px-4 py-1.5 font-bold ${version === key ? (key === "before" ? "bg-tomato" : "bg-butter") : "bg-white"}`}
          >
            {VERSIONS[key].label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted">
        You are logged in as user <span className="font-mono font-bold text-ink">{LOGGED_IN}</span>. Show more sends:
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label className="flex items-center rounded-2xl border-[3px] border-ink bg-white font-mono">
          <span className="px-3 text-muted">/api/links/mine?user=</span>
          <input
            value={asked}
            onChange={(event) => {
              setAsked(event.target.value.replace(/\D/g, "").slice(0, 3));
              setShown(null);
            }}
            inputMode="numeric"
            aria-label="User number in the request"
            className="w-14 rounded-r-xl border-l-[3px] border-ink px-3 py-2 font-bold outline-none"
          />
        </label>
        <button
          type="button"
          onClick={send}
          className="rounded-2xl border-[3px] border-ink bg-tomato px-6 py-2 font-bold shadow-[4px_4px_0_var(--color-ink)]"
        >
          Show more
        </button>
        <span className="text-sm text-muted">Try 3.</span>
      </div>

      {shown !== null && (
        <div role="status" className={`mt-6 rounded-2xl border-[3px] border-ink px-5 py-4 ${shown !== LOGGED_IN ? "bg-tomato/20" : "bg-butter"}`}>
          {list ? (
            <>
              <p className="font-bold">{shown === LOGGED_IN ? "Your links." : `${list.who}'s links. You aren't ${list.who}.`}</p>
              <ul className="mt-2 font-mono text-sm">
                {list.links.map((link) => (
                  <li key={link} className="break-all">{link}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="font-bold">User {shown} has no links in this copy. Try 3 or 7.</p>
          )}
        </div>
      )}
    </div>
  );
}
