import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Users, CheckCircle2 } from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';
import { friendlyDate } from '../../utils/dates';
import { displayName, naira } from '../../utils/format';
import { TRIP_STATUS_LABEL } from '../../constants';

export default function DriverTripsScreen() {
  const session = useComuta((s) => s.session);
  const trips = useComuta((s) => s.trips);
  const bookings = useComuta((s) => s.bookings);
  const hubs = useComuta((s) => s.hubs);
  const users = useComuta((s) => s.users);

  const getHub = (id: string) => hubs.find((h) => h.id === id);

  const driverTrips = useMemo(() => {
    if (!session?.userId) return [];
    return trips
      .filter((t) => t.driverId === session.userId)
      .sort((a, b) => a.date.localeCompare(b.date) || a.departureTime.localeCompare(b.departureTime));
  }, [trips, session?.userId]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Your Trips</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {driverTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={48} color={colors.faint} />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>Publish a route and your trips will appear here.</Text>
          </View>
        ) : (
          driverTrips.map((trip, i) => {
            const pax = bookings.filter((b) => b.tripId === trip.id && b.status !== 'cancelled');
            const totalEarnings = pax.reduce((acc, b) => acc + b.total, 0);
            return (
              <Animated.View key={trip.id} entering={FadeInDown.delay(i * 50).duration(250)}>
                <Pressable style={styles.tripCard}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripDate}>{friendlyDate(trip.date)}</Text>
                    <View style={[styles.statusBadge,
                      trip.status === 'confirmed' && { backgroundColor: colors.forest[50] },
                      trip.status === 'completed' && { backgroundColor: colors.forest[50] },
                      trip.status === 'at_risk' && { backgroundColor: colors.amber[50] },
                      trip.status === 'cancelled' && { backgroundColor: colors.red[50] },
                    ]}>
                      <Text style={[styles.statusText,
                        trip.status === 'confirmed' && { color: colors.forest[700] },
                        trip.status === 'completed' && { color: colors.forest[700] },
                        trip.status === 'at_risk' && { color: colors.amber[600] },
                        trip.status === 'cancelled' && { color: colors.red[500] },
                      ]}>{TRIP_STATUS_LABEL[trip.status]}</Text>
                    </View>
                  </View>
                  <Text style={styles.tripCorridor}>{getHub(trip.fromId)?.area} → {getHub(trip.toId)?.area}</Text>
                  <Text style={styles.tripMeta}>{trip.departureTime} · {pax.length}/{trip.seatsTotal} seats</Text>
                  {pax.length > 0 && (
                    <View style={styles.paxSection}>
                      <Text style={styles.paxLabel}>{pax.length} passenger{pax.length !== 1 ? 's' : ''} · {naira(totalEarnings)}</Text>
                      <View style={styles.paxAvatars}>
                        {pax.slice(0, 5).map((b) => {
                          const rider = users.find((u) => u.id === b.riderId);
                          return rider ? (
                            <View key={b.id} style={[styles.miniAvatar, { backgroundColor: rider.avatarColor }]}>
                              <Text style={styles.miniAvatarText}>{rider.photoInitials}</Text>
                            </View>
                          ) : null;
                        })}
                      </View>
                    </View>
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
  listContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },
  tripCard: { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing[5], marginBottom: spacing[3], ...shadows.soft },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[2] },
  tripDate: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.onsurface },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.full, backgroundColor: colors.lineSoft },
  statusText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.muted },
  tripCorridor: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface, marginBottom: 2 },
  tripMeta: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted },
  paxSection: { paddingTop: spacing[3], marginTop: spacing[3], borderTopWidth: 1, borderTopColor: colors.lineSoft },
  paxLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.forest[600], marginBottom: spacing[2] },
  paxAvatars: { flexDirection: 'row', gap: -6 },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  miniAvatarText: { fontFamily: fontFamily.bold, fontSize: 10, color: colors.white },
  emptyState: { alignItems: 'center', paddingTop: spacing[16], gap: spacing[3] },
  emptyTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface },
  emptySubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted, textAlign: 'center', paddingHorizontal: spacing[8] },
});
