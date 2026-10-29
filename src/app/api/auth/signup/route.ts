import { createUser, normaliseEmail, startSession } from "@/lib/auth";
import { checkNewPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = normaliseEmail(body?.email);
  if (!email) return Response.json({ error: "That doesn't look like an email address." }, { status: 400 });
  const problem = checkNewPassword(body?.password);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  const user = await createUser(email, body.password);
  if (!user) return Response.json({ error: "An account with that email already exists." }, { status: 409 });
  await startSession(user.id);
  return Response.json({ email: user.email }, { status: 201 });
}
