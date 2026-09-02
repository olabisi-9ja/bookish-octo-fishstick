/**
 * Figma 99:397 - "Verify your identity - Driver's Licence".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function LicenceReview() {
  return (
    <PendingScreen
      title="Verify your identity - Driver's Licence"
      node="99:397"
      next="/role"
    />
  );
}
