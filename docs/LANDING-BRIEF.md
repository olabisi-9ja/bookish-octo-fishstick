# Landing page redesign — brief

Written 2026-09-03, at the end of the rider-flow session. Nothing has been
built yet; this is the research and the one blocker that has to be resolved
first.

## Resolve this before writing any code

**The deployed landing page is not built from this branch.** Editing
`apps/pwa/src/features/landing/Landing.tsx` on `feat/monorepo-figma-tokens`
would not change what is live at `bookish-octo-fishstick-delta.vercel.app`.

What the search found:

| Ref | Has the live hero copy ("Your route. Your people.")? |
|---|---|
| `feat/monorepo-figma-tokens` (this branch) | no — a *different* landing design |
| `origin/main` | no |
| `master` (local only) | **yes** |
| seven `origin/arena/*` branches | yes |

`master` is 1 commit ahead of `origin/main` and 43 behind it. Its
`Landing.tsx` is 961 lines against this branch's 947, and diffing the two is
773 insertions / 787 deletions — they are near-total rewrites of each other,
not variations.

So there are **two competing landing pages** in the repo, and the one nobody is
working on is the one in production.

First step for the next session: confirm which branch Vercel builds — the
Vercel MCP server is connected (`list_projects` / `list_deployments` will say),
or the Vercel dashboard shows it under the project's Git settings. Then decide
whether the redesign lands on that branch or whether production should be
repointed at `main` once the monorepo branch merges. Do not guess.

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
