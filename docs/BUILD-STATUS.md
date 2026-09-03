# COMUTA build status

Last updated 2026-09-03. Branch `feat/monorepo-figma-tokens`, based on `main`.

## Where things stand

All 40 Figma frames are built in the Expo app. Every screen was built from
`get_design_context` on its node and checked against the frame — never
reconstructed from a screenshot alone. The rider search flow was additionally
driven end to end in the browser: home → pickup → drop-off → picker → results.

Re-verified on 2026-09-03 with `get_metadata` on page 39:456 — still 40 frames,
same ids. Re-run that check at the start of every phase; the designer is still
adding screens.

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

## Built (40 frames)

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
| Rider home | 118:137, 158:908, 162:1076, 247:365 | `(rider)/ride` |
| Pickup search | 151:450, 153:670 | `(rider)/location-search?field=pickup` |
| Drop-off search | 158:983, 158:1028 | `(rider)/location-search?field=dropoff` |
| Date and time picker | 163:1151 | `(rider)/date-time` |
| Available rides | 247:433 | `(rider)/search-results` |

## How the rider frames map to screens

The ten rider frames are five screens, because most of them are states rather
than destinations:

- **Four home frames** are one card with the search draft filled in a field at
  a time — empty, pickup set, both set, time chosen. The draft lives in
  `src/store/rideSearch.ts`, deliberately outside the persisted `useComuta`
  store: a pickup chosen last week should not survive a relaunch.
- **Four search frames** are one screen with a `field` param. Pickup and
  drop-off differ only in copy, and the second frame of each pair is just the
  state after the rider types.
- **163:1151** is the picker; **247:433**, despite its name, is the results
  list.

Two copy corrections were needed and are recorded in the manifest: the drop-off
frame is a verbatim copy of the pickup one (it would have asked riders where
they were *starting from* on the screen that picks a destination), and 247:433
is not a picker.

## Also outstanding

1. **PWA conversion.** Confirmed on 2026-09-03: login and the installable PWA
   should both come from the Expo app, not the Vite app. `expo export
   --platform web` already works and `app.json` is `output: "static"`. Still
   needed: web manifest, service worker, install prompt. Then retire
   `apps/pwa`'s app screens — it still carries a full parallel implementation,
   17 rider files, 9 auth, 5 driver — and extract the landing page to
   `apps/landing`.

   **Landing page redesign** is queued behind the same files; the research and
   a blocker worth reading first are in `docs/LANDING-BRIEF.md`. Short version:
   the live page at `bookish-octo-fishstick-delta.vercel.app` is **not** built
   from this branch, so confirm which branch Vercel deploys before editing
   anything.

2. **Adaptive desktop layouts.** The responsive foundation is in
   (`useBreakpoint`, `CenteredColumn`, `TwoPane`; breakpoints in the token
   package) and auth plus rider home centre correctly at 1280px. `TwoPane` is
   unused so far — it is meant for the search/results screens. These layouts are
   an engineering decision, **not** in Figma, and need design sign-off.

3. **Route name collisions — fixed.** `(rider)/home` and `(driver)/home` both
   resolved to `/home` (expo-router picked the driver one), and `trips`
   collided the same way. Renamed to `/ride`, `/drive` and `/drive-trips`;
   `/trips` is now the rider's. No basenames collide across groups any more —
   the check is to list route basenames per group and look for duplicates.
   After renaming a route file, clear Metro's cache (`rm -rf .expo` plus
   `$TEMP/metro-*`) or the bundler keeps serving the deleted module.

4. **Degular is unlicensed.** `design-tokens.json` nominates Switzer (Fontshare,
   free) as the substitute; the app currently renders Manrope, which is what is
   installed. Single swap point: `packages/tokens/src/fonts.ts`, plus the loader
   in `app/_layout.tsx`.

5. **Provider sign-in needs client IDs.** Native uses Apple's
   `ASAuthorizationAppleIDButton` and Google's `GoogleSigninButton`; web uses
   Google Identity Services and Sign in with Apple JS. Both web SDKs read
   `EXPO_PUBLIC_GOOGLE_CLIENT_ID` / `EXPO_PUBLIC_APPLE_CLIENT_ID` and render an
   explanatory note until those exist.

6. **6 pre-existing type errors**, none from this work, down from 8.
   `DriverProfile.rating` was added because 247:433 draws it, which cleared
   two. The rest are `booking-confirm` wanting `totalTrips`, `vehicleModel` and
   `licensePlate` on `DriverProfile` — all derivable from `completedTrips` and
   the `vehicles` collection — plus a `StatusBar` prop and an arity error.

7. **140 hardcoded hex literals** across 21 files in `apps/pwa/src` still bypass
   the theme. Moot for any screen retired in the PWA conversion.

8. **Legacy rider screens.** `trips`, `pricing`, `account` and
   `booking-confirm` still render off `constants/theme` with lucide icons
   rather than `@comuta/tokens`. They have no Figma frames yet. They now at
   least carry the tab bar.

## Fixed along the way

Found while building the rider flow, all outside its frames but load-bearing:

- **Icons could not be coloured.** Figma exports each icon with the fill it had
  in the frame it was pulled from, so the four tab icons and the truck-driver
  icon ignored the `color` prop they were given: the tab bar always looked like
  HOME was selected, and the driver card's icon was near-black on a near-black
  plate, invisible. Their fills are now `currentColor`. Any newly exported icon
  that needs to change colour in code needs the same treatment.
- **Two icons carry their shadow inside the asset.** `bx:arrow-back` (80x78.26)
  and `fluent:alert-badge` (82x80) wrap a smaller plate inset at (18,18).
  Drawing them at the plate's size scales the whole canvas and renders the
  glyph at about half size — the alert badge had this bug. Both now draw at
  natural size with a negative offset. They are the only two like this.
- **Tab bar missing on three rider screens.** The rider group is a Stack, not a
  Tabs navigator, so each destination must place the pill itself; `trips`,
  `pricing` and `account` did not, stranding the rider. There is now one
  `FloatingTabBar` and a `TAB_BAR_CLEARANCE` the scroll content must reserve.
- **Pressed states were guesses.** The components page publishes a rest and a
  pressed/active variant per component. `buttonLarge` and the onboarding button
  press to `primary-colors/primary-color-30` (#21785b), not the `primary[20]`
  the code used; location rows press to `outline-variant`; the one published
  selectable-option state is `id type`'s accent (#d1f279), which the picker's
  quick-time chips now use.
- **Browser focus rings.** React Native Web renders `TextInput` as an `<input>`
  with the UA focus ring, which no frame draws. `NO_FOCUS_RING` in
  `src/constants/web.ts` removes it; applied to the shared auth `Field` and
  both search inputs.
- **Driver home header.** Its wrapper `View` never had `styles.header` applied,
  so the notification bell wrapped below the wordmark instead of sitting inline.

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
- **158:983** ("rider drop off search") is a verbatim copy of the pickup frame:
  the title still reads "Where are you starting from?" and both saved places
  still read "Closest pickup to home/work". Shipping it would have asked riders
  where they were starting from on the screen that picks a destination. Built
  as "Where are you headed?" — the phrase the home card already uses — and
  "Closest drop-off to…".
- **247:433** is named "date and time picker" but is the Available rides
  results list. The actual picker is 163:1151.
- **151:450** and **158:983** disagree on the subtitle: 16px left-aligned
  versus 12px centred. They are one screen in two roles, so both follow
  158:983.
- **Saved Places** (151:450, 158:983) has no data model — `User` carries no
  home or work address — and no frame behind the drawn `+`. Wired to the two
  hubs nearest the origin as placeholder data; needs a model and an add frame.
- **247:433** specifies no empty state and no sort/filter controls. The
  pre-Figma screen it replaced had Recommended/Price/Departure/Seats chips;
  they are not carried over because no frame specifies them. Worth confirming
  with the designer whether they return.
- **163:1151**'s wheel shows only 5:00–7:00 AM inside its clip, plus two
  leftover duplicate rows that never render. Built as 5:00 AM to 11:30 PM in
  half hours — confirm the intended range.

## Environment notes

- `npm install` fails with ECONNRESET unless socket concurrency is capped:
  `npm install --maxsockets=3`. Retries and longer timeouts do not help.
- `api.expo.dev` and `figma.com` are both reachable; Figma asset downloads work,
  so raster and SVG exports can be pulled programmatically.
- The typed-route file `.expo/types/router.d.ts` only regenerates while the dev
  server runs. After adding a route, start the server before typechecking.
- Metro caches deleted route files. After renaming or removing one, stop the
  server, `rm -rf .expo` and `rm -rf $TEMP/metro-*`, then restart — otherwise it
  keeps trying to bundle the old path and navigation silently fails.
- `(rider)/ride` is reachable in the browser at `/ride`: expo-router strips the
  group from the URL, so a group-qualified path like `/(rider)/ride` normalises
  away and cannot be used to disambiguate two same-named routes.
- React Native Web keeps both screens mounted during a horizontal transition, so
  the web preview cross-fades instead. Native keeps the slide.

## Verification

`expo export` bundles iOS and Android (Hermes) and web. The PWA builds with both
token layers intact. Typecheck is clean apart from the 6 pre-existing errors.

The rider search flow was driven end to end in the browser at 375px and at
desktop width, not just rendered: home → pickup search (typed a query, picked a
hub) → home with the pickup filled → drop-off search showing the corrected copy
→ home with both filled → picker (chip selects a window, scrolls the wheel,
selection renders at 24px in the container green) → Available rides carrying
"Today by 7:00am" into its subtitle. Distances on the search screens are real
haversine values from the seed hubs, not placeholders.
