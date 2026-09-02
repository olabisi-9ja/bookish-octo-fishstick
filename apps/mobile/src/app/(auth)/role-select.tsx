import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Circle, Rect } from 'react-native-svg';
import { Car, MapPin, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';

export default function RoleSelect() {
  const router = useRouter();
  const session = useComuta((s) => s.session);

  const selectRider = () => {
    if (session) {
      useComuta.getState().setSession({ ...session, role: 'rider', onboarded: true });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/(rider)/home');
  };

  const selectDriver = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/driver-onboarding');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Svg width={40} height={40} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="48" fill={colors.forest[900]} />
            <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
            <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
          </Svg>
          <Text style={styles.logoText}>Comuta</Text>
        </View>

        <Text style={styles.title}>Want to give rides too?</Text>
        <Text style={styles.subtitle}>
          You're already set up as a Rider below. Add driving to earn from your daily commute.
        </Text>

        {/* Option 1: Start riding */}
        <Pressable
          onPress={selectRider}
          style={({ pressed }) => [styles.optionCard, styles.optionRider, pressed && styles.cardPressed]}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionIconWrap}>
              <Svg width={60} height={40} viewBox="0 0 60 40">
                <Rect x="5" y="10" width="50" height="22" rx="6" fill={colors.forest[700]} />
                <Rect x="12" y="3" width="36" height="12" rx="4" fill={colors.forest[600]} />
                <Rect x="16" y="6" width="12" height="7" rx="2" fill={colors.lime[400]} opacity={0.4} />
                <Rect x="32" y="6" width="12" height="7" rx="2" fill={colors.lime[400]} opacity={0.4} />
                <Circle cx="18" cy="32" r="5" fill={colors.forest[950]} />
                <Circle cx="42" cy="32" r="5" fill={colors.forest[950]} />
              </Svg>
            </View>
            <Text style={styles.optionTitle}>Start riding for now</Text>
            <Text style={styles.optionSubtitle}>
              Find verified commuters going your way daily.
            </Text>
          </View>
          <ArrowRight size={20} color={colors.forest[600]} />
        </Pressable>

        {/* Option 2: I want to drive too */}
        <Pressable
          onPress={selectDriver}
          style={({ pressed }) => [styles.optionCard, styles.optionDriver, pressed && styles.cardPressed]}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionIconWrap}>
              <Svg width={60} height={40} viewBox="0 0 60 40">
                <Rect x="5" y="10" width="50" height="22" rx="6" fill={colors.lime[600]} />
                <Rect x="12" y="3" width="36" height="12" rx="4" fill={colors.lime[500]} />
                <Rect x="16" y="6" width="12" height="7" rx="2" fill={colors.forest[800]} opacity={0.3} />
                <Rect x="32" y="6" width="12" height="7" rx="2" fill={colors.forest[800]} opacity={0.3} />
                <Circle cx="18" cy="32" r="5" fill={colors.forest[950]} />
                <Circle cx="42" cy="32" r="5" fill={colors.forest[950]} />
              </Svg>
            </View>
            <Text style={styles.optionTitle}>I want to drive too</Text>
            <Text style={styles.optionSubtitle}>
              Earn from your commute by sharing rides daily.
            </Text>
          </View>
          <ArrowRight size={20} color={colors.forest[600]} />
        </Pressable>

        <Text style={styles.note}>
          You're already set as a Rider. Completing driver onboarding gives you access to both modes.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing[8],
  },
  logoText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.titleLarge,
    color: colors.forest[900],
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.headlineLarge,
    color: colors.onsurface,
    marginBottom: spacing[2],
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyMedium,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: spacing[8],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[5],
    borderRadius: radii.xl,
    backgroundColor: colors.white,
    marginBottom: spacing[4],
    borderWidth: 2,
    borderColor: colors.lineSoft,
    ...shadows.soft,
  },
  optionRider: {},
  optionDriver: {},
  cardPressed: {
    borderColor: colors.forest[600],
    backgroundColor: colors.forest[50],
  },
  optionContent: { flex: 1 },
  optionIconWrap: { marginBottom: spacing[3] },
  optionTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.titleMedium,
    color: colors.onsurface,
    marginBottom: 4,
  },
  optionSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
    lineHeight: 18,
  },
  note: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.faint,
    textAlign: 'center',
    marginTop: spacing[8],
    paddingHorizontal: spacing[4],
    lineHeight: 18,
  },
});
