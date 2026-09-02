/** Figma 191:429 - "Splash screen 2". Built from get_design_context on that node. */
import { router } from 'expo-router';
import { OnboardingSlide } from '@/components';

export default function Intro2() {
  return (
    <OnboardingSlide
      index={1}
      total={4}
      title={"No more guessing at the bus stop"}
      body={"Every driver on Comuta is verified: ID, license, and vehicle checked before they can post a ride"}
      art={{ name: 'onboarding-2', node: '191:432' }}
      cta="Next"
      onNext={() => router.push('/(onboarding)/intro-3')}
      onSkip={() => router.replace('/(auth)/signup')}
      
    />
  );
}
