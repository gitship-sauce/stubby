// Removes links nobody will miss: made without an account, never clicked, older than --days.
//   pnpm cleanup --days 30
// The rules (a limit per run, the count first) live in src/lib/cleanup.ts, where tests/cleanup.test.mjs checks them.
import { createInterface } from "node:readline/promises";
import { neon } from "@neondatabase/serverless";
import { cleanup } from "../src/lib/cleanup.ts";
import { testCopyUrl } from "./test-copy.mjs";

const at = process.argv.indexOf("--days");
const days = Number(at === -1 ? NaN : process.argv[at + 1]);
if (!Number.isInteger(days) || days < 1) {
  console.error("Say how old a link must be: pnpm cleanup --days 30");
  process.exit(1);
}

const sql = neon(testCopyUrl());
const old = (d) => sql`user_id is null and clicks = 0 and created_at < now() - make_interval(days => ${d})`;
await cleanup(
  {
    countMatches: async (d) => (await sql`select count(*)::int as n from links where ${old(d)}`)[0].n,
    countAll: async () => (await sql`select count(*)::int as n from links`)[0].n,
    deleteMatches: async (d, max) =>
      (await sql`delete from links where code in (select code from links where ${old(d)} limit ${max}) returning code`)
        .length,
    ask: async (question) => {
      const prompt = createInterface({ input: process.stdin, output: process.stdout });
      try {
        return await prompt.question(question);
      } finally {
        prompt.close();
      }
    },
    say: (line) => console.log(line),
  },
  days,
);
