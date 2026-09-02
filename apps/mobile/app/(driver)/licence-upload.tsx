/**
 * Figma 103:497 - "Driver's license upload".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function LicenceUpload() {
  return (
    <PendingScreen
      title="Driver's license upload"
      node="103:497"
      next="/(driver)/vehicle"
    />
  );
}
