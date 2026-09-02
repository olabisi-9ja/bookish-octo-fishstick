/** Figma 200:463 - "Splash screen 4". Built from get_design_context on that node. */
import { router } from 'expo-router';
import { OnboardingSlide } from '@/components';

export default function Intro4() {
  return (
    <OnboardingSlide
      index={3}
      total={4}
      title={"Built for people who commute every day, by people who do too"}
      body={"Comuta connects commuters already on the road, not a fleet of strangers."}
      art={{ name: 'onboarding-4', node: '203:491' }}
      cta="Get started"
      onNext={() => router.push('/(auth)/signup')}
      onSkip={() => router.replace('/(auth)/signup')}
      final
    />
  );
}
