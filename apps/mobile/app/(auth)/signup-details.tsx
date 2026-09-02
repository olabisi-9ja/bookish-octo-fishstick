/**
 * Figma 58:197 - "Create an Account - Email".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function SignupDetails() {
  return (
    <PendingScreen
      title="Create an Account - Email"
      node="58:197"
      next="/(auth)/login"
    />
  );
}
