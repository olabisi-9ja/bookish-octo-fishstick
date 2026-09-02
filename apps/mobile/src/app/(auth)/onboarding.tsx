import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ViewToken,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Svg, Circle, Rect, Path, G, Line } from 'react-native-svg';
import { colors, fontFamily, fontSize, spacing, radii } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Your commute already\nhas a driver going\nyour way',
    description:
      'Lagos traffic is bad enough without\nwondering who\'s picking you up.',
    illustration: 'car',
  },
  {
    title: 'No more guessing at\nthe bus stop',
    description:
      'Every driver on Comuta is verified:\nID, license, and vehicle checked\nbefore they can post a ride.',
    illustration: 'id',
  },
  {
    title: 'Pick your stop, pick your\ntime, pay to lock your\nseat',
    description:
      'Meet at a known landmark, not a\nrandom spot. Your seat is yours the\nmoment you pay.',
    illustration: 'map',
  },
  {
    title: 'Built for people who\ncommute every day, by\npeople who do too',
    description:
      'Comuta connects commuters\nalready on the road, not a fleet of\nstrangers.',
    illustration: 'city',
  },
];

// ─── Illustrations (SVG) ─────────────────────────────────────
function CarIllustration() {
  return (
    <Svg width={260} height={200} viewBox="0 0 260 200">
      {/* Bus stop pole */}
      <Rect x="50" y="40" width="4" height="120" fill={colors.lime[500]} />
      <Rect x="38" y="35" width="28" height="20" rx="3" fill={colors.lime[500]} />
      <Rect x="42" y="40" width="20" height="12" rx="2" fill={colors.forest[900]} />
      {/* Ground */}
      <Rect x="20" y="155" width="220" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
      {/* Car body */}
      <G>
        <Rect x="100" y="110" width="120" height="45" rx="10" fill={colors.forest[700]} />
        <Rect x="115" y="90" width="90" height="28" rx="8" fill={colors.forest[600]} />
        {/* Windows */}
        <Rect x="122" y="95" width="30" height="18" rx="4" fill={colors.lime[400]} opacity={0.4} />
        <Rect x="158" y="95" width="30" height="18" rx="4" fill={colors.lime[400]} opacity={0.4} />
        {/* Headlights */}
        <Circle cx="214" cy="132" r="5" fill={colors.lime[500]} />
        <Circle cx="106" cy="132" r="5" fill={colors.red[400]} opacity={0.6} />
        {/* Wheels */}
        <Circle cx="130" cy="155" r="13" fill={colors.forest[950]} />
        <Circle cx="190" cy="155" r="13" fill={colors.forest[950]} />
        <Circle cx="130" cy="155" r="5" fill="rgba(255,255,255,0.3)" />
        <Circle cx="190" cy="155" r="5" fill="rgba(255,255,255,0.3)" />
      </G>
    </Svg>
  );
}

function IdIllustration() {
  return (
    <Svg width={260} height={200} viewBox="0 0 260 200">
      {/* ID Card */}
      <Rect x="40" y="40" width="140" height="100" rx="12" fill="rgba(255,255,255,0.15)" />
      <Rect x="48" y="48" width="124" height="84" rx="8" fill="rgba(255,255,255,0.1)" />
      {/* Photo placeholder */}
      <Rect x="58" y="58" width="36" height="44" rx="4" fill={colors.lime[500]} opacity={0.4} />
      <Circle cx="76" cy="72" r="10" fill="rgba(255,255,255,0.3)" />
      {/* Text lines */}
      <Rect x="104" y="62" width="58" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
      <Rect x="104" y="76" width="42" height="6" rx="3" fill="rgba(255,255,255,0.15)" />
      <Rect x="104" y="90" width="52" height="6" rx="3" fill="rgba(255,255,255,0.15)" />
      {/* IDENTITY CARD header */}
      <Rect x="58" y="114" width="104" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
      {/* Checkmark circle */}
      <Circle cx="200" cy="90" r="30" fill={colors.lime[500]} />
      <Path d="M188 90 L196 98 L212 82" stroke={colors.forest[900]} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrow */}
      <Path d="M165 100 Q180 110 195 95" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4,4" />
    </Svg>
  );
}

function MapIllustration() {
  return (
    <Svg width={260} height={200} viewBox="0 0 260 200">
      {/* Phone frame */}
      <Rect x="80" y="20" width="100" height="170" rx="14" fill="rgba(255,255,255,0.12)" />
      <Rect x="86" y="32" width="88" height="146" rx="8" fill="rgba(255,255,255,0.08)" />
      {/* Map route line */}
      <Path d="M100 140 Q115 100 130 80 Q145 60 160 70" stroke={colors.lime[500]} strokeWidth="3" fill="none" />
      {/* Pin A */}
      <Circle cx="100" cy="140" r="8" fill={colors.forest[600]} />
      <Circle cx="100" cy="140" r="3" fill={colors.white} />
      {/* Pin B */}
      <Circle cx="160" cy="70" r="8" fill={colors.lime[500]} />
      <Circle cx="160" cy="70" r="3" fill={colors.forest[900]} />
      {/* Map grid lines */}
      <Line x1="90" y1="60" x2="170" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <Line x1="90" y1="100" x2="170" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <Line x1="120" y1="35" x2="120" y2="175" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <Line x1="150" y1="35" x2="150" y2="175" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Seat badge */}
      <Rect x="30" y="70" width="40" height="40" rx="10" fill={colors.lime[500]} />
      <Rect x="38" y="80" width="24" height="4" rx="2" fill={colors.forest[900]} />
      <Rect x="38" y="88" width="16" height="4" rx="2" fill={colors.forest[900]} />
      {/* Price tag */}
      <Rect x="190" y="120" width="45" height="30" rx="8" fill={colors.lime[500]} />
      <Rect x="198" y="130" width="28" height="5" rx="2" fill={colors.forest[900]} />
    </Svg>
  );
}

function CityIllustration() {
  return (
    <Svg width={260} height={200} viewBox="0 0 260 200">
      {/* Buildings skyline */}
      <Rect x="20" y="80" width="30" height="80" rx="3" fill="rgba(255,255,255,0.12)" />
      <Rect x="55" y="60" width="25" height="100" rx="3" fill="rgba(255,255,255,0.08)" />
      <Rect x="85" y="90" width="20" height="70" rx="3" fill="rgba(255,255,255,0.15)" />
      <Rect x="140" y="50" width="28" height="110" rx="3" fill="rgba(255,255,255,0.1)" />
      <Rect x="175" y="70" width="22" height="90" rx="3" fill="rgba(255,255,255,0.12)" />
      <Rect x="205" y="85" width="30" height="75" rx="3" fill="rgba(255,255,255,0.08)" />
      {/* Windows on buildings */}
      <Rect x="28" y="90" width="6" height="6" rx="1" fill={colors.lime[500]} opacity={0.3} />
      <Rect x="28" y="104" width="6" height="6" rx="1" fill={colors.lime[500]} opacity={0.5} />
      <Rect x="38" y="90" width="6" height="6" rx="1" fill={colors.lime[500]} opacity={0.4} />
      <Rect x="148" y="60" width="6" height="6" rx="1" fill={colors.lime[500]} opacity={0.3} />
      <Rect x="148" y="74" width="6" height="6" rx="1" fill={colors.lime[500]} opacity={0.5} />
      <Rect x="158" y="60" width="6" height="6" rx="1" fill={colors.lime[500]} opacity={0.2} />
      {/* Road */}
      <Rect x="10" y="160" width="240" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
      {/* Car */}
      <Rect x="110" y="138" width="50" height="22" rx="6" fill={colors.lime[500]} />
      <Rect x="118" y="130" width="34" height="12" rx="4" fill={colors.lime[400]} />
      <Circle cx="120" cy="160" r="6" fill={colors.forest[950]} />
      <Circle cx="150" cy="160" r="6" fill={colors.forest[950]} />
      <Circle cx="120" cy="160" r="2.5" fill="rgba(255,255,255,0.3)" />
      <Circle cx="150" cy="160" r="2.5" fill="rgba(255,255,255,0.3)" />
      {/* People dots */}
      <Circle cx="95" cy="150" r="4" fill="rgba(255,255,255,0.3)" />
      <Rect x="92" y="155" width="6" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      <Circle cx="180" cy="148" r="4" fill="rgba(255,255,255,0.3)" />
      <Rect x="177" y="153" width="6" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
    </Svg>
  );
}

const ILLUSTRATIONS: Record<string, React.FC> = {
  car: CarIllustration,
  id: IdIllustration,
  map: MapIllustration,
  city: CityIllustration,
};

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const skip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Svg width={28} height={28} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="48" fill={colors.white} />
              <Circle cx="50" cy="50" r="44" fill={colors.forest[900]} />
              <Rect x="34" y="28" width="8" height="44" rx="4" fill={colors.white} />
              <Rect x="58" y="28" width="8" height="44" rx="4" fill={colors.lime[500]} />
            </Svg>
            <Text style={styles.logoText}>Comuta</Text>
          </View>
          {currentIndex < SLIDES.length - 1 && (
            <Pressable onPress={skip} hitSlop={12}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => {
          const Illustration = ILLUSTRATIONS[item.illustration];
          return (
            <View style={styles.slide}>
              {/* Illustration area */}
              <View style={styles.illustrationArea}>
                <Illustration />
              </View>

              {/* Text */}
              <View style={styles.textArea}>
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Footer: Dots + Button */}
      <SafeAreaView edges={['bottom']} style={styles.footerSafe}>
        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex && styles.dotActive]}
              />
            ))}
          </View>

          <Pressable style={styles.ctaButton} onPress={goNext}>
            <Text style={styles.ctaText}>
              {currentIndex === SLIDES.length - 1 ? 'Get started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.forest[900],
  },
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.titleLarge,
    color: colors.white,
  },
  skipText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodyMedium,
    color: 'rgba(255,255,255,0.6)',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 80,
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
    marginBottom: spacing[8],
  },
  textArea: {
    paddingHorizontal: spacing[6],
  },
  slideTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.white,
    lineHeight: 36,
    marginBottom: spacing[4],
  },
  slideDescription: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyMedium,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 22,
  },
  footerSafe: {
    paddingHorizontal: spacing[6],
  },
  footer: {
    paddingBottom: spacing[6],
    gap: spacing[6],
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.lime[500],
  },
  ctaButton: {
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.forest[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.white,
  },
});
