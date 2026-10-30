"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

export type SandboxEpisode = { n: number; title: string; panel: ReactNode };

// One tab per episode. ?ep=<number> opens that episode's tab, so each video can link straight to its own test.
export function SandboxTabs({ episodes, active, onPick }: { episodes: SandboxEpisode[]; active: number; onPick?: (n: number) => void }) {
  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Episodes">
        {episodes.map((e) => (
          <button
            key={e.n}
            type="button"
            role="tab"
            id={`tab-${e.n}`}
            aria-selected={e.n === active}
            aria-controls={`panel-${e.n}`}
            onClick={() => onPick?.(e.n)}
            className={`rounded-xl border-[3px] border-ink px-4 py-2 text-left font-bold ${e.n === active ? "bg-butter shadow-[4px_4px_0_var(--color-ink)]" : "bg-white"}`}
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted">Episode {e.n}</span>
            <span className="block">{e.title}</span>
          </button>
        ))}
      </div>
      {episodes.map((e) => (
        <section key={e.n} role="tabpanel" id={`panel-${e.n}`} aria-labelledby={`tab-${e.n}`} hidden={e.n !== active} className="mt-8">
          {e.panel}
        </section>
      ))}
    </div>
  );
}

// Reads ?ep= from the address and keeps it in step with the tab that's open. The page itself stays static.
export function SandboxTabsFromUrl({ episodes }: { episodes: SandboxEpisode[] }) {
  const router = useRouter();
  const asked = Number(useSearchParams().get("ep"));
  const latest = episodes[episodes.length - 1].n;
  const active = episodes.some((e) => e.n === asked) ? asked : latest;
  return <SandboxTabs episodes={episodes} active={active} onPick={(n) => router.replace(`?ep=${n}`, { scroll: false })} />;
}
