// Runs before every build (pnpm build). No database: the counts and the prompt are stand-ins.
import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanup, LIMIT } from "../src/lib/cleanup.ts";

function stand(matches, typed = "") {
  const run = { deleted: null, asked: false, said: [] };
  const needs = {
    countMatches: async () => matches,
    countAll: async () => 5000,
    deleteMatches: async (_days, max) => ((run.deleted = Math.min(matches, max)), run.deleted),
    ask: async () => ((run.asked = true), typed),
    say: (line) => run.said.push(line),
  };
  return { needs, run };
}

// Episode 5: 30 days typed as 3 matched 3,000 links, and the old cleanup deleted them all.
test("a run over the limit stops before deleting anything", async () => {
  const { needs, run } = stand(3000);
  const result = await cleanup(needs, 3);
  assert.equal(result.deleted, 0);
  assert.equal(run.deleted, null, "deleted links on a run over the limit");
  assert.equal(run.asked, false);
  assert.deepEqual(run.said, [`Stopped: 3,000 is over the limit of ${LIMIT}. Nothing deleted.`]);
});

test("a normal run shows the count first and deletes after the number is typed back", async () => {
  const { needs, run } = stand(200, "200");
  const result = await cleanup(needs, 30);
  assert.equal(result.deleted, 200);
  assert.equal(run.said[0], "Will delete 200 of 5,000 links.");
});

test("a wrong number typed back deletes nothing", async () => {
  const { needs, run } = stand(200, "y");
  assert.equal((await cleanup(needs, 30)).deleted, 0);
  assert.equal(run.deleted, null);
});
