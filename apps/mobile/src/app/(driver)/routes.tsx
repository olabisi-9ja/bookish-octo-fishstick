import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Pause, Play, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { useComuta } from '../../store';
import { DAY_LABELS } from '../../constants';
import { naira } from '../../utils/format';

export default function DriverRoutesScreen() {
  const session = useComuta((s) => s.session);
  const routes = useComuta((s) => s.routes);
  const hubs = useComuta((s) => s.hubs);
  const getHub = (id: string) => hubs.find((h) => h.id === id);

  const myRoutes = useMemo(
    () => routes.filter((r) => r.ownerId === session?.userId),
    [routes, session?.userId],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Your Routes</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {myRoutes.map((route, i) => (
          <Animated.View key={route.id} entering={FadeInDown.delay(i * 60).duration(250)}>
            <View style={[styles.routeCard, route.paused && styles.routeCardPaused]}>
              <View style={styles.routeHeader}>
                <Text style={styles.routeCorridor}>{getHub(route.fromId)?.area} → {getHub(route.toId)?.area}</Text>
                {route.paused && <View style={styles.pausedBadge}><Text style={styles.pausedText}>Paused</Text></View>}
              </View>
              <Text style={styles.routeDetails}>{route.time} · {route.seats} seats · {naira(route.pricePerSeat)}/seat</Text>
              <View style={styles.daysRow}>
                {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                  <View key={day} style={[styles.dayChip, route.days.includes(day as any) && styles.dayChipActive]}>
                    <Text style={[styles.dayChipText, route.days.includes(day as any) && styles.dayChipTextActive]}>{DAY_LABELS[day][0]}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.routeActions}>
                <Pressable onPress={() => useComuta.getState().updateRoute(route.id, { paused: !route.paused })} style={styles.actionButton}>
                  {route.paused ? <Play size={16} color={colors.forest[600]} /> : <Pause size={16} color={colors.muted} />}
                  <Text style={[styles.actionText, route.paused && { color: colors.forest[600] }]}>{route.paused ? 'Resume' : 'Pause'}</Text>
                </Pressable>
                <Pressable onPress={() => useComuta.getState().deleteRoute(route.id)} style={styles.actionButton}>
                  <Trash2 size={16} color={colors.red[400]} />
                  <Text style={[styles.actionText, { color: colors.red[400] }]}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        ))}
        <Button label="Publish new route" variant="lime" onPress={() => {}} icon={<Plus size={18} color={colors.forest[950]} />} style={{ marginTop: spacing[4] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  headerRow: { paddingHorizontal: spacing[5], paddingTop: spacing[4], paddingBottom: spacing[3] },
  screenTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.headlineLarge, color: colors.onsurface },
  listContent: { paddingHorizontal: spacing[5], paddingBottom: spacing[10] },
  routeCard: { backgroundColor: colors.white, borderRadius: radii.xl, padding: spacing[5], marginBottom: spacing[3], ...shadows.soft },
  routeCardPaused: { opacity: 0.65 },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[2] },
  routeCorridor: { fontFamily: fontFamily.semibold, fontSize: fontSize.titleMedium, color: colors.onsurface },
  routeDetails: { fontFamily: fontFamily.regular, fontSize: fontSize.bodySmall, color: colors.muted, marginBottom: spacing[3] },
  daysRow: { flexDirection: 'row', gap: 6, marginBottom: spacing[4] },
  dayChip: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface2 },
  dayChipActive: { backgroundColor: colors.forest[900] },
  dayChipText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.muted },
  dayChipTextActive: { color: colors.white },
  pausedBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full, backgroundColor: colors.amber[50] },
  pausedText: { fontFamily: fontFamily.medium, fontSize: fontSize.labelSmall, color: colors.amber[600] },
  routeActions: { flexDirection: 'row', gap: spacing[4], paddingTop: spacing[3], borderTopWidth: 1, borderTopColor: colors.lineSoft },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: fontFamily.medium, fontSize: fontSize.bodySmall, color: colors.muted },
});
