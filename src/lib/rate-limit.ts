import { sql } from "@/lib/db";

const WINDOW_MINUTES = 15;
const PER_EMAIL = 5;
const PER_VISITOR = 20;

// Counts this request for the email and for the visitor, and says whether either is over its limit.
// The same queries run whether or not the email has an account, so the limit can't leak that either.
async function tooManyTries(emailKey: string, visitorKey: string): Promise<boolean> {
  await sql`insert into reset_tries (key) values (${emailKey}), (${visitorKey})`;
  const rows = await sql`
    select key, count(*)::int as tries from reset_tries
    where key in (${emailKey}, ${visitorKey}) and at > now() - make_interval(mins => ${WINDOW_MINUTES})
    group by key`;
  const tries = new Map(rows.map((row) => [row.key as string, row.tries as number]));
  return (tries.get(emailKey) ?? 0) > PER_EMAIL || (tries.get(visitorKey) ?? 0) > PER_VISITOR;
}

export async function tooManyResetTries(email: string, visitor: string): Promise<boolean> {
  return tooManyTries(`email:${email}`, `visitor:${visitor}`);
}

// Sign-up sends an email too, so it gets the same limits, counted on their own.
export async function tooManySignupTries(email: string, visitor: string): Promise<boolean> {
  return tooManyTries(`signup-email:${email}`, `signup-visitor:${visitor}`);
}

const LINKS_PER_VISITOR = 60;

// Shortening has its own limit, per visitor, so one script can't fill the database with links.
export async function tooManyLinks(visitor: string): Promise<boolean> {
  const key = `shorten-visitor:${visitor}`;
  await sql`insert into reset_tries (key) values (${key})`;
  const rows = await sql`
    select count(*)::int as tries from reset_tries
    where key = ${key} and at > now() - make_interval(mins => ${WINDOW_MINUTES})`;
  return (rows[0].tries as number) > LINKS_PER_VISITOR;
}

export async function forgetOldResetTries(): Promise<void> {
  await sql`delete from reset_tries where at < now() - interval '1 day'`;
}
