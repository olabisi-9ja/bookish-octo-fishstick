/**
 * Date and time picker — Figma node 163:1151.
 *
 * A Today/Tomorrow pair, four quick-time chips, a scrolling wheel of specific
 * times, then "Search rides" over the tab bar. The pair and the button are the
 * same Figma components the auth screens already instance (`button` 58:120,
 * `buttonLarge` 77:450), so they come from components/figma/Auth.
 *
 * The frame draws the wheel's selected row at 24px in the container green with
 * its neighbours at 14px and reduced opacity. Under `overflow-clip` it also
 * carries two leftover duplicate rows that never render; they are not
 * reproduced.
 *
 * The chips and the wheel are one value, not two: a chip jumps the wheel to
 * the start of its window, and a chip reads as selected when the chosen time
 * falls inside it. That keeps a single source of truth — the frame offers the
 * chips as a shortcut ("Or pick a specific time"), not as a separate field.
 */
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLUMN_MAX_WIDTH, semantic, radii, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import { ScreenHeader } from '../../components/figma/ScreenHeader';
import { FloatingTabBar, TAB_BAR_CLEARANCE } from '../../components/figma/TabBar';
import { ButtonLarge, SegmentedPair } from '../../components/figma/Auth';
import { useBreakpoint } from '../../components/layout/Responsive';
import { useRideSearch, type WhenDay } from '../../store/rideSearch';
import { addMinutesToClock, parseClock } from '../../utils/dates';

const GUTTER = 20;

/** Figma: the wheel is a 150px box; one row per 30 minutes. */
const ITEM_HEIGHT = 36;
const WHEEL_HEIGHT = 150;
const WHEEL_PAD = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

const DAYS: readonly { value: WhenDay; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
];

/** 5:00 AM to 11:30 PM in half hours — the frame's wheel starts at 5:00 AM. */
const TIMES: string[] = (() => {
  const out: string[] = [];
  let t = '5:00 AM';
  for (let i = 0; i < 38; i++) {
    out.push(t);
    t = addMinutesToClock(t, 30);
  }
  return out;
})();

/** Quick Time Selection chips, each jumping the wheel to its window start. */
const QUICK: readonly { label: string; from: string }[] = [
  { label: 'Before 7 AM', from: '5:00 AM' },
  { label: 'Between 7 AM and 9 AM', from: '7:00 AM' },
  { label: 'Between 9 AM and 11 AM', from: '9:00 AM' },
  { label: 'After 11 AM', from: '11:00 AM' },
];

/** Which chip window a clock label falls in. */
function windowOf(label: string): number {
  const [h] = parseClock(label);
  if (h < 7) return 0;
  if (h < 9) return 1;
  if (h < 11) return 2;
  return 3;
}

export default function DateTimePicker() {
  const { isWide } = useBreakpoint();
  const day = useRideSearch((s) => s.day);
  const time = useRideSearch((s) => s.time);
  const setWhen = useRideSearch((s) => s.setWhen);

  const scrollRef = useRef<ScrollView>(null);
  const selected = Math.max(0, TIMES.indexOf(time));
  const activeChip = windowOf(time);

  function commitIndex(i: number) {
    const next = TIMES[Math.min(Math.max(i, 0), TIMES.length - 1)];
    if (next && next !== time) setWhen(day, next);
  }

  function settle(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const y = e.nativeEvent.contentOffset.y;
    const i = Math.round(y / ITEM_HEIGHT);
    commitIndex(i);
    // Web has no native snapping, so align the row after the scroll settles.
    if (Math.abs(y - i * ITEM_HEIGHT) > 1) {
      scrollRef.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true });
    }
  }

  function pickChip(from: string) {
    setWhen(day, from);
    const i = TIMES.indexOf(from);
    if (i >= 0) scrollRef.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true });
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.stack, isWide && styles.stackWide]}>
          <ScreenHeader title="When do you want to travel?" />

          <SegmentedPair
            options={DAYS}
            value={day}
            onChange={(next) => setWhen(next, time)}
          />

          <View style={styles.card}>
            <View style={styles.group}>
              <Type variant="titleSmall" color={semantic.onSurface}>
                Quick Time Selection
              </Type>
              <View style={styles.chips}>
                {QUICK.map((chip, i) => {
                  const active = i === activeChip;
                  return (
                    <Pressable
                      key={chip.label}
                      onPress={() => pickChip(chip.from)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
                    >
                      <Type variant="bodySmall" color={semantic.primary}>
                        {chip.label}
                      </Type>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.group}>
              <Type variant="titleSmall" color={semantic.onSurface}>
                Or pick a specific time
              </Type>
              <ScrollView
                ref={scrollRef}
                style={styles.wheel}
                contentContainerStyle={styles.wheelContent}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                contentOffset={{ x: 0, y: selected * ITEM_HEIGHT }}
                onMomentumScrollEnd={settle}
                onScrollEndDrag={settle}
                accessibilityLabel="Departure time"
              >
                {TIMES.map((label, i) => {
                  const isSelected = i === selected;
                  return (
                    <Pressable
                      key={label}
                      onPress={() => {
                        commitIndex(i);
                        scrollRef.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true });
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      style={styles.wheelItem}
                    >
                      <Type
                        variant={isSelected ? 'headlineSmall' : 'titleSmall'}
                        color={isSelected ? semantic.onPrimaryContainer : semantic.primary}
                        style={isSelected ? undefined : styles.wheelItemIdle}
                      >
                        {label}
                      </Type>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <ButtonLarge label="Search rides" onPress={() => router.push('/(rider)/search-results')} />
        </View>
      </ScrollView>

      <FloatingTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface },
  // Bottom padding clears the floating tab pill, which overlays the scroll view.
  content: { paddingHorizontal: GUTTER, paddingTop: 60, paddingBottom: TAB_BAR_CLEARANCE },
  contentWide: { alignItems: 'center' },
  stack: { width: '100%', gap: spacing[7] },
  stackWide: { maxWidth: COLUMN_MAX_WIDTH },

  // 163:1161 carries padding and a 16px radius but no fill.
  card: {
    width: '100%',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
    borderRadius: radii.xl,
  },
  group: { width: '100%', gap: spacing[3], alignItems: 'center' },

  chips: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.md,
  },
  chipIdle: { backgroundColor: semantic.inverseOnSurface },
  /**
   * The frame draws no selected chip, but the design system publishes one
   * selectable-option state — `id type` 91:129 Variant2: the accent fill under
   * unchanged primary text, over the same inverse-on-surface idle plate. The
   * chips take it rather than inventing a third treatment.
   */
  chipActive: { backgroundColor: semantic.accent },

  wheel: {
    alignSelf: 'center',
    height: WHEEL_HEIGHT,
    borderRadius: radii.md,
    backgroundColor: semantic.inverseOnSurface,
  },
  wheelContent: { paddingHorizontal: spacing[5], paddingVertical: WHEEL_PAD },
  wheelItem: { height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  wheelItemIdle: { opacity: 0.5 },

});
