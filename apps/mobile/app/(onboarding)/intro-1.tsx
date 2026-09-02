/** Figma 42:5 - "Splash screen 1". Built from get_design_context on that node. */
import { router } from 'expo-router';
import { OnboardingSlide } from '@/components';

export default function Intro1() {
  return (
    <OnboardingSlide
      index={0}
      total={4}
      title={"Your commute already has a driver going your way"}
      body={"Lagos traffic is bad enough without wondering who's picking you up."}
      art={{ name: 'onboarding-1', node: '190:324' }}
      cta="Next"
      onNext={() => router.push('/(onboarding)/intro-2')}
      onSkip={() => router.replace('/(auth)/signup')}
      
    />
  );
}
