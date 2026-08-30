import type { CSSProperties } from 'react';

type LottiePlayerProps = Record<string, unknown> & {
  src?: string;
  background?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  controls?: boolean;
  mode?: string;
  preserveAspectRatio?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  className?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': LottiePlayerProps;
    }
  }
}
