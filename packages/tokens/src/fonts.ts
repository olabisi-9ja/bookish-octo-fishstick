/**
 * Font family mapping.
 *
 * Figma specifies **Degular** (Darden Studio) for every type role. Degular is
 * commercial and cannot be vendored, so `design/design-tokens.json` nominates
 * **Switzer** (Fontshare, free, self-hosted) as the substitute behind the
 * token. DM Mono stays for PINs and booking references.
 *
 * This file is the single swap point. Drop the licensed Degular files into the
 * apps and change the right-hand sides; no screen code changes.
 */
export { figmaFontFamily, substituteFontFamily, monoFontFamily } from './generated/typography';

/**
 * React Native font names by weight.
 *
 * NOTE: the native app still ships Manrope — the Switzer files are not yet
 * vendored into apps/mobile/assets/fonts. Swap these five strings (and the
 * loader in app/_layout.tsx) once they are.
 */
export const fontFamily = {
  400: 'Manrope_400Regular',
  500: 'Manrope_500Medium',
  600: 'Manrope_600SemiBold',
  700: 'Manrope_700Bold',
  800: 'Manrope_800ExtraBold',
} as const;

/** CSS font stack for the PWA and landing page. */
export const fontStack =
  "'Switzer', 'Degular', 'Manrope', ui-sans-serif, system-ui, -apple-system, sans-serif";

export const monoStack = "'DM Mono', ui-monospace, 'SF Mono', monospace";

export type FontWeight = keyof typeof fontFamily;
