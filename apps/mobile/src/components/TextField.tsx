/**
 * TextField - the input used across signup, login, reset and KYC. Figma draws
 * these inline on each screen rather than as a published component, so the
 * geometry here is taken from the auth screens: full width, radius 8, the
 * --surface-container fill the buttons use, Title Small text.
 */
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { color, radius, semantic, space, text } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  right?: React.ReactNode;
}

export function TextField({ label, error, right, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[text.labelLarge, styles.label]}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          focused && { borderColor: semantic.primary },
          !!error && { borderColor: semantic.error },
        ]}
      >
        <TextInput
          style={[text.titleSmall, styles.input, style]}
          placeholderTextColor={color.neutralVariant.t50}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {right}
      </View>
      {error ? <Text style={[text.labelSmall, styles.error]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs, alignSelf: 'stretch' },
  label: { color: semantic.primary },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: semantic.surfaceContainer,
    borderRadius: radius.md - 2,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: space.md,
    minHeight: 44,
  },
  input: { flex: 1, color: semantic.primary, paddingVertical: space.sm },
  error: { color: semantic.error },
});
