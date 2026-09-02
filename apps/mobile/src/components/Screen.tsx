/**
 * Screen - the frame every route sits in. The Figma artboards are 402 x 874
 * with a 20pt gutter, so that gutter lives here rather than being repeated on
 * every screen.
 */
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { semantic, space } from '@/theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  dark?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  style?: ViewStyle;
}

export function Screen({
  children,
  scroll,
  dark,
  padded = true,
  edges = ['top', 'bottom'],
  style,
}: Props) {
  const bg = dark ? semantic.primary : semantic.background;
  const inner = [padded && styles.padded, style];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, ...inner]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, ...inner]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  padded: { paddingHorizontal: space.lg },
});
