import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

/** See the note in src/app/_layout.tsx. */
const SCREEN_ANIMATION = Platform.OS === 'web' ? 'fade' : 'slide_from_right';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: SCREEN_ANIMATION,
      }}
    >
      <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="forgot" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="password-reset-done" options={{ animation: 'fade' }} />
      <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
      <Stack.Screen name="documents-review" options={{ animation: 'fade' }} />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="role-select" />
      <Stack.Screen name="driver-onboarding" />
      <Stack.Screen name="vehicle-details" />
      <Stack.Screen name="vehicle-documents" />
      <Stack.Screen name="selfie" />
      <Stack.Screen name="payout" />
    </Stack>
  );
}
