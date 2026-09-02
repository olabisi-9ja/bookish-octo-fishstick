/**
 * Figma 153:670 - "rider pickup search".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function PickupResults() {
  return (
    <PendingScreen
      title="rider pickup search"
      node="153:670"
      next="/(rider)/dropoff"
    />
  );
}
