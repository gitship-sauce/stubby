import { resetPassword } from "@/lib/auth";
import { checkNewPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (typeof body?.token !== "string") return Response.json({ error: "This reset link is broken." }, { status: 400 });
  const problem = checkNewPassword(body?.password);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  const ok = await resetPassword(body.token, body.password);
  if (!ok) return Response.json({ error: "This reset link has expired or was already used. Ask for a new one." }, { status: 400 });
  return Response.json({ message: "Password changed. Log in with the new one." });
}
