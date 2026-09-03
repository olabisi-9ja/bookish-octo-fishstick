import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { semantic } from '@comuta/tokens';

/**
 * Rider group.
 *
 * A Stack, not a Tabs navigator: Figma draws the rider tab bar as a floating
 * rounded pill inside the frame (component `tabBar` 158:759), which a native
 * tab navigator cannot render. Screens compose `TabBar` from
 * components/figma/TabBar themselves.
 *
 * See the note in src/app/_layout.tsx for why web cross-fades.
 */
const SCREEN_ANIMATION = Platform.OS === 'web' ? 'fade' : 'slide_from_right';

export default function RiderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: semantic.surface },
        animation: SCREEN_ANIMATION,
      }}
    >
      <Stack.Screen name="ride" />
      <Stack.Screen name="trips" />
      <Stack.Screen name="pricing" />
      <Stack.Screen name="account" />
      <Stack.Screen name="location-search" />
      <Stack.Screen name="date-time" />
      <Stack.Screen name="search-results" />
      <Stack.Screen name="booking-confirm" />
    </Stack>
  );
}
