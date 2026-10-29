// Episode 2: the forgot-password page must not tell anyone which emails have an account.
// Needs Stubby running and an account to test with:
//   pnpm build && pnpm start
//   STUBBY_URL=http://localhost:3000 TEST_ACCOUNT_EMAIL=you@example.com pnpm test:reset (not part of pnpm test)
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { neon } from "@neondatabase/serverless";

const base = process.env.STUBBY_URL;
const account = process.env.TEST_ACCOUNT_EMAIL;
if (!base || !account || !process.env.DATABASE_URL) {
  throw new Error("Set STUBBY_URL and TEST_ACCOUNT_EMAIL (and DATABASE_URL in .env.local). See the top of this file.");
}
const sql = neon(process.env.DATABASE_URL);

// Each run pretends to be a new visitor, so earlier runs don't count against the limit.
// Only a local server trusts this header: on Vercel, Vercel sets it.
const visitor = `test-${randomUUID()}`;

async function ask(email) {
  const start = performance.now();
  const response = await fetch(`${base}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": visitor },
    body: JSON.stringify({ email }),
  });
  return { status: response.status, body: await response.text(), ms: performance.now() - start };
}

const median = (values) => values.toSorted((a, b) => a - b)[Math.floor(values.length / 2)];
const madeUp = () => `nobody-${randomUUID()}@example.com`;

test("a real account and a made-up email get the same words", async () => {
  await sql`delete from reset_tries where key = ${`email:${account}`}`;
  const real = await ask(account);
  const fake = await ask(madeUp());
  assert.equal(real.status, fake.status);
  assert.equal(real.body, fake.body);
});

test("a real account and a made-up email take the same time", async () => {
  await sql`delete from reset_tries where key = ${`email:${account}`}`;
  const real = [];
  const fake = [];
  for (let i = 0; i < 3; i++) {
    real.push((await ask(account)).ms);
    fake.push((await ask(madeUp())).ms);
  }
  const gap = Math.abs(median(real) - median(fake));
  assert.ok(gap < 100, `real ${median(real).toFixed(0)} ms vs made-up ${median(fake).toFixed(0)} ms: the clock gives accounts away`);
});

test("the sixth try for one email in 15 minutes is turned away", async () => {
  const email = madeUp();
  for (let i = 0; i < 5; i++) assert.equal((await ask(email)).status, 200);
  assert.equal((await ask(email)).status, 429);
});
