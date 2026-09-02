/**
 * Spacing, radii and touch targets.
 *
 * Figma does not publish these as variables, so they are derived from the
 * measured frame geometry (402px wide, 20px gutter across all 40 screens)
 * on a 4px grid.
 */
export const spacing = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32,
  10: 40, 12: 48, 14: 56, 16: 64, 20: 80, 24: 96,
} as const;

/** Horizontal page padding measured off the Figma frames. */
export const gutter = 20;

export const radii = {
  none: 0, xs: 4, sm: 6, md: 8, lg: 12, xl: 16,
  '2xl': 20, '3xl': 24, full: 9999,
} as const;

export const touchTarget = {
  min: 44, // WCAG 2.1 AA
  button: 56,
  buttonMedium: 48,
  buttonSmall: 36,
  tabItem: 48,
} as const;

export const zIndex = {
  base: 0, card: 1, sticky: 10, overlay: 50, modal: 100, toast: 200,
} as const;
