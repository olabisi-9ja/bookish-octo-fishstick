/**
 * Figma 65:213 - "OTP verification - Phone number".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function OtpPhoneFilled() {
  return (
    <PendingScreen
      title="OTP verification - Phone number"
      node="65:213"
      next="/(auth)/reset-email"
    />
  );
}
