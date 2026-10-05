# Instagram feed

The homepage pulls the club's latest Instagram posts in automatically. This is how it
works and what to do when it breaks.

## What you need once

Instagram's API is only open to **professional** accounts. A personal account has no API
access at all — there is no key to request, and third-party widgets hit the same wall
because they use the same API.

1. **@ecell_jntuh must be a Professional account** — Creator or Business.
   Creator is the better default: Business accounts get a restricted music library in
   Reels, which the social team will notice. Both work identically here.
2. A **Meta app** of type **Business** at `developers.facebook.com`, with the **Instagram**
   product added.
3. A **long-lived access token**, generated from
   _Instagram → API setup with Instagram business login → Generate token_.
   Dashboard tokens last 60 days; the login-flow ones last an hour, so use the dashboard.

The permission involved is `instagram_business_basic`, which is **read-only** — it cannot
post, delete or read DMs.

## Secrets

All three live in **GitHub → Settings → Secrets and variables → Actions**. None of them go
to Vercel: the sync runs in CI and commits the result, so the deploy needs no credentials.
That matters because this repository is public.

| Secret            | What it is                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| `IG_ACCESS_TOKEN` | the long-lived token. Rotated automatically — see below                  |
| `IG_USER_ID`      | the numeric account id, from `/me?fields=user_id`                        |
| `GH_PAT`          | fine-grained PAT, this repo only, **Contents** + **Secrets** read/write  |

`GH_PAT` exists because `GITHUB_TOKEN` cannot write secrets, and the refresh job has to
overwrite `IG_ACCESS_TOKEN` with the new value. **It is the one credential that cannot
renew itself** — set a calendar reminder for whenever you set it to expire.

## How it runs

- **`sync-instagram.yml`** polls every 10 minutes. Instagram publishes no "new post"
  webhook, so polling is the only option. The first job makes one cheap call comparing the
  newest post id against what is committed; only a genuine change triggers the second job,
  which downloads the images, optimises them through `sharp`, rewrites
  `src/content/instagram.ts` and commits. The push is what triggers the Vercel deploy.
- **`refresh-instagram-token.yml`** runs fortnightly and exchanges the token for a fresh
  60 days.

Expect a new post to be live in **10–20 minutes**: the poll interval, plus GitHub's own
scheduling delay, plus the build.

## Run it by hand

```bash
cd frontend
IG_ACCESS_TOKEN=... IG_USER_ID=... pnpm sync-instagram
```

Or trigger either workflow from the Actions tab — both accept `workflow_dispatch`.

## When it breaks

**The feed stopped updating.** Check the Actions tab. A failing `check` job with a warning
about the latest post id almost always means the token expired.

**The token expired.** There is no recovery — Meta will not refresh a token that is more
than 60 days stale. Generate a new one from the Meta app dashboard and update
`IG_ACCESS_TOKEN`. This is why refresh runs fortnightly rather than monthly: three
consecutive failures still leave two weeks of margin.

**Someone revoked the app** from Instagram → Settings → Apps and websites. Same fix as an
expired token, but the app has to be re-authorised first.

**The feed is empty.** That is a supported state, not a failure. The homepage falls back to
event posters, which is also what you get before the first sync ever runs.

## Why there are no Stories

Asked and answered, so it doesn't need researching again.

Stories **are** available from Meta, but only through a different API than posts:
`GET graph.facebook.com/{ig-user-id}/stories`, which needs the **Facebook Login** flow,
`instagram_basic` + `pages_read_engagement`, and — the blocker — **a Facebook Page with the
Instagram account linked to it.** The club has no Facebook Page, and creating one purely to
feed a website section is not worth the ownership it adds.

Three things made it a poor trade even if a Page existed:

- **Stories last 24 hours.** The section would be empty most days, because posting here is
  event-driven rather than daily.
- **Anything with licensed audio returns no media.** Meta omits `media_url` for video using
  the Instagram audio library, which covers a large share of real stories.
- **They are 9:16**, so they cannot share the square grid and would need their own strip.

If a Facebook Page ever exists for other reasons, this is worth revisiting — the honest
version shows stories only while they are live and removes them once they expire.

## Deliberate choices

- **Images are downloaded, not hotlinked.** Instagram's CDN URLs are signed and expire
  within days, so a stored URL becomes a broken image. Ours also keeps the site working
  when Meta is down.
- **Images are committed to the repository.** This keeps the token out of Vercel entirely
  and makes builds reproducible. The cost is slow repository growth — the feed is capped at
  4 posts and older images are deleted on each sync, so it stays bounded.
- **No embed script.** Instagram's own embed is ~100 KB of third-party JavaScript, which
  would blow the 170 KB per-route budget and is blocked by the site's `script-src 'self'`
  CSP. The feed is a server component and ships no client JavaScript at all.
