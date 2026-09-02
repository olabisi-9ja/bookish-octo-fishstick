/**
 * Figma 62:368 - "Reset Password - Email".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function ResetEmail() {
  return (
    <PendingScreen
      title="Reset Password - Email"
      node="62:368"
      next="/(auth)/reset-phone"
    />
  );
}
