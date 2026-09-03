import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, CheckCircle, Clock } from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { relativeTime } from '../../utils/dates';

export default function EarningsScreen() {
  const session = useComuta((s) => s.session);
  const driverProfiles = useComuta((s) => s.driverProfiles);
  const payouts = useComuta((s) => s.payouts);

  const profile = session?.userId ? driverProfiles[session.userId] : null;
  const myPayouts = useMemo(
    () => payouts.filter((p) => p.driverId === session?.userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [payouts, session?.userId],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Earnings</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Summary card */}
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Recovered this month</Text>
            <Text style={styles.summaryAmount}>{naira(profile?.monthlyRecovered || 0)}</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <TrendingUp size={14} color={colors.forest[600]} />
                <Text style={styles.summaryStatText}>{profile?.monthlyTrips || 0} trips</Text>
              </View>
              <View style={styles.summaryStatDivider} />
              <View style={styles.summaryStat}>
                <ArrowUpRight size={14} color={colors.forest[600]} />
                <Text style={styles.summaryStatText}>{profile?.monthlyPassengers || 0} passengers</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Reliability */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <Text style={styles.sectionLabel}>Reliability</Text>
          <View style={styles.reliabilityRow}>
            <View style={styles.reliabilityCard}>
              <Text style={styles.reliabilityValue}>{profile?.completionRate || 0}%</Text>
              <Text style={styles.reliabilityLabel}>Completion</Text>
            </View>
            <View style={styles.reliabilityCard}>
              <Text style={styles.reliabilityValue}>{profile?.onTimeRate || 0}%</Text>
              <Text style={styles.reliabilityLabel}>On-time</Text>
            </View>
            <View style={styles.reliabilityCard}>
              <Text style={styles.reliabilityValue}>{profile?.completedTrips || 0}</Text>
              <Text style={styles.reliabilityLabel}>Total trips</Text>
            </View>
          </View>
        </Animated.View>

        {/* Payout history */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <Text style={styles.sectionLabel}>Payout history</Text>
          {myPayouts.length === 0 ? (
            <View style={styles.emptyPayouts}>
              <Wallet size={40} color={colors.faint} />
              <Text style={styles.emptyText}>No payouts yet</Text>
            </View>
          ) : (
            myPayouts.map((payout, i) => (
              <Animated.View key={payout.id} entering={FadeInDown.delay(250 + i * 50).duration(200)}>
                <View style={styles.payoutCard}>
                  <View style={styles.payoutIcon}>
                    {payout.status === 'completed' ? (
                      <CheckCircle size={20} color={colors.forest[600]} />
                    ) : (
                      <Clock size={20} color={colors.amber[500]} />
                    )}
                  </View>
                  <View style={styles.payoutInfo}>
                    <Text style={styles.payoutAmount}>{naira(payout.amount)}</Text>
                    <Text style={styles.payoutNote}>{payout.note}</Text>
                    <Text style={styles.payoutMeta}>{payout.method} · {relativeTime(payout.createdAt)}</Text>
                  </View>
                  <View style={[styles.payoutBadge,
                    payout.status === 'completed' && { backgroundColor: colors.forest[50] },
                    payout.status === 'pending' && { backgroundColor: colors.amber[50] },
                  ]}>
                    <Text style={[styles.payoutBadgeText,
                      payout.status === 'completed' && { color: colors.forest[700] },
                      payout.status === 'pending' && { color: colors.amber[600] },
                    ]}>{payout.status === 'completed' ? 'Paid' : 'Pending'}</Text>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  screenTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface, paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[3] },
  scrollContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },
  sectionLabel: { fontFamily: fontFamily.semibold, fontSize: fontSize.labelMedium, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing[3], marginTop: spacing[5] },
  summaryCard: { backgroundColor: colors.forest[900], borderRadius: radii.xl, padding: spacing[6], marginBottom: spacing[2] },
  summaryLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.forest[100], marginBottom: spacing[1] },
  summaryAmount: { fontFamily: fontFamily.bold, fontSize: fontSize.displaySmall, color: colors.white, marginBottom: spacing[4] },
  summaryStats: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  summaryStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryStatText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.forest[100] },
  summaryStatDivider: { width: 1, height: 16, backgroundColor: colors.forest[700] },
  reliabilityRow: { flexDirection: 'row', gap: spacing[3] },
  reliabilityCard: { flex: 1, backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing[4], alignItems: 'center', gap: spacing[1], ...shadows.soft },
  reliabilityValue: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineMedium, color: colors.onsurface },
  reliabilityLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  payoutCard: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing[4], marginBottom: spacing[2], ...shadows.soft },
  payoutIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  payoutInfo: { flex: 1, gap: 2 },
  payoutAmount: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  payoutNote: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  payoutMeta: { fontFamily: fontFamily.regular, fontSize: fontSize.caption, color: colors.faint },
  payoutBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full },
  payoutBadgeText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall },
  emptyPayouts: { alignItems: 'center', paddingVertical: spacing[10], gap: spacing[3] },
  emptyText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted },
});
