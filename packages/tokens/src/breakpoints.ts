/**
 * Breakpoints.
 *
 * NOT from Figma — the design file contains only the 402x874 phone frame, so
 * anything above phone width is an engineering decision and needs design
 * sign-off before it ships. Recorded here rather than scattered through
 * screens so there is one place to reconcile when those frames arrive.
 */
export const breakpoints = {
  /** The Figma artboard width. Below this, layouts are single-column. */
  phone: 0,
  /** Two panes become viable here. */
  tablet: 768,
  /** Full list + detail split. */
  desktop: 1024,
} as const;

export type BreakpointName = keyof typeof breakpoints;

/**
 * Max width of a single-column screen on a wide viewport. Phone frames are
 * 402px; letting them stretch past ~520px breaks the measured type and
 * spacing, so a column is centred instead.
 */
export const COLUMN_MAX_WIDTH = 520;

export function breakpointFor(width: number): BreakpointName {
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'phone';
}
