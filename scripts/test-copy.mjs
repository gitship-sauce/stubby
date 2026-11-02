// The cleanup and seed scripts delete rows, so they only ever run against a Neon test branch, never the live database.
// The branch's address lives in .env.test-copy; .env.local keeps the live one for the app.
import { readFileSync } from "node:fs";

function databaseUrl(file) {
  let text;
  try {
    text = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  } catch {
    return null;
  }
  const line = text.split("\n").find((l) => l.startsWith("DATABASE_URL="));
  return line ? line.slice("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "") : null;
}

export function testCopyUrl() {
  const testCopy = databaseUrl(".env.test-copy");
  if (!testCopy) {
    console.error("No test copy: make a Neon branch and put its DATABASE_URL in .env.test-copy first.");
    process.exit(1);
  }
  if (testCopy === databaseUrl(".env.local")) {
    console.error(".env.test-copy points at the live database. Use a Neon branch, never the real one.");
    process.exit(1);
  }
  return testCopy;
}
