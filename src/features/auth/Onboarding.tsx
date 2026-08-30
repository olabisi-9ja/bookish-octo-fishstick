import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CommuteIllustration, VerifyIllustration, BookAheadIllustration } from '../../components/illustrations/Illustrations';
import { DURATION, EASE } from '../../constants';

const SLIDES = [
  {
    title: 'Ride with people already making your commute.',
    body: 'Share a route with people heading the same way and pay less for the journey.',
    art: <CommuteIllustration />,
  },
  {
    title: 'Know who you\u2019re riding with.',
    body: 'Verified drivers, vehicles and pickup hubs help make every commute more predictable.',
    art: <VerifyIllustration />,
  },
  {
    title: 'Book ahead. Know your seat.',
    body: 'See your price, pickup point and trip details before you travel.',
    art: <BookAheadIllustration />,
  },
];

export function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <div className="flex items-center justify-between px-5 pt-5 safe-t">
        {index > 0 ? (
          <button
            onClick={() => setIndex((i) => i - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-variant"
            aria-label="Previous"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-1.5" aria-hidden>
          {SLIDES.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-forest-900' : 'w-1.5 bg-line'}`} />
          ))}
        </div>
        <button onClick={() => navigate('/login')} className="tap px-2 text-[13px] font-bold text-variant hover:text-forest-900">
          Skip
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: DURATION.standard, ease: EASE }}
          >
            <div className="mx-auto max-w-[300px]">{slide.art}</div>
            <h1 className="mx-auto mt-8 max-w-xs text-center text-[27px] font-extrabold leading-[1.12] tracking-tight text-forest-900">
              {slide.title}
            </h1>
            <p className="mx-auto mt-3 max-w-xs text-center text-[15px] leading-relaxed text-variant">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-3 px-7 pb-10 safe-b">
        <Button block onClick={() => (last ? navigate('/signup') : setIndex((i) => i + 1))}>
          {last ? 'Get started' : 'Continue'}
        </Button>
        {last && (
          <Button block variant="tertiary" onClick={() => navigate('/login')}>
            Log in
          </Button>
        )}
      </div>
    </div>
  );
}
