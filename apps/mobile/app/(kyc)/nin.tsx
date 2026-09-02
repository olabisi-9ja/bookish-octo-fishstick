/**
 * Figma 91:222 - "Verify your identity - NIN".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Nin() {
  return (
    <PendingScreen
      title="Verify your identity - NIN"
      node="91:222"
      next="/(kyc)/licence"
    />
  );
}
