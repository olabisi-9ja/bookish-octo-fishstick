/**
 * Figma 62:314 - "Login - Phone Number".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function LoginPassword() {
  return (
    <PendingScreen
      title="Login - Phone Number"
      node="62:314"
      next="/(auth)/otp-email"
    />
  );
}
