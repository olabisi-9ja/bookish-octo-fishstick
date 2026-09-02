/**
 * Six-box OTP entry — Figma node 65:140 (row) with boxes 65:141, 101, 153,
 * 151, 149, 143.
 *
 * The frame draws six equal bordered boxes, 36px tall, 10px apart, each
 * flexing to fill the 362px content width. Only one hidden input is mounted:
 * the boxes are presentation, so paste, autofill and the SMS one-time-code
 * keyboard all behave the way the platform expects.
 */
import { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { semantic, radii, spacing } from '@comuta/tokens';
import { Type } from './Type';

export const OTP_LENGTH = 6;

export type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Called once the last box is filled. */
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
};

export function OtpInput({ value, onChange, onComplete, autoFocus }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const handle = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, OTP_LENGTH);
    onChange(digits);
    if (digits.length === OTP_LENGTH) onComplete?.(digits);
  };

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      accessibilityRole="none"
      accessibilityLabel={`Enter the ${OTP_LENGTH}-digit code`}
    >
      <View style={styles.row}>
        {Array.from({ length: OTP_LENGTH }, (_, i) => {
          const char = value[i] ?? '';
          // The caret sits on the first empty box while the field has focus.
          const active = focused && i === Math.min(value.length, OTP_LENGTH - 1);
          return (
            <View key={i} style={[styles.box, active && styles.boxActive]}>
              <Type variant="titleSmall" color={semantic.onSurface}>
                {char}
              </Type>
            </View>
          );
        })}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={OTP_LENGTH}
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        style={styles.hidden}
        caretHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing[2] + 2, width: '100%' },
  box: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: semantic.onSurfaceVariant,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: semantic.primary, borderWidth: 2 },
  /**
   * Kept in the tree and focusable, but visually absent — moving it offscreen
   * would break the on-screen keyboard on web.
   */
  hidden: { position: 'absolute', opacity: 0, height: 36, width: '100%' },
});
