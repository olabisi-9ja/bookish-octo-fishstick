/**
 * LocationRow - Figma `location buttons` 158:772.
 *
 * Spec: width 362, radius 12, padding 8, 40pt leading icon, 16 gap. Name is
 * Title Small on --primary; area is Label Small on --on-primary-container
 * #21785b; the distance sits right, Title Small on --primary. Default fills
 * --inverse-on-surface #f0f4f4; Variant2 (pressed/selected) fills
 * --outline-variant #c3d4d4.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { radius, semantic, space, text } from '@/theme';

interface Props {
  name: string;
  area: string;
  distance?: string;
  selected?: boolean;
  onPress?: () => void;
}

function LocationPin() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
        fill={semantic.primary}
      />
    </Svg>
  );
}

export function LocationRow({ name, area, distance, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${area}${distance ? `, ${distance} away` : ''}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: selected || pressed ? semantic.outlineVariant : semantic.inverseOnSurface },
      ]}
    >
      <View style={styles.left}>
        <LocationPin />
        <View style={styles.labels}>
          <Text style={[text.titleSmall, { color: semantic.primary }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[text.labelSmall, { color: semantic.onPrimaryContainer }]} numberOfLines={1}>
            {area}
          </Text>
        </View>
      </View>
      {distance ? (
        <Text style={[text.titleSmall, { color: semantic.primary }]}>{distance}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space.sm,
    borderRadius: radius.md + 2, // Figma: 12
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: space.base, flexShrink: 1 },
  labels: { justifyContent: 'center', flexShrink: 1 },
});
