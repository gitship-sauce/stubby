import { finishSignup, startSession } from "@/lib/auth";

// The button on /finish-signup sends { token } here. A button, not the link itself, so email scanners that open
// links can't use the token up.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const user = token ? await finishSignup(token) : null;
  if (!user) return Response.json({ error: "This link is broken or too old. Sign up again for a new one." }, { status: 400 });
  await startSession(user.id);
  return Response.json({ email: user.email });
}
