import { followLink } from "@/lib/links";
import { linkTarget } from "@/lib/link-target";

// Visiting /abc123 sends you on to the saved link.
export async function GET(request: Request, ctx: RouteContext<"/[code]">) {
  const { code } = await ctx.params;
  const url = await followLink(code);
  if (!url) return new Response("Stubby doesn't know that link.", { status: 404 });
  return Response.redirect(new URL(linkTarget({ code, url }), request.url), 307);
}
