# Landing page redesign — brief

Written 2026-09-03 at the end of the rider-flow session, and revised the same
day once the page was actually built and the deploy question was checked
rather than inferred.

## The deploy question, answered

Two earlier readings of this were wrong. Recording the whole thing so nobody
re-derives it a third time.

**What was claimed first:** production is built from `master` or an `arena/*`
branch, and there are two competing landing pages. Wrong &mdash; inferred from
`git` searching and from what the public URL served, never checked.

**What was claimed second:** production builds from `main`, and the latest
production build contains the redesign. Half right. It builds from `main`, but
that build ships *nothing*.

**What is actually true**, from the Vercel API and build logs on 2026-09-03:

1. **Every production deployment since the monorepo restructure is empty.**
   The build log for `main` @ `3806a5c` reads, in full:
   `Running "vercel build"` &rarr; `Build Completed in /vercel/output [233ms]`.
   No install, no compile. The project has `framework: null`, and commit
   `b9621de` moved the Vite app from the repo root to `apps/pwa`. The root
   `package.json` has no `build` script, so Vercel finds nothing to do and
   deploys an empty output. Hence `404: NOT_FOUND` on
   `bookish-octo-fishstick-olabisi-side-projects.vercel.app`.

2. **The public `-delta` URL only works because it is stale.**
   `bookish-octo-fishstick-delta.vercel.app` is still attached to
   `dpl_HBPLgwAa6ostErsg9SnJj8HbonNg` &mdash; `main` @ `ad12723`, "Rebrand
   PadiGo to Comuta" &mdash; the last deployment built *before* the
   restructure, and so the last one with real output. That is why it shows an
   old landing page while `main` has carried the redesign for days.

`master` is just an old local branch whose landing page happens to match what
that stale alias serves, which is what made this look like a branching problem.

### The fix

- `vercel.json` at the repo root (added 2026-09-03) gives Vercel the build it
  was missing: `buildCommand: npm run pwa:build`, `outputDirectory:
  apps/pwa/dist`, an SPA rewrite so client-side routes resolve on first load,
  and cache headers that keep `sw.js` revalidating while hashed assets go
  immutable.
- It only takes effect once it is on `main`.
- Afterwards the `-delta` alias still has to be re-pointed at the current
  production deployment, or it will keep serving the pre-restructure build
  forever. That is a dashboard action (or `vercel alias set`), not a code
  change.

## What the three references actually do

Studied on 2026-09-03 by loading each site. Notes are on structure and
direction — no copy, imagery or CSS was taken from any of them.

### Common to all three

1. **Two audiences addressed from the very top.** Uber splits it in the nav
   (Ride / Drive); Bolt puts two CTAs in the hero (Get Bolt / Earn with Bolt);
   Lyft splits the hero itself into a rider half and a driver half. None of
   them makes the earner side a footer link.
2. **The hero either transacts or commits.** Uber puts the real booking form in
   it — pickup, dropoff, "See prices". Bolt and Lyft skip the form and go
   straight to a single strong CTA. There is no third option where the hero
   just describes the product.
3. **A short, plain headline.** Three to six words, no cleverness: "Go anywhere
   with Uber", "Riding is the new driving", "The world awaits".
4. **Every section carries its own CTA link**, not just the hero.
5. **App download near the bottom, with QR codes**, rider and driver apps
   presented as a pair.
6. **A deep multi-column footer** doing the SEO and legal work.

### Where they differ, and which is right for Comuta

- **Uber** — black and white, enormous type, near-zero decoration, the widget
  doing the selling. Works because everyone already knows what Uber is.
- **Bolt** — service-card grid, bright, each card a separate product. It is a
  super-app menu; Comuta has one product, so this structure would read as
  padding.
- **Lyft** — warm and human, safety and community as full sections rather than
  trust badges, benefit-tagged comparison cards. Closest in spirit to what
  Comuta sells, since a shared pre-booked commute is a trust purchase.

**The gap none of them fills:** all three sell a category the visitor already
understands. Comuta does not — a pre-booked shared commute on a fixed corridor
is not ride-hailing, and the page has to teach that before it can sell it. The
current landing already recognises this; whatever replaces it must keep an
explainer section, and probably a "what this replaces" cost comparison, because
that is the actual argument.

Take from Uber the working entry point in the hero (Comuta's is from / to /
which day, searching seats rather than cars). Take from Lyft the alternating
rider / earner bands and treating safety as a section. Take from Bolt the idea
of giving the one differentiating feature a full-bleed band of its own.

## Where things are

- Page: `apps/pwa/src/features/landing/Landing.tsx` (947 lines here, 961 on
  `master`), plus `PublicNav.tsx` and `CompanyPage.tsx` for the sub-pages.
- Route: `/` in `apps/pwa/src/App.tsx`; the sub-pages (`/how-it-works`,
  `/safety`, `/drivers`, …) all render `CompanyPage`.
- Only one image ships: `apps/pwa/public/images/padigo-commuters.jpg`. The live
  hero photograph is not in this branch's tree.
- **Use the Figma token layer, not the legacy ramps.** `apps/pwa/src/index.css`
  defines `--color-forest-*` / `--color-lime-*` from an earlier interpretation
  that does *not* match Figma, then imports `@comuta/tokens/tailwind-theme`
  with the canonical `primary-*`, `accent-*`, `tertiary-*`, `ntl-*`, `nv-*`
  ramps and the `--text-display-*` / `--text-headline-*` scale. The file says
  it plainly: new work uses the generated ones.
- No Figma frame specifies this page — all 40 frames are 402x874 app screens —
  so the layout is composed, while ramps, type scale and button hierarchy stay
  the design system's.

## Also queued

From `BUILD-STATUS.md`, and confirmed as the intended direction on 2026-09-03:
login and the installable PWA should both come from the Expo app in
`apps/mobile`, not the Vite app. That is the PWA conversion — web manifest,
service worker, install prompt, then retire `apps/pwa`'s duplicated app screens
(17 rider, 9 auth, 5 driver files) and extract the landing page to its own
`apps/landing`. The landing redesign and that conversion touch the same files,
so decide the order before starting either.
