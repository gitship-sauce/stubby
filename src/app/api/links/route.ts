import { currentUser } from "@/lib/auth";
import { checkLink } from "@/lib/clean-link";
import { saveLink } from "@/lib/links";
import { tooManyLinks } from "@/lib/rate-limit";

// The form on the home page sends { url } here and gets back the short code.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.url !== "string") {
    return Response.json({ error: "Send the link as { url: \"https://...\" }." }, { status: 400 });
  }
  // On Vercel the first x-forwarded-for address is the visitor's, set by Vercel itself.
  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (await tooManyLinks(visitor)) {
    return Response.json({ error: "That's a lot of links. Wait 15 minutes, then try again." }, { status: 429 });
  }

  const checked = checkLink(body.url);
  if ("error" in checked) return Response.json(checked, { status: 400 });

  const user = await currentUser();
  const code = await saveLink(checked.url, user?.id ?? null);
  return Response.json({ code, url: checked.url }, { status: 201 });
}
