import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect } from 'react-native-svg';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Users,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';
import { displayName, naira } from '../../utils/format';
import { friendlyDate } from '../../utils/dates';

export default function SearchResults() {
  const router = useRouter();
  const trips = useComuta((s) => s.trips);
  const users = useComuta((s) => s.users);
  const hubs = useComuta((s) => s.hubs);
  const driverProfiles = useComuta((s) => s.driverProfiles);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const getHub = (id: string) => hubs.find((h) => h.id === id);
  const getDriver = (id: string) => users.find((u) => u.id === id);

  // Filter available trips
  const available = useMemo(
    () =>
      trips
        .filter((t) => ['scheduled', 'confirmed'].includes(t.status) && t.seatsLeft > 0)
        .sort((a, b) => a.departureTime.localeCompare(b.departureTime)),
    [trips],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.onsurface} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Available rides</Text>
          <Text style={styles.headerSubtitle}>
            {available.length} ride{available.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      </View>

      {/* Sort/filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {['Recommended', 'Price', 'Departure time', 'Seats'].map((label, i) => (
          <Pressable key={label} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
            {i === 0 && <Star size={12} color={colors.white} />}
            <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {available.length === 0 ? (
          <View style={styles.emptyState}>
            <Svg width={100} height={70} viewBox="0 0 100 70">
              <Rect x="15" y="20" width="70" height="30" rx="8" fill={colors.forest[100]} />
              <Rect x="25" y="12" width="50" height="14" rx="4" fill={colors.forest[50]} />
              <Circle cx="30" cy="50" r="8" fill={colors.forest[200]} />
              <Circle cx="70" cy="50" r="8" fill={colors.forest[200]} />
            </Svg>
            <Text style={styles.emptyTitle}>No rides available</Text>
            <Text style={styles.emptySubtitle}>
              Try a different time or corridor. New rides are posted daily.
            </Text>
          </View>
        ) : (
          available.map((trip, i) => {
            const driver = getDriver(trip.driverId);
            const fromHub = getHub(trip.fromId);
            const toHub = getHub(trip.toId);
            const isSelected = selectedTrip === trip.id;
            const profile = driver ? driverProfiles[driver.id] : undefined;

            return (
              <Animated.View key={trip.id} entering={FadeInDown.delay(i * 50).duration(250)}>
                <Pressable
                  style={[styles.rideCard, isSelected && styles.rideCardSelected]}
                  onPress={() => setSelectedTrip(trip.id)}
                >
                  {/* Driver row */}
                  <View style={styles.driverRow}>
                    <View style={[styles.avatar, { backgroundColor: driver?.avatarColor || colors.forest[600] }]}>
                      <Text style={styles.avatarText}>{driver?.photoInitials || '??'}</Text>
                    </View>
                    <View style={styles.driverInfo}>
                      <View style={styles.driverNameRow}>
                        <Text style={styles.driverName}>{driver ? displayName(driver) : 'Driver'}</Text>
                        {profile?.completionRate && profile.completionRate >= 90 && (
                          <View style={styles.verifiedBadge}>
                            <Shield size={10} color={colors.forest[600]} />
                          </View>
                        )}
                      </View>
                      <View style={styles.ratingRow}>
                        <Star size={12} color={colors.amber[500]} fill={colors.amber[500]} />
                        <Text style={styles.ratingText}>
                          {profile?.rating?.toFixed(1) || '4.8'} · {profile?.completionRate || 98}% completion
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.priceTag}>{naira(trip.pricePerSeat)}</Text>
                  </View>

                  {/* Route */}
                  <View style={styles.routeRow}>
                    <View style={styles.routeDots}>
                      <View style={[styles.routeDot, { backgroundColor: colors.forest[600] }]} />
                      <View style={styles.routeLine} />
                      <View style={[styles.routeDot, { backgroundColor: colors.lime[500] }]} />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeHub}>{fromHub?.area || 'Origin'}</Text>
                      <Text style={styles.routeMeta}>
                        {trip.departureTime} · {trip.durationMin} min · {trip.distanceKm} km
                      </Text>
                      <Text style={styles.routeHub}>{toHub?.area || 'Destination'}</Text>
                    </View>
                  </View>

                  {/* Bottom meta */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaChip}>
                      <Clock size={12} color={colors.muted} />
                      <Text style={styles.metaText}>{friendlyDate(trip.date)}</Text>
                    </View>
                    <View style={styles.metaChip}>
                      <Users size={12} color={colors.muted} />
                      <Text style={styles.metaText}>{trip.seatsLeft} seat{trip.seatsLeft !== 1 ? 's' : ''} left</Text>
                    </View>
                  </View>

                  {/* Book CTA (visible when selected) */}
                  {isSelected && (
                    <Animated.View entering={FadeInDown.duration(200)}>
                      <Pressable
                        style={styles.bookButton}
                        onPress={() => {
                          // Navigate to booking confirmation
                          router.push({ pathname: '/(rider)/booking-confirm', params: { tripId: trip.id } });
                        }}
                      >
                        <Text style={styles.bookButtonText}>Book this ride</Text>
                        <Text style={styles.bookButtonPrice}>{naira(trip.pricePerSeat)}/seat</Text>
                      </Pressable>
                    </Animated.View>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.titleLarge, color: colors.onsurface },
  headerSubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted, marginTop: 2 },

  // Filters
  filterRow: { gap: spacing[2], paddingHorizontal: spacing[5], paddingBottom: spacing[4] },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[4],
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: { backgroundColor: colors.forest[900], borderColor: colors.forest[900] },
  filterText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.muted },
  filterTextActive: { color: colors.white },

  // List
  listContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },

  // Ride card
  rideCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    borderWidth: 2,
    borderColor: colors.lineSoft,
    ...shadows.soft,
  },
  rideCardSelected: {
    borderColor: colors.forest[600],
    backgroundColor: colors.forest[50],
  },

  // Driver
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[4] },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamily.bold, fontSize: 14, color: colors.white },
  driverInfo: { flex: 1 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  driverName: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.forest[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  priceTag: { fontFamily: fontFamily.bold, fontSize: fontSize.titleLarge, color: colors.forest[800] },

  // Route
  routeRow: { flexDirection: 'row', gap: spacing[3], marginBottom: spacing[4] },
  routeDots: { alignItems: 'center', paddingTop: 4 },
  routeDot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: { width: 2, height: 24, backgroundColor: colors.lineSoft },
  routeInfo: { flex: 1, gap: 2 },
  routeHub: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.onsurface },
  routeMeta: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },

  // Meta
  metaRow: { flexDirection: 'row', gap: spacing[3] },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: colors.surface2,
  },
  metaText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.muted },

  // Book button
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.forest[900],
    borderRadius: radii.lg,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginTop: spacing[4],
  },
  bookButtonText: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.white },
  bookButtonPrice: { fontFamily: fontFamily.bold, fontSize: fontSize.bodyMedium, color: colors.lime[400] },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: spacing[16], gap: spacing[3] },
  emptyTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface },
  emptySubtitle: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted, textAlign: 'center', paddingHorizontal: spacing[8] },
});
