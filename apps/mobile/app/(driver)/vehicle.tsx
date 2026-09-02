/**
 * Figma 103:534 - "Tell us about your vehicle".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Vehicle() {
  return (
    <PendingScreen
      title="Tell us about your vehicle"
      node="103:534"
      next="/(driver)/documents"
    />
  );
}
