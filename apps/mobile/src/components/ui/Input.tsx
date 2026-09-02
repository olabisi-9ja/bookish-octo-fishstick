/**
 * COMUTA Input — text fields with full state support.
 * States: idle, focused, error, disabled.
 */
import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors, fontFamily, fontSize, radii, spacing } from '../../constants/theme';
import { DURATION } from '../../constants/motion';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helperText,
  disabled = false,
  containerStyle,
  ...textInputProps
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const borderColor = error
    ? colors.red[500]
    : focused
    ? colors.forest[600]
    : colors.line;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          { borderColor },
          focused && styles.inputFocused,
          disabled && styles.inputDisabled,
          error && styles.inputError,
        ]}
        placeholderTextColor={colors.faint}
        editable={!disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={colors.forest[600]}
        {...textInputProps}
      />
      {(error || helperText) && (
        <Text style={[styles.helper, error && styles.helperError]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

/** Password input with visibility toggle */
export function PasswordInput({
  label = 'Password',
  ...props
}: InputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.passwordWrapper}>
      <Input
        label={label}
        secureTextEntry={!visible}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
      <Pressable
        onPress={() => setVisible((v) => !v)}
        style={styles.eyeButton}
        hitSlop={12}
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <EyeOff size={20} color={colors.muted} />
        ) : (
          <Eye size={20} color={colors.muted} />
        )}
      </Pressable>
    </View>
  );
}

/** Phone number input with +234 prefix */
export function PhoneInput(props: Omit<InputProps, 'keyboardType'>) {
  return (
    <Input
      keyboardType="phone-pad"
      placeholder="0803 123 4567"
      maxLength={15}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodySmall,
    color: colors.onsurface,
    marginBottom: spacing[2],
  },
  labelError: {
    color: colors.red[500],
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.lg,
    paddingHorizontal: spacing[4],
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyMedium,
    color: colors.onsurface,
    backgroundColor: colors.white,
  },
  inputFocused: {
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: colors.surface2,
    color: colors.faint,
  },
  inputError: {
    borderColor: colors.red[500],
  },
  helper: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.muted,
    marginTop: spacing[1],
    paddingHorizontal: spacing[1],
  },
  helperError: {
    color: colors.red[500],
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 38,
    padding: 4,
  },
});
