/**
 * Figma 99:437 - "role selection".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Role() {
  return (
    <PendingScreen
      title="role selection"
      node="99:437"
      next="/(driver)/licence-upload"
    />
  );
}
