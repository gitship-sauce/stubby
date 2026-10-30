import type { SavedLink } from "@/lib/show-more";

// One row of Your links. Used by the first page (drawn on the server) and by Show more (in the browser).
export function LinkRow({ link }: { link: SavedLink }) {
  return (
    <li className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3">
      <a href={`/${link.code}`} className="font-mono font-bold underline decoration-2 underline-offset-2">/{link.code}</a>
      <span className="min-w-0 flex-1 truncate font-mono text-sm text-ink/70">{link.url}</span>
      <span className="font-mono text-sm">{link.clicks} {link.clicks === 1 ? "click" : "clicks"}</span>
    </li>
  );
}
