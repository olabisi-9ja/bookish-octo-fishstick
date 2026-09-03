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
import { semantic, shadows, spacing, touchTarget } from '@comuta/tokens';
import { Type } from './Type';
import HomeIcon from '../../../assets/figma/icon-tab-home.svg';
import TripsIcon from '../../../assets/figma/icon-tab-trips.svg';
import WalletIcon from '../../../assets/figma/icon-tab-wallet.svg';
import ProfileIcon from '../../../assets/figma/icon-tab-profile.svg';

/** Figma draws tab icons at 20px. */
const ICON_SIZE = 20;

type Tab = {
  label: string;
  Icon: React.FC<SvgProps>;
  href: '/(rider)/home' | '/(rider)/trips' | '/(rider)/pricing' | '/(rider)/account';
  /** Path fragment that marks this tab active. */
  match: string;
};

const TABS: readonly Tab[] = [
  { label: 'HOME', Icon: HomeIcon, href: '/(rider)/home', match: 'home' },
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

const styles = StyleSheet.create({
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
