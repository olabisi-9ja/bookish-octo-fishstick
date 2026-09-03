/**
 * Rider home — Figma node 118:137.
 *
 * Header (small wordmark + alert badge), greeting, the search card, a trips
 * summary, the become-a-driver prompt, and the tab bar pinned to the bottom
 * (the frame root is justify-between).
 */
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLUMN_MAX_WIDTH, semantic, radii, shadows, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import { TabBar } from '../../components/figma/TabBar';
import { useBreakpoint } from '../../components/layout/Responsive';
import AlertBadge from '../../../assets/figma/icon-alert-badge.svg';
import LocationArrow from '../../../assets/figma/icon-location-arrow.svg';
import LocationAdd from '../../../assets/figma/icon-location-add.svg';
import DateTime from '../../../assets/figma/icon-date-time.svg';
import Caret from '../../../assets/figma/icon-caret-down.svg';
import TripIcon from '../../../assets/figma/icon-trip.svg';
import TruckDriver from '../../../assets/figma/icon-truck-driver.svg';
import FormNext from '../../../assets/figma/icon-form-next.svg';

const GUTTER = 20;

export default function RiderHome() {
  const { isWide } = useBreakpoint();
  const [pickup, setPickup] = useState<string | null>(null);
  const [dropoff, setDropoff] = useState<string | null>(null);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.stack, isWide && styles.stackWide]}>
          <View style={styles.header}>
            <Image
              source={require('../../../assets/figma/wordmark-small.png') as ImageSourcePropType}
              style={styles.wordmark}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="Comuta"
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" hitSlop={spacing[2]}>
              <AlertBadge width={42} height={40} />
            </Pressable>
          </View>

          <View style={styles.searchGroup}>
            <Type variant="headlineSmall" color={semantic.primary}>
              Good morning, Ade
            </Type>

            <View style={styles.searchCard}>
              <Type variant="titleSmall" color={semantic.onSurface}>
                Where are you headed?
              </Type>

              <LocationRow
                Icon={LocationArrow}
                placeholder="Choose pickup location"
                value={pickup}
                onPress={() => router.push('/(rider)/hub-select')}
              />
              <LocationRow
                Icon={LocationAdd}
                placeholder="Choose drop-off location"
                value={dropoff}
                onPress={() => router.push('/(rider)/hub-select')}
              />

              <View style={styles.whenRow}>
                <Type variant="bodySmall" color={semantic.primary}>
                  Select date and time:
                </Type>
                <Pressable
                  style={styles.whenPill}
                  accessibilityRole="button"
                  accessibilityLabel="Select date and time. Today by 22:30"
                >
                  <DateTime width={18} height={18} />
                  <View style={styles.whenValue}>
                    <Type variant="titleSmall" color={semantic.primary}>
                      Today
                    </Type>
                    <Type variant="labelSmall" color={semantic.primary}>
                      by
                    </Type>
                    <Type variant="titleSmall" color={semantic.primary}>
                      22:30
                    </Type>
                  </View>
                  <Caret width={18} height={18} />
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
                accessibilityRole="button"
                onPress={() => router.push('/(rider)/search-results')}
              >
                <Type variant="titleSmall" color={semantic.onPrimary}>
                  Search rides
                </Type>
              </Pressable>
            </View>
          </View>

          <View style={styles.emptyCard}>
            <TripIcon width={40} height={40} />
            <Type variant="headlineSmall" color={semantic.onSurface}>
              No trips booked yet
            </Type>
            <Type variant="bodySmall" color={semantic.onSurface}>
              Search a route above to book your first ride.
            </Type>
          </View>

          <Pressable
            style={({ pressed }) => [styles.driverCard, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Want to give rides? Earn back your fuel costs."
            onPress={() => router.push('/(auth)/role-select')}
          >
            <View style={styles.driverCopy}>
              <TruckDriver width={58} height={58} color={semantic.onPrimary} />
              <View style={styles.driverText}>
                <Type variant="headlineSmall" color={semantic.onPrimary}>
                  Want to give rides?
                </Type>
                <Type variant="bodySmall" color={semantic.onPrimary}>
                  Earn back your fuel costs.
                </Type>
              </View>
            </View>
            <FormNext width={40} height={40} color={semantic.onPrimary} />
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.tabWrap, isWide && styles.tabWrapWide]}>
        <TabBar />
      </View>
    </View>
  );
}

/** One of the two location rows inside the search card. */
function LocationRow({
  Icon,
  placeholder,
  value,
  onPress,
}: {
  Icon: React.FC<{ width: number; height: number }>;
  placeholder: string;
  value: string | null;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.locationRow, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ?? placeholder}
    >
      <Icon width={20} height={20} />
      <Type
        variant="bodySmall"
        color={value ? semantic.primary : semantic.outlineVariant}
      >
        {value ?? placeholder}
      </Type>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface },
  // Bottom padding clears the floating tab pill, which overlays the scroll view.
  content: { paddingHorizontal: GUTTER, paddingTop: 60, paddingBottom: spacing[24] },
  contentWide: { alignItems: 'center' },
  stack: { width: '100%', gap: spacing[7] },
  stackWide: { maxWidth: COLUMN_MAX_WIDTH },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { width: 98, height: 40 },

  searchGroup: { gap: spacing[4] },
  searchCard: {
    width: '100%',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
    borderRadius: radii.xl,
    backgroundColor: semantic.primaryContainer,
    ...shadows.soft,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2] + 2,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[3],
    borderRadius: radii.md,
    backgroundColor: semantic.onPrimary,
  },
  whenRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] + 2 },
  whenPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.xs,
    backgroundColor: semantic.inverseOnSurface,
  },
  whenValue: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  searchButton: {
    width: '100%',
    paddingVertical: spacing[2],
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semantic.primary,
  },

  emptyCard: {
    width: '100%',
    gap: spacing[1],
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
    borderRadius: radii.xl,
    backgroundColor: semantic.tertiaryContainer,
  },

  driverCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii['3xl'],
    backgroundColor: semantic.primary,
    ...shadows.soft,
  },
  driverCopy: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], flexShrink: 1 },
  driverText: { gap: spacing[1], flexShrink: 1 },

  tabWrap: { paddingHorizontal: GUTTER, paddingBottom: 60 },
  tabWrapWide: { alignSelf: 'center', width: '100%', maxWidth: COLUMN_MAX_WIDTH + GUTTER * 2 },

  pressed: { opacity: 0.85 },
});
