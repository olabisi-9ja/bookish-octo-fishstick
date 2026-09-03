/**
 * Back button over a centred title — the header the rider frames draw
 * (151:450, 158:983, 163:1151, 247:433).
 *
 * The auth group has no drawn back control and relies on the native gesture,
 * so this is the first screen furniture of its kind in the app.
 *
 * The exported `bx:arrow-back` asset is 80x78.26 because it carries the soft
 * shadow around a 40x38.26 plate positioned at (18,18) inside it. Rather than
 * clip the shadow away — Android ignores `overflow: visible` on children —
 * the pressable is the full asset box, shifted so the visible plate lands at
 * the header's top-left corner. The bleed doubles as extra touch target and
 * stays clear of the centred title.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { semantic } from '@comuta/tokens';
import { Type } from './Type';
import ArrowBack from '../../../assets/figma/icon-arrow-back.svg';

/** Figma: the header row is 38.261px tall; the title sits 8.63px down it. */
const HEADER_HEIGHT = 38.261;
const TITLE_TOP = 8.63;
/** The exported asset box, and the plate's offset within it. */
const ASSET = { width: 80, height: 78.2609, inset: 18 };

export function ScreenHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <ArrowBack width={ASSET.width} height={ASSET.height} />
      </Pressable>
      <View style={styles.titleWrap}>
        <Type variant="titleMedium" color={semantic.primary} numberOfLines={1}>
          {title}
        </Type>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { width: '100%', height: HEADER_HEIGHT },
  back: {
    position: 'absolute',
    left: -ASSET.inset,
    top: -ASSET.inset,
    width: ASSET.width,
    height: ASSET.height,
  },
  /**
   * Figma centres the title across the full width, which fits on the 402px
   * frame. Narrower than that, a long title runs under the back button, so the
   * text is inset past it (40px plate plus a gap) and truncates instead of
   * colliding. At 402px and above the inset is slack and the title still reads
   * as centred.
   */
  titleWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: TITLE_TOP,
    alignItems: 'center',
    paddingHorizontal: 48,
    pointerEvents: 'none',
  },
  pressed: { opacity: 0.7 },
});
