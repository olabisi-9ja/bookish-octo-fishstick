/**
 * Typography primitives bound to the Figma M3 type scale.
 *
 * Figma specifies Degular for every role; the app renders the substitute named
 * in design/design-tokens.json until Degular is licensed. Weight comes from the
 * scale, so a role always renders at the weight the design asks for.
 *
 * Source: Figma tGWQGJbGogndVTvpVjzxYa node 29:422.
 */
import { Text, type TextProps, type TextStyle } from 'react-native';
import { typeScale, fontFamily, type TypeRole } from '@comuta/tokens';

const FAMILY_FOR_WEIGHT: Record<string, string> = {
  '400': fontFamily[400],
  '500': fontFamily[500],
  '600': fontFamily[600],
  '700': fontFamily[700],
  '800': fontFamily[800],
};

/**
 * NOTE: the prop is `variant`, not `role` — React Native's `TextProps` already
 * declares an ARIA `role`, and intersecting the two collapses the props to
 * `never`.
 */
export type TypeProps = TextProps & {
  variant: TypeRole;
  color?: string;
};

/** Renders text at a named role from the Figma type scale. */
export function Type({ variant, color, style, ...rest }: TypeProps) {
  const spec = typeScale[variant];
  const base: TextStyle = {
    fontFamily: FAMILY_FOR_WEIGHT[spec.fontWeight] ?? fontFamily[400],
    fontSize: spec.fontSize,
    lineHeight: spec.lineHeight,
    ...(color ? { color } : null),
  };
  return <Text {...rest} style={[base, style]} />;
}
