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
