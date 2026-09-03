/** Elevation. React Native shadow props on iOS, `elevation` on Android. */
import { palette } from './generated/colors';

export const shadows = {
  none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  soft: { shadowColor: palette.primary.base, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  lift: { shadowColor: palette.primary.base, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 22, elevation: 6 },
  sheet: { shadowColor: palette.primary.base, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.14, shadowRadius: 20, elevation: 12 },
} as const;
