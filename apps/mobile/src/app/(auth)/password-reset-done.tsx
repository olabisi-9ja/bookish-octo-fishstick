/**
 * Password reset confirmation — Figma node 69:269.
 */
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Icon from '../../../assets/figma/icon-password-reset.svg';
import { StatusScreen } from '../../components/figma/StatusScreen';

export default function PasswordResetDone() {
  return (
    <>
      <StatusBar style="dark" />
      <StatusScreen
        Icon={Icon}
        title="Password reset"
        body="Your password has been changed. Log in with your new password."
        actionLabel="Log in"
        onAction={() => router.replace('/(auth)/login')}
      />
    </>
  );
}
