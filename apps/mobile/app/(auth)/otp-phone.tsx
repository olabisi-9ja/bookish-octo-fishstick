/**
 * Figma 65:157 - "OTP verification - phone number".
 * Route exists and navigates; the screen itself is not drawn from Figma yet.
 */
import { PendingScreen } from '@/components';

export default function OtpPhone() {
  return (
    <PendingScreen
      title="OTP verification - phone number"
      node="65:157"
      next="/(auth)/otp-phone-filled"
    />
  );
}
