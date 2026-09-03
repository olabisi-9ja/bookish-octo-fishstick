/**
 * Document upload tile — Figma node 99:271 / 99:321.
 *
 * A 100px tall surface-variant panel with an outline border, a 36px icon and
 * a "Upload photo" label. Once a photo is chosen the tile shows it, since the
 * whole point of the hint below is that the user can check the shot is legible.
 */
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { semantic, radii, spacing } from '@comuta/tokens';
import { Type } from './Type';
import UploadIcon from '../../../assets/figma/icon-upload-photo.svg';

/** Figma: 100px tall tile, 36px icon. */
const TILE_HEIGHT = 100;
const ICON_SIZE = 36;

export function UploadTile({
  label,
  hint,
  onPicked,
}: {
  label: string;
  hint?: string;
  onPicked?: (uri: string) => void;
}) {
  const [uri, setUri] = useState<string | null>(null);

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled) return;
    const picked = result.assets[0]?.uri;
    if (!picked) return;
    setUri(picked);
    onPicked?.(picked);
  };

  return (
    <View style={styles.group}>
      <Type variant="titleSmall" color={semantic.primary}>
        {label}
      </Type>

      <Pressable
        onPress={pick}
        accessibilityRole="button"
        accessibilityLabel={uri ? `${label}. Photo selected. Tap to replace.` : label}
        style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <>
            <UploadIcon width={ICON_SIZE} height={ICON_SIZE} />
            <Type variant="titleSmall" color={semantic.onSurfaceVariant}>
              Upload photo
            </Type>
          </>
        )}
      </Pressable>

      {hint ? (
        <Type variant="labelSmall" color={semantic.primary}>
          {hint}
        </Type>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing[1], width: '100%' },
  tile: {
    width: '100%',
    height: TILE_HEIGHT,
    gap: spacing[1],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: semantic.outline,
    backgroundColor: semantic.surfaceVariant,
    overflow: 'hidden',
  },
  tilePressed: { opacity: 0.85 },
  preview: { width: '100%', height: '100%' },
});
