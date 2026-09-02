/**
 * Figma 118:137 - "rider homepage".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function Home() {
  return (
    <PendingScreen
      title="rider homepage"
      node="118:137"
      next="/(rider)/home-search"
    />
  );
}
