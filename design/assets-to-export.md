# Figma assets still to export

This session could not download Figma's raster assets: the egress proxy denies
`figma.com` by organisation policy, so `download_assets` returns URLs that
cannot be fetched. The Figma MCP tools themselves work, so **layout, typography
and colour on every built screen are exact** — only the bitmaps are missing.

## How to fill one in

1. Open the node in Figma, select the frame, Export → PNG @3x.
2. Save it to `apps/mobile/assets/onboarding/<name>.png`.
3. Uncomment its line in `ART` in `apps/mobile/src/components/FigmaImage.tsx`.

Nothing else changes — every call site picks it up.

| name | Figma node | size | used by |
|---|---|---|---|
| `onboarding-1` | `190:324` | 402 × 325 | `app/(onboarding)/intro-1.tsx` |
| `onboarding-2` | `191:432` | 402 × 325 | `app/(onboarding)/intro-2.tsx` |
| `onboarding-3` | `198:449` | 402 × 325 | `app/(onboarding)/intro-3.tsx` |
| `onboarding-4` | `203:491` | 402 × 325 | `app/(onboarding)/intro-4.tsx` |
| `wordmark` | `21:3` | 140 × 57 | `src/components/Wordmark.tsx` |

`Wordmark` currently draws a mark from the brand tokens so the app is not full
of holes. Replace it with the export when you have it.

## Fonts

Degular is not licensed for this project. `src/theme` maps the M3 scale onto
**Switzer** (Fontshare, free) and falls back to the platform face until the
files are bundled. To bundle: drop `Switzer-Regular/Medium/Semibold/Bold.ttf`
into `apps/mobile/assets/fonts/`, load them with `expo-font` in
`app/_layout.tsx`, and the whole type scale switches over — every size, weight
and line-height is already Figma's.
