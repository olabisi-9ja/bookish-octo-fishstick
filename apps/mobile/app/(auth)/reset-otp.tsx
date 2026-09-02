/**
 * Figma 65:241 - "Reset Password - Phone".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function ResetOtp() {
  return (
    <PendingScreen
      title="Reset Password - Phone"
      node="65:241"
      next="/(auth)/reset-new"
    />
  );
}
