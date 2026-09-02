/**
 * Figma 151:450 - "rider pickup search".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Pickup() {
  return (
    <PendingScreen
      title="rider pickup search"
      node="151:450"
      next="/(rider)/pickup-results"
    />
  );
}
