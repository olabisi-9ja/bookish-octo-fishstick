/**
 * Figma 65:76 - "OTP verification - Email".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function OtpEmail() {
  return (
    <PendingScreen
      title="OTP verification - Email"
      node="65:76"
      next="/(auth)/otp-email-filled"
    />
  );
}
