import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { checkPassword, hashPassword } from "@/lib/password";

export type User = { id: number; email: string };

const SESSION_COOKIE = "stubby_session";
const SESSION_DAYS = 30;
const RESET_MINUTES = 30;

const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");

// "Ana@Mail.com " and "ana@mail.com" are the same person.
export function normaliseEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const clean = email.trim().toLowerCase();
  return clean.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) ? clean : null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const rows = await sql`select id, email from users where email = ${email}`;
  return rows.length > 0 ? { id: Number(rows[0].id), email: rows[0].email as string } : null;
}

// Returns null when the email is already taken.
export async function createUser(email: string, password: string): Promise<User | null> {
  const hash = await hashPassword(password);
  const rows = await sql`
    insert into users (email, password_hash) values (${email}, ${hash})
    on conflict (email) do nothing
    returning id, email`;
  return rows.length > 0 ? { id: Number(rows[0].id), email: rows[0].email as string } : null;
}

// Made once, so a log-in for an email with no account still runs scrypt and takes as long as a real one.
let spareHash: Promise<string> | undefined;

export async function checkLogin(email: string, password: string): Promise<User | null> {
  const rows = await sql`select id, email, password_hash from users where email = ${email}`;
  if (rows.length === 0) {
    spareHash ??= hashPassword(randomBytes(16).toString("hex"));
    await checkPassword(password, await spareHash);
    return null;
  }
  const ok = await checkPassword(password, rows[0].password_hash as string);
  return ok ? { id: Number(rows[0].id), email: rows[0].email as string } : null;
}

export async function startSession(userId: number): Promise<void> {
  const token = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`insert into sessions (token_hash, user_id, expires_at) values (${sha256(token)}, ${userId}, ${expires})`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await sql`delete from sessions where token_hash = ${sha256(token)}`;
  store.delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await sql`
    select users.id, users.email from sessions join users on users.id = sessions.user_id
    where sessions.token_hash = ${sha256(token)} and sessions.expires_at > now()`;
  return rows.length > 0 ? { id: Number(rows[0].id), email: rows[0].email as string } : null;
}

// Returns the token for the email link. Only its hash is saved.
export async function createResetToken(userId: number): Promise<string> {
  const token = newToken();
  const expires = new Date(Date.now() + RESET_MINUTES * 60 * 1000);
  await sql`insert into password_resets (token_hash, user_id, expires_at) values (${sha256(token)}, ${userId}, ${expires})`;
  return token;
}

// Uses the token up, sets the new password and logs the account out everywhere. False if the link is bad or old.
export async function resetPassword(token: string, password: string): Promise<boolean> {
  const rows = await sql`
    update password_resets set used_at = now()
    where token_hash = ${sha256(token)} and used_at is null and expires_at > now()
    returning user_id`;
  if (rows.length === 0) return false;
  const userId = Number(rows[0].user_id);
  const hash = await hashPassword(password);
  await sql`update users set password_hash = ${hash} where id = ${userId}`;
  await sql`delete from sessions where user_id = ${userId}`;
  return true;
}

// Where links in emails point. Never built from the request's Host header, which a visitor can fake.
export function siteUrl(): string {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return production ? `https://${production}` : "http://localhost:3000";
}
