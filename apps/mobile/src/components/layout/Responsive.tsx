/**
 * Responsive layout primitives.
 *
 * The Expo app is also the installable PWA, so every screen has to hold up
 * from a 402px phone to a desktop browser. Figma only specifies the phone
 * frame, so the phone rendering is the design contract and the wider layouts
 * are engineering decisions pending design sign-off — see
 * packages/tokens/src/breakpoints.ts.
 *
 * The rule: never stretch a phone layout. Above `tablet`, either centre the
 * column at COLUMN_MAX_WIDTH or split it into two panes.
 */
import { createContext, useContext, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View, type ViewProps } from 'react-native';
import {
  COLUMN_MAX_WIDTH,
  breakpointFor,
  breakpoints,
  spacing,
  type BreakpointName,
} from '@comuta/tokens';

export type Breakpoint = {
  name: BreakpointName;
  width: number;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** True once there is room for a list beside a detail pane. */
  isWide: boolean;
};

const BreakpointContext = createContext<Breakpoint | null>(null);

export function useBreakpoint(): Breakpoint {
  const ctx = useContext(BreakpointContext);
  const { width } = useWindowDimensions();
  return useMemo(() => {
    if (ctx) return ctx;
    const name = breakpointFor(width);
    return {
      name,
      width,
      isPhone: name === 'phone',
      isTablet: name === 'tablet',
      isDesktop: name === 'desktop',
      isWide: width >= breakpoints.tablet,
    };
  }, [ctx, width]);
}

/**
 * Centres a phone-width column on wide viewports instead of stretching it.
 * This is the default shell for every single-pane screen.
 */
export function CenteredColumn({ style, children, ...rest }: ViewProps) {
  const { isWide } = useBreakpoint();
  return (
    <View style={[styles.fill, isWide && styles.centered, style]} {...rest}>
      <View style={[styles.fill, isWide && styles.column]}>{children}</View>
    </View>
  );
}

/**
 * List beside detail on wide viewports; on a phone only `primary` renders and
 * the detail is expected to be a pushed route instead.
 */
export function TwoPane({
  primary,
  detail,
  /** Fraction of the width the list takes on a wide viewport. */
  primaryFlex = 0.42,
}: {
  primary: React.ReactNode;
  detail: React.ReactNode;
  primaryFlex?: number;
}) {
  const { isWide } = useBreakpoint();

  if (!isWide) return <View style={styles.fill}>{primary}</View>;

  return (
    <View style={styles.paneRow}>
      <View style={[styles.pane, { flex: primaryFlex }]}>{primary}</View>
      <View style={styles.paneDivider} />
      <View style={[styles.pane, { flex: 1 - primaryFlex }]}>{detail}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, width: '100%' },
  centered: { alignItems: 'center' },
  column: { width: '100%', maxWidth: COLUMN_MAX_WIDTH },
  paneRow: { flex: 1, flexDirection: 'row', width: '100%' },
  pane: { flex: 1 },
  paneDivider: { width: spacing[6] },
});
