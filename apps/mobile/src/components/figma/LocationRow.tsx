/**
 * Location row — Figma component `location buttons` 158:772, as instanced on
 * the pickup and drop-off search frames (151:450, 153:670, 158:983, 158:1028).
 *
 * Two plates are drawn. Search results under "Major Points near you" sit on an
 * inverse-on-surface plate with a 12px radius (153:670); the current-location
 * and saved-place rows above the results have no plate at all (151:450).
 * Otherwise both are the same row: a 40px icon, a name over its area, and a
 * trailing slot holding either a distance or an icon.
 *
 * The component set publishes a pressed variant for the plated row (158:773,
 * an outline-variant plate) and that is what `filled` uses. The plain rows are
 * a different frame element with no published pressed state, so they dim.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { semantic, radii, spacing, touchTarget } from '@comuta/tokens';
import { Type } from './Type';

/** Figma draws every icon in this component at 40px. */
const ICON_SIZE = 40;

export type LocationRowProps = {
  Icon: React.FC<SvgProps>;
  /** Primary line — the hub or place name. */
  name: string;
  /** Secondary line — "Ikorodu, Lagos". */
  area: string;
  /** Trailing slot: a distance label on results, an icon on saved places. */
  trailing?: React.ReactNode;
  /** `filled` draws the inverse-on-surface plate used for search results. */
  variant?: 'plain' | 'filled';
  onPress?: () => void;
};

export function LocationRow({
  Icon,
  name,
  area,
  trailing,
  variant = 'plain',
  onPress,
}: LocationRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${area}`}
      style={({ pressed }) => [
        styles.row,
        variant === 'filled' && styles.filled,
        pressed && (variant === 'filled' ? styles.filledPressed : styles.pressed),
      ]}
    >
      <View style={styles.lead}>
        <Icon width={ICON_SIZE} height={ICON_SIZE} />
        <View style={styles.text}>
          <Type variant="titleSmall" color={semantic.primary}>
            {name}
          </Type>
          <Type variant="labelSmall" color={semantic.onPrimaryContainer}>
            {area}
          </Type>
        </View>
      </View>
      {trailing}
    </Pressable>
  );
}

/** The distance label drawn on the right of a result row (153:670). */
export function RowDistance({ km }: { km: number }) {
  return (
    <Type variant="titleSmall" color={semantic.primary}>
      {`${km.toFixed(1)}km`}
    </Type>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radii.md,
    minHeight: touchTarget.min,
  },
  filled: {
    padding: spacing[2],
    borderRadius: radii.lg,
    backgroundColor: semantic.inverseOnSurface,
  },
  /** The component's own pressed variant, 158:773 — an outline-variant plate. */
  filledPressed: { backgroundColor: semantic.outlineVariant },
  lead: { flexDirection: 'row', alignItems: 'center', gap: spacing[4], flexShrink: 1 },
  text: { flexShrink: 1 },
  pressed: { opacity: 0.85 },
});
