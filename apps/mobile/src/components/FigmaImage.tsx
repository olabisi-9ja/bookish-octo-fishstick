/**
 * A bitmap that Figma owns and this repo does not have yet.
 *
 * The session that built these screens could not download Figma's raw image
 * assets: the egress proxy denies figma.com by organisation policy, so
 * download_assets returns URLs that cannot be fetched from here. Layout,
 * typography and colour are exact; the artwork is not present.
 *
 * To fill one in: open the node in Figma, export at 3x into
 * assets/<name>.png, then add it to ART below. Everything already
 * referencing it picks it up with no other change. design/assets-to-export.md
 * lists every node still outstanding.
 */
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { color, radius, semantic, space, text } from '@/theme';

/** Exported Figma artwork, keyed by the name used at the call site. */
const ART: Record<string, ImageSourcePropType | undefined> = {
  // 'onboarding-1': require('../../assets/onboarding/onboarding-1.png'),
};

interface Props {
  name: string;
  node: string;
  width?: number | `${number}%`;
  height: number;
  label?: string;
}

export function FigmaImage({ name, node, width = '100%', height, label }: Props) {
  const art = ART[name];
  if (art) {
    return (
      <Image
        source={art}
        style={{ width, height }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessible={!!label}
        accessibilityLabel={label}
      />
    );
  }
  return (
    <View style={[styles.pending, { width, height }]} accessibilityRole="image" accessibilityLabel={label ?? name}>
      <Text style={[text.labelSmall, styles.name]}>{name}</Text>
      <Text style={[text.labelSmall, styles.node]}>Figma {node}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pending: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    backgroundColor: color.primary.t95,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.primary.t80,
  },
  name: { color: semantic.onPrimaryContainer },
  node: { color: color.neutralVariant.t50 },
});
