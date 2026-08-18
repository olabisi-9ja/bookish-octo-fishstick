import { useEffect, useRef, useState } from 'react';

/**
 * Tracks how far an element has travelled through the viewport.
 * 0 = element's top just entered from the bottom, 1 = element's bottom left the top.
 * Respects prefers-reduced-motion (locks progress at a "settled" value).
 */
export function useElementScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setProgress(0.6);
      return;
    }
    let raf = 0;
    const handle = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = 1 - (rect.top + rect.height) / (vh + rect.height);
        setProgress(Math.max(0, Math.min(1, p)));
      });
    };
    window.addEventListener('scroll', handle, { passive: true });
    window.addEventListener('resize', handle);
    handle();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, []);

  return { ref, progress };
}
