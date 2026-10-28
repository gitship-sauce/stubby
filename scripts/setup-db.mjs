// Creates the links table in your Neon database: pnpm db:setup
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Copy it from Neon into .env.local first.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
await sql.query(schema);
console.log("Done: the links table is ready.");
