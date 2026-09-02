import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useComuta } from '../store';
import { authService } from '../services/authService';
import { colors, fontFamily } from '../constants/theme';
import { DURATION } from '../constants/motion';
import { Svg, Circle, Rect } from 'react-native-svg';

/** Entry point — lime green splash then redirect based on auth state. */
export default function Index() {
  const router = useRouter();
  const session = useComuta((s) => s.session);

  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    authService.refresh();

    // Animate logo entrance
    logoOpacity.value = withTiming(1, { duration: 400 });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    textOpacity.value = withDelay(250, withTiming(1, { duration: 400 }));

    // Navigate after animation
    const timer = setTimeout(() => {
      if (session?.onboarded && session.kycComplete) {
        if (session.role === 'driver' && session.driverOnboarded) {
          router.replace('/(driver)/home');
        } else {
          router.replace('/(rider)/home');
        }
      } else {
        router.replace('/(auth)/onboarding');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Logo — large centered */}
      <Animated.View style={[styles.logoContainer, logoAnimStyle]}>
        <Svg width={120} height={120} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
          <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
          <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
        </Svg>
      </Animated.View>

      {/* Brand name */}
      <Animated.Text style={[styles.brandName, textAnimStyle]}>
        Comuta
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lime[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  brandName: {
    fontFamily: fontFamily.extrabold,
    fontSize: 32,
    color: colors.forest[900],
    letterSpacing: -0.5,
  },
});
