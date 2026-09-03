/**
 * Onboarding carousel — Figma nodes 42:5, 191:429, 198:446, 200:463
 * ("Splash screen 1-4").
 *
 * One layout across all four slides: wordmark + Skip, a 325px illustration
 * band, then the copy and the button pinned apart by `justify-content:
 * space-between`. Slide 4 drops Skip, widens the copy gap to 16, and changes
 * the button to "Get started".
 */
import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
  type ListRenderItemInfo,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { semantic, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import {
  ART_CROPS,
  GUTTER,
  OnboardingButton,
  PagerDots,
  SlideArt,
  Wordmark,
  type ArtCrop,
} from '../../components/figma/Onboarding';

type Slide = {
  node: string;
  art: ImageSourcePropType;
  crop: ArtCrop;
  title: string;
  body: string;
  /** Figma uses gap 4 on slides 1-3 and gap 16 on slide 4. */
  copyGap: number;
  cta: string;
  showSkip: boolean;
};

const SLIDES: Slide[] = [
  {
    node: '42:5',
    art: require('../../../assets/figma/onboarding-1.jpg') as ImageSourcePropType,
    crop: ART_CROPS[1],
    title: 'Your commute already has a driver going your way',
    body: "Lagos traffic is bad enough without wondering who's picking you up.",
    copyGap: spacing[1],
    cta: 'Next',
    showSkip: true,
  },
  {
    node: '191:429',
    art: require('../../../assets/figma/onboarding-2.jpg') as ImageSourcePropType,
    crop: ART_CROPS[2],
    title: 'No more guessing at the bus stop',
    body: 'Every driver on Comuta is verified: ID, license, and vehicle checked before they can post a ride',
    copyGap: spacing[1],
    cta: 'Next',
    showSkip: true,
  },
  {
    node: '198:446',
    art: require('../../../assets/figma/onboarding-3.jpg') as ImageSourcePropType,
    crop: ART_CROPS[3],
    title: 'Pick your stop, pick your time, pay to lock your seat',
    body: 'Meet at a known landmark, not a random spot. Your seat is yours the moment you pay.',
    copyGap: spacing[1],
    cta: 'Next',
    showSkip: true,
  },
  {
    node: '200:463',
    art: require('../../../assets/figma/onboarding-4.jpg') as ImageSourcePropType,
    crop: ART_CROPS[4],
    title: 'Built for people who commute every day, by people who do too',
    body: 'Comuta connects commuters already on the road, not a fleet of strangers.',
    copyGap: spacing[4],
    cta: 'Get started',
    showSkip: false,
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const finish = useCallback(() => router.replace('/(auth)/signup'), []);

  const advance = useCallback(() => {
    if (index >= SLIDES.length - 1) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [index, finish]);

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      setIndex(next);
    },
    [width]
  );

  const renderSlide = useCallback(
    ({ item }: ListRenderItemInfo<Slide>) => (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.header, !item.showSkip && styles.headerNoSkip]}>
          <Wordmark />
          {item.showSkip ? (
            <Pressable onPress={finish} accessibilityRole="button" hitSlop={spacing[2]}>
              <Type variant="titleSmall" color={semantic.primary}>
                Skip
              </Type>
            </Pressable>
          ) : null}
        </View>

        <SlideArt source={item.art} crop={item.crop} />

        <View style={styles.body}>
          <View style={{ gap: item.copyGap }}>
            <Type variant="displaySmall" color={semantic.primary}>
              {item.title}
            </Type>
            <Type variant="headlineSmall" color={semantic.onPrimaryContainer}>
              {item.body}
            </Type>
          </View>
        </View>
      </View>
    ),
    [width, finish]
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.node}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      {/* Pinned to the frame bottom so it does not scroll with the slides. */}
      <View style={styles.footer}>
        <PagerDots count={SLIDES.length} index={index} />
        <OnboardingButton label={SLIDES[index].cta} onPress={advance} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface, paddingVertical: 60 },
  slide: { flex: 1, alignItems: 'center' },
  header: {
    width: '100%',
    paddingHorizontal: GUTTER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerNoSkip: { justifyContent: 'flex-start' },
  body: {
    flex: 1,
    width: '100%',
    paddingHorizontal: GUTTER,
    paddingTop: spacing[4],
  },
  footer: {
    alignItems: 'center',
    gap: spacing[3],
    paddingBottom: spacing[5],
    paddingHorizontal: GUTTER,
  },
});
