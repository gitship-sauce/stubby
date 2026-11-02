// The cleanup removes links made without an account that were never clicked, once they are older than `days`. The
// database and the prompt are passed in, so a test can run this exact code without either.
//
// One run may delete at most LIMIT links. A normal monthly run removes about 200, so a run far bigger than that is
// almost always a wrong input (30 days typed as 3 deleted 3,000 of 5,000 on our test copy: Why It Broke, episode 5).
// Over the limit it stops with nothing deleted. A real bigger cleanup means raising LIMIT in a reviewed change.
export const LIMIT = 500;

export type CleanupNeeds = {
  countMatches: (days: number) => Promise<number>;
  countAll: () => Promise<number>;
  // Deletes at most `max` matching links and returns how many went, so links that turn old between the count and
  // the delete can't push a run past the number that was confirmed.
  deleteMatches: (days: number, max: number) => Promise<number>;
  ask: (question: string) => Promise<string>;
  say: (line: string) => void;
};

const n = (value: number) => value.toLocaleString("en-GB");

export async function cleanup(needs: CleanupNeeds, days: number): Promise<{ deleted: number }> {
  if (!Number.isInteger(days) || days < 1) throw new Error("days must be a whole number, 1 or more");
  const count = await needs.countMatches(days);
  if (count > LIMIT) {
    needs.say(`Stopped: ${n(count)} is over the limit of ${LIMIT}. Nothing deleted.`);
    return { deleted: 0 };
  }
  if (count === 0) {
    needs.say("Nothing to delete.");
    return { deleted: 0 };
  }
  needs.say(`Will delete ${n(count)} of ${n(await needs.countAll())} links.`);
  // Typing the number back makes you read it; "y" can be typed without looking.
  const typed = await needs.ask(`Type ${count} to go on: `);
  if (typed.trim() !== String(count)) {
    needs.say("That's not the number. Nothing deleted.");
    return { deleted: 0 };
  }
  const deleted = await needs.deleteMatches(days, count);
  needs.say(`Deleted ${n(deleted)} links.`);
  return { deleted };
}
