/**
 * Figma 228:264 - "Reset Password - Phone".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function ResetConfirm() {
  return (
    <PendingScreen
      title="Reset Password - Phone"
      node="228:264"
      next="/(auth)/reset-done"
    />
  );
}
