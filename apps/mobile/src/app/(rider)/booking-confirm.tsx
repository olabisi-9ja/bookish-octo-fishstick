import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect, Path } from 'react-native-svg';
import {
  ArrowLeft,
  Star,
  Shield,
  MapPin,
  Clock,
  Users,
  CreditCard,
  MessageSquare,
  Phone,
  Check,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';
import { displayName, naira } from '../../utils/format';
import { friendlyDate } from '../../utils/dates';
import { Button } from '../../components/ui/Button';

export default function BookingConfirm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tripId: string }>();
  const trips = useComuta((s) => s.trips);
  const users = useComuta((s) => s.users);
  const hubs = useComuta((s) => s.hubs);
  const driverProfiles = useComuta((s) => s.driverProfiles);

  const trip = trips.find((t) => t.id === params.tripId) || trips[0];
  const driver = users.find((u) => u.id === trip?.driverId);
  const fromHub = hubs.find((h) => h.id === trip?.fromId);
  const toHub = hubs.find((h) => h.id === trip?.toId);
  const profile = driver ? driverProfiles[driver.id] : undefined;

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Booking confirmed!', 'Your seat has been reserved. Check your Activity tab for details.', [
      { text: 'Great', onPress: () => router.replace('/(rider)/ride') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.onsurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Driver card */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.driverCard}>
          <View style={[styles.avatar, { backgroundColor: driver?.avatarColor || colors.forest[600] }]}>
            <Text style={styles.avatarText}>{driver?.photoInitials || '??'}</Text>
          </View>
          <View style={styles.driverInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.driverName}>{driver ? displayName(driver) : 'Driver'}</Text>
              <View style={styles.verifiedBadge}>
                <Shield size={10} color={colors.forest[600]} />
              </View>
            </View>
            <View style={styles.ratingRow}>
              <Star size={12} color={colors.amber[500]} fill={colors.amber[500]} />
              <Text style={styles.ratingText}>{profile?.rating?.toFixed(1) || '4.8'}</Text>
              <Text style={styles.separator}>·</Text>
              <Text style={styles.ratingText}>{profile?.totalTrips || 120}+ trips</Text>
            </View>
          </View>

          {/* Contact buttons */}
          <View style={styles.contactRow}>
            <Pressable style={styles.contactBtn}>
              <MessageSquare size={16} color={colors.forest[600]} />
            </Pressable>
            <Pressable style={styles.contactBtn}>
              <Phone size={16} color={colors.forest[600]} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Vehicle info */}
        {profile?.vehicleModel && (
          <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.vehicleCard}>
            <Svg width={56} height={32} viewBox="0 0 56 32">
              <Rect x="5" y="8" width="46" height="18" rx="5" fill={colors.forest[100]} />
              <Rect x="12" y="2" width="32" height="10" rx="4" fill={colors.forest[50]} />
              <Circle cx="16" cy="26" r="4" fill={colors.forest[300]} />
              <Circle cx="40" cy="26" r="4" fill={colors.forest[300]} />
            </Svg>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleModel}>{profile.vehicleModel}</Text>
              <Text style={styles.vehiclePlate}>{profile.licensePlate || 'ABC 123 XY'}</Text>
            </View>
          </Animated.View>
        )}

        {/* Route details */}
        <Animated.View entering={FadeInDown.delay(120).duration(300)} style={styles.routeCard}>
          <Text style={styles.sectionTitle}>Route details</Text>
          <View style={styles.routeRow}>
            <View style={styles.routeDots}>
              <View style={[styles.routeDot, { backgroundColor: colors.forest[600] }]} />
              <View style={styles.routeLine} />
              <View style={[styles.routeDot, { backgroundColor: colors.lime[500] }]} />
            </View>
            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <Text style={styles.routeHub}>{fromHub?.name || 'Pickup Hub'}</Text>
                <Text style={styles.routeAddress}>{fromHub?.address || ''}</Text>
              </View>
              <View style={styles.routePoint}>
                <Text style={styles.routeHub}>{toHub?.name || 'Drop-off Hub'}</Text>
                <Text style={styles.routeAddress}>{toHub?.address || ''}</Text>
              </View>
            </View>
          </View>
          <View style={styles.routeMeta}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.muted} />
              <Text style={styles.metaText}>{trip.departureTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={14} color={colors.muted} />
              <Text style={styles.metaText}>{trip.distanceKm} km</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={14} color={colors.muted} />
              <Text style={styles.metaText}>{trip.seatsLeft} seat{trip.seatsLeft !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Payment summary */}
        <Animated.View entering={FadeInDown.delay(180).duration(300)} style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentRow}>
            <CreditCard size={18} color={colors.forest[600]} />
            <Text style={styles.paymentMethod}>Cash</Text>
            <Pressable>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Seat price</Text>
            <Text style={styles.priceValue}>{naira(trip.pricePerSeat)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>{naira(Math.round(trip.pricePerSeat * 0.05))}</Text>
          </View>
          <View style={[styles.divider, { marginTop: spacing[2] }]} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{naira(Math.round(trip.pricePerSeat * 1.05))}</Text>
          </View>
        </Animated.View>

        {/* Safety note */}
        <View style={styles.safetyNote}>
          <Shield size={16} color={colors.forest[600]} />
          <Text style={styles.safetyText}>
            All drivers are verified. Share your trip status with trusted contacts for extra peace of mind.
          </Text>
        </View>
      </ScrollView>

      {/* Confirm CTA */}
      <View style={styles.ctaContainer}>
        <Button label="Confirm & book seat" onPress={handleConfirm} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  errorText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodyMedium, color: colors.muted, textAlign: 'center', paddingTop: 100 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface },

  scroll: { paddingHorizontal: spacing[5], paddingBottom: spacing[4] },

  // Driver card
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.soft,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamily.bold, fontSize: 18, color: colors.white },
  driverInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  driverName: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface },
  verifiedBadge: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.forest[50], alignItems: 'center', justifyContent: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  separator: { color: colors.faint },
  contactRow: { flexDirection: 'row', gap: spacing[2] },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.forest[50],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Vehicle
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.soft,
  },
  vehicleInfo: { flex: 1 },
  vehicleModel: { fontFamily: fontFamily.medium, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  vehiclePlate: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted, marginTop: 2 },

  // Route
  routeCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.soft,
  },
  sectionTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface, marginBottom: spacing[4] },
  routeRow: { flexDirection: 'row', gap: spacing[3] },
  routeDots: { alignItems: 'center', paddingTop: 4, width: 12 },
  routeDot: { width: 12, height: 12, borderRadius: 6 },
  routeLine: { width: 2, flex: 1, minHeight: 30, backgroundColor: colors.lineSoft },
  routeInfo: { flex: 1, gap: spacing[4] },
  routePoint: { gap: 2 },
  routeHub: { fontFamily: fontFamily.medium, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  routeAddress: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  routeMeta: { flexDirection: 'row', gap: spacing[4], marginTop: spacing[4], borderTopWidth: 1, borderTopColor: colors.lineSoft, paddingTop: spacing[3] },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.muted },

  // Payment
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.soft,
  },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  paymentMethod: { flex: 1, fontFamily: fontFamily.medium, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  changeText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.teal[600] },
  divider: { height: 1, backgroundColor: colors.lineSoft, marginVertical: spacing[3] },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[1] },
  priceLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted },
  priceValue: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.onsurface },
  totalLabel: { fontFamily: fontFamily.bold, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  totalValue: { fontFamily: fontFamily.bold, fontSize: fontSize.titleMedium, color: colors.forest[800] },

  // Safety
  safetyNote: {
    flexDirection: 'row',
    gap: spacing[3],
    backgroundColor: colors.forest[50],
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  safetyText: { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.forest[700], lineHeight: 18 },

  // CTA
  ctaContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    paddingTop: spacing[2],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.lineSoft,
  },
});
