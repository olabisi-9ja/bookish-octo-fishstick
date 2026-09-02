/**
 * Figma 58:256 - "Login - Phone Number".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Login() {
  return (
    <PendingScreen
      title="Login - Phone Number"
      node="58:256"
      next="/(auth)/login-password"
    />
  );
}
