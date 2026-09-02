/** Figma 198:446 - "Splash screen 3". Built from get_design_context on that node. */
import { router } from 'expo-router';
import { OnboardingSlide } from '@/components';

export default function Intro3() {
  return (
    <OnboardingSlide
      index={2}
      total={4}
      title={"Pick your stop, pick your time, pay to lock your seat"}
      body={"Meet at a known landmark, not a random spot. Your seat is yours the moment you pay."}
      art={{ name: 'onboarding-3', node: '198:449' }}
      cta="Next"
      onNext={() => router.push('/(onboarding)/intro-4')}
      onSkip={() => router.replace('/(auth)/signup')}
      
    />
  );
}
