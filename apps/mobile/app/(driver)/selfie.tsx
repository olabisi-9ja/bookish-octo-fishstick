/**
 * Figma 103:609 - "Selfie capture".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Selfie() {
  return (
    <PendingScreen
      title="Selfie capture"
      node="103:609"
      next="/(driver)/payout"
    />
  );
}
