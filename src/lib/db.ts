import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Copy it from Neon into .env.local.");
}

// Values put inside sql`...` are sent separately from the query, so they can't change it.
export const sql = neon(process.env.DATABASE_URL);
