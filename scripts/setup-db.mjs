// Creates the tables in your Neon database: pnpm db:setup. Safe to run again.
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Copy it from Neon into .env.local first.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
// Neon runs one statement per query, so the file is split at each statement's closing semicolon.
for (const statement of schema.split(/;\s*(?:\n|$)/).map((part) => part.trim()).filter(Boolean)) {
  await sql.query(statement);
}
console.log("Done: the tables are ready.");
