/**
 * Full-screen status/confirmation layout.
 *
 * Built from Figma nodes 69:269 (Password reset), 228:264 (You're in!) and
 * 103:708 (We're reviewing your documents). All three are the same frame:
 * wordmark, a 150x150 icon, a heading, centred body copy, and one large
 * button — so they are one component with the parts passed in.
 *
 * The icons are the designer's own SVG exports, rendered as vectors rather
 * than rasterised, so they stay sharp at any density.
 */
import { StyleSheet, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { semantic, spacing } from '@comuta/tokens';
import { Type } from './Type';
import { AuthScreen, ButtonLarge, Wordmark } from './Auth';

/** Figma draws every status icon at 150x150. */
export const STATUS_ICON_SIZE = 150;

export type StatusScreenProps = {
  Icon: React.FC<SvgProps>;
  title: string;
  body: string;
  /** Figma tints the body on-surface on 69:269/228:264 and on-primary-container on 103:708. */
  bodyColor?: string;
  actionLabel: string;
  onAction: () => void;
};

export function StatusScreen({
  Icon,
  title,
  body,
  bodyColor = semantic.onSurface,
  actionLabel,
  onAction,
}: StatusScreenProps) {
  return (
    <AuthScreen>
      <View style={styles.centered}>
        <Wordmark />
      </View>
      <View style={styles.stack}>
        <Icon width={STATUS_ICON_SIZE} height={STATUS_ICON_SIZE} />
        <Type variant="headlineSmall" color={semantic.primary} style={styles.centeredText}>
          {title}
        </Type>
        <Type variant="titleSmall" color={bodyColor} style={styles.centeredText}>
          {body}
        </Type>
        <View style={styles.action}>
          <ButtonLarge label={actionLabel} onPress={onAction} />
        </View>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center' },
  stack: { alignItems: 'center', gap: spacing[1], width: '100%' },
  centeredText: { textAlign: 'center' },
  action: { width: '100%', marginTop: spacing[3] },
});
