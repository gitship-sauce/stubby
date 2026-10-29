import { after } from "next/server";
import { createResetToken, findUserByEmail, normaliseEmail, siteUrl } from "@/lib/auth";
import { sendResetEmail } from "@/lib/email";
import { forgetOldResetTries, tooManyResetTries } from "@/lib/rate-limit";

// Every email gets these words, whether it has an account or not.
const SAME_ANSWER = "If that email has an account, a reset link is on its way.";

// The form on /forgot-password sends { email } here.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = normaliseEmail(body?.email);
  if (!email) return Response.json({ error: "That doesn't look like an email address." }, { status: 400 });

  // On Vercel the first x-forwarded-for address is the visitor's, set by Vercel itself.
  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (await tooManyResetTries(email, visitor)) {
    return Response.json({ error: "Too many tries. Wait 15 minutes, then try again." }, { status: 429 });
  }

  // Looking up the account and sending the email happen after the answer has gone,
  // so a real account and a made-up one get their answer just as fast.
  after(async () => {
    try {
      const user = await findUserByEmail(email);
      if (user) {
        const token = await createResetToken(user.id);
        await sendResetEmail(user.email, `${siteUrl()}/reset-password?token=${token}`);
      }
      await forgetOldResetTries();
    } catch (error) {
      console.error("Forgot password: the reset email wasn't sent.", error);
      throw error;
    }
  });

  return Response.json({ message: SAME_ANSWER });
}
