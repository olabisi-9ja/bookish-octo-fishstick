/**
 * Figma 103:584 - "Confirm your vehicle documents".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Documents() {
  return (
    <PendingScreen
      title="Confirm your vehicle documents"
      node="103:584"
      next="/(driver)/selfie"
    />
  );
}
