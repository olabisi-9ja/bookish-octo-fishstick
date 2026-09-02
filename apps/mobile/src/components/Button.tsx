/**
 * Button - Figma `buttons` 58:120, `button large` 77:450, `onboarding button`
 * 204:515. All three are the same object at different widths, so they are one
 * component here with a `size` rather than three near-duplicates.
 *
 * Figma spec, verbatim: radius 8, paddingVertical 8, label Title Small
 * (14 / 21 / weight 500). Default fills --primary #0a251c with --on-primary
 * white; Variant2 of the wide buttons fills primary-30 #21785b, and Variant2 of
 * the 175pt button fills --surface-container #f0f4f4 with primary text.
 */
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { color, radius, semantic, space, text } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'accent' | 'outline' | 'ghost';
export type ButtonSize = 'compact' | 'full';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  left?: React.ReactNode;
  style?: ViewStyle;
}

const FILL: Record<ButtonVariant, string> = {
  primary: semantic.primary,
  secondary: color.primary.t30,
  tonal: semantic.surfaceContainer,
  accent: semantic.accent,
  outline: 'transparent',
  ghost: 'transparent',
};

const LABEL: Record<ButtonVariant, string> = {
  primary: semantic.onPrimary,
  secondary: semantic.onPrimary,
  tonal: semantic.primary,
  accent: semantic.onAccent,
  outline: semantic.primary,
  ghost: semantic.primary,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'full',
  disabled,
  loading,
  left,
  style,
}: Props) {
  const inert = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inert, busy: !!loading }}
      onPress={inert ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'compact' && styles.compact,
        { backgroundColor: FILL[variant] },
        variant === 'outline' && styles.outline,
        pressed && !inert && styles.pressed,
        inert && styles.inert,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={LABEL[variant]} />
      ) : (
        <View style={styles.row}>
          {left}
          <Text style={[text.titleSmall, { color: LABEL[variant] }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    paddingHorizontal: space.base,
    borderRadius: radius.md - 2, // Figma: 8
    alignSelf: 'stretch',
    minHeight: 37,
  },
  compact: { alignSelf: 'flex-start', width: 175 },
  outline: { borderWidth: 1, borderColor: semantic.outlineVariant },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  pressed: { opacity: 0.85 },
  inert: { opacity: 0.45 },
});
