/**
 * COMUTA Button — the single most used UI component.
 *
 * Follows strict hierarchy per UX Guidelines:
 * - primary: dark forest green filled (ONE per screen)
 * - secondary: white/outline
 * - tertiary: text-only
 * - lime: accent CTA ("Want to give rides?")
 * - destructive: red (cancel/SOS)
 */
import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily, radii, touchTarget } from '../../constants/theme';
import { SPRING } from '../../constants/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'lime' | 'destructive';
type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, SPRING.snappy);
    if (variant !== 'tertiary') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [variant]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING.snappy);
  }, []);

  const isDisabled = disabled || loading;
  const containerStyles = [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    isDisabled && variant === 'primary' && styles.disabledPrimary,
    style,
  ];

  const textStyles = [
    styles.label,
    textSizeStyles[size],
    variantTextStyles[variant],
    isDisabled && styles.disabledText,
  ];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[containerStyles, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'destructive' ? colors.white : colors.forest[900]}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyles}>{label}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.lg,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontFamily: fontFamily.semibold,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledPrimary: {
    backgroundColor: colors.lineSoft,
  },
  disabledText: {
    color: colors.faint,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  large: { height: touchTarget.button, paddingHorizontal: 24 },
  medium: { height: touchTarget.buttonMedium, paddingHorizontal: 20 },
  small: { height: touchTarget.buttonSmall, paddingHorizontal: 16 },
};

const textSizeStyles: Record<ButtonSize, TextStyle> = {
  large: { fontSize: 16, lineHeight: 22 },
  medium: { fontSize: 14, lineHeight: 20 },
  small: { fontSize: 13, lineHeight: 18 },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.forest[900] },
  secondary: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
  tertiary: { backgroundColor: 'transparent' },
  lime: { backgroundColor: colors.lime[500] },
  destructive: { backgroundColor: colors.red[500] },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: colors.white },
  secondary: { color: colors.forest[900] },
  tertiary: { color: colors.forest[700] },
  lime: { color: colors.forest[950] },
  destructive: { color: colors.white },
};
