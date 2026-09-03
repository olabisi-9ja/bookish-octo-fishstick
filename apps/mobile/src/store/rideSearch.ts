/**
 * The rider's in-progress search — pickup, drop-off and departure time.
 *
 * Figma draws this as state accumulating across four home frames
 * (118:137 → 158:908 → 162:1076 → 247:365) while the location search
 * (151:450, 158:983) and the date/time picker (163:1151) are the routes that
 * set it. The home card is the same component in all four; only this draft
 * differs, which is why they are one screen here rather than four.
 *
 * Deliberately separate from `useComuta`: that store is persisted domain
 * state, and a pickup chosen last week should not survive a relaunch.
 */
import { create } from 'zustand';

export type SearchField = 'pickup' | 'dropoff';
export type WhenDay = 'today' | 'tomorrow';

/** Figma draws the untouched pill as "Today by 22:30" (118:137). */
export const DEFAULT_TIME = '10:30 PM';

interface RideSearchState {
  pickupHubId: string | null;
  dropoffHubId: string | null;
  day: WhenDay;
  /** Clock label in the app's canonical 12-hour form, e.g. "6:00 AM". */
  time: string;
  setHub: (field: SearchField, hubId: string) => void;
  clearHub: (field: SearchField) => void;
  setWhen: (day: WhenDay, time: string) => void;
  reset: () => void;
}

const EMPTY = {
  pickupHubId: null,
  dropoffHubId: null,
  day: 'today' as WhenDay,
  time: DEFAULT_TIME,
};

export const useRideSearch = create<RideSearchState>((set) => ({
  ...EMPTY,
  setHub: (field, hubId) =>
    set(field === 'pickup' ? { pickupHubId: hubId } : { dropoffHubId: hubId }),
  clearHub: (field) =>
    set(field === 'pickup' ? { pickupHubId: null } : { dropoffHubId: null }),
  setWhen: (day, time) => set({ day, time }),
  reset: () => set(EMPTY),
}));
