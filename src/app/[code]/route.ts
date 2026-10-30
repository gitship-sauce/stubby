import { followLink } from "@/lib/links";
import { linkTarget } from "@/lib/link-target";

// A short page instead of bare text, still with status 404. The code comes from the address bar, so it is escaped.
function unknownLink(code: string): Response {
  const safe = code.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Unknown link · Stubby</title>
<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1.5rem;line-height:1.5">
<h1>Stubby doesn't know /${safe}.</h1>
<p>Check the link for typos, or ask whoever sent it for the full address.</p>
<p><a href="/">Make your own short link</a></p></body></html>`;
  return new Response(html, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

// Visiting /abc123 sends you on to the saved link.
export async function GET(request: Request, ctx: RouteContext<"/[code]">) {
  const { code } = await ctx.params;
  const url = await followLink(code);
  if (!url) return unknownLink(code);
  return Response.redirect(new URL(linkTarget({ code, url }), request.url), 307);
}
