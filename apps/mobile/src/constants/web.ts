/**
 * Web-only style corrections.
 *
 * The Expo app is also the installable PWA, so React Native Web's DOM
 * defaults show through on every screen and have to be reconciled with the
 * Figma frames.
 */
import { Platform, type TextStyle } from 'react-native';

/**
 * React Native Web renders `TextInput` as an `<input>`, which carries the
 * browser's focus ring. No Figma field draws one — the field's own border and
 * the caret are the focus indicators — so it is removed, on web only.
 */
export const NO_FOCUS_RING = Platform.OS === 'web'
  ? ({ outlineStyle: 'none' } as unknown as TextStyle)
  : null;
