/**
 * COMUTA native theme.
 *
 * Two layers, mirroring the PWA's index.css:
 *
 *  1. `palette` / `semantic` / `typeScale` — the canonical Figma tokens from
 *     `@comuta/tokens`. **Figma is law: NEW screens use these.**
 *
 *  2. `colors` / `fontSize` / `lineHeight` — a legacy hand-rolled interpretation
 *     that predates the Figma pull and does NOT match it (forest-800 #0f4431 vs
 *     primary-20 #16503d, lime-500 #bdf23f vs accent-50 #afe817). It is kept
 *     verbatim so the scaffold screens keep rendering as built. Each screen
 *     rebuilt from Figma drops its `colors` import; delete this layer when the
 *     last one is gone.
 */
import {
  palette,
  semantic,
  typeScale,
  fontFamily as tokenFontFamily,
  spacing as tokenSpacing,
  radii as tokenRadii,
  shadows as tokenShadows,
  touchTarget as tokenTouchTarget,
  zIndex as tokenZIndex,
  gutter as tokenGutter,
} from '@comuta/tokens';

// ─── Layer 1: canonical Figma tokens ─────────────────────────

export { palette, semantic, typeScale };

// ─── Layer 2: legacy (deprecated) ────────────────────────────

/**
 * @deprecated Pre-Figma palette. Use `palette` / `semantic` in new screens.
 */
export const colors = {
  forest: {
    950: '#041f17',
    900: '#0a251c',
    800: '#0f4431',
    700: '#155942',
    600: '#1c6e54',
    500: '#278465',
    300: '#7fb9a1',
    200: '#a9d3c3',
    100: '#d9efe4',
    50: '#eef8f2',
  },
  lime: {
    700: '#6f8f0e',
    600: '#94c11b',
    500: '#bdf23f',
    400: '#cdf26b',
    100: '#e9f8c8',
    50: '#f5fbe4',
  },
  teal: {
    700: '#155e6e',
    600: '#1e7386',
    500: '#2b8ca0',
    100: '#dcf0f4',
    50: '#eef8fa',
  },
  red: {
    700: '#8c231a',
    600: '#ac2f23',
    500: '#c74435',
    400: '#d96558',
    100: '#f6dcd8',
    50: '#fbefed',
  },
  amber: {
    600: '#b7791f',
    500: '#d19a2c',
    100: '#faeecf',
    50: '#fdf7e3',
  },

  surface: '#f9fbfb',
  surface2: '#f0f4f4',
  onsurface: '#151e1e',
  variant: '#405959',
  muted: '#5e6c76',
  faint: '#8ba0ae',
  line: '#d8e0e4',
  lineSoft: '#e8edf1',
  ink: '#131c20',
  white: '#ffffff',
  black: '#000000',

  transparent: 'transparent',
  overlay: 'rgba(10, 37, 28, 0.5)',
  overlayLight: 'rgba(10, 37, 28, 0.2)',
} as const;

// ─── Typography ───────────────────────────────────────────────

export const fontFamily = {
  regular: tokenFontFamily[400],
  medium: tokenFontFamily[500],
  semibold: tokenFontFamily[600],
  bold: tokenFontFamily[700],
  extrabold: tokenFontFamily[800],
} as const;

/**
 * @deprecated Legacy scale. New screens use `typeScale` (the Figma M3 scale).
 */
export const fontSize = {
  displayLarge: 40,
  displayMedium: 34,
  displaySmall: 28,
  headlineLarge: 24,
  headlineMedium: 22,
  headlineSmall: 20,
  titleLarge: 18,
  titleMedium: 16,
  titleSmall: 14,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 13,
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
  caption: 11,
} as const;

/** @deprecated Legacy leading. New screens use `typeScale`. */
export const lineHeight = {
  displayLarge: 48,
  displayMedium: 42,
  displaySmall: 36,
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 26,
  titleLarge: 24,
  titleMedium: 22,
  titleSmall: 20,
  bodyLarge: 24,
  bodyMedium: 20,
  bodySmall: 18,
  labelLarge: 20,
  labelMedium: 16,
  labelSmall: 14,
  caption: 14,
} as const;

// ─── Layout (shared by both layers) ──────────────────────────

export const spacing = tokenSpacing;
export const gutter = tokenGutter;
export const radii = tokenRadii;
export const shadows = tokenShadows;
export const touchTarget = tokenTouchTarget;
export const zIndex = tokenZIndex;
