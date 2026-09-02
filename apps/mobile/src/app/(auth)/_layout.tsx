import { Stack } from 'expo-router';
import { colors } from '../../constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="forgot" />
      <Stack.Screen name="kyc" />
      <Stack.Screen name="role-select" />
      <Stack.Screen name="driver-onboarding" />
    </Stack>
  );
}
