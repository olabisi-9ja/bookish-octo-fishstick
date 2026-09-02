import { Redirect } from 'expo-router';

/** Entry point. Onboarding is the first run experience. */
export default function Index() {
  return <Redirect href="/(onboarding)/intro-1" />;
}
