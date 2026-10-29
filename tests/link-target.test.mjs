// Runs before every build (pnpm build), with that deploy's own settings. On Vercel a settings change only takes
// effect on the next deploy, so flipping a switch runs this too, and a failing test stops the deploy.
import assert from "node:assert/strict";
import { test } from "node:test";
import { linkTarget } from "../src/lib/link-target.ts";

// Episode 3: turning on an old switch sent every short link to an unfinished preview page.
test("a short link goes to its saved site", () => {
  const link = { code: "abc123", url: "https://example.com/page" };
  assert.equal(linkTarget(link), link.url, "a short link no longer goes to its saved site");
});
