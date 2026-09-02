/**
 * COMUTA Motion System — Animation constants for React Native.
 *
 * Ported from the PWA (src/constants/index.ts DURATION + EASE).
 * Extended with spring configs for react-native-reanimated.
 *
 * Three animation tiers per the Motion & Illustration Guide:
 * 1. Micro-interactions (150–250ms) — button presses, toggles, tab switches
 * 2. Transitions (250–400ms) — sheet expand, card→detail, screen push
 * 3. State-change moments — booking confirmed, KYC, payment, T-8 countdown, SOS
 */

import { Easing } from 'react-native-reanimated';

// ─── Duration tokens (ms) ────────────────────────────────────

export const DURATION = {
  instant: 120,
  fast: 200,
  standard: 300,
  expressive: 600,
  story: 900,
} as const;

// ─── Easing curves ───────────────────────────────────────────

/** COMUTA brand easing: [0.22, 0.61, 0.36, 1] — smooth, confident deceleration. */
export const EASE_BEZIER = Easing.bezier(0.22, 0.61, 0.36, 1);

export const EASE = {
  standard: EASE_BEZIER,
  in: Easing.bezier(0.4, 0, 1, 1),
  out: Easing.bezier(0, 0, 0.2, 1),
  inOut: Easing.bezier(0.4, 0, 0.2, 1),
  linear: Easing.linear,
} as const;

// ─── Spring configs (react-native-reanimated) ────────────────

export const SPRING = {
  /** Button press, toggle, micro-interactions — snappy, no overshoot */
  snappy: {
    damping: 20,
    stiffness: 400,
    mass: 0.6,
    overshootClamping: true,
  },

  /** Bottom sheet, card expand — gentle spring with slight overshoot */
  gentle: {
    damping: 18,
    stiffness: 200,
    mass: 0.8,
    overshootClamping: false,
  },

  /** Modal/sheet entrance — expressive with controlled overshoot */
  expressive: {
    damping: 14,
    stiffness: 160,
    mass: 1,
    overshootClamping: false,
  },

  /** Success animations (checkmark draw) — slow, deliberate */
  story: {
    damping: 16,
    stiffness: 120,
    mass: 1.2,
    overshootClamping: false,
  },
} as const;

// ─── Animation presets ───────────────────────────────────────

export const ANIMATION = {
  /** Button press scale-down */
  buttonPress: {
    scale: 0.97,
    duration: DURATION.instant,
  },

  /** Screen fade-in */
  screenEnter: {
    opacity: { from: 0, to: 1 },
    translateY: { from: 8, to: 0 },
    duration: DURATION.standard,
  },

  /** Tab content crossfade */
  tabSwitch: {
    opacity: { from: 0, to: 1 },
    duration: DURATION.fast,
  },

  /** Success checkmark draw — the emotional high-point */
  successCheck: {
    pathLength: { from: 0, to: 1 },
    duration: DURATION.expressive,
    delay: 200,
  },

  /** KYC review pulse */
  pendingPulse: {
    scale: { from: 1, to: 1.05 },
    opacity: { from: 0.8, to: 1 },
    duration: 2000,
    loop: true,
  },

  /** SOS long-press fill ring — deliberate, weighty */
  sosHold: {
    progress: { from: 0, to: 1 },
    duration: 1500, // 1.5s hold required
    hapticIntervals: [0, 0.25, 0.5, 0.75, 1.0], // escalating feedback
  },

  /** T-8 countdown progress ring */
  countdownRing: {
    strokeDashoffset: { from: 1, to: 0 },
    duration: DURATION.standard, // per tick update
  },

  /** Driver position interpolation on live map */
  mapInterpolation: {
    duration: 1000, // smooth between 1s location updates
  },
} as const;
