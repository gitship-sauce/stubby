// Fills the test copy with 5,000 made-up links (example.com), so the cleanup can be filmed without touching real ones.
// It empties the test copy's links table first. Run it again to start over: pnpm seed:test-copy
import { randomInt } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { testCopyUrl } from "./test-copy.mjs";

const sql = neon(testCopyUrl());
const letters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const code = () => Array.from({ length: 6 }, () => letters[randomInt(letters.length)]).join("");
const day = 24 * 60 * 60 * 1000;

const [user] = await sql`
  insert into users (email, password_hash) values ('made-up@example.com', 'no-login')
  on conflict (email) do update set email = excluded.email
  returning id`;

// The groups the cleanup rule sees. The monthly cleanup keeps old unclicked links few, so most of them are recent.
const groups = [
  { count: 200, account: false, clicks: 0, from: 31, to: 60 }, // past 30 days: what a normal run removes
  { count: 2800, account: false, clicks: 0, from: 4, to: 29 }, // newer, not clicked yet
  { count: 400, account: false, clicks: 0, from: 0, to: 2 }, // made in the last two days
  { count: 1000, account: false, clicks: 1, from: 0, to: 60 }, // clicked at least once
  { count: 600, account: true, clicks: 0, from: 0, to: 60 }, // made by someone logged in
];

const used = new Set();
const codes = [], urls = [], userIds = [], clicks = [], made = [];
for (const g of groups) {
  for (let i = 0; i < g.count; i++) {
    let c;
    do c = code(); while (used.has(c));
    used.add(c);
    codes.push(c);
    urls.push(`https://example.com/made-up/${codes.length}`);
    userIds.push(g.account ? user.id : null);
    clicks.push(g.clicks === 0 ? 0 : 1 + randomInt(40));
    // Ages are spread inside each group, with half a day of margin from every boundary.
    const age = g.from + 0.5 + Math.random() * (g.to - g.from);
    made.push(new Date(Date.now() - age * day).toISOString());
  }
}

await sql`delete from links`;
await sql`
  insert into links (code, url, user_id, clicks, created_at)
  select * from unnest(${codes}::text[], ${urls}::text[], ${userIds}::bigint[], ${clicks}::int[], ${made}::timestamptz[])`;
const [{ n }] = await sql`select count(*)::int as n from links`;
console.log(`The test copy has ${n.toLocaleString("en-GB")} made-up links.`);
