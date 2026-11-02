# Stubby

Long link in, short link out. Stubby also removes tracking junk like `?utm_source=...`.

Stubby is the app from the [Gitship Sauce](https://www.youtube.com/@gitship_sauce) series where a famous real failure breaks it each episode, and we fix it on camera. Each episode has two tags, so you can check out the app before and after the fix:

| Episode | Broken | Fixed |
| --- | --- | --- |
| 1. One regex took down Cloudflare | `ep1-broken` | `ep1-fixed` |
| 2. The forgot-password page that said who has an account | `ep2-broken` | `ep2-fixed` |
| 3. The old switch that broke every link | `ep3-broken` | `ep3-fixed` |
| 4. Heartbleed, and the user number Stubby believed | `ep4-broken` | `ep4-fixed` |
| 5. Amazon S3, and the cleanup with no limit | `ep5-broken` | `ep5-fixed` |

## Sandbox

[/sandbox](https://stubby-gitship.vercel.app/sandbox) has one tab per episode, each running only in your browser. Add `?ep=<number>` to open one episode's tab, e.g. [/sandbox?ep=4](https://stubby-gitship.vercel.app/sandbox?ep=4).

## Run it

1. Make a free database on [Neon](https://neon.tech) and copy its connection string.
2. `cp .env.example .env.local` and paste the string into `DATABASE_URL`. For reset and sign-up emails, make a free [Resend](https://resend.com) key and paste it into `RESEND_API_KEY`.
3. `pnpm install`, then `pnpm db:setup`, then `pnpm dev`.
4. Open http://localhost:3000

`pnpm build` runs `tests/link-target.test.mjs`, `tests/show-more.test.mjs` and `tests/cleanup.test.mjs` first, so a switch that sends short links anywhere but their saved site, a Show more that lists someone else's links, or a cleanup that deletes more than its limit, stops the build. `pnpm test` runs it with the link cleaning checks. `pnpm test:reset` checks that the forgot-password page gives every email the same answer in the same time; it needs Stubby running (see the top of `tests/forgot-password.e2e.mjs`).

## Your links

Log in and the home page lists the links you made, newest first, with the day each was made and a Copy button. It draws the first 20; **Show more** asks `/api/links/mine` for the next 20 at a time (`src/lib/show-more.ts`). Whose links comes from your login, never from a number in the request.

## Cleanup

`pnpm cleanup --days 30` removes links made without an account that were never clicked, once they are older than 30 days. It shows how many it will delete and asks you to type that number back; a run over 500 links stops with nothing deleted (`src/lib/cleanup.ts`).

It runs only against a Neon test branch, never your live database: make a branch, put its connection string in `.env.test-copy` as `DATABASE_URL=...`, and `pnpm seed:test-copy` fills it with 5,000 made-up links. Both scripts refuse to run if `.env.test-copy` is missing or points at the same database as `.env.local`.

## Signing up on the live site

The live site is a demo. Sign-up finishes with an email link, and without our own email domain Resend only delivers to our test inboxes, so a sign-up on stubby-gitship.vercel.app won't reach you. To try the sign-up fix, use the [sandbox](https://stubby-gitship.vercel.app/sandbox) or run Stubby yourself with your own Resend key.
