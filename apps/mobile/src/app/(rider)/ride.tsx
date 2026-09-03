/**
 * Rider home — Figma nodes 118:137, 158:908, 162:1076 and 247:365.
 *
 * Header (small wordmark + alert badge), greeting, the search card, a trips
 * summary, the become-a-driver prompt, and the tab bar pinned to the bottom
 * (the frame root is justify-between).
 *
 * Those four frames are one screen, not four: they are the same card with the
 * search draft filled in a field at a time — empty, pickup set, both set, then
 * a time chosen. The draft lives in store/rideSearch and the routes that set
 * it are (rider)/location-search and (rider)/date-time.
 */
import { Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLUMN_MAX_WIDTH, semantic, radii, shadows, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import { FloatingTabBar, TAB_BAR_CLEARANCE } from '../../components/figma/TabBar';
import { useBreakpoint } from '../../components/layout/Responsive';
import { useComuta } from '../../store';
import { useRideSearch, type SearchField } from '../../store/rideSearch';
import { toClock24 } from '../../utils/dates';
import AlertBadge from '../../../assets/figma/icon-alert-badge.svg';
import LocationArrow from '../../../assets/figma/icon-location-arrow.svg';
import LocationAdd from '../../../assets/figma/icon-location-add.svg';
import DateTime from '../../../assets/figma/icon-date-time.svg';
import Caret from '../../../assets/figma/icon-caret-down.svg';
import TripIcon from '../../../assets/figma/icon-trip.svg';
import TruckDriver from '../../../assets/figma/icon-truck-driver.svg';
import FormNext from '../../../assets/figma/icon-form-next.svg';

const GUTTER = 20;

/**
 * The alert badge exports at 82x80 because it carries a soft shadow around a
 * 42x40 plate inset at (18,18) — the same packaging as `bx:arrow-back`. Drawn
 * at 42x40 the whole canvas scales down and the bell renders about half size,
 * so the asset is drawn at its natural size and offset instead, leaving a
 * 42x40 footprint in the header row.
 */
const ALERT_ASSET = { width: 82, height: 80, inset: 18 };

/** Opens the location search bound to one of the two fields. */
function openSearch(field: SearchField) {
  router.push({ pathname: '/(rider)/location-search', params: { field } });
}

export default function RiderHome() {
  const { isWide } = useBreakpoint();

  const hubs = useComuta((s) => s.hubs);
  const pickupHubId = useRideSearch((s) => s.pickupHubId);
  const dropoffHubId = useRideSearch((s) => s.dropoffHubId);
  const day = useRideSearch((s) => s.day);
  const time = useRideSearch((s) => s.time);

  const pickup = hubs.find((h) => h.id === pickupHubId)?.name ?? null;
  const dropoff = hubs.find((h) => h.id === dropoffHubId)?.name ?? null;

  // The pill reads "Today by 22:30" — a 24-hour clock, no suffix (118:137).
  const dayLabel = day === 'today' ? 'Today' : 'Tomorrow';
  const clock = toClock24(time);

  /**
   * The frame always draws "Search rides" enabled, including with both fields
   * empty (118:137), so it stays enabled and sends the rider to whichever
   * field is still missing rather than growing a disabled state Figma never
   * specified.
   */
  function search() {
    if (!pickupHubId) return openSearch('pickup');
    if (!dropoffHubId) return openSearch('dropoff');
    router.push('/(rider)/search-results');
  }

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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={spacing[2]}
              style={styles.alert}
            >
              <AlertBadge width={ALERT_ASSET.width} height={ALERT_ASSET.height} style={styles.alertAsset} />
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

              <CardLocationRow
                Icon={LocationArrow}
                placeholder="Choose pickup location"
                value={pickup}
                onPress={() => openSearch('pickup')}
              />
              <CardLocationRow
                Icon={LocationAdd}
                placeholder="Choose drop-off location"
                value={dropoff}
                onPress={() => openSearch('dropoff')}
              />

              <View style={styles.whenRow}>
                <Type variant="bodySmall" color={semantic.primary}>
                  Select date and time:
                </Type>
                <Pressable
                  style={styles.whenPill}
                  accessibilityRole="button"
                  accessibilityLabel={`Select date and time. ${dayLabel} by ${clock}`}
                  onPress={() => router.push('/(rider)/date-time')}
                >
                  <DateTime width={18} height={18} />
                  <View style={styles.whenValue}>
                    <Type variant="titleSmall" color={semantic.primary}>
                      {dayLabel}
                    </Type>
                    <Type variant="labelSmall" color={semantic.primary}>
                      by
                    </Type>
                    <Type variant="titleSmall" color={semantic.primary}>
                      {clock}
                    </Type>
                  </View>
                  <Caret width={18} height={18} />
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
                accessibilityRole="button"
                onPress={search}
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

      <FloatingTabBar />
    </View>
  );
}

/**
 * One of the two location rows inside the search card. Named apart from the
 * `LocationRow` in components/figma: this is the card's field row, that is the
 * search screens' result row (Figma component 158:772).
 */
function CardLocationRow({
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
        color={value ? semantic.onPrimaryContainer : semantic.outlineVariant}
      >
        {value ?? placeholder}
      </Type>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface },
  // Bottom padding clears the floating tab pill, which overlays the scroll view.
  content: { paddingHorizontal: GUTTER, paddingTop: 60, paddingBottom: TAB_BAR_CLEARANCE },
  contentWide: { alignItems: 'center' },
  stack: { width: '100%', gap: spacing[7] },
  stackWide: { maxWidth: COLUMN_MAX_WIDTH },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { width: 98, height: 40 },
  alert: { width: 42, height: 40 },
  alertAsset: { position: 'absolute', left: -ALERT_ASSET.inset, top: -ALERT_ASSET.inset },

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


  pressed: { opacity: 0.85 },
});
