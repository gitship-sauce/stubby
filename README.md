# Stubby

Long link in, short link out. Stubby also removes tracking junk like `?utm_source=...`.

Stubby is the app from the Gitship Sauce series where a famous real failure breaks it each episode, and we fix it on camera. Each episode has two tags, so you can check out the app before and after the fix:

| Episode | Broken | Fixed |
| --- | --- | --- |
| 1. One regex took down Cloudflare | `ep1-broken` | `ep1-fixed` |

## Run it

1. Make a free database on [Neon](https://neon.tech) and copy its connection string.
2. `cp .env.example .env.local` and paste the string into `DATABASE_URL`.
3. `pnpm install`, then `pnpm db:setup`, then `pnpm dev`.
4. Open http://localhost:3000

`pnpm test` checks the link cleaning.
