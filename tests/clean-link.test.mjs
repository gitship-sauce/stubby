// pnpm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { checkLink, cleanLink } from "../src/lib/clean-link.ts";

test("removes tracking junk and keeps the real parameters", () => {
  assert.equal(
    cleanLink("https://shop.example/shoes?size=9&utm_source=newsletter&fbclid=abc"),
    "https://shop.example/shoes?size=9",
  );
});

test("leaves a link with no parameters alone", () => {
  assert.equal(cleanLink("https://example.com/about"), "https://example.com/about");
});

test("rejects things that aren't web links", () => {
  assert.ok("error" in checkLink("hello"));
  assert.ok("error" in checkLink("javascript:alert(1)"));
});

// Episode 1: /.*=.*/ took 18 seconds on this link and froze Stubby for everyone.
test("a 200,000-character link is cleaned in under 50 ms", () => {
  const huge = "https://example.com/?" + "a".repeat(200_000);
  const start = performance.now();
  cleanLink(huge);
  assert.ok(performance.now() - start < 50, "cleaning a long link is slow again");
});

test("links over 2,048 characters are turned away", () => {
  assert.ok("error" in checkLink("https://example.com/?" + "a".repeat(2048)));
  assert.ok("url" in checkLink("https://example.com/?" + "a".repeat(1000)));
});
