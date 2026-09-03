/**
 * "You're in!" — Figma node 228:264.
 *
 * The frame is named "Reset Password - Phone" in Figma, but its content is the
 * post-signup confirmation that hands off to identity verification. Named for
 * what it does.
 */
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Icon from '../../../assets/figma/icon-checkmark-done.svg';
import { StatusScreen } from '../../components/figma/StatusScreen';

export default function Welcome() {
  return (
    <>
      <StatusBar style="dark" />
      <StatusScreen
        Icon={Icon}
        title="You're in!"
        body="One more step before you can start riding or driving: let's verify your identity."
        actionLabel="Verify my identity"
        onAction={() => router.replace('/(auth)/kyc')}
      />
    </>
  );
}
