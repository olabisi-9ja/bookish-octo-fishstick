/* eslint-disable */
/**
 * GENERATED FILE - do not edit by hand.
 * Run `npm run generate --workspace @comuta/tokens` after changing
 * design/design-tokens.json, which is pulled verbatim from Figma
 * tGWQGJbGogndVTvpVjzxYa (colour 22:52, type 29:422).
 */

/** Material 3 tonal ramps, exactly as they sit in the Figma file. */
export const color = {
  primary: {
    base: '#0a251c',
    t0: '#000000',
    t10: '#0b281e',
    t20: '#16503d',
    t30: '#21785b',
    t40: '#2ba17a',
    t50: '#36c998',
    t60: '#5ed4ad',
    t70: '#87dec1',
    t80: '#afe9d6',
    t90: '#d7f4ea',
    t93: '#e3f7f1',
    t95: '#ebfaf5',
    t99: '#fbfefd',
    t100: '#ffffff',
  },
  secondary: {
    base: '#d1f279',
    t0: '#000000',
    t10: '#232e05',
    t20: '#465d09',
    t30: '#698b0e',
    t40: '#8cba12',
    t50: '#afe817',
    t60: '#bfed45',
    t70: '#d1f279',
    t80: '#dff6a2',
    t90: '#effad1',
    t93: '#f4fcde',
    t95: '#f7fde8',
    t99: '#fdfffa',
    t100: '#ffffff',
  },
  tertiary: {
    base: '#90b6a9',
    t0: '#000000',
    t10: '#141f1b',
    t20: '#283e36',
    t30: '#3d5c51',
    t40: '#517b6d',
    t50: '#659a88',
    t60: '#90b6a9',
    t70: '#a3c2b7',
    t80: '#c1d7cf',
    t90: '#e0ebe7',
    t93: '#e9f1ee',
    t95: '#f0f5f3',
    t99: '#fcfdfd',
    t100: '#ffffff',
  },
  neutral: {
    base: '#050707',
    t0: '#000000',
    t10: '#151e1e',
    t20: '#2b3c3c',
    t30: '#405959',
    t40: '#557777',
    t50: '#6a9595',
    t60: '#88aaaa',
    t70: '#a6bfbf',
    t80: '#c3d4d4',
    t90: '#e1eaea',
    t93: '#eaf0f0',
    t95: '#f0f4f4',
    t99: '#fcfdfd',
    t100: '#ffffff',
  },
  neutralVariant: {
    base: '#101312',
    t0: '#000000',
    t10: '#171c1a',
    t20: '#2f3734',
    t30: '#46534f',
    t40: '#5d6f69',
    t50: '#758a83',
    t60: '#90a29c',
    t70: '#acb9b5',
    t80: '#c8d0cd',
    t90: '#e3e8e6',
    t93: '#ecefee',
    t95: '#f1f3f3',
    t99: '#fcfdfd',
    t100: '#ffffff',
  },
  error: {
    base: '#ab1103',
    t0: '#000000',
    t10: '#320501',
    t20: '#640a02',
    t30: '#ab1103',
    t40: '#c81404',
    t50: '#fb1904',
    t60: '#fb4737',
    t70: '#fc7569',
    t80: '#fda39b',
    t90: '#fed1cd',
    t93: '#fedfdc',
    t95: '#ffe8e6',
    t99: '#fffafa',
    t100: '#ffffff',
  },
} as const;

/**
 * The only layer screens are allowed to import. A screen never reaches for a
 * raw tone - if a colour is missing here, add the role, do not inline a hex.
 */
export const semantic = {
  primary: '#0a251c',
  onPrimary: '#ffffff',
  primaryContainer: '#d7f4ea',
  onPrimaryContainer: '#21785b',
  accent: '#d1f279',
  onAccent: '#0a251c',
  error: '#ab1103',
  onError: '#ffffff',
  surfaceContainer: '#f0f4f4',
  inverseOnSurface: '#f0f4f4',
  outlineVariant: '#c3d4d4',
  surface: '#f9fbfb',

  // surfaces
  background: color.neutral.t100,
  surfaceVariant: color.neutral.t95,
  surfaceRaised: color.neutral.t100,

  // text
  onBackground: color.neutral.t10,
  onSurface: color.neutral.t10,
  onSurfaceVariant: color.neutralVariant.t40,
  onSurfaceFaint: color.neutralVariant.t50,

  // lines
  outline: color.neutralVariant.t80,
  outlineSoft: color.neutralVariant.t90,

  // states
  disabled: color.neutralVariant.t80,
  success: color.primary.t30,
} as const;

/**
 * M3 type scale in Degular. Degular is not licensed for this project, so the
 * apps load Switzer and map it here; sizes, weights and the flat 1.5x
 * line-height are Figma's, unchanged.
 */
export const fontFamily = {
  sans: 'Switzer',
  mono: 'DM Mono',
} as const;

export const lineHeightRatio = 1.5;
export const letterSpacing = 0;

export const type = {
  displayLarge: { size: 57, weight: '400', lineHeight: 85.5 },
  displayMedium: { size: 45, weight: '400', lineHeight: 67.5 },
  displaySmall: { size: 36, weight: '400', lineHeight: 54 },
  headlineLarge: { size: 32, weight: '400', lineHeight: 48 },
  headlineMedium: { size: 28, weight: '400', lineHeight: 42 },
  headlineSmall: { size: 24, weight: '400', lineHeight: 36 },
  titleLarge: { size: 22, weight: '400', lineHeight: 33 },
  titleMedium: { size: 16, weight: '500', lineHeight: 24 },
  titleSmall: { size: 14, weight: '500', lineHeight: 21 },
  bodyLarge: { size: 16, weight: '400', lineHeight: 24 },
  bodyMedium: { size: 14, weight: '500', lineHeight: 21 },
  bodySmall: { size: 12, weight: '500', lineHeight: 18 },
  labelLarge: { size: 14, weight: '500', lineHeight: 21 },
  labelMedium: { size: 12, weight: '500', lineHeight: 18 },
  labelSmall: { size: 11, weight: '500', lineHeight: 16.5 },
} as const;

export type ColorRamp = keyof typeof color;
export type Tone = keyof (typeof color)['primary'];
export type TypeRole = keyof typeof type;
