/**
 * Figma 103:708 - "Reset Password - Phone".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function ResetDone() {
  return (
    <PendingScreen
      title="Reset Password - Phone"
      node="103:708"
      next="/(kyc)/identity"
    />
  );
}
