/**
 * Splash — Figma node 42:3 ("onboarding").
 *
 * Full-bleed accent field with the 199x200 logo lockup centred. Holds briefly,
 * then hands off to the onboarding carousel.
 */
import { useEffect } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { semantic } from '@comuta/tokens';

/** How long the mark holds before the carousel takes over. */
const HOLD_MS = 1600;

export default function Splash() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/(auth)/onboarding'), HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Image
        source={require('../../assets/figma/logo-lockup.png') as ImageSourcePropType}
        style={styles.mark}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Comuta"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semantic.accent,
  },
  /** 199x200 in the frame. */
  mark: { width: 199, height: 200 },
});
