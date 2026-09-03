import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MapPin, Navigation, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../../constants/theme';
import { useComuta } from '../../store';

export default function HubSelect() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const isPickup = params.mode !== 'dropoff';
  const hubs = useComuta((s) => s.hubs);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return hubs;
    const q = search.toLowerCase();
    return hubs.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q),
    );
  }, [hubs, search]);

  const handleSelect = (hubId: string) => {
    // Navigate back with the selected hub
    router.back();
    // In a real app, this would set the pickup/dropoff in a shared state
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <ArrowLeft size={22} color={colors.onsurface} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isPickup ? 'Where are you starting from?' : 'Where are you going to?'}
        </Text>
      </View>

      {/* Search input */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.faint} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hub, area, or landmark"
            placeholderTextColor={colors.faint}
            value={search}
            onChangeText={setSearch}
            autoFocus
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Use current location */}
      <Pressable style={styles.locationRow}>
        <View style={styles.locationIcon}>
          <Navigation size={18} color={colors.forest[600]} />
        </View>
        <View>
          <Text style={styles.locationTitle}>Use current location</Text>
          <Text style={styles.locationSubtitle}>Find hubs nearest to you</Text>
        </View>
      </Pressable>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Saved places header (optional) */}
      <View style={styles.sectionHeader}>
        <Clock size={14} color={colors.muted} />
        <Text style={styles.sectionTitle}>Hubs near you</Text>
      </View>

      {/* Hub list */}
      <FlatList
        data={filtered}
        keyExtractor={(h) => h.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 30).duration(200)}>
            <Pressable
              onPress={() => handleSelect(item.id)}
              style={({ pressed }) => [styles.hubRow, pressed && styles.hubRowPressed]}
            >
              <View style={styles.hubIcon}>
                <MapPin size={18} color={colors.forest[600]} />
              </View>
              <View style={styles.hubInfo}>
                <Text style={styles.hubName}>{item.name}</Text>
                <Text style={styles.hubAddress}>{item.address}</Text>
              </View>
              <Text style={styles.hubDistance}>
                {(Math.random() * 8 + 1).toFixed(1)} km
              </Text>
            </Pressable>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Search size={40} color={colors.faint} />
            <Text style={styles.emptyText}>No hubs match "{search}"</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  headerTitle: {
    flex: 1,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.titleMedium,
    color: colors.onsurface,
  },

  // Search
  searchRow: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: spacing[4],
  },
  searchInput: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodyMedium,
    color: colors.onsurface,
    padding: 0,
  },

  // Location row
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forest[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodyMedium,
    color: colors.onsurface,
  },
  locationSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.muted,
    marginTop: 2,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.lineSoft,
    marginHorizontal: spacing[5],
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  sectionTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.labelMedium,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Hub list
  listContent: {
    paddingBottom: spacing[10],
  },
  hubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  hubRowPressed: {
    backgroundColor: colors.forest[50],
  },
  hubIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubInfo: {
    flex: 1,
  },
  hubName: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.bodyMedium,
    color: colors.onsurface,
  },
  hubAddress: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.labelSmall,
    color: colors.muted,
    marginTop: 2,
  },
  hubDistance: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.labelSmall,
    color: colors.forest[600],
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing[16],
    gap: spacing[3],
  },
  emptyText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.bodySmall,
    color: colors.muted,
  },
});
