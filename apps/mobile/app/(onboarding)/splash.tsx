/**
 * Figma 42:3 - "onboarding".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Splash() {
  return (
    <PendingScreen
      title="onboarding"
      node="42:3"
      next="/(onboarding)/intro-1"
    />
  );
}
