/**
 * Figma 163:1151 - "date and time picker".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Datetime() {
  return (
    <PendingScreen
      title="date and time picker"
      node="163:1151"
      next="/(rider)/pickup"
    />
  );
}
