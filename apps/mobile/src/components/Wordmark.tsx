/**
 * The COMUTA wordmark. Figma keeps it as a raster (node 21:3 on the Components
 * page, used at 140 x 57 in onboarding), which this session could not export -
 * see FigmaImage for why. Drawn here from the brand's own tokens so the app has
 * a real mark rather than a hole; replace with the exported asset when
 * available.
 */
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { semantic, space } from '@/theme';

export function Wordmark({ width = 140, height = 57 }: { width?: number; height?: number }) {
  const glyph = Math.round(height * 0.52);
  return (
    <View style={[styles.row, { width, height }]} accessibilityRole="header" accessibilityLabel="COMUTA">
      <Svg width={glyph} height={glyph} viewBox="0 0 24 24">
        <Rect x="0" y="0" width="24" height="24" rx="7" fill={semantic.primary} />
        <Rect x="7" y="6.5" width="3.6" height="11" rx="1.8" fill={semantic.accent} />
        <Rect x="13.4" y="6.5" width="3.6" height="11" rx="1.8" fill={semantic.accent} />
      </Svg>
      <Text style={[styles.word, { fontSize: glyph * 0.72, color: semantic.primary }]}>COMUTA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  word: { fontWeight: '700', letterSpacing: 0.5 },
});
