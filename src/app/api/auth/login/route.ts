import { checkLogin, normaliseEmail, startSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = normaliseEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password.slice(0, 128) : "";
  const user = email ? await checkLogin(email, password) : null;
  // One message for a wrong email and a wrong password, so this page doesn't say who has an account.
  if (!user) return Response.json({ error: "Wrong email or password." }, { status: 401 });
  await startSession(user.id);
  return Response.json({ email: user.email });
}
