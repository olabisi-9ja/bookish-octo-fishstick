/**
 * Shared pieces of the onboarding carousel.
 *
 * Built from Figma tGWQGJbGogndVTvpVjzxYa nodes 42:5, 191:429, 198:446 and
 * 200:463 (component `onboarding button` 204:514). All four slides share one
 * layout; only the illustration, its crop, and the copy change.
 */
import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { palette, semantic, radii, spacing } from '@comuta/tokens';
import { Type } from './Type';

/** Figma frame geometry: 402x874 artboard, 20px gutter, 362px content width. */
export const GUTTER = 20;
export const CONTENT_WIDTH = 362;
/** The illustration band is a fixed 325px tall, full artboard width. */
export const ART_HEIGHT = 325;

/**
 * How each slide's illustration sits inside the 325px band.
 * Percentages are Figma's, verbatim — the exports are square/landscape rasters
 * that the frame crops and offsets, so they cannot be rendered as a plain fit.
 */
export type ArtCrop = { left: string; top: string; width: string; height: string };

export const ART_CROPS: Record<1 | 2 | 3 | 4, ArtCrop> = {
  1: { left: '-2.95%', top: '-15.5%', width: '105.91%', height: '131%' },
  2: { left: '10.19%', top: '0.76%', width: '79.61%', height: '98.47%' },
  3: { left: '-0.53%', top: '-12.5%', width: '101.06%', height: '125%' },
  4: { left: '0%', top: '8.8%', width: '100%', height: '82.4%' },
};

/** The 140x57 Comuta wordmark that heads every onboarding slide. */
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

/** The cropped illustration band. */
export function SlideArt({ source, crop }: { source: ImageSourcePropType; crop: ArtCrop }) {
  return (
    <View style={styles.artBand}>
      <Image
        source={source}
        style={[styles.art, crop as object]}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </View>
  );
}

/**
 * Page indicator. Figma exports this as a flat SVG per slide (the layer is
 * mislabelled "Continue with Google"), but it has to track the live slide, so
 * it is drawn natively from the same geometry: four 8px dots, 12px band.
 */
export function PagerDots({ count, index }: { count: number; index: number }) {
  return (
    <View style={styles.dots} accessibilityRole="tablist">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i === index && styles.dotActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: i === index }}
        />
      ))}
    </View>
  );
}

/** `onboarding button` — Figma component 204:514. */
export function OnboardingButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Type variant="titleSmall" color={semantic.onPrimary}>
        {label}
      </Type>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wordmark: { width: 140, height: 57 },
  artBand: { width: '100%', height: ART_HEIGHT, overflow: 'hidden' },
  art: { position: 'absolute' },
  dots: {
    height: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    width: CONTENT_WIDTH,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: palette.nv[80],
  },
  dotActive: { backgroundColor: semantic.accent },
  button: {
    width: CONTENT_WIDTH,
    paddingVertical: spacing[2],
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semantic.primary,
  },
  // `onboarding button` 204:515 Variant2 — primary-colors/primary-color-30.
  buttonPressed: { backgroundColor: palette.primary[30] },
});
