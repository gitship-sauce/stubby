import { after } from "next/server";
import { createSignupToken, createUser, findUserByEmail, normaliseEmail, siteUrl, startSession } from "@/lib/auth";
import { sendFinishSignupEmail, sendSignupAttemptEmail } from "@/lib/email";
import { checkNewPassword, hashPassword } from "@/lib/password";
import { tooManySignupTries } from "@/lib/rate-limit";

// Every email gets these words, whether it has an account or not.
const SAME_REPLY = "Check your inbox to finish signing up.";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = normaliseEmail(body?.email);
  if (!email) return Response.json({ error: "That doesn't look like an email address." }, { status: 400 });
  const problem = checkNewPassword(body?.password);
  if (problem) return Response.json({ error: problem }, { status: 400 });

  if (process.env.BETA === "on") {
    // On Vercel the first x-forwarded-for address is the visitor's, set by Vercel itself.
    const visitor = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (await tooManySignupTries(email, visitor)) {
      return Response.json({ error: "Too many tries. Wait 15 minutes, then try again." }, { status: 429 });
    }
    // Hashed for every email, so a taken one takes as long as a new one.
    const passwordHash = await hashPassword(body.password);
    // The account check and the email happen after the reply has gone, so the reply can't give an account away.
    after(async () => {
      try {
        if (await findUserByEmail(email)) {
          await sendSignupAttemptEmail(email, `${siteUrl()}/login`, `${siteUrl()}/forgot-password`);
        } else {
          const token = await createSignupToken(email, passwordHash);
          await sendFinishSignupEmail(email, `${siteUrl()}/finish-signup?token=${token}`);
        }
      } catch (error) {
        console.error("Sign-up: the email wasn't sent.", error);
        throw error;
      }
    });
    return Response.json({ message: SAME_REPLY });
  }

  const user = await createUser(email, body.password);
  if (!user) return Response.json({ error: "An account with that email already exists." }, { status: 409 });
  await startSession(user.id);
  return Response.json({ email: user.email }, { status: 201 });
}
