/**
 * Pickup and drop-off search — Figma 151:450 and 153:670 (pickup),
 * 158:983 and 158:1028 (drop-off).
 *
 * Four frames, one screen. The pickup and drop-off frames are the same layout
 * with different copy, and within each pair the second frame is simply the
 * state after the rider types: the header and saved places give way to a
 * filled search pill over a list of nearby points. `field` selects the copy.
 *
 * Two copy corrections, both recorded in design/figma-manifest.json. The
 * drop-off frame 158:983 is a verbatim duplicate of the pickup frame: its
 * title still reads "Where are you starting from?" and its saved places still
 * say "Closest pickup to home". Shipping that would ask a rider where they are
 * starting from on the screen that chooses where they are going.
 *
 * The two frames also disagree on the subtitle — 151:450 sets it 16px and
 * left-aligned, 158:983 12px and centred. They are the same screen in two
 * roles and have to render identically, so both follow 158:983: a centred
 * subtitle under a centred title.
 */
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLUMN_MAX_WIDTH, semantic, radii, shadows, spacing } from '@comuta/tokens';
import { Type } from '../../components/figma/Type';
import { ScreenHeader } from '../../components/figma/ScreenHeader';
import { LocationRow, RowDistance } from '../../components/figma/LocationRow';
import { useBreakpoint } from '../../components/layout/Responsive';
import { useComuta } from '../../store';
import { useRideSearch, type SearchField } from '../../store/rideSearch';
import { haversineKm } from '../../utils/geo';
import { NO_FOCUS_RING } from '../../constants/web';
import type { Hub } from '../../types';
import SearchIcon from '../../../assets/figma/icon-search.svg';
import CurrentLocation from '../../../assets/figma/icon-current-location.svg';
import SavedPlace from '../../../assets/figma/icon-saved-place.svg';
import AddPlus from '../../../assets/figma/icon-add-plus.svg';
import LocationPin from '../../../assets/figma/icon-location-pin.svg';
import ChevronBack from '../../../assets/figma/icon-chevron-back.svg';
import CloseIcon from '../../../assets/figma/icon-close.svg';

const GUTTER = 20;

/** Copy per role. The drop-off column corrects frame 158:983's duplicated text. */
const COPY: Record<SearchField, { title: string; results: string; saved: [string, string] }> = {
  pickup: {
    title: 'Where are you starting from?',
    results: 'Major Points near you',
    saved: ['Closest pickup to home', 'Closest pickup to work'],
  },
  dropoff: {
    title: 'Where are you headed?',
    results: 'Major Points close to your destination',
    saved: ['Closest drop-off to home', 'Closest drop-off to work'],
  },
};

const SUBTITLE = 'Use your location or search for a hub.';
const PLACEHOLDER = 'Search by address, area, or hub name';

/** How many nearby points the results list offers. Figma draws four. */
const RESULT_COUNT = 4;

export default function LocationSearch() {
  const params = useLocalSearchParams<{ field?: string }>();
  const field: SearchField = params.field === 'dropoff' ? 'dropoff' : 'pickup';
  const copy = COPY[field];

  const { isWide } = useBreakpoint();
  const hubs = useComuta((s) => s.hubs);
  const setHub = useRideSearch((s) => s.setHub);
  const [query, setQuery] = useState('');

  /**
   * Stands in for the device's location. A real build reads GPS and snaps to
   * the nearest hub; the seed's first hub is the Ikorodu one the frames draw.
   */
  const origin = hubs[0];

  /**
   * Figma's results are points *near the place named in the query*, not hubs
   * whose text matches it — 153:670 types "Eyita Ojokoro, Ikorodu" and lists
   * Sabo, Ikorodu Garage, Agric and Odonguyan, none of which contain that
   * string. So the query resolves to an anchor and the list is the nearest
   * hubs to it, the anchor itself excluded.
   */
  const anchor = useMemo(() => matchHub(hubs, query) ?? origin, [hubs, query, origin]);

  const results = useMemo(() => nearest(hubs, anchor, RESULT_COUNT), [hubs, anchor]);

  /**
   * Saved places have no data model yet and no frame for adding one, so the
   * two rows Figma draws are bound to the nearest hubs to the origin. Recorded
   * as a gap in design/figma-manifest.json.
   */
  const savedPlaces = useMemo(() => nearest(hubs, origin, 2), [hubs, origin]);

  const searching = query.trim().length > 0;

  function choose(hub: Hub) {
    setHub(field, hub.id);
    router.back();
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.stack, isWide && styles.stackWide]}>
          {searching ? (
            <View style={styles.pill}>
              <View style={styles.pillLead}>
                <Pressable
                  onPress={() => router.back()}
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  hitSlop={spacing[2]}
                >
                  <ChevronBack width={20} height={20} />
                </Pressable>
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                  style={[styles.pillInput, NO_FOCUS_RING]}
                  placeholder={PLACEHOLDER}
                  placeholderTextColor={semantic.onSurfaceVariant}
                  accessibilityLabel={copy.title}
                />
              </View>
              <Pressable
                onPress={() => setQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={spacing[2]}
              >
                <CloseIcon width={20} height={20} />
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.headingGroup}>
                <ScreenHeader title={copy.title} />
                <View style={styles.subtitle}>
                  <Type variant="bodySmall" color={semantic.primary}>
                    {SUBTITLE}
                  </Type>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.field}>
                  <SearchIcon width={20} height={20} />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    style={[styles.fieldInput, NO_FOCUS_RING]}
                    placeholder={PLACEHOLDER}
                    placeholderTextColor={semantic.onSurfaceVariant}
                    accessibilityLabel={PLACEHOLDER}
                  />
                </View>

                <LocationRow
                  Icon={CurrentLocation}
                  name="Use my current location"
                  area={`${origin.area}, ${origin.city}`}
                  onPress={() => choose(origin)}
                />
              </View>

              <View style={styles.section}>
                <Type variant="titleSmall" color={semantic.primary}>
                  Saved Places
                </Type>
                {savedPlaces.map(({ hub }, i) => (
                  <LocationRow
                    key={hub.id}
                    Icon={SavedPlace}
                    name={copy.saved[i] ?? hub.name}
                    area={`${hub.area}, ${hub.city}`}
                    trailing={<AddPlus width={24} height={24} />}
                    onPress={() => choose(hub)}
                  />
                ))}
              </View>
            </>
          )}

          {searching ? (
            <View style={styles.section}>
              <Type variant="titleSmall" color={semantic.primary}>
                {copy.results}
              </Type>
              {results.map(({ hub, km }) => (
                <LocationRow
                  key={hub.id}
                  Icon={LocationPin}
                  variant="filled"
                  name={hub.name}
                  area={`${hub.area}, ${hub.city}`}
                  trailing={<RowDistance km={km} />}
                  onPress={() => choose(hub)}
                />
              ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

/** Best textual match for a typed place, across name, area and address. */
function matchHub(hubs: Hub[], query: string): Hub | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return hubs.find((h) => [h.name, h.area, h.address].some((v) => v.toLowerCase().includes(q)));
}

/** The `count` hubs closest to `from`, excluding `from` itself. */
function nearest(hubs: Hub[], from: Hub, count: number): { hub: Hub; km: number }[] {
  return hubs
    .filter((h) => h.id !== from.id)
    .map((hub) => ({ hub, km: haversineKm(from.lat, from.lng, hub.lat, hub.lng) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, count);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: semantic.surface },
  content: { paddingHorizontal: GUTTER, paddingTop: 60, paddingBottom: 60 },
  contentWide: { alignItems: 'center' },
  stack: { width: '100%', gap: spacing[7] },
  stackWide: { maxWidth: COLUMN_MAX_WIDTH },

  headingGroup: { width: '100%', gap: spacing[2] },
  subtitle: { width: '100%', alignItems: 'center', paddingVertical: spacing[1] + 2 },

  section: { width: '100%', gap: spacing[4] },

  field: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    borderWidth: 1,
    borderColor: semantic.onSurfaceVariant,
    borderRadius: radii.md,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[3],
  },
  fieldInput: { flex: 1, fontSize: 12, lineHeight: 18, color: semantic.primary },

  pill: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[3],
    borderRadius: radii.md,
    backgroundColor: semantic.onPrimary,
    ...shadows.soft,
  },
  pillLead: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing[4] },
  pillInput: { flex: 1, fontSize: 12, lineHeight: 18, color: semantic.onPrimaryContainer },
});
