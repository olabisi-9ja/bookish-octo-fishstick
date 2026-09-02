/**
 * Figma 65:185 - "OTP verification - Email".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function OtpEmailFilled() {
  return (
    <PendingScreen
      title="OTP verification - Email"
      node="65:185"
      next="/(auth)/otp-phone"
    />
  );
}
