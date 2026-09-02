/**
 * Figma 46:9 - "Create an Account - Email".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Signup() {
  return (
    <PendingScreen
      title="Create an Account - Email"
      node="46:9"
      next="/(auth)/signup-details"
    />
  );
}
