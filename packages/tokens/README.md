# @comuta/tokens

The single source of design truth for every COMUTA surface — mobile, PWA, landing.

## The pipeline

```
Figma (tGWQGJbGogndVTvpVjzxYa)
  ├── node 22:52  colours     ─┐
  └── node 29:422 type scale  ─┤
                               ▼
                    figma.tokens.json          ← verbatim capture, committed
                               ▼
                    scripts/generate.mjs       ← BRAND_MAP lives here
                               ▼
        src/generated/  colors.ts   typography.ts
                        tokens.css  tailwind-theme.css
                               ▼
        apps/mobile (theme.ts)   apps/pwa (index.css)
```

`figma.tokens.json` is a verbatim capture of the Figma brand sheet. It is
committed so the build is reproducible without network access to Figma.

**Never hand-edit `src/generated/`.** Change the brand in Figma, re-extract,
then:

```bash
npm run tokens
```

## What comes from Figma, and what doesn't

| Layer | Source |
|---|---|
| 6 tonal ramps (primary, secondary, tertiary, neutral, neutral-variant, error) | Figma node 22:52 |
| 15-role type scale, 1.5 line-height ratio | Figma node 29:422 |
| Brand names (`forest`, `lime`, `teal`, `red`) → Figma stops | `BRAND_MAP` in the generator |
| Spacing, radii, touch targets, elevation | Derived — Figma publishes no variables for these |
| `amber` warning ramp | **Local extension** — Figma publishes no warning ramp |

## Known gaps in the design contract

1. **No warning/attention ramp.** The product needs one (T-8 countdown, KYC
   under review, at-risk trips). `LOCAL_EXTENSIONS` in the generator holds
   provisional amber values. Delete it once Figma publishes a real ramp.

2. **`forest.950` ≈ `forest.900`.** Figma's `primary` ramp has no stop between
   pure black and its base swatch, so the two deepest names differ by one
   imperceptible unit (`#0b281e` vs `#0a251c`). `900` is pinned to the base
   swatch because `app.json` hardcodes that exact value for the splash and
   adaptive-icon backgrounds.

3. **Degular is not licensed.** Figma specifies Degular (Darden Studio) for
   every type role. It is commercial and cannot be vendored, so the apps render
   Manrope. `src/fonts.ts` is the single swap point — drop in the licensed
   files and change it there.

The generator throws if two names in one ramp resolve to the same Figma stop,
so a mapping that silently collapses two shades fails the build rather than
shipping.

## Consuming it

```ts
// mobile / any TS
import { brand, brandFlat, semantic, typeScale, spacing } from '@comuta/tokens';
```

```css
/* PWA / landing — after `@import 'tailwindcss'` */
@import '@comuta/tokens/tailwind-theme';
```
