import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, RefreshControl, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect } from 'react-native-svg';
import Animated, { FadeInDown, FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Bell, Users, TrendingUp, Plus, ChevronRight, AlertCircle, CheckCircle2, Clock, MapPin, ArrowLeft, CalendarDays, Check, X } from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { useComuta } from '../../store';
import { greeting, friendlyDate, todayISO, addDaysISO } from '../../utils/dates';
import { TRIP_STATUS_LABEL } from '../../constants';
import { nid, pinCode } from '../../utils/format';

export default function DriverHome() {
  const router = useRouter();
  const session = useComuta((s) => s.session);
  const users = useComuta((s) => s.users);
  const trips = useComuta((s) => s.trips);
  const bookings = useComuta((s) => s.bookings);
  const hubs = useComuta((s) => s.hubs);
  const driverProfiles = useComuta((s) => s.driverProfiles);
  const notifications = useComuta((s) => s.notifications);
  const addTrip = useComuta((s) => s.addTrip);
  const [refreshing, setRefreshing] = useState(false);

  // Publish Wizard Modal State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<{ fromId?: string; toId?: string; date?: string; time?: string; seats: number; price: number }>({ seats: 3, price: 1200 });

  const currentUser = useMemo(
    () => users.find((u) => u.id === session?.userId),
    [users, session?.userId],
  );

  const profile = session?.userId ? driverProfiles[session.userId] : null;
  const unreadNotifs = notifications.filter((n) => n.userId === session?.userId && !n.read).length;

  const driverTrips = useMemo(() => {
    if (!session?.userId) return [];
    return trips
      .filter((t) => t.driverId === session.userId && !['completed', 'cancelled'].includes(t.status))
      .sort((a, b) => a.date.localeCompare(b.date) || a.departureTime.localeCompare(b.departureTime));
  }, [trips, session?.userId]);

  const nextTrip = driverTrips[0];
  const getHub = (id: string) => hubs.find((h) => h.id === id);

  const nextTripPassengers = nextTrip
    ? bookings.filter((b) => b.tripId === nextTrip.id && b.status !== 'cancelled')
    : [];

  const needsConfirmation = nextTrip && !nextTrip.driverConfirmed &&
    ['confirmation_pending', 'scheduled'].includes(nextTrip.status);

  const confirmTrip = () => {
    if (!nextTrip) return;
    useComuta.getState().updateTrip(nextTrip.id, { driverConfirmed: true, status: 'confirmed' });
    nextTripPassengers.forEach((b) => {
      useComuta.getState().pushNotification(
        b.riderId,
        'Your driver confirmed tomorrow\'s trip',
        `${currentUser?.firstName} confirmed your ${getHub(nextTrip.fromId)?.area} → ${getHub(nextTrip.toId)?.area} commute.`,
        'trip'
      );
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    useComuta.getState().refreshCalendar();
    setTimeout(() => setRefreshing(false), 500);
  };

  const startPublishing = () => {
    setIsPublishing(true);
    setPublishStep(1);
    setDraft({ seats: 3, price: 1200 });
  };

  const cancelPublishing = () => {
    setIsPublishing(false);
  };

  const submitPublishing = () => {
    if (!session?.userId || !draft.fromId || !draft.toId || !draft.date || !draft.time) return;
    addTrip({
      id: nid('trp'),
      driverId: session.userId,
      fromId: draft.fromId,
      toId: draft.toId,
      pickupHubId: draft.fromId,
      date: draft.date,
      departureTime: draft.time,
      arrivalTime: '9:00 AM',
      durationMin: 120,
      distanceKm: 45,
      pricePerSeat: draft.price,
      seatsTotal: draft.seats,
      seatsLeft: draft.seats,
      driverConfirmed: true,
      status: 'confirmed',
      pin: pinCode(),
      createdAt: new Date().toISOString()
    });
    cancelPublishing();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Svg width={32} height={32} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
            <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
            <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
          </Svg>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.forest[600]} />}
      >
        {/* Greeting */}
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>{currentUser?.firstName || 'Driver'}</Text>
        </View>

        {/* T-8 Confirmation card */}
        {needsConfirmation && nextTrip && (
          <View>
            <View style={styles.confirmCard}>
              <View style={styles.confirmHeader}>
                <AlertCircle size={20} color={colors.amber[600]} />
                <Text style={styles.confirmLabel}>Confirm your commute</Text>
              </View>
              <Text style={styles.confirmCorridor}>
                {getHub(nextTrip.fromId)?.area} → {getHub(nextTrip.toId)?.area}
              </Text>
              <Text style={styles.confirmDetails}>
                {friendlyDate(nextTrip.date)} · {nextTrip.departureTime} · {nextTripPassengers.length} passenger{nextTripPassengers.length !== 1 ? 's' : ''} booked
              </Text>
              <View style={styles.confirmDeadline}>
                <Clock size={14} color={colors.amber[600]} />
                <Text style={styles.confirmDeadlineText}>Confirm by 11:00 PM tonight</Text>
              </View>
              <Button label="Confirm trip" onPress={confirmTrip} />
            </View>
          </View>
        )}

        {/* Next trip card (if confirmed) */}
        {nextTrip && nextTrip.driverConfirmed && (
          <View>
            <Text style={styles.sectionLabel}>Your next commute</Text>
            <View style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={[styles.statusBadge, { backgroundColor: colors.forest[50] }]}>
                  <CheckCircle2 size={12} color={colors.forest[600]} />
                  <Text style={[styles.statusText, { color: colors.forest[700] }]}>Confirmed</Text>
                </View>
                <Text style={styles.tripDate}>{friendlyDate(nextTrip.date)}</Text>
              </View>
              <Text style={styles.tripCorridor}>
                {getHub(nextTrip.fromId)?.area} → {getHub(nextTrip.toId)?.area}
              </Text>
              <Text style={styles.tripMeta}>
                {nextTrip.departureTime} · {nextTripPassengers.length}/{nextTrip.seatsTotal} seats booked
              </Text>
              <View style={styles.passengersRow}>
                {nextTripPassengers.slice(0, 4).map((b) => {
                  const rider = users.find((u) => u.id === b.riderId);
                  return rider ? (
                    <View key={b.id} style={[styles.miniAvatar, { backgroundColor: rider.avatarColor }]}>
                      <Text style={styles.miniAvatarText}>{rider.photoInitials}</Text>
                    </View>
                  ) : null;
                })}
                {nextTripPassengers.length > 4 && (
                  <View style={[styles.miniAvatar, { backgroundColor: colors.surface2 }]}>
                    <Text style={[styles.miniAvatarText, { color: colors.muted }]}>+{nextTripPassengers.length - 4}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Earnings snapshot */}
        <View>
          <Text style={styles.sectionLabel}>This month</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <TrendingUp size={20} color={colors.forest[600]} />
              <Text style={styles.statValue}>{profile?.monthlyTrips || 0}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={20} color={colors.teal[600]} />
              <Text style={styles.statValue}>{profile?.monthlyPassengers || 0}</Text>
              <Text style={styles.statLabel}>Passengers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCurrency}>₦</Text>
              <Text style={styles.statValue}>{((profile?.monthlyRecovered || 0) / 1000).toFixed(1)}k</Text>
              <Text style={styles.statLabel}>Recovered</Text>
            </View>
          </View>
        </View>

        {/* Publish CTA */}
        <View>
          <View style={{ marginTop: spacing[5] }}>
            <Button
              label="Publish a commute"
              variant="lime"
              onPress={startPublishing}
              icon={<Plus size={18} color={colors.forest[950]} />}
            />
          </View>
        </View>

        {/* Upcoming trips */}
        {driverTrips.length > 1 && (
          <View>
            <Text style={styles.sectionLabel}>Coming up</Text>
            {driverTrips.slice(1, 5).map((trip) => {
              const pax = bookings.filter((b) => b.tripId === trip.id && b.status !== 'cancelled');
              return (
                <Pressable key={trip.id} style={styles.upcomingCard}>
                  <View>
                    <Text style={styles.upcomingDate}>{friendlyDate(trip.date)}</Text>
                    <Text style={styles.upcomingCorridor}>{getHub(trip.fromId)?.area} → {getHub(trip.toId)?.area}</Text>
                    <Text style={styles.upcomingMeta}>{trip.departureTime} · {pax.length} booked</Text>
                  </View>
                  <ChevronRight size={16} color={colors.muted} />
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: spacing[10] }} />
      </ScrollView>

      {/* ── Publish Wizard Modal ── */}
      <Modal visible={isPublishing} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.wizardSafe} edges={['top', 'bottom']}>
          {/* Wizard Header */}
          <View style={styles.wizardHeader}>
            <Pressable onPress={() => publishStep > 1 ? setPublishStep((p) => (p - 1) as any) : cancelPublishing()} style={styles.wizardBack}>
              {publishStep > 1 ? <ArrowLeft size={24} color={colors.onsurface} /> : <X size={24} color={colors.onsurface} />}
            </Pressable>
            <Text style={styles.wizardTitle}>Publish commute</Text>
            <View style={styles.wizardBack} />
          </View>

          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            {[1, 2, 3].map((step) => (
              <View key={step} style={[styles.stepDot, publishStep >= step && styles.stepDotActive]} />
            ))}
          </View>

          <ScrollView contentContainerStyle={styles.wizardContent} showsVerticalScrollIndicator={false}>
            {publishStep === 1 && (
              <>
                <Text style={styles.stepTitle}>Where are you driving?</Text>
                <Text style={styles.stepSubtitle}>Select pickup hub</Text>
                <View style={styles.hubsList}>
                  {hubs.map((h) => (
                    <Pressable
                      key={h.id}
                      style={[styles.hubOption, draft.fromId === h.id && styles.hubOptionActive]}
                      onPress={() => setDraft({ ...draft, fromId: h.id })}
                    >
                      <MapPin size={20} color={draft.fromId === h.id ? colors.forest[600] : colors.muted} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.hubOptionName, draft.fromId === h.id && { color: colors.forest[800] }]}>{h.name}</Text>
                        <Text style={styles.hubOptionArea}>{h.area}</Text>
                      </View>
                      {draft.fromId === h.id && <Check size={20} color={colors.forest[600]} />}
                    </Pressable>
                  ))}
                </View>

                {draft.fromId && (
                  <>
                    <Text style={[styles.stepSubtitle, { marginTop: spacing[6] }]}>Select drop-off hub</Text>
                    <View style={styles.hubsList}>
                      {hubs.filter((h) => h.id !== draft.fromId).map((h) => (
                        <Pressable
                          key={h.id}
                          style={[styles.hubOption, draft.toId === h.id && styles.hubOptionActive]}
                          onPress={() => setDraft({ ...draft, toId: h.id })}
                        >
                          <MapPin size={20} color={draft.toId === h.id ? colors.lime[600] : colors.muted} />
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.hubOptionName, draft.toId === h.id && { color: colors.forest[800] }]}>{h.name}</Text>
                            <Text style={styles.hubOptionArea}>{h.area}</Text>
                          </View>
                          {draft.toId === h.id && <Check size={20} color={colors.lime[600]} />}
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}
              </>
            )}

            {publishStep === 2 && (
              <>
                <Text style={styles.stepTitle}>When are you leaving?</Text>

                <Text style={styles.inputLabel}>Date</Text>
                <View style={styles.rowGrid}>
                  {[todayISO(), addDaysISO(1)].map((dateISO, i) => (
                    <Pressable
                      key={dateISO}
                      style={[styles.choiceBox, draft.date === dateISO && styles.choiceBoxActive]}
                      onPress={() => setDraft({ ...draft, date: dateISO })}
                    >
                      <Text style={[styles.choiceText, draft.date === dateISO && styles.choiceTextActive]}>
                        {i === 0 ? 'Today' : 'Tomorrow'}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={[styles.inputLabel, { marginTop: spacing[5] }]}>Time</Text>
                <View style={styles.rowGrid}>
                  {['6:00 AM', '7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM'].map((time) => (
                    <Pressable
                      key={time}
                      style={[styles.choiceBox, draft.time === time && styles.choiceBoxActive]}
                      onPress={() => setDraft({ ...draft, time })}
                    >
                      <Text style={[styles.choiceText, draft.time === time && styles.choiceTextActive]}>{time}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            {publishStep === 3 && (
              <>
                <Text style={styles.stepTitle}>Seats & Price</Text>

                <Text style={styles.inputLabel}>Available Seats</Text>
                <View style={styles.counterRow}>
                  <Pressable style={styles.counterBtn} onPress={() => setDraft({ ...draft, seats: Math.max(1, draft.seats - 1) })}>
                    <Text style={styles.counterBtnText}>-</Text>
                  </Pressable>
                  <Text style={styles.counterValue}>{draft.seats}</Text>
                  <Pressable style={styles.counterBtn} onPress={() => setDraft({ ...draft, seats: Math.min(6, draft.seats + 1) })}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </Pressable>
                </View>

                <Text style={[styles.inputLabel, { marginTop: spacing[5] }]}>Price per seat</Text>
                <View style={styles.counterRow}>
                  <Pressable style={styles.counterBtn} onPress={() => setDraft({ ...draft, price: Math.max(500, draft.price - 100) })}>
                    <Text style={styles.counterBtnText}>-</Text>
                  </Pressable>
                  <Text style={styles.counterValue}>₦{draft.price}</Text>
                  <Pressable style={styles.counterBtn} onPress={() => setDraft({ ...draft, price: Math.min(5000, draft.price + 100) })}>
                    <Text style={styles.counterBtnText}>+</Text>
                  </Pressable>
                </View>

                <View style={styles.priceHelp}>
                  <AlertCircle size={16} color={colors.muted} />
                  <Text style={styles.priceHelpText}>Recommended price for this route is ₦1,200</Text>
                </View>
              </>
            )}
          </ScrollView>

          {/* Wizard CTA */}
          <View style={styles.wizardCta}>
            {publishStep < 3 ? (
              <Button
                label="Next"
                onPress={() => {
                  if (publishStep === 1 && draft.fromId && draft.toId) setPublishStep(2);
                  else if (publishStep === 2 && draft.date && draft.time) setPublishStep(3);
                }}
                disabled={
                  (publishStep === 1 && (!draft.fromId || !draft.toId)) ||
                  (publishStep === 2 && (!draft.date || !draft.time))
                }
              />
            ) : (
              <Button label="Publish Commute" variant="lime" onPress={submitPublishing} />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontFamily: fontFamily.bold, fontSize: fontSize.titleLarge, color: colors.forest[900] },
  notifButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  notifBadge: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.red[500], alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { fontFamily: fontFamily.bold, fontSize: 10, color: colors.white },

  // Content
  scrollContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },

  // Greeting
  greeting: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, marginTop: spacing[2] },
  userName: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineMedium, color: colors.onsurface, marginBottom: spacing[4] },

  sectionLabel: { fontFamily: fontFamily.semibold, fontSize: fontSize.labelMedium, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing[3], marginTop: spacing[5] },

  // Confirm card
  confirmCard: { backgroundColor: colors.amber[50], borderRadius: radii.xl, padding: spacing[5], marginBottom: spacing[2], borderWidth: 1, borderColor: colors.amber[100] },
  confirmHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[3] },
  confirmLabel: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.amber[600] },
  confirmCorridor: { fontFamily: fontFamily.bold, fontSize: fontSize.titleLarge, color: colors.onsurface, marginBottom: spacing[1] },
  confirmDetails: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted, marginBottom: spacing[3] },
  confirmDeadline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing[4] },
  confirmDeadlineText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.amber[600] },

  // Trip card
  tripCard: { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing[5], ...shadows.soft, marginBottom: spacing[2], borderWidth: 1, borderColor: colors.lineSoft },
  tripHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[3] },
  tripDate: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.muted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radii.full },
  statusText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall },
  tripCorridor: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface, marginBottom: 2 },
  tripMeta: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted, marginBottom: spacing[3] },
  passengersRow: { flexDirection: 'row', gap: -8, paddingTop: spacing[3], borderTopWidth: 1, borderTopColor: colors.lineSoft },
  miniAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  miniAvatarText: { fontFamily: fontFamily.bold, fontSize: 10, color: colors.white },

  // Stats
  statsRow: { flexDirection: 'row', gap: spacing[3] },
  statCard: { flex: 1, backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing[4], alignItems: 'center', gap: spacing[1], ...shadows.soft, borderWidth: 1, borderColor: colors.lineSoft },
  statValue: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineMedium, color: colors.onsurface },
  statLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  statCurrency: { fontFamily: fontFamily.bold, fontSize: 20, color: colors.forest[600] },

  // Upcoming
  upcomingCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing[4], marginBottom: spacing[2], ...shadows.soft },
  upcomingDate: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.onsurface },
  upcomingCorridor: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  upcomingMeta: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.forest[600], marginTop: 2 },

  // --- Wizard Modal Styles ---
  wizardSafe: { flex: 1, backgroundColor: colors.surface },
  wizardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[3] },
  wizardBack: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  wizardTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.titleMedium, color: colors.onsurface },

  stepIndicator: { flexDirection: 'row', gap: 8, paddingHorizontal: spacing[5], marginVertical: spacing[2] },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.lineSoft },
  stepDotActive: { backgroundColor: colors.forest[600] },

  wizardContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[6] },
  stepTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineMedium, color: colors.onsurface, marginBottom: spacing[4], marginTop: spacing[4] },
  stepSubtitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.muted, marginBottom: spacing[3] },

  wizardCta: { paddingHorizontal: spacing[5], paddingBottom: spacing[4], paddingTop: spacing[2], borderTopWidth: 1, borderTopColor: colors.lineSoft },

  // Step 1: Hubs
  hubsList: { gap: spacing[3] },
  hubOption: { flexDirection: 'row', alignItems: 'center', gap: spacing[4], padding: spacing[4], borderRadius: radii.xl, backgroundColor: colors.surface2, borderWidth: 2, borderColor: 'transparent' },
  hubOptionActive: { backgroundColor: colors.forest[50], borderColor: colors.forest[600] },
  hubOptionName: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  hubOptionArea: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted, marginTop: 2 },

  // Step 2: Schedule
  inputLabel: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodySmall, color: colors.muted, marginBottom: spacing[3] },
  rowGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3] },
  choiceBox: { paddingHorizontal: spacing[5], paddingVertical: spacing[3], borderRadius: radii.lg, backgroundColor: colors.surface2, borderWidth: 2, borderColor: 'transparent' },
  choiceBoxActive: { backgroundColor: colors.forest[50], borderColor: colors.forest[600] },
  choiceText: { fontFamily: fontFamily.medium, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  choiceTextActive: { color: colors.forest[800], fontFamily: fontFamily.bold },

  // Step 3: Seats & Price
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface2, borderRadius: radii.xl, padding: spacing[2] },
  counterBtn: { width: 48, height: 48, borderRadius: radii.lg, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  counterBtnText: { fontFamily: fontFamily.bold, fontSize: 24, color: colors.forest[600] },
  counterValue: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineMedium, color: colors.onsurface },
  priceHelp: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing[3] },
  priceHelpText: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
});
