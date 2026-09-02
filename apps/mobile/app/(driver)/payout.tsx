/**
 * Figma 103:679 - "Where should we send your earnings?".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Payout() {
  return (
    <PendingScreen
      title="Where should we send your earnings?"
      node="103:679"
      next="/(rider)/home"
    />
  );
}
