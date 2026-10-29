// Sends through Resend (resend.com). Without our own domain, Resend only delivers from onboarding@resend.dev
// to the account owner and to its test inboxes (delivered+name@resend.dev).
export async function sendResetEmail(to: string, link: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is missing. Copy it from Resend into .env.local.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Stubby <onboarding@resend.dev>",
      to,
      subject: "Reset your Stubby password",
      text: `Someone asked to reset the password for this Stubby account.\n\nSet a new one here: ${link}\n\nThe link works once, for 30 minutes. If it wasn't you, ignore this email.`,
    }),
  });
  if (!response.ok) throw new Error(`Resend refused the email (${response.status}): ${await response.text()}`);
}
