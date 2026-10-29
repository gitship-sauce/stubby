import { createResetToken, findUserByEmail, normaliseEmail, siteUrl } from "@/lib/auth";
import { sendResetEmail } from "@/lib/email";

// The form on /forgot-password sends { email } here.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = normaliseEmail(body?.email);
  if (!email) return Response.json({ error: "That doesn't look like an email address." }, { status: 400 });

  const user = await findUserByEmail(email);
  if (!user) return Response.json({ error: "No account found with that email." }, { status: 404 });

  const token = await createResetToken(user.id);
  await sendResetEmail(user.email, `${siteUrl()}/reset-password?token=${token}`);
  return Response.json({ message: "Check your inbox for a reset link." });
}
