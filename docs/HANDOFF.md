# COMUTA — Engineering Handoff

> **Scope.** This is the engineering handoff for COMUTA. It was written in a planning
> session and parked briefly in an unrelated repo because the planning folder had no git
> of its own; it now lives here, in the COMUTA repo, which is its permanent home.
> Design tokens and the Figma screen manifest are in [`../design/`](../design/).

Last verified against Figma: **2026-09-01**.

---

## 1. What COMUTA is

Lagos-first **pre-booked shared commuting** — deliberately not ride-hailing. Verified
vehicle owners publish seats on a commute they already make; riders reserve and pay
upfront.

| | |
|---|---|
| Launch corridor | Ikorodu → Island |
| Price | ₦2,500–3,000 per seat |
| Platform share | 10% |
| Cancellation window | 8 hours |
| Hard requirement | Mandatory **T-8 driver confirmation** |

Full spec: `COMUTA_Full_Business_Plan_PRD_TR_Backend_Implementation (1).docx` — 52 sections.
Extracted plain text was at `scratchpad/prd.txt` in the planning session (ephemeral; re-extract
from the .docx if needed).

---

## 2. Starting state — three assets that do not agree

| # | Asset | State |
|---|---|---|
| 1 | **Figma** `tGWQGJbGogndVTvpVjzxYa` | Design system + **38 finished screens** on page "app design" (`39:456`). M3 tonal colour, M3 type scale in Degular, 12 components. MCP authenticated and working. |
| 2 | `bookish-octo-fishstick` | Complete Vite + React + Tailwind v4 **PWA prototype**: marketing site (8 pages), rider + driver app (~51 screens), 9 mock services, PWA plumbing, **12 implementation docs including a full API contract**. Repo `github.com/olabisi-9ja/bookish-octo-fishstick` — `main` plus 8 `arena/*` branches. **This repo.** You are in it. |
| 3 | `comuta-mobile/` | Expo SDK 57 + expo-router. 23 screens, **18 TypeScript errors**, broken rider booking loop, no maps, no camera, still wearing Expo starter branding. |

**The core problem:** (2) and (3) were both built from an *interpretation* of the design,
not from Figma. Their palettes, type scales and fonts all differ from each other and from
the design file. Everything gets re-skinned to Figma.

**Repo hazard:** do not `git init` or commit inside the local `Comuta/` folder — you would be
committing into Greene-Studios. Clone `bookish-octo-fishstick` properly first.

---

## 3. Decisions locked with the user

1. Two Next.js apps — marketing site + installable PWA product app (admin comes later).
2. **Mock-first backend.** A real backend swaps in behind identical interfaces.
3. No Degular licence → a free lookalike, behind a single token.
4. Build on the existing `bookish-octo-fishstick` repo.
5. **Figma is law.** Re-skin everything to the Figma ramps verbatim.
6. **Wait for the designer** on the ~85 undesigned screens. Build the 38 plus scaffolding only.
7. Maps: **Leaflet / OpenStreetMap** for now.
8. Order of work: **mobile → PWA → marketing**.

---

## 4. Design tokens

Machine-readable and complete in **[`design/design-tokens.json`](../design/design-tokens.json)** — six M3
tonal ramps × 14 tones, pulled verbatim from Figma node `22:52` via `get_design_context`,
plus the full type scale from `29:422`. Use that file; the table below is the orientation
summary only.

| ramp | base | 10 | 30 | 50 | 70 | 90 |
|---|---|---|---|---|---|---|
| primary | `#0a251c` | `#0b281e` | `#21785b` | `#36c998` | `#87dec1` | `#d7f4ea` |
| secondary (lime) | `#d1f279` | `#232e05` | `#698b0e` | `#afe817` | `#d1f279` | `#effad1` |
| tertiary | `#90b6a9` | `#141f1b` | `#3d5c51` | `#659a88` | `#a3c2b7` | `#e0ebe7` |
| neutral | `#050707` | `#151e1e` | `#405959` | `#6a9595` | `#a6bfbf` | `#e1eaea` |
| neutral-variant | `#101312` | `#171c1a` | `#46534f` | `#758a83` | `#acb9b5` | `#e3e8e6` |
| error | `#ab1103` | `#320501` | `#ab1103` | `#fb1904` | `#fc7569` | `#fed1cd` |

Tone 0 is `#000000` and tone 100 is `#ffffff` in every ramp. `base` is the standalone key
swatch beside each ramp and is **not always a member of it** — `primary.base` (`#0a251c`) is
darker than `primary.10`.

**Typography** — M3 scale, Degular, flat **1.5** line-height, letter-spacing **0**:

```
display  57 / 45 / 36     headline 32 / 28 / 24     title 22 / 16 / 14
body     16 / 14 / 12     label    14 / 12 / 11
```

Weight 400: display (all three), headline (all three), title-large, body-large.
Weight 500: everything else. Verified against `29:422`, not inferred.

Degular is not licensed for this project. Substitute **Switzer** (Fontshare, free,
self-hosted) behind the font token. Keep **DM Mono** for PINs and booking references.

**Semantic layer — the only thing screens may import.** No screen references a raw tone.

- `primary` `#0a251c` — dark-green filled CTA
- `accent` `#d1f279` — lime, the driver branch
- `error` `#ab1103`

Button hierarchy, written down once: primary filled · secondary outline (social auth) ·
tertiary text · accent lime for the driver branch.

---

## 5. The 38 designed screens

Node IDs, flow groupings and Figma's own frame names are in
**[`design/figma-manifest.json`](../design/figma-manifest.json)** — re-verified 2026-09-01, all 402×874,
nothing added or removed since planning.

Counts: onboarding 5 · auth 14 · KYC 5 · role select 1 · driver onboarding 5 · rider 8.

Two things to know before you open Figma:

- `get_metadata` with no `nodeId` lists **only** `0:1 Components`. The "app design" page does
  not appear. Address `39:456` directly. Re-check for new pages at the start of every phase.
- **Fidelity rule:** build each screen from `get_design_context` on its node and verify
  against `get_screenshot`. Never reconstruct a screen from a screenshot alone.

---

## 6. Target architecture

```
Comuta/                      # git clone of bookish-octo-fishstick
├─ apps/
│  ├─ mobile/                # Expo
│  ├─ app/                   # Next + Serwist, installable PWA
│  ├─ web/                   # Next, marketing
│  └─ admin/                 # scaffold only
├─ packages/
│  ├─ tokens/  ui-native/  ui-web/  core/  api-client/  config/
├─ docs/                     # the 12 implementation docs + cross-platform-mobile.md
└─ design/figma-manifest.json
```

Turborepo + npm workspaces (npm 11 — no pnpm or yarn installed). Expo needs a
`metro.config.js` with monorepo `watchFolders`.

**Reuse, do not rewrite.** From `bookish-octo-fishstick`: the domain types, the 9 mock
services, the Lagos hub seed data, the format / date / geo utils, the Zustand store, the
motion tokens, and the SSR smoke harness. Exact paths are in that repo's implementation docs.

---

## 7. Phases

| | | Exit criteria |
|---|---|---|
| **P0** | Foundation — clone repo, monorepo, tokens, core, api-client, fonts | typecheck clean; mobile 18 errors → 0 |
| **P1** | Components — `ui-native` + `ui-web` from the 12 Figma components, every state |  |
| **P2** | Mobile — the 38 screens pixel-exact; real camera KYC, secure-store, auth guards, driver Account tab; replace Expo branding; scaffold deferred routes |  |
| **P3** | PWA — port ~51 screens react-router → App Router, re-skin, rebuild the 38 responsively |  |
| **P4** | Marketing — port `Landing.tsx` + `CompanyPage.tsx`, 14 pages, drop CDN dependencies |  |
| **P5** | Store compliance — see below |  |
| **P6** | Deferred — the ~85 screens once designed, then the real backend |  |

**P5 in full.** iOS: Sign in with Apple (required by 4.8), in-app account deletion (5.1.1v),
`PrivacyInfo.xcprivacy`. Android: edge-to-edge, predictive back, `POST_NOTIFICATIONS`,
`foregroundServiceType="location"`.

---

## 8. Known bugs — fix in P0/P2

- Delete dead `src/components/ui/collapsible.tsx` — 4 of the 18 TS errors.
- Invalid `backgroundColor` prop on `expo-status-bar`.
- `addDaysISO(todayISO(), 1)` — two args passed to a one-arg function.
- `DriverProfile` is missing `rating`, `totalTrips`, `vehicleModel`, `licensePlate`, so the
  vehicle card never renders.
- `forest[200]` and `forest[300]` are referenced but do not exist.
- `styles.header` is defined and never applied, in both home screens.
- **Rider funnel is dead end to end:** hub selection is discarded, search ignores its params,
  and confirm creates no booking.
- PWA rider **Trips** nav points at `/app/rider/trips`, which does not exist — the screen is
  at `history`.

---

## 9. Open questions

- **Dark mode has no palette.** Recommend pinning light-only until the designer supplies one.
- **Platform rate conflicts:** 5% vs 9% vs 10% across sources. The PRD's **10%** wins.
- **Tab-bar labels:** three of the four Figma tab items are named "TRIPS". Needs the designer.
- **OSM public tiles forbid production traffic.** Leaflet is fine; the tile source is not.
  Move to OpenFreeMap or Protomaps before any real traffic.
- **Figma page listing is unreliable** (see §5). Re-check for new pages each phase.
