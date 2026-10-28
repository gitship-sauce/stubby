"use client";

import { useEffect, useRef, useState } from "react";

// Runs in a Web Worker on the visitor's own device, so the slow check never touches Stubby's server.
// The broken check is the exact line from the ep1-broken tag; the fixed one is what Stubby runs now.
const workerCode = `
onmessage = (event) => {
  const { check, length } = event.data;
  const link = "https://example.com/?" + "a".repeat(length);
  const start = performance.now();
  if (check === "broken") /.*=.*/.test(link);
  else new URL(link).searchParams.keys();
  postMessage(performance.now() - start);
};`;

const LENGTHS = [25_000, 50_000, 100_000, 200_000];
const GIVE_UP_AFTER_MS = 60_000;

type Run = { check: "broken" | "fixed"; length: number; ms: number | null; stopped?: boolean };

export function RegexSandbox() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [running, setRunning] = useState<Run | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const runningRef = useRef<Run | null>(null);
  const worker = useRef<Worker | null>(null);
  const timers = useRef<{ tick?: number; giveUp?: number }>({});

  function stop(stopped: boolean, ms: number | null) {
    worker.current?.terminate();
    worker.current = null;
    window.clearInterval(timers.current.tick);
    window.clearTimeout(timers.current.giveUp);
    const current = runningRef.current;
    runningRef.current = null;
    setRunning(null);
    if (current) setRuns((done) => [{ ...current, ms, stopped }, ...done]);
  }

  function start(check: Run["check"], length: number) {
    const run: Run = { check, length, ms: null };
    const blob = new Blob([workerCode], { type: "text/javascript" });
    worker.current = new Worker(URL.createObjectURL(blob));
    worker.current.onmessage = (event: MessageEvent<number>) => stop(false, event.data);
    const began = performance.now();
    setElapsed(0);
    runningRef.current = run;
    setRunning(run);
    timers.current.tick = window.setInterval(() => setElapsed(performance.now() - began), 100);
    timers.current.giveUp = window.setTimeout(() => stop(true, null), GIVE_UP_AFTER_MS);
    worker.current.postMessage({ check, length });
  }

  useEffect(() => () => worker.current?.terminate(), []);

  return (
    <div className="rounded-3xl border-[3px] border-ink bg-white p-6 shadow-[6px_6px_0_var(--color-ink)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckCard
          title="Broken check (episode 1)"
          code="if (!/.*=.*/.test(link)) return link;"
          tone="bg-tomato"
          disabled={running !== null}
          onRun={(length) => start("broken", length)}
        />
        <CheckCard
          title="Fixed check (Stubby today)"
          code="const url = new URL(link);"
          tone="bg-butter"
          disabled={running !== null}
          onRun={(length) => start("fixed", length)}
        />
      </div>

      <div className="mt-6 min-h-24 rounded-2xl border-[3px] border-ink bg-paper p-5" aria-live="polite">
        {running ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-lg">
              {running.check === "broken" ? "Broken" : "Fixed"} check, {running.length.toLocaleString("en-GB")} characters:{" "}
              <span className="text-3xl font-bold">{(elapsed / 1000).toFixed(1)} s</span>
            </p>
            <button
              type="button"
              onClick={() => stop(true, null)}
              className="rounded-xl border-[3px] border-ink bg-white px-4 py-1.5 font-bold"
            >
              Stop
            </button>
          </div>
        ) : (
          <p className="text-muted">Pick a link length above. Try the broken check at 25,000, then double it.</p>
        )}
      </div>

      {runs.length > 0 && (
        <table className="mt-6 w-full font-mono text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="py-1 font-normal">Check</th>
              <th className="py-1 font-normal">Link length</th>
              <th className="py-1 text-right font-normal">Time</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run, index) => (
              <tr key={index} className="border-t-2 border-ink/10">
                <td className="py-1.5">{run.check}</td>
                <td className="py-1.5">{run.length.toLocaleString("en-GB")}</td>
                <td className="py-1.5 text-right font-bold">
                  {run.ms === null ? "stopped" : run.ms < 1000 ? `${run.ms.toFixed(1)} ms` : `${(run.ms / 1000).toFixed(1)} s`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function CheckCard(props: {
  title: string;
  code: string;
  tone: string;
  disabled: boolean;
  onRun: (length: number) => void;
}) {
  return (
    <div className={`rounded-2xl border-[3px] border-ink p-4 ${props.tone}`}>
      <p className="font-bold">{props.title}</p>
      <code className="mt-2 block break-all rounded-lg bg-ink px-3 py-2 font-mono text-sm text-paper">{props.code}</code>
      <div className="mt-3 flex flex-wrap gap-2">
        {LENGTHS.map((length) => (
          <button
            key={length}
            type="button"
            disabled={props.disabled}
            onClick={() => props.onRun(length)}
            className="rounded-xl border-[3px] border-ink bg-white px-3 py-1 font-mono text-sm font-bold disabled:opacity-50"
          >
            {length.toLocaleString("en-GB")}
          </button>
        ))}
      </div>
    </div>
  );
}
