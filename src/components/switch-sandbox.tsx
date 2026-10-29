"use client";

import { useState } from "react";

// A copy of Stubby's switch and one short link that runs only in this browser: nothing is sent to Stubby's server.
// It copies the real behaviour of ep3-broken and ep3-fixed: before the fix, the BETA switch turns on the safe
// sign-up reply and also the shelved preview page, which stops every link. After the fix, the preview is deleted
// and the reply has its own switch.
const VERSIONS = {
  before: { label: "Before the fix", switchName: "BETA", linkStops: true },
  after: { label: "After the fix", switchName: "SAFE_SIGNUP_REPLY", linkStops: false },
} as const;

type Version = keyof typeof VERSIONS;

const SAVED_SITE = "https://example.com/recipes/pancakes";

export function SwitchSandbox() {
  const [version, setVersion] = useState<Version>("before");
  const [on, setOn] = useState(false);
  const [clicked, setClicked] = useState(false);
  const page = VERSIONS[version];
  const stopped = on && page.linkStops;

  function pick(next: Version) {
    setVersion(next);
    setOn(false);
    setClicked(false);
  }

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

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => {
            setOn(!on);
            setClicked(false);
          }}
          className={`rounded-2xl border-[3px] border-ink px-5 py-3 font-mono font-bold shadow-[4px_4px_0_var(--color-ink)] ${on ? "bg-butter" : "bg-white"}`}
        >
          {page.switchName} = {on ? "on" : "off"}
        </button>
        <p className="text-sm text-muted">
          Sign-up reply: <span className="font-medium text-ink">{on ? "Check your inbox to finish signing up." : "An account with that email already exists."}</span>
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => setClicked(true)}
          className="rounded-2xl border-[3px] border-ink bg-tomato px-6 py-3 font-bold shadow-[4px_4px_0_var(--color-ink)]"
        >
          Click a Stubby link
        </button>
        <span className="font-mono text-sm text-muted">stubby-gitship.vercel.app/abc123 → {new URL(SAVED_SITE).host}</span>
      </div>

      {clicked && (
        <div role="status" className={`mt-6 rounded-2xl border-[3px] border-ink px-5 py-4 ${stopped ? "bg-tomato/20" : "bg-butter"}`}>
          {stopped ? (
            <>
              <p className="font-bold">Stuck on the preview page.</p>
              <p className="mt-1 text-sm">&ldquo;You&apos;re going to: example.com&rdquo;, with no button to go on. The old preview code still checks BETA.</p>
            </>
          ) : (
            <>
              <p className="font-bold">You reached the saved site.</p>
              <p className="mt-1 break-all font-mono text-sm">{SAVED_SITE}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
