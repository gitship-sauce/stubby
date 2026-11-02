// Removes links nobody will miss: made without an account, never clicked, older than --days.
//   pnpm cleanup --days 30
import { neon } from "@neondatabase/serverless";
import { testCopyUrl } from "./test-copy.mjs";

const at = process.argv.indexOf("--days");
const days = Number(at === -1 ? NaN : process.argv[at + 1]);
if (!Number.isInteger(days) || days < 1) {
  console.error("Say how old a link must be: pnpm cleanup --days 30");
  process.exit(1);
}

const sql = neon(testCopyUrl());
const rows = await sql`
  delete from links
  where user_id is null and clicks = 0 and created_at < now() - make_interval(days => ${days})
  returning code`;
console.log(`Deleted ${rows.length.toLocaleString("en-GB")} links. Done.`);
