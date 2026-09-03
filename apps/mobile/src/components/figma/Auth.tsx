/**
 * Shared building blocks for the auth screens.
 *
 * Measured off Figma frames 46:9, 58:197, 58:256, 62:314 and the components
 * they instance: `button` 58:120 (the segmented Email / Phone Number pair),
 * `buttonLarge` 77:450, and the bordered field rows.
 *
 * Every screen in the auth group is the same vertical stack — wordmark,
 * heading pair, then a 20px-gapped column of sections — so that frame is a
 * component here rather than being repeated eleven times.
 */
import { forwardRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type ImageSourcePropType,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import { Image } from 'react-native';
import { COLUMN_MAX_WIDTH, semantic, palette, radii, spacing } from '@comuta/tokens';
import { Type } from './Type';
import { useBreakpoint } from '../layout/Responsive';
import { NO_FOCUS_RING } from '../../constants/web';

/** Figma: 20px gutter, 362px content width, 60px top/bottom padding. */
export const GUTTER = 20;
export const CONTENT_WIDTH = 362;

/** The 140x57 wordmark that heads every auth screen. */
export function Wordmark() {
  return (
    <Image
      source={require('../../../assets/figma/wordmark.png') as ImageSourcePropType}
      style={styles.wordmark}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Comuta"
    />
  );
}

/**
 * The auth screen shell: surface background, gutter, 60px vertical padding and
 * a 28px gap between the wordmark, the heading pair and the body.
 *
 * Auth is single-pane at every width — there is no second column of content to
 * show — so on tablet and desktop the column is centred at COLUMN_MAX_WIDTH
 * rather than stretched. Stretching would pull the measured 362px controls out
 * of proportion with the Figma type scale.
 */
export function AuthScreen({ children, ...rest }: ViewProps) {
  const { isWide } = useBreakpoint();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.screenContent, isWide && styles.screenContentWide]}
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      <View style={[styles.stack, isWide && styles.stackWide]}>{children}</View>
    </ScrollView>
  );
}

/** Heading pair — headline-small over title-small, 4px apart. */
export function AuthHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.heading}>
      <Type variant="headlineSmall" color={semantic.primary}>
        {title}
      </Type>
      {subtitle ? (
        <Type variant="titleSmall" color={semantic.onPrimaryContainer}>
          {subtitle}
        </Type>
      ) : null}
    </View>
  );
}

/** Hairline / label / hairline row, e.g. "or sign up with". */
export function LabelledDivider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.rule} />
      <Type variant="titleSmall" color={semantic.primary}>
        {label}
      </Type>
      <View style={styles.rule} />
    </View>
  );
}

/** Segmented pair — Figma component `button` 58:120. */
export function SegmentedPair<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmentRow} accessibilityRole="tablist">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active ? styles.segmentActive : styles.segmentIdle]}
          >
            <Type
              variant="titleSmall"
              color={active ? semantic.onPrimary : semantic.primary}
            >
              {opt.label}
            </Type>
          </Pressable>
        );
      })}
    </View>
  );
}

export type FieldProps = TextInputProps & {
  label: string;
  /** Helper text under the input, e.g. the password rule. */
  hint?: string;
  /** Rendered in the error colour in place of `hint`. */
  error?: string;
  /** Trailing control, e.g. a show/hide password toggle. */
  trailing?: React.ReactNode;
};

/** Labelled bordered input — the `details` group in the Figma frames. */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, hint, error, trailing, style, ...rest },
  ref
) {
  return (
    <View style={styles.field}>
      <Type variant="titleSmall" color={semantic.primary}>
        {label}
      </Type>
      <View style={[styles.inputBox, error ? styles.inputBoxError : null]}>
        <TextInput
          ref={ref}
          style={[styles.input, NO_FOCUS_RING, style]}
          placeholderTextColor={semantic.onSurfaceVariant}
          {...rest}
        />
        {trailing}
      </View>
      {error ? (
        <Type variant="labelSmall" color={semantic.error}>
          {error}
        </Type>
      ) : hint ? (
        <Type variant="labelSmall" color={semantic.primary}>
          {hint}
        </Type>
      ) : null}
    </View>
  );
});

/** `buttonLarge` — Figma component 77:450. */
export function ButtonLarge({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.buttonLarge,
        pressed && !disabled ? styles.buttonLargePressed : null,
        disabled ? styles.buttonLargeDisabled : null,
      ]}
    >
      <Type variant="titleSmall" color={semantic.onPrimary}>
        {label}
      </Type>
    </Pressable>
  );
}

/** Fine print under a primary action. */
export function LegalNote({ children }: { children: React.ReactNode }) {
  return (
    <Type variant="labelSmall" color={semantic.onSurface} style={styles.centered}>
      {children}
    </Type>
  );
}

/** "Already have an account? Log In" style footer. */
export function AuthFooterLink({
  prompt,
  action,
  onPress,
}: {
  prompt: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.footerRow}>
      <Type variant="labelSmall" color={semantic.onSurface}>
        {prompt}
      </Type>
      <Pressable onPress={onPress} accessibilityRole="link" hitSlop={spacing[2]}>
        <Type variant="titleSmall" color={semantic.primary}>
          {action}
        </Type>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: { width: 140, height: 57 },
  screen: { flex: 1, backgroundColor: semantic.surface },
  screenContent: {
    paddingHorizontal: GUTTER,
    paddingVertical: 60,
  },
  screenContentWide: { alignItems: 'center' },
  stack: { width: '100%', gap: spacing[7] }, // 28
  stackWide: { maxWidth: COLUMN_MAX_WIDTH },
  heading: { gap: spacing[1] },
  dividerRow: {
    width: CONTENT_WIDTH,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  rule: { flex: 1, height: 1, backgroundColor: palette.nv[80] },
  segmentRow: { flexDirection: 'row', gap: spacing[3] },
  segment: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: { backgroundColor: semantic.primary },
  segmentIdle: { backgroundColor: semantic.surfaceContainer },
  field: { gap: spacing[1], width: '100%' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: semantic.onSurfaceVariant,
    borderRadius: radii.md,
    paddingHorizontal: GUTTER,
    paddingVertical: spacing[2],
  },
  inputBoxError: { borderColor: semantic.error },
  input: {
    flex: 1,
    // Body Small (12/18) — the placeholder role in the Figma fields.
    fontSize: 12,
    lineHeight: 18,
    color: semantic.onSurface,
    padding: 0,
  },
  buttonLarge: {
    width: '100%',
    paddingVertical: spacing[2],
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semantic.primary,
  },
  // `buttonLarge` 77:450 Variant2 — primary-colors/primary-color-30, #21785b.
  buttonLargePressed: { backgroundColor: palette.primary[30] },
  buttonLargeDisabled: { backgroundColor: palette.nv[80] },
  centered: { textAlign: 'center' },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});
