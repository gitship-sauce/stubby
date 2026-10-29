# Stubby

Long link in, short link out. Stubby also removes tracking junk like `?utm_source=...`.

Stubby is the app from the [Gitship Sauce](https://www.youtube.com/@gitship_sauce) series where a famous real failure breaks it each episode, and we fix it on camera. Each episode has two tags, so you can check out the app before and after the fix:

| Episode | Broken | Fixed |
| --- | --- | --- |
| 1. One regex took down Cloudflare | `ep1-broken` | `ep1-fixed` |
| 2. The forgot-password page that said who has an account | `ep2-broken` | `ep2-fixed` |

## Run it

1. Make a free database on [Neon](https://neon.tech) and copy its connection string.
2. `cp .env.example .env.local` and paste the string into `DATABASE_URL`. For reset emails, make a free [Resend](https://resend.com) key and paste it into `RESEND_API_KEY`.
3. `pnpm install`, then `pnpm db:setup`, then `pnpm dev`.
4. Open http://localhost:3000

`pnpm test` checks the link cleaning. `pnpm test:reset` checks that the forgot-password page gives every email the same answer in the same time; it needs Stubby running (see the top of `tests/forgot-password.e2e.mjs`).
