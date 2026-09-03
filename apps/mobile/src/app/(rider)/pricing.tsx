import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TrendingDown, Info, ChevronRight, MapPin } from 'lucide-react-native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { recommendedSeatPrice, taxiFare } from '../../constants';

export default function PricingScreen() {
  const hubs = useComuta((s) => s.hubs);

  // Sample corridors with pricing info
  const corridors = useMemo(() => {
    const pairs = [
      { fromId: 'hub_ikorodu', toId: 'hub_vi', distKm: 45, durMin: 120 },
      { fromId: 'hub_ikorodu', toId: 'hub_lekki', distKm: 38, durMin: 95 },
      { fromId: 'hub_ikeja', toId: 'hub_vi', distKm: 18, durMin: 55 },
      { fromId: 'hub_yaba', toId: 'hub_lekki', distKm: 22, durMin: 50 },
      { fromId: 'hub_ajah', toId: 'hub_vi', distKm: 28, durMin: 65 },
    ];
    return pairs.map((p) => {
      const from = hubs.find((h) => h.id === p.fromId);
      const to = hubs.find((h) => h.id === p.toId);
      const comutaPrice = recommendedSeatPrice(p.distKm, p.durMin);
      const soloPrice = taxiFare(p.distKm, p.durMin);
      const savings = Math.round(((soloPrice - comutaPrice) / soloPrice) * 100);
      return { ...p, from, to, comutaPrice, soloPrice, savings };
    });
  }, [hubs]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Pricing</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {/* Explainer card */}
        <Animated.View entering={FadeInDown.delay(50).duration(300)}>
          <View style={styles.explainerCard}>
            <View style={styles.explainerHeader}>
              <Info size={20} color={colors.forest[600]} />
              <Text style={styles.explainerTitle}>How pricing works</Text>
            </View>
            <Text style={styles.explainerText}>
              Comuta prices are set per seat, per corridor. Drivers set their own prices within a recommended range based on distance and fuel costs. You always see the exact price before booking — no surge, no surprises.
            </Text>
          </View>
        </Animated.View>

        {/* Corridor price cards */}
        <Text style={styles.sectionLabel}>Popular corridors</Text>
        {corridors.map((corridor, i) => (
          <Animated.View key={`${corridor.fromId}-${corridor.toId}`} entering={FadeInDown.delay(100 + i * 60).duration(250)}>
            <Pressable style={styles.corridorCard}>
              <View style={styles.corridorHeader}>
                <View style={styles.corridorDots}>
                  <View style={[styles.dot, { backgroundColor: colors.forest[600] }]} />
                  <View style={styles.corridorLine} />
                  <View style={[styles.dot, { backgroundColor: colors.lime[500] }]} />
                </View>
                <View style={styles.corridorInfo}>
                  <Text style={styles.corridorFrom}>{corridor.from?.area || 'Origin'}</Text>
                  <Text style={styles.corridorTo}>{corridor.to?.area || 'Destination'}</Text>
                </View>
                <View style={styles.priceColumn}>
                  <Text style={styles.priceValue}>{naira(corridor.comutaPrice)}</Text>
                  <Text style={styles.pricePer}>per seat</Text>
                </View>
              </View>

              <View style={styles.savingsRow}>
                <View style={styles.savingsBadge}>
                  <TrendingDown size={12} color={colors.forest[600]} />
                  <Text style={styles.savingsText}>
                    Save {corridor.savings}% vs solo ({naira(corridor.soloPrice)})
                  </Text>
                </View>
                <Text style={styles.corridorMeta}>
                  {corridor.distKm} km · ~{corridor.durMin} min
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  headerRow: { paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[3] },
  screenTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface },
  listContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },
  
  // Explainer
  explainerCard: { backgroundColor: colors.forest[50], borderRadius: radii.xl, padding: spacing[5], marginBottom: spacing[5], borderWidth: 1, borderColor: colors.forest[100] },
  explainerHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] },
  explainerTitle: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.forest[800] },
  explainerText: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.forest[700], lineHeight: 20 },

  sectionLabel: { fontFamily: fontFamily.semibold, fontSize: fontSize.labelMedium, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing[3] },

  // Corridor card
  corridorCard: { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing[5], marginBottom: spacing[3], ...shadows.soft, borderWidth: 1, borderColor: colors.lineSoft },
  corridorHeader: { flexDirection: 'row', gap: spacing[3], marginBottom: spacing[3] },
  corridorDots: { alignItems: 'center', paddingTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  corridorLine: { width: 2, height: 20, backgroundColor: colors.lineSoft },
  corridorInfo: { flex: 1, gap: 2 },
  corridorFrom: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  corridorTo: { fontFamily: fontFamily.semibold, fontSize: fontSize.bodyMedium, color: colors.onsurface },
  priceColumn: { alignItems: 'flex-end' },
  priceValue: { fontFamily: fontFamily.bold, fontSize: fontSize.titleLarge, color: colors.forest[800] },
  pricePer: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
  
  savingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing[3], borderTopWidth: 1, borderTopColor: colors.lineSoft },
  savingsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full, backgroundColor: colors.forest[50] },
  savingsText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.forest[600] },
  corridorMeta: { fontFamily: fontFamily.regular, fontSize: fontSize.labelSmall, color: colors.muted },
});
