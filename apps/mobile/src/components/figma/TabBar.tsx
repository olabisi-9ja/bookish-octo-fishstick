/**
 * Rider tab bar — Figma component `tabBar` 158:759, as drawn on 118:137.
 *
 * A floating surface-variant pill pinned to the bottom of the frame: 30px
 * radius, 48px side padding, 40px between items, each a 20px icon over an
 * 11px uppercase label. The active item takes the primary colour.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { usePathname, router } from 'expo-router';
import type { SvgProps } from 'react-native-svg';
import { COLUMN_MAX_WIDTH, gutter, semantic, shadows, spacing, touchTarget } from '@comuta/tokens';
import { Type } from './Type';
import { useBreakpoint } from '../layout/Responsive';
import HomeIcon from '../../../assets/figma/icon-tab-home.svg';
import TripsIcon from '../../../assets/figma/icon-tab-trips.svg';
import WalletIcon from '../../../assets/figma/icon-tab-wallet.svg';
import ProfileIcon from '../../../assets/figma/icon-tab-profile.svg';

/** Figma draws tab icons at 20px. */
const ICON_SIZE = 20;

type Tab = {
  label: string;
  Icon: React.FC<SvgProps>;
  href: '/(rider)/ride' | '/(rider)/trips' | '/(rider)/pricing' | '/(rider)/account';
  /** Path fragment that marks this tab active. */
  match: string;
};

const TABS: readonly Tab[] = [
  { label: 'HOME', Icon: HomeIcon, href: '/(rider)/ride', match: 'ride' },
  { label: 'TRIPS', Icon: TripsIcon, href: '/(rider)/trips', match: 'trips' },
  // The frame labels this WALLET; the route it maps to is the fares screen.
  { label: 'WALLET', Icon: WalletIcon, href: '/(rider)/pricing', match: 'pricing' },
  { label: 'PROFILE', Icon: ProfileIcon, href: '/(rider)/account', match: 'account' },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map(({ label, Icon, href, match }) => {
        const active = pathname.includes(match);
        const color = active ? semantic.primary : semantic.onSurfaceVariant;
        return (
          <Pressable
            key={label}
            onPress={() => router.replace(href)}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            style={styles.item}
          >
            <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
            <Type variant="labelSmall" color={color}>
              {label}
            </Type>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Figma pins the pill 60px above the bottom of the frame. */
const PINNED_BOTTOM = 60;

/** The pill's own height: a 48px touch target inside 8px of padding. */
const BAR_HEIGHT = touchTarget.tabItem + spacing[2] * 2;

/**
 * Space a screen must leave below its content so the pinned pill does not
 * cover the last row — the pill's full footprint from the bottom edge, plus a
 * gutter's breathing room.
 */
export const TAB_BAR_CLEARANCE = PINNED_BOTTOM + BAR_HEIGHT + spacing[5];

/**
 * The tab bar pinned to the bottom of a rider screen.
 *
 * The rider group is a Stack rather than a Tabs navigator, so each tab
 * destination places the pill itself — miss it and the screen strands the
 * rider with no way back. Figma pins it 60px above the bottom inside the 20px
 * gutter (the frame root is justify-between with the pill as its last child),
 * which an overlay reproduces without dictating how the screen above it lays
 * out.
 */
export function FloatingTabBar() {
  const { isWide } = useBreakpoint();
  return (
    <View style={styles.pinned}>
      <View style={[styles.pinnedInner, isWide && styles.pinnedInnerWide]}>
        <TabBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinned: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: PINNED_BOTTOM,
    paddingHorizontal: gutter,
    alignItems: 'center',
    // Only the pill itself takes presses; the gutter beside it stays inert so
    // it does not swallow taps on the content scrolling underneath.
    pointerEvents: 'box-none',
  },
  pinnedInner: { width: '100%' },
  pinnedInnerWide: { maxWidth: COLUMN_MAX_WIDTH },

  bar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[10], // 40
    paddingHorizontal: spacing[12], // 48
    paddingVertical: spacing[2],
    borderRadius: 30,
    backgroundColor: semantic.surfaceVariant,
    ...shadows.soft,
  },
  item: {
    gap: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touchTarget.tabItem,
  },
});
