/**
 * Figma 73:303 - "Verify your identity".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Identity() {
  return (
    <PendingScreen
      title="Verify your identity"
      node="73:303"
      next="/(kyc)/nin"
    />
  );
}
