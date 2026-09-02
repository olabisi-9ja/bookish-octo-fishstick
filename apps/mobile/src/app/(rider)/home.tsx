import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect, Path, G } from 'react-native-svg';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  Bell,
  Search,
  ChevronRight,
  MapPin,
  Clock,
  Car,
  ArrowRight,
  CalendarDays,
} from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { useComuta } from '../../store';
import { greeting, friendlyDate, todayISO, addDaysISO } from '../../utils/dates';
import { displayName, naira, nid, pinCode } from '../../utils/format';
import { TRIP_STATUS_LABEL } from '../../constants';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Comuta Logo SVG ─────────────────────────────────────────
function ComutaLogo({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
      <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
      <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
    </Svg>
  );
}

// ─── Empty State Illustration ────────────────────────────────
function EmptyTripsIllustration() {
  return (
    <View style={styles.emptyIllustration}>
      <Svg width={120} height={80} viewBox="0 0 120 80">
        {/* Road */}
        <Rect x="10" y="60" width="100" height="6" rx="3" fill={colors.forest[100]} />
        {/* Car body */}
        <Rect x="30" y="35" width="60" height="25" rx="6" fill={colors.forest[800]} />
        <Rect x="38" y="25" width="44" height="16" rx="5" fill={colors.forest[700]} />
        {/* Windows */}
        <Rect x="42" y="29" width="16" height="9" rx="2" fill={colors.lime[400]} opacity={0.5} />
        <Rect x="62" y="29" width="16" height="9" rx="2" fill={colors.lime[400]} opacity={0.5} />
        {/* Wheels */}
        <Circle cx="45" cy="60" r="7" fill={colors.forest[900]} />
        <Circle cx="75" cy="60" r="7" fill={colors.forest[900]} />
        <Circle cx="45" cy="60" r="3" fill={colors.white} />
        <Circle cx="75" cy="60" r="3" fill={colors.white} />
      </Svg>
    </View>
  );
}

export default function RiderHome() {
  const router = useRouter();
  const session = useComuta((s) => s.session);
  const users = useComuta((s) => s.users);
  const trips = useComuta((s) => s.trips);
  const bookings = useComuta((s) => s.bookings);
  const hubs = useComuta((s) => s.hubs);
  const notifications = useComuta((s) => s.notifications);
  const driverProfiles = useComuta((s) => s.driverProfiles);
  const [refreshing, setRefreshing] = useState(false);

  // Hub selection state
  const [selectedPickup, setSelectedPickup] = useState<string | null>(null);
  const [selectedDropoff, setSelectedDropoff] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('Select now');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerDay, setTimePickerDay] = useState<'today' | 'tomorrow'>('today');

  const currentUser = useMemo(
    () => users.find((u) => u.id === session?.userId),
    [users, session?.userId],
  );

  const upcomingTrips = useMemo(() => {
    if (!session?.userId) return [];
    return bookings
      .filter((b) => b.riderId === session.userId && b.status !== 'cancelled')
      .map((b) => ({ booking: b, trip: trips.find((t) => t.id === b.tripId)! }))
      .filter((x) => x.trip && !['completed', 'cancelled'].includes(x.trip.status))
      .sort(
        (a, b) =>
          a.trip.date.localeCompare(b.trip.date) ||
          a.trip.departureTime.localeCompare(b.trip.departureTime),
      );
  }, [bookings, trips, session?.userId]);

  const unreadNotifs = notifications.filter(
    (n) => n.userId === session?.userId && !n.read,
  ).length;

  const getHub = (id: string) => hubs.find((h) => h.id === id);
  const getDriver = (id: string) => users.find((u) => u.id === id);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    useComuta.getState().refreshCalendar();
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  // Hub chips (show first 6 for the horizontal scroll)
  const displayHubs = hubs.slice(0, 6);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View>
        <View style={styles.logoRow}>
          <ComutaLogo size={32} />
          <Text style={styles.logoText}>Comuta</Text>
        </View>
        <Pressable style={styles.notifButton} hitSlop={12}>
          <Bell size={22} color={colors.onsurface} />
          {unreadNotifs > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadNotifs}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.forest[600]}
          />
        }
      >
        {/* Greeting */}
        <View>
          <Text style={styles.greeting}>
            {greeting()}, {currentUser?.firstName || 'there'}
          </Text>
        </View>

        {/* ── Search Card ── */}
        <View>
          <Text style={styles.sectionTitle}>Where are you headed?</Text>

          {/* Search input (tappable) */}
          <Pressable
            style={styles.searchBar}
            onPress={() => router.push({ pathname: '/(rider)/hub-select', params: { mode: 'dropoff' } })}
          >
            <Search size={18} color={colors.faint} />
            <Text style={styles.searchPlaceholder}>
              Search by address, area or landmark
            </Text>
          </Pressable>

          {/* Hub chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hubChipsRow}
          >
            {displayHubs.map((hub) => {
              const isSelected = selectedDropoff === hub.id;
              return (
                <Pressable
                  key={hub.id}
                  style={[styles.hubChip, isSelected && styles.hubChipActive]}
                  onPress={() => setSelectedDropoff(isSelected ? null : hub.id)}
                >
                  <View
                    style={[
                      styles.hubDot,
                      isSelected && styles.hubDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.hubChipText,
                      isSelected && styles.hubChipTextActive,
                    ]}
                  >
                    {hub.area}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Time selection chips */}
          <View style={styles.timeRow}>
            <Pressable
              style={[styles.timeChip, selectedTime === 'Select now' && styles.timeChipActive]}
              onPress={() => setSelectedTime('Select now')}
            >
              <Text style={[styles.timeChipText, selectedTime === 'Select now' && styles.timeChipTextActive]}>Select now</Text>
            </Pressable>
            <Pressable
              style={[styles.timeChip, selectedTime.startsWith('Today') && styles.timeChipActive]}
              onPress={() => { setTimePickerDay('today'); setShowTimePicker(true); }}
            >
              <CalendarDays size={14} color={selectedTime.startsWith('Today') ? colors.forest[800] : colors.muted} />
              <Text style={[styles.timeChipText, selectedTime.startsWith('Today') && styles.timeChipTextActive]}>
                {selectedTime.startsWith('Today') ? selectedTime : 'Today'}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.timeChip, selectedTime.startsWith('Tomorrow') && styles.timeChipActive]}
              onPress={() => { setTimePickerDay('tomorrow'); setShowTimePicker(true); }}
            >
              <Clock size={14} color={selectedTime.startsWith('Tomorrow') ? colors.forest[800] : colors.muted} />
              <Text style={[styles.timeChipText, selectedTime.startsWith('Tomorrow') && styles.timeChipTextActive]}>
                {selectedTime.startsWith('Tomorrow') ? selectedTime : 'Tomorrow'}
              </Text>
            </Pressable>
          </View>

          {/* Search CTA */}
          <Button
            label="Search rides"
            onPress={() => router.push('/(rider)/search-results')}
            icon={<Search size={18} color={colors.white} />}
          />
        </View>

        {/* ── Upcoming Trips or Empty State ── */}
        <View>
          {upcomingTrips.length === 0 ? (
            <View style={styles.emptyState}>
              <EmptyTripsIllustration />
              <Text style={styles.emptyTitle}>No trips booked yet</Text>
              <Text style={styles.emptySubtitle}>
                Book a commute above to see your upcoming trips here.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Your next commute</Text>
              {upcomingTrips.slice(0, 3).map(({ trip, booking }) => {
                const driver = getDriver(trip.driverId);
                return (
                  <Pressable key={trip.id} style={styles.tripCard}>
                    <View style={styles.tripCardHeader}>
                      <View
                        style={[
                          styles.statusBadge,
                          trip.status === 'confirmed' && styles.statusConfirmed,
                          trip.status === 'at_risk' && styles.statusAtRisk,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            trip.status === 'confirmed' &&
                              styles.statusTextConfirmed,
                            trip.status === 'at_risk' &&
                              styles.statusTextAtRisk,
                          ]}
                        >
                          {TRIP_STATUS_LABEL[trip.status]}
                        </Text>
                      </View>
                      <Text style={styles.tripDate}>
                        {friendlyDate(trip.date)}
                      </Text>
                    </View>

                    {/* Corridor */}
                    <View style={styles.corridorRow}>
                      <View style={styles.corridorDots}>
                        <View
                          style={[
                            styles.corridorDot,
                            { backgroundColor: colors.forest[600] },
                          ]}
                        />
                        <View style={styles.corridorLine} />
                        <View
                          style={[
                            styles.corridorDot,
                            { backgroundColor: colors.lime[500] },
                          ]}
                        />
                      </View>
                      <View style={styles.corridorInfo}>
                        <Text style={styles.corridorHub}>
                          {getHub(trip.fromId)?.area || 'Origin'}
                        </Text>
                        <Text style={styles.corridorMeta}>
                          {trip.departureTime} · {trip.durationMin} min ·{' '}
                          {naira(trip.pricePerSeat)}
                        </Text>
                        <Text style={styles.corridorHub}>
                          {getHub(trip.toId)?.area || 'Destination'}
                        </Text>
                      </View>
                    </View>

                    {/* Driver */}
                    {driver && (
                      <View style={styles.driverRow}>
                        <View
                          style={[
                            styles.avatar,
                            { backgroundColor: driver.avatarColor },
                          ]}
                        >
                          <Text style={styles.avatarText}>
                            {driver.photoInitials}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.driverName}>
                            {displayName(driver)}
                          </Text>
                          <Text style={styles.driverMeta}>
                            {driverProfiles[driver.id]?.completionRate || 98}%
                            completion rate
                          </Text>
                        </View>
                        <ChevronRight size={18} color={colors.muted} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </>
          )}
        </View>

        {/* ── Driver CTA Banner ── */}
        {session?.role === 'rider' && !session?.driverOnboarded && (
          <View>
            <Pressable
              onPress={() => router.push('/(auth)/driver-onboarding')}
              style={styles.driverBanner}
            >
              <View style={styles.driverBannerLeft}>
                <View style={styles.driverBannerIcon}>
                  <Car size={20} color={colors.white} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverBannerTitle}>
                    Want to give rides?
                  </Text>
                  <Text style={styles.driverBannerSubtitle}>
                    Earn from your daily commute
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.white} />
            </Pressable>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: spacing[10] }} />
      </ScrollView>

      {/* ── Time Picker Modal ── */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowTimePicker(false)}>
          <Pressable style={styles.timePickerSheet} onPress={(e) => e.stopPropagation()}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            <Text style={styles.timePickerTitle}>Where do you want to travel?</Text>

            {/* Day tabs */}
            <View style={styles.dayTabRow}>
              <Pressable
                style={[styles.dayTab, timePickerDay === 'today' && styles.dayTabActive]}
                onPress={() => setTimePickerDay('today')}
              >
                <Text style={[styles.dayTabText, timePickerDay === 'today' && styles.dayTabTextActive]}>Today</Text>
              </Pressable>
              <Pressable
                style={[styles.dayTab, timePickerDay === 'tomorrow' && styles.dayTabActive]}
                onPress={() => setTimePickerDay('tomorrow')}
              >
                <Text style={[styles.dayTabText, timePickerDay === 'tomorrow' && styles.dayTabTextActive]}>Tomorrow</Text>
              </Pressable>
            </View>

            <Text style={styles.timePickerSectionLabel}>Select Time Selection</Text>
            <Text style={styles.timePickerHint}>Choose a specific time</Text>

            {/* Time grid */}
            <View style={styles.timeGrid}>
              {['5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '8:00 PM'].map((time) => {
                const label = `${timePickerDay === 'today' ? 'Today' : 'Tomorrow'} · ${time}`;
                const isActive = selectedTime === label;
                return (
                  <Pressable
                    key={time}
                    style={[styles.timeSlot, isActive && styles.timeSlotActive]}
                    onPress={() => {
                      setSelectedTime(label);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={[styles.timeSlotText, isActive && styles.timeSlotTextActive]}>{time}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Search CTA */}
            <View style={{ marginTop: spacing[5] }}>
              <Button
                label="Search rides"
                onPress={() => {
                  setShowTimePicker(false);
                  router.push('/(rider)/search-results');
                }}
                icon={<Search size={18} color={colors.white} />}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.titleLarge,
    color: colors.forest[900],
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.red[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: colors.white,
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: spacing[5],
  },

  // ── Greeting ──
  greeting: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.headlineLarge,
    color: colors.onsurface,
    marginBottom: spacing[6],
  },

  // ── Section ──
  sectionTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.bodyMedium,
    color: colors.muted,
    marginBottom: spacing[3],
  },

  // ── Search Bar ──
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    height: 52,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  searchPlaceholder: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyMedium,
    color: colors.faint,
  },

  // ── Hub Chips ──
  hubChipsRow: {
    gap: spacing[2],
    paddingBottom: spacing[4],
  },
  hubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  hubChipActive: {
    backgroundColor: colors.forest[50],
    borderColor: colors.forest[600],
  },
  hubDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.muted,
  },
  hubDotActive: {
    backgroundColor: colors.forest[600],
  },
  hubChipText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
  },
  hubChipTextActive: {
    color: colors.forest[800],
    fontFamily: fontFamily.semibold,
  },

  // ── Time Chips ──
  timeRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.full,
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  timeChipActive: {
    backgroundColor: colors.forest[50],
    borderColor: colors.forest[600],
  },
  timeChipText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
  },
  timeChipTextActive: {
    color: colors.forest[800],
    fontFamily: fontFamily.semibold,
  },

  // ── Empty State ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing[10],
    gap: spacing[3],
  },
  emptyIllustration: {
    marginBottom: spacing[2],
  },
  emptyTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.titleMedium,
    color: colors.onsurface,
  },
  emptySubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: spacing[8],
  },

  // ── Section Label ──
  sectionLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.labelMedium,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing[6],
    marginBottom: spacing[3],
  },

  // ── Trip Card ──
  tripCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.soft,
    borderWidth: 1,
    borderColor: colors.lineSoft,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  tripDate: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: colors.lineSoft,
  },
  statusConfirmed: { backgroundColor: colors.forest[50] },
  statusAtRisk: { backgroundColor: colors.amber[50] },
  statusText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.labelSmall,
    color: colors.muted,
  },
  statusTextConfirmed: { color: colors.forest[700] },
  statusTextAtRisk: { color: colors.amber[600] },

  // ── Corridor ──
  corridorRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  corridorDots: { alignItems: 'center', paddingTop: 4 },
  corridorDot: { width: 10, height: 10, borderRadius: 5 },
  corridorLine: {
    width: 2,
    height: 28,
    backgroundColor: colors.lineSoft,
  },
  corridorInfo: { flex: 1, gap: 4 },
  corridorHub: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.bodyMedium,
    color: colors.onsurface,
  },
  corridorMeta: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.muted,
  },

  // ── Driver ──
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.white,
  },
  driverName: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.onsurface,
  },
  driverMeta: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.muted,
  },

  // ── Driver CTA Banner ──
  driverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.forest[900],
    borderRadius: radii.xl,
    padding: spacing[5],
    marginTop: spacing[4],
  },
  driverBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  driverBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forest[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverBannerTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.bodyMedium,
    color: colors.white,
  },
  driverBannerSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.forest[100],
    marginTop: 2,
  },

  // ── Time Picker Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  timePickerSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
    paddingTop: spacing[3],
    maxHeight: '80%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing[4],
  },
  timePickerTitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.titleLarge,
    color: colors.onsurface,
    marginBottom: spacing[4],
  },
  dayTabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: radii.lg,
    padding: 4,
    marginBottom: spacing[5],
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  dayTabActive: {
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  dayTabText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
  },
  dayTabTextActive: {
    color: colors.forest[900],
    fontFamily: fontFamily.semibold,
  },
  timePickerSectionLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.bodyMedium,
    color: colors.onsurface,
    marginBottom: spacing[1],
  },
  timePickerHint: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.muted,
    marginBottom: spacing[4],
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  timeSlot: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: radii.lg,
    backgroundColor: colors.surface2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotActive: {
    backgroundColor: colors.forest[50],
    borderColor: colors.forest[600],
  },
  timeSlotText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.onsurface,
  },
  timeSlotTextActive: {
    color: colors.forest[800],
    fontFamily: fontFamily.bold,
  },
});
