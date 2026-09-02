/**
 * Figma 69:269 - "Reset Password - Phone".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function ResetNew() {
  return (
    <PendingScreen
      title="Reset Password - Phone"
      node="69:269"
      next="/(auth)/reset-confirm"
    />
  );
}
