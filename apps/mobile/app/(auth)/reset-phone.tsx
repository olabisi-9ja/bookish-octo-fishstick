/**
 * Figma 65:48 - "Reset Password - Phone".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function ResetPhone() {
  return (
    <PendingScreen
      title="Reset Password - Phone"
      node="65:48"
      next="/(auth)/reset-otp"
    />
  );
}
