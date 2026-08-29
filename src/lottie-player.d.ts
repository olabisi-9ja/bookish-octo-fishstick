import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react';

type LottiePlayerProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
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
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': LottiePlayerProps;
    }
  }
}
