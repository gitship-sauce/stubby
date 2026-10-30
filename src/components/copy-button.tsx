"use client";

import { useState } from "react";

// Copies a short link's full address, like https://stubby-gitship.vercel.app/abc123.
export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(`${window.location.origin}/${code}`);
        setCopied(true);
      }}
      className="rounded-lg border-2 border-ink bg-white px-2 py-0.5 text-sm font-bold"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
