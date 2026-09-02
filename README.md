# COMUTA

Lagos-first **pre-booked shared commuting**. Verified vehicle owners publish
seats on a commute they already make; riders reserve and pay upfront.

Launch corridor Ikorodu → Island · ₦2,500–3,000 a seat · 10% platform share ·
8-hour cancellation window · mandatory **T-8 driver confirmation**.

## Layout

```
comuta/
├─ apps/
│  ├─ mobile/          Expo SDK 57 + expo-router  →  the iOS / Android app
│  └─ pwa/             Vite + React               →  installable PWA + marketing site
├─ packages/
│  └─ tokens/          design tokens, GENERATED from Figma
├─ design/             the Figma contract: tokens, screen manifest, asset list
├─ docs/               engineering handoff
└─ implementation/     product + backend specs
```

npm workspaces. Node 22, npm 10.

## Running it

```bash
npm install

npm run mobile      # Expo dev server - scan the QR with Expo Go
npm run pwa         # Vite dev server for the web app
npm run typecheck   # every workspace
npm run smoke       # the PWA service checks
```

## The design system is generated, not hand-written

`packages/tokens` is produced from `design/design-tokens.json`, which is pulled
verbatim out of Figma (`tGWQGJbGogndVTvpVjzxYa`, colour `22:52`, type `29:422`).

```bash
npm run generate --workspace @comuta/tokens
```

**Never hand-edit `packages/tokens/src/index.ts`.** Change Figma, re-pull the
JSON, re-run the generator. Screens import the `semantic` layer only — a screen
never references a raw tone, and never inlines a hex.

## Screen status

`apps/mobile/src/lib/figma-screens.ts` is the register: all 38 designed frames,
each with its Figma node and whether it has actually been built from
`get_design_context`. A route marked `built: false` renders a loud placeholder
naming the node it is waiting on — it is not a finished screen.

Figma: [app design](https://www.figma.com/design/tGWQGJbGogndVTvpVjzxYa/comuta?node-id=39-456)
· [brand](https://www.figma.com/design/tGWQGJbGogndVTvpVjzxYa/comuta?node-id=0-1)
