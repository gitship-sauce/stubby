import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { peekLink } from "@/lib/links";

export const metadata: Metadata = { title: "Where this link goes · Stubby" };

// Beta: shows where a short link goes before the visitor leaves Stubby.
export default function Preview({ params }: PageProps<"/preview/[code]">) {
  return (
    <PageShell title="You're going to:">
      <Suspense fallback={null}>
        <Destination params={params} />
      </Suspense>
    </PageShell>
  );
}

async function Destination({ params }: Pick<PageProps<"/preview/[code]">, "params">) {
  const { code } = await params;
  const url = await peekLink(code);
  if (!url) notFound();
  return (
    <>
      <p className="max-w-2xl break-all rounded-2xl border-[3px] border-ink bg-white px-5 py-4 font-mono text-xl">{new URL(url).host}</p>
      <p className="mt-4 max-w-2xl break-all text-muted">{url}</p>
    </>
  );
}
