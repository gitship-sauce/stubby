import { randomInt } from "node:crypto";
import { sql } from "@/lib/db";

// No 0/O or 1/l/I, so a code read out loud can't be typed wrong.
const letters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) code += letters[randomInt(letters.length)];
  return code;
}

// Saves the link under a new short code and returns the code. userId is set when someone logged in made it.
export async function saveLink(url: string, userId: number | null = null): Promise<string> {
  // 56 letters, 6 places: 30 billion codes, so a clash is rare. Try again if one happens.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = makeCode();
    const rows = await sql`
      insert into links (code, url, user_id) values (${code}, ${url}, ${userId})
      on conflict (code) do nothing
      returning code`;
    if (rows.length > 0) return code;
  }
  throw new Error("Couldn't find a free short code after 5 tries.");
}

// Counts the click and returns where the code points, or null if there's no such code.
export async function followLink(code: string): Promise<string | null> {
  const rows = await sql`
    update links set clicks = clicks + 1 where code = ${code}
    returning url`;
  return rows.length > 0 ? (rows[0].url as string) : null;
}

export async function getStats(): Promise<{ links: number; clicks: number }> {
  const rows = await sql`select count(*)::int as links, coalesce(sum(clicks), 0)::int as clicks from links`;
  return { links: rows[0].links as number, clicks: rows[0].clicks as number };
}

export type SavedLink = { code: string; url: string; clicks: number };

// The 20 newest links someone made while logged in.
export async function listLinks(userId: number): Promise<SavedLink[]> {
  const rows = await sql`
    select code, url, clicks from links where user_id = ${userId}
    order by created_at desc limit 20`;
  return rows.map((row) => ({ code: row.code as string, url: row.url as string, clicks: row.clicks as number }));
}
