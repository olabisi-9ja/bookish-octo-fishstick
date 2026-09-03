/**
 * Available rides — Figma node 247:433.
 *
 * The frame is named "date and time picker" in Figma, but it is nothing of the
 * sort: it is the results list the "Search rides" button leads to. Recorded in
 * design/figma-manifest.json under frameNameCorrections.
 *
 * This replaces the pre-Figma screen that stood here, which was built from the
 * plan before the frame existed and styled off `constants/theme` with lucide
 * icons. Its sort and filter chips are not in the frame and are not carried
 * over — noted as a gap so the designer can decide whether they return.
 */
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLUMN_MAX_WIDTH, semantic, radii, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import { ScreenHeader } from '../../components/figma/ScreenHeader';
import { useBreakpoint } from '../../components/layout/Responsive';
import { useComuta } from '../../store';
import { useRideSearch } from '../../store/rideSearch';
import { displayName, naira } from '../../utils/format';
import { toClockCompact } from '../../utils/dates';

const GUTTER = 20;

export default function SearchResults() {
  const { isWide } = useBreakpoint();

  const trips = useComuta((s) => s.trips);
  const users = useComuta((s) => s.users);
  const hubs = useComuta((s) => s.hubs);
  const vehicles = useComuta((s) => s.vehicles);
  const driverProfiles = useComuta((s) => s.driverProfiles);

  const pickupHubId = useRideSearch((s) => s.pickupHubId);
  const dropoffHubId = useRideSearch((s) => s.dropoffHubId);
  const day = useRideSearch((s) => s.day);
  const time = useRideSearch((s) => s.time);

  const from = hubs.find((h) => h.id === pickupHubId);
  const to = hubs.find((h) => h.id === dropoffHubId);

  const when = `${day === 'today' ? 'Today' : 'Tomorrow'} by ${toClockCompact(time)}`;
  const subtitle = from && to ? `${from.name} → ${to.name} · ${when}` : when;

  const available = useMemo(
    () =>
      trips
        .filter((t) => ['scheduled', 'confirmed'].includes(t.status) && t.seatsLeft > 0)
        .filter((t) => (pickupHubId ? t.fromId === pickupHubId : true))
        .filter((t) => (dropoffHubId ? t.toId === dropoffHubId : true))
        .sort((a, b) => a.departureTime.localeCompare(b.departureTime)),
    [trips, pickupHubId, dropoffHubId],
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.stack, isWide && styles.stackWide]}>
          <View style={styles.headingGroup}>
            <ScreenHeader title="Available rides" />
            <View style={styles.subtitle}>
              <Type variant="titleMedium" color={semantic.primary}>
                {subtitle}
              </Type>
            </View>
          </View>

          <View style={styles.results}>
            {available.map((trip) => {
              const driver = users.find((u) => u.id === trip.driverId);
              const profile = driverProfiles[trip.driverId];
              const vehicle = vehicles.find((v) => v.id === profile?.vehicleId);
              const detail = [
                profile ? `${profile.rating.toFixed(1)} ★` : null,
                vehicle ? `${vehicle.color} ${vehicle.model}` : null,
              ]
                .filter(Boolean)
                .join(' · ');

              return (
                <Pressable
                  key={trip.id}
                  onPress={() =>
                    router.push({
                      pathname: '/(rider)/booking-confirm',
                      params: { tripId: trip.id },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`${driver ? displayName(driver) : 'Driver'}, ${detail}, ${naira(trip.pricePerSeat)}`}
                  style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                >
                  <View style={styles.rowText}>
                    <Type variant="bodySmall" color={semantic.primary}>
                      {driver ? displayName(driver) : 'Driver'}
                    </Type>
                    <Type variant="labelSmall" color={semantic.primary}>
                      {detail}
                    </Type>
                  </View>
                  <Type variant="titleSmall" color={semantic.primary}>
                    {naira(trip.pricePerSeat)}
                  </Type>
                </Pressable>
              );
            })}

            {available.length === 0 ? (
              <View style={styles.empty}>
                <Type variant="bodySmall" color={semantic.onSurfaceVariant}>
                  No rides on this route yet. Try another time.
                </Type>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface },
  content: { paddingHorizontal: GUTTER, paddingTop: 60, paddingBottom: 60 },
  contentWide: { alignItems: 'center' },
  stack: { width: '100%', gap: spacing[7] },
  stackWide: { maxWidth: COLUMN_MAX_WIDTH },

  headingGroup: { width: '100%', gap: spacing[2] },
  subtitle: { width: '100%', alignItems: 'center', paddingVertical: spacing[1] + 2 },

  // The frame draws a single row, so the list gap follows the sibling results
  // list on the search screens (153:670), which is 16px.
  results: { width: '100%', gap: spacing[4] },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: radii.md,
    backgroundColor: semantic.tertiaryContainer,
  },
  rowPressed: { backgroundColor: semantic.outlineVariant },
  rowText: { gap: spacing[1], flexShrink: 1 },

  empty: { width: '100%', alignItems: 'center', paddingVertical: spacing[5] },
});
