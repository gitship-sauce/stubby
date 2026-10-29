// Sends through Resend (resend.com). Without our own domain, Resend only delivers from onboarding@resend.dev
// to the account owner and to its test inboxes (delivered+name@resend.dev).
async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is missing. Copy it from Resend into .env.local.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Stubby <onboarding@resend.dev>", to, subject, text }),
  });
  if (!response.ok) throw new Error(`Resend refused the email (${response.status}): ${await response.text()}`);
}

export async function sendResetEmail(to: string, link: string): Promise<void> {
  await sendEmail(
    to,
    "Reset your Stubby password",
    `Someone asked to reset the password for this Stubby account.\n\nSet a new one here: ${link}\n\nThe link works once, for 30 minutes. If it wasn't you, ignore this email.`,
  );
}

export async function sendFinishSignupEmail(to: string, link: string): Promise<void> {
  await sendEmail(
    to,
    "Finish signing up to Stubby",
    `Someone used this email to sign up to Stubby.\n\nTo finish, open this link: ${link}\n\nThe link works once, for 24 hours. If it wasn't you, ignore this email.`,
  );
}

// Sent instead of a sign-up link when the email already has an account, so the sign-up page never has to say so.
export async function sendSignupAttemptEmail(to: string, loginLink: string, resetLink: string): Promise<void> {
  await sendEmail(
    to,
    "Someone tried to sign up with your email",
    `Someone tried to make a Stubby account with this email, but you already have one.\n\nLog in here: ${loginLink}\nForgot your password? ${resetLink}\n\nIf it wasn't you, you can ignore this email.`,
  );
}
