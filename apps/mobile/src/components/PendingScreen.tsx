/**
 * A route that exists and navigates but has NOT been drawn from Figma yet.
 *
 * This is deliberately loud. A silent empty screen gets mistaken for a finished
 * one; this states the Figma node it is waiting on so the next session can pick
 * it up with get_design_context and nothing has to be rediscovered.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from './Screen';
import { Wordmark } from './Wordmark';
import { color, radius, semantic, space, text } from '@/theme';
import { figmaUrl } from '@/lib/figma-screens';

interface Props {
  title: string;
  node: string;
  next?: string;
}

export function PendingScreen({ title, node, next }: Props) {
  return (
    <Screen>
      <View style={styles.top}>
        <Wordmark width={120} height={48} />
      </View>

      <View style={styles.card}>
        <Text style={[text.labelSmall, styles.tag]}>NOT BUILT FROM FIGMA YET</Text>
        <Text style={[text.headlineSmall, styles.title]}>{title}</Text>
        <Text style={[text.bodyMedium, styles.node]}>{figmaUrl(node)}</Text>
      </View>

      <View style={styles.actions}>
        {next ? (
          <Pressable onPress={() => router.push(next as never)} style={styles.link} accessibilityRole="button">
            <Text style={[text.titleSmall, { color: semantic.onPrimary }]}>Continue</Text>
          </Pressable>
        ) : null}
        {router.canGoBack() ? (
          <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button">
            <Text style={[text.titleSmall, { color: semantic.primary }]}>Back</Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { paddingVertical: space.xl },
  card: {
    flex: 1,
    justifyContent: 'center',
    gap: space.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.primary.t80,
    backgroundColor: color.primary.t95,
    padding: space.xl,
  },
  tag: { color: semantic.onPrimaryContainer, letterSpacing: 1 },
  title: { color: semantic.primary },
  node: { color: color.neutralVariant.t50 },
  actions: { gap: space.md, paddingVertical: space.xl },
  link: {
    alignItems: 'center',
    paddingVertical: space.md,
    borderRadius: radius.md - 2,
    backgroundColor: semantic.primary,
  },
  back: { alignItems: 'center', paddingVertical: space.md },
});
