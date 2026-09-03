/**
 * Reassurance note pinned to the bottom of a screen — Figma node 91:197.
 *
 * Title-medium heading in the error colour over title-small body copy, on an
 * inverse-on-surface panel.
 */
import { StyleSheet, View } from 'react-native';
import { semantic, radii, spacing } from '@comuta/tokens';
import { Type } from './Type';

export function NoteCard({ title = 'Note:', body }: { title?: string; body: string }) {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <Type variant="titleMedium" color={semantic.onErrorContainer}>
        {title}
      </Type>
      <Type variant="titleSmall" color={semantic.onSurface}>
        {body}
      </Type>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: spacing[1],
    backgroundColor: semantic.inverseOnSurface,
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
});
