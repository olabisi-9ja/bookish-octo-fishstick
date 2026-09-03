# COMUTA build status

Last updated 2026-09-03. Branch `feat/monorepo-figma-tokens`, based on `main`.

## Where things stand

31 of the 40 Figma frames are built in the Expo app. Every screen was built
from `get_design_context` on its node and checked against the frame — never
reconstructed from a screenshot alone.

## Repository shape

```
apps/mobile      Expo app (iOS, Android, and — per the parity decision — the PWA)
apps/pwa         the existing Vite PWA; app screens to be retired, landing to be extracted
packages/tokens  @comuta/tokens, generated from design/design-tokens.json
design/          design-tokens.json + figma-manifest.json — the design contract
docs/            PRD, screen inventory, UX and motion guides, this file
```

`design/design-tokens.json` is the canonical Figma capture. `packages/tokens`
generates typed TS for the Expo app and the Tailwind `@theme` block the PWA
consumes. Run `npm run tokens` after re-pulling from Figma. The generator throws
if two names in one ramp collapse onto the same stop.

## Built (31 frames)

| Group | Frames | Route |
|---|---|---|
| Splash | 42:3 | `index` |
| Onboarding carousel | 42:5, 191:429, 198:446, 200:463 | `(auth)/onboarding` |
| Create account | 46:9, 58:197 | `(auth)/signup` |
| Log in | 58:256, 62:314 | `(auth)/login` |
| OTP | 65:76, 65:185, 65:157, 65:213 | `(auth)/otp` |
| Reset request | 62:368, 65:48 | `(auth)/forgot` |
| Set new password | 65:241 | `(auth)/reset-password` |
| Password reset done | 69:269 | `(auth)/password-reset-done` |
| "You're in!" | 228:264 | `(auth)/welcome` |
| Documents under review | 103:708 | `(auth)/documents-review` |
| Verify identity | 73:303, 91:222, 99:255, 99:327, 99:397 | `(auth)/kyc` |
| Role selection | 99:437 | `(auth)/role-select` |
| Driver licence | 103:497 | `(auth)/driver-onboarding` |
| Vehicle details | 103:534 | `(auth)/vehicle-details` |
| Vehicle documents | 103:584 | `(auth)/vehicle-documents` |
| Selfie | 103:609 | `(auth)/selfie` |
| Payout | 103:679 | `(auth)/payout` |
| Rider home | 118:137 | `(rider)/home` |

## Not yet built (9 frames)

All in the rider group:

| Frame | Name |
|---|---|
| 158:908, 162:1076, 247:365 | rider homepage — three further states |
| 163:1151, 247:433 | date and time picker |
| 151:450, 153:670 | rider pickup search |
| 158:983, 158:1028 | rider drop off search |

`247:365` and `247:433` were added by the designer after the 2026-09-01 pull.
The page has 40 frames, not the 38 the manifest originally recorded.

## Also outstanding

1. **PWA conversion.** The decision was that the Expo app becomes the
   installable PWA. `expo export --platform web` already works and `app.json`
   is `output: "static"`. Still needed: web manifest, service worker, install
   prompt. Then retire `apps/pwa`'s app screens and extract the landing page to
   `apps/landing`.

2. **Adaptive desktop layouts.** The responsive foundation is in
   (`useBreakpoint`, `CenteredColumn`, `TwoPane`; breakpoints in the token
   package) and auth plus rider home centre correctly at 1280px. `TwoPane` is
   unused so far — it is meant for the search/results screens. These layouts are
   an engineering decision, **not** in Figma, and need design sign-off.

3. **Route name collision.** `(rider)/home` and `(driver)/home` both resolve to
   `/home`, and expo-router picks the driver one. Harmless on native, wrong for
   the PWA where URLs are user-facing. Rename before shipping web — e.g.
   `/ride` and `/drive`.

4. **Degular is unlicensed.** `design-tokens.json` nominates Switzer (Fontshare,
   free) as the substitute; the app currently renders Manrope, which is what is
   installed. Single swap point: `packages/tokens/src/fonts.ts`, plus the loader
   in `app/_layout.tsx`.

5. **Provider sign-in needs client IDs.** Native uses Apple's
   `ASAuthorizationAppleIDButton` and Google's `GoogleSigninButton`; web uses
   Google Identity Services and Sign in with Apple JS. Both web SDKs read
   `EXPO_PUBLIC_GOOGLE_CLIENT_ID` / `EXPO_PUBLIC_APPLE_CLIENT_ID` and render an
   explanatory note until those exist.

6. **8 pre-existing type errors**, none from this work. Six are `DriverProfile`
   missing `rating`, `totalTrips`, `vehicleModel`, `licensePlate` — the rider
   booking screens need them. Plus a `StatusBar` prop and an arity error.

7. **140 hardcoded hex literals** across 21 files in `apps/pwa/src` still bypass
   the theme. Moot for any screen retired in the PWA conversion.

## Design-contract issues found

Recorded in `design/figma-manifest.json` under `frameNameCorrections` and
`gaps`, so they are not rediscovered:

- **103:679** is a bank-details form whose first field is labelled "Vehicle make
  and model" (placeholder "e.g. Toyota Corolla"), and whose "Account holder
  name" is placeheld "e.g. LND-234-AB" — a licence plate. Both are copy-paste
  slips from the vehicle screen. Built with copy describing the actual field.
- **103:584**'s heading reads "Upload your driver's license" while its subtitle
  and both tiles are about vehicle registration.
- **228:264** and **103:708** are named "Reset Password - Phone" but contain
  neither a password nor a reset.
- **191:417** (onboarding pager dots) and **58:142** (a text input) are both
  named "Continue with Google".
- **103:534** has no seat-capacity field, though a driver publishes seats and
  capacity bounds every trip they can post. Deliberately not invented — it needs
  a frame.

## Environment notes

- `npm install` fails with ECONNRESET unless socket concurrency is capped:
  `npm install --maxsockets=3`. Retries and longer timeouts do not help.
- `api.expo.dev` and `figma.com` are both reachable; Figma asset downloads work,
  so raster and SVG exports can be pulled programmatically.
- The typed-route file `.expo/types/router.d.ts` only regenerates while the dev
  server runs. After adding a route, start the server before typechecking.
- React Native Web keeps both screens mounted during a horizontal transition, so
  the web preview cross-fades instead. Native keeps the slide.

## Verification

`expo export` bundles iOS and Android (Hermes) and web. The PWA builds with both
token layers intact. Typecheck is clean apart from the 8 pre-existing errors.
