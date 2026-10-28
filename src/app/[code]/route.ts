import { followLink } from "@/lib/links";

// Visiting /abc123 sends you on to the saved link.
export async function GET(_request: Request, ctx: RouteContext<"/[code]">) {
  const { code } = await ctx.params;
  const url = await followLink(code);
  if (!url) return new Response("Stubby doesn't know that link.", { status: 404 });
  return Response.redirect(url, 307);
}
