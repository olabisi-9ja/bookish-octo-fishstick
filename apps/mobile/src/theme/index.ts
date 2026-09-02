/**
 * The COMUTA theme for React Native.
 *
 * Everything here is derived from @comuta/tokens, which is generated from
 * design/design-tokens.json, which is pulled verbatim out of Figma. Nothing in
 * this file invents a colour or a size - if a value is missing, it gets added
 * to the Figma file first.
 */
import { StyleSheet, type TextStyle } from 'react-native';
import { color, fontFamily, letterSpacing, semantic, type } from '@comuta/tokens';

export { color, semantic };

/**
 * The Figma screens are all 402 x 874 - an iPhone 16 Pro frame. Spacing below
 * is the 4pt grid those screens are laid out on.
 */
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 56,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

/**
 * Degular is not licensed for this project. Switzer is the substitute and is
 * loaded in app/_layout.tsx; if the files are absent the app falls back to the
 * platform face rather than failing to boot. FONT maps a weight to the family
 * name Expo registers.
 */
export const FONT = {
  regular: 'Switzer-Regular',
  medium: 'Switzer-Medium',
  semibold: 'Switzer-Semibold',
  bold: 'Switzer-Bold',
  mono: 'DMMono-Regular',
} as const;

const familyForWeight = (weight: string) =>
  weight === '500' ? FONT.medium : weight === '700' ? FONT.bold : FONT.regular;

/** The M3 type roles as ready-to-spread RN text styles. */
export const text = Object.fromEntries(
  Object.entries(type).map(([role, t]) => [
    role,
    {
      fontFamily: familyForWeight(t.weight),
      fontSize: t.size,
      lineHeight: t.lineHeight,
      letterSpacing,
      fontWeight: t.weight as TextStyle['fontWeight'],
    } satisfies TextStyle,
  ]),
) as Record<keyof typeof type, TextStyle>;

export const fonts = fontFamily;

/** Hairline that actually renders as one device pixel. */
export const hairline = StyleSheet.hairlineWidth;
