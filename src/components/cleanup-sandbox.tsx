"use client";

import { useState } from "react";

// 5,000 made-up links, kept in this browser: nothing is sent to Stubby's server. The mix copies the test copy we
// filmed on (scripts/seed-test-copy.mjs). The cleanup only takes links made without an account and never clicked,
// once they are older than the days typed. Ages are spread evenly inside each group, so the counts match the video.
const TOTAL = 5000;
const UNCLICKED_AGES = [
  ...spread(200, 31.5, 60.5),
  ...spread(2800, 4.5, 29.5),
  ...spread(400, 0.5, 2.5),
];
const LIMIT = 500;
const PER_SQUARE = 50;

function spread(count: number, from: number, to: number) {
  return Array.from({ length: count }, (_, i) => from + ((to - from) * i) / (count - 1));
}

const VERSIONS = {
  before: { label: "Before the fix", hasLimit: false },
  after: { label: "After the fix", hasLimit: true },
} as const;

type Version = keyof typeof VERSIONS;
type Result = { matched: number; deleted: number; stopped: boolean };

export function CleanupSandbox() {
  const [version, setVersion] = useState<Version>("before");
  const [days, setDays] = useState("30");
  const [result, setResult] = useState<Result | null>(null);

  function run() {
    const n = Number(days);
    if (!Number.isInteger(n) || n < 1) return;
    const matched = UNCLICKED_AGES.filter((age) => age > n).length;
    const stopped = VERSIONS[version].hasLimit && matched > LIMIT;
    setResult({ matched, deleted: stopped ? 0 : matched, stopped });
  }

  const left = TOTAL - (result?.deleted ?? 0);
  const squares = TOTAL / PER_SQUARE;
  const gone = Math.round((result?.deleted ?? 0) / PER_SQUARE);

  return (
    <div className="rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-ink)]">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Which version">
        {(Object.keys(VERSIONS) as Version[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setVersion(key);
              setResult(null);
            }}
            aria-pressed={version === key}
            className={`rounded-xl border-[3px] border-ink px-4 py-1.5 font-bold ${version === key ? (key === "before" ? "bg-tomato" : "bg-butter") : "bg-white"}`}
          >
            {VERSIONS[key].label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted">
        The rule: links made without an account, never clicked, older than 30 days. A normal run removes about 200.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <label className="flex items-center rounded-2xl border-[3px] border-ink bg-white font-mono">
          <span className="px-3 text-muted">pnpm cleanup --days</span>
          <input
            value={days}
            onChange={(event) => {
              setDays(event.target.value.replace(/\D/g, "").slice(0, 3));
              setResult(null);
            }}
            inputMode="numeric"
            aria-label="Days"
            className="w-16 rounded-r-xl border-l-[3px] border-ink px-3 py-2 font-bold outline-none"
          />
        </label>
        <button
          type="button"
          onClick={run}
          className="rounded-2xl border-[3px] border-ink bg-tomato px-6 py-2 font-bold shadow-[4px_4px_0_var(--color-ink)]"
        >
          Run cleanup
        </button>
        <span className="text-sm text-muted">Try 3.</span>
      </div>

      <div className="mt-6 grid grid-cols-20 gap-1" aria-hidden="true">
        {Array.from({ length: squares }, (_, i) => (
          <span key={i} className={`h-4 rounded-sm border-2 border-ink ${i < squares - gone ? "bg-butter" : "bg-white opacity-30"}`} />
        ))}
      </div>
      <p className="mt-2 text-sm text-muted">Each square is {PER_SQUARE} links. {left.toLocaleString("en-GB")} of {TOTAL.toLocaleString("en-GB")} left.</p>

      {result && (
        <div role="status" className={`mt-4 rounded-2xl border-[3px] border-ink px-5 py-4 font-mono ${result.stopped || result.deleted <= LIMIT ? "bg-butter" : "bg-tomato/20"}`}>
          {result.stopped
            ? `Stopped: ${result.matched.toLocaleString("en-GB")} is over the limit of ${LIMIT}. Nothing deleted.`
            : `Deleted ${result.deleted.toLocaleString("en-GB")} links.${VERSIONS[version].hasLimit ? "" : " Done."}`}
        </div>
      )}
    </div>
  );
}
