/** The onboarding page indicator - Figma 191:417, a 362 x 12 strip. */
import { StyleSheet, View } from 'react-native';
import { color, radius, semantic, space } from '@/theme';

export function PageDots({ count, index }: { count: number; index: number }) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i === index ? styles.on : styles.off]}
          accessibilityRole="tab"
          accessibilityState={{ selected: i === index }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, height: 12 },
  dot: { height: 8, borderRadius: radius.pill },
  on: { width: 24, backgroundColor: semantic.primary },
  off: { width: 8, backgroundColor: color.primary.t80 },
});
