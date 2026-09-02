/**
 * The onboarding slide shared by Figma 42:5, 191:429, 198:446 and 200:463.
 *
 * Those four frames are one layout with different copy and art, so they are one
 * component here. Geometry is Figma's, verbatim: --surface #f9fbfb ground,
 * paddingVertical 60, a 140 x 57 wordmark with "Skip" opposite, a 402 x 325
 * illustration, then a flex-1 block that pushes the page dots and the button to
 * the bottom on a 20pt gutter. Title is Display Small on --primary; body is
 * Headline Small on --on-primary-container.
 *
 * The last slide (200:463) drops "Skip", left-aligns the wordmark on its own
 * row and opens the copy gap from 4 to 16 - hence `final`.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { FigmaImage } from './FigmaImage';
import { PageDots } from './PageDots';
import { Wordmark } from './Wordmark';
import { semantic, space, text } from '@/theme';

interface Props {
  index: number;
  total: number;
  title: string;
  body: string;
  art: { name: string; node: string };
  cta: string;
  onNext: () => void;
  onSkip?: () => void;
  final?: boolean;
}

export function OnboardingSlide({
  index,
  total,
  title,
  body,
  art,
  cta,
  onNext,
  onSkip,
  final,
}: Props) {
  return (
    <View style={styles.root}>
      <View style={[styles.header, final && styles.headerFinal]}>
        <Wordmark width={140} height={57} />
        {!final && onSkip ? (
          <Pressable onPress={onSkip} accessibilityRole="button" hitSlop={12}>
            <Text style={[text.titleSmall, { color: semantic.primary }]}>Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <FigmaImage name={art.name} node={art.node} height={325} label={title} />

      <View style={styles.body}>
        <View style={[styles.copy, final && styles.copyFinal]}>
          <Text style={[text.displaySmall, { color: semantic.primary }]}>{title}</Text>
          <Text style={[text.headlineSmall, { color: semantic.onPrimaryContainer }]}>{body}</Text>
        </View>

        <View style={styles.actions}>
          <PageDots count={total} index={index} />
          <Button label={cta} onPress={onNext} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface, paddingVertical: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
  },
  headerFinal: { justifyContent: 'flex-start' },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingBottom: space.lg,
  },
  copy: { gap: space.xs },
  copyFinal: { gap: space.base },
  actions: { gap: space.md },
});
