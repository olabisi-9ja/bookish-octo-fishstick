/**
 * Figma 99:255 - "Verify your identity - Driver's Licence".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Licence() {
  return (
    <PendingScreen
      title="Verify your identity - Driver's Licence"
      node="99:255"
      next="/(kyc)/licence-filled"
    />
  );
}
