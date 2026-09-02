/**
 * @comuta/tokens — the single source of design truth for every COMUTA surface.
 *
 * Colour ramps and the type scale are generated from `design/design-tokens.json`
 * at the repo root, which is a verbatim capture of the Figma brand sheet.
 * Spacing, radii and elevation are derived — Figma publishes no variables for
 * them. Mobile, PWA and landing all import from here.
 *
 * Screens should use `semantic` wherever it covers the need, and reach for a
 * raw `palette` tone only when it does not.
 */
export { palette, semantic } from './generated/colors';
export type { PaletteRamp, Tone, SemanticRole } from './generated/colors';

export {
  typeScale,
  figmaFontFamily,
  substituteFontFamily,
  monoFontFamily,
  lineHeightRatio,
  letterSpacing,
} from './generated/typography';
export type { TypeRole } from './generated/typography';

export { fontFamily, fontStack, monoStack } from './fonts';
export type { FontWeight } from './fonts';

export { spacing, gutter, radii, touchTarget, zIndex } from './spacing';
export { shadows } from './shadows';

/** Figma artboard geometry — every designed screen frame is 402x874. */
export const frame = { width: 402, height: 874 } as const;
