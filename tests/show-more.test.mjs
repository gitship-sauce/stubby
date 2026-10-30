// Runs before every build (pnpm build). No database: the login and the links are stand-ins.
import assert from "node:assert/strict";
import { test } from "node:test";
import { showMore } from "../src/lib/show-more.ts";

const myLinks = [{ code: "abc123", url: "https://example.com/page", clicks: 2, made: "2026-10-30T00:00:00.000Z" }];

test("Show more lists your next page of links", async () => {
  const needs = { currentUser: async () => ({ id: 7 }), listLinks: async () => myLinks };
  const answer = await showMore(needs, new URLSearchParams("user=7&page=2"));
  assert.deepEqual(answer, { status: 200, links: myLinks });
});

// Episode 4: Show more believed the user number the page sent, so anyone could read anyone's list by changing it.
test("Show more lists the logged-in user's links, whatever number the request sends", async () => {
  let listed = null;
  const needs = { currentUser: async () => ({ id: 7 }), listLinks: async (userId) => ((listed = userId), []) };
  await showMore(needs, new URLSearchParams("user=3&page=2"));
  assert.equal(listed, 7, `asked as user 7 for user 3 · listed user ${listed}'s links`);
});
