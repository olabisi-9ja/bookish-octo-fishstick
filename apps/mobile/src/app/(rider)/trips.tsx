import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Clock, Star, ChevronRight } from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';
import { friendlyDate } from '../../utils/dates';
import { naira, displayName } from '../../utils/format';
import { TRIP_STATUS_LABEL } from '../../constants';

type Tab = 'upcoming' | 'completed';

export default function TripsScreen() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const session = useComuta((s) => s.session);
  const bookings = useComuta((s) => s.bookings);
  const trips = useComuta((s) => s.trips);
  const hubs = useComuta((s) => s.hubs);
  const users = useComuta((s) => s.users);

  const getHub = (id: string) => hubs.find((h) => h.id === id);
  const getDriver = (id: string) => users.find((u) => u.id === id);

  const riderTrips = useMemo(() => {
    if (!session?.userId) return [];
    return bookings
      .filter((b) => b.riderId === session.userId)
      .map((b) => ({ booking: b, trip: trips.find((t) => t.id === b.tripId)! }))
      .filter((x) => x.trip);
  }, [bookings, trips, session?.userId]);

  const upcoming = riderTrips
    .filter((x) => !['completed', 'cancelled'].includes(x.trip.status) && x.booking.status !== 'cancelled')
    .sort((a, b) => a.trip.date.localeCompare(b.trip.date));

  const completed = riderTrips
    .filter((x) => ['completed', 'cancelled'].includes(x.trip.status) || x.booking.status === 'cancelled')
    .sort((a, b) => b.trip.date.localeCompare(a.trip.date));

  const items = tab === 'upcoming' ? upcoming : completed;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Your Trips</Text>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <Pressable onPress={() => setTab('upcoming')} style={[styles.tab, tab === 'upcoming' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
        </Pressable>
        <Pressable onPress={() => setTab('completed')} style={[styles.tab, tab === 'completed' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'completed' && styles.tabTextActive]}>Completed</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color={colors.faint} />
            <Text style={styles.emptyTitle}>No {tab} trips</Text>
            <Text style={styles.emptySubtitle}>
              {tab === 'upcoming' ? 'Book a commute to see your upcoming trips here.' : 'Your completed trips will appear here.'}
            </Text>
          </View>
        ) : (
          items.map(({ trip, booking }, i) => {
            const driver = getDriver(trip.driverId);
            return (
              <Animated.View key={trip.id + booking.id} entering={FadeInDown.delay(i * 60).duration(250)}>
                <Pressable style={styles.tripCard}>
                  <View style={styles.tripCardHeader}>
                    <Text style={styles.tripDate}>{friendlyDate(trip.date)}</Text>
                    <View style={[
                      styles.statusBadge,
                      trip.status === 'confirmed' && { backgroundColor: colors.forest[50] },
                      trip.status === 'at_risk' && { backgroundColor: colors.amber[50] },
                      trip.status === 'completed' && { backgroundColor: colors.forest[50] },
                      trip.status === 'cancelled' && { backgroundColor: colors.red[50] },
                    ]}>
                      <Text style={[
                        styles.statusText,
                        trip.status === 'confirmed' && { color: colors.forest[700] },
                        trip.status === 'completed' && { color: colors.forest[700] },
                        trip.status === 'at_risk' && { color: colors.amber[600] },
                        trip.status === 'cancelled' && { color: colors.red[500] },
                      ]}>
                        {TRIP_STATUS_LABEL[trip.status]}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.tripCorridor}>
                    {getHub(trip.fromId)?.area} → {getHub(trip.toId)?.area}
                  </Text>
                  <Text style={styles.tripMeta}>
                    {trip.departureTime} · {naira(booking.total)} · {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                  </Text>

                  {driver && (
                    <View style={styles.tripDriverRow}>
                      <View style={[styles.miniAvatar, { backgroundColor: driver.avatarColor }]}>
                        <Text style={styles.miniAvatarText}>{driver.photoInitials}</Text>
                      </View>
                      <Text style={styles.tripDriverName}>{displayName(driver)}</Text>
                      {booking.rated && booking.rating && (
                        <View style={styles.ratingRow}>
                          <Star size={12} color={colors.amber[500]} fill={colors.amber[500]} />
                          <Text style={styles.ratingText}>{booking.rating}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Rate prompt for unrated completed trips */}
                  {trip.status === 'completed' && !booking.rated && (
                    <Pressable style={styles.ratePrompt}>
                      <Star size={16} color={colors.forest[600]} />
                      <Text style={styles.ratePromptText}>Rate this trip</Text>
                    </Pressable>
                  )}
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  screenTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[3] },
  tabBar: { flexDirection: 'row', marginHorizontal: spacing[5], marginBottom: spacing[4], backgroundColor: colors.surface2, borderRadius: radii.lg, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radii.md },
  tabActive: { backgroundColor: colors.white, ...shadows.soft },
  tabText: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.muted },
  tabTextActive: { color: colors.forest[900] },
  listContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },
  tripCard: { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing[5], marginBottom: spacing[3], ...shadows.soft },
  tripCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[2] },
  tripDate: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.onsurface },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.full, backgroundColor: colors.lineSoft },
  statusText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.muted },
  tripCorridor: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface, marginBottom: 2 },
  tripMeta: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted, marginBottom: spacing[3] },
  tripDriverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], paddingTop: spacing[3], borderTopWidth: 1, borderTopColor: colors.lineSoft },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { fontFamily: fontFamily.bold, fontSize: 10, color: colors.white },
  tripDriverName: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.onsurface, flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.amber[600] },
  ratePrompt: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing[3], paddingTop: spacing[3], borderTopWidth: 1, borderTopColor: colors.lineSoft },
  ratePromptText: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.forest[600] },
  emptyState: { alignItems: 'center', paddingTop: spacing[16], gap: spacing[3] },
  emptyTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface },
  emptySubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted, textAlign: 'center', paddingHorizontal: spacing[8] },
});
