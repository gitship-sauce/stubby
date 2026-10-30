// Runs before every build (pnpm build). No database: the login and the links are stand-ins.
import assert from "node:assert/strict";
import { test } from "node:test";
import { showMore } from "../src/lib/show-more.ts";

const myLinks = [{ code: "abc123", url: "https://example.com/page", clicks: 2 }];

test("Show more lists your next page of links", async () => {
  const needs = { currentUser: async () => ({ id: 7 }), listLinks: async () => myLinks };
  const answer = await showMore(needs, new URLSearchParams("user=7&page=2"));
  assert.deepEqual(answer, { status: 200, links: myLinks });
});
