import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from '../../components/brand/Logo';
import { useComuta } from '../../store';
import { DURATION, EASE } from '../../constants';

/** Brand moment: logo fade + subtle upward movement, then hand off. */
export function Splash() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);

  useEffect(() => {
    const t = setTimeout(() => {
      if (session?.onboarded) {
        navigate(session.role === 'driver' ? '/app/driver/home' : '/app/rider/home', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 1800);
    return () => clearTimeout(t);
  }, [session, navigate]);

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center bg-forest-900"
      style={{
        background:
          'radial-gradient(circle at 50% 38%, rgba(39,132,101,0.5), transparent 52%), linear-gradient(170deg, #041F17, #0A251C 70%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.expressive, ease: EASE }}
      >
        <Logo inverse size={64} wordmark={false} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: DURATION.standard, ease: EASE }}
        className="mt-5 text-2xl font-extrabold tracking-tight text-white"
      >
        COMUTA
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: DURATION.standard }}
        className="mt-2 text-[13px] font-semibold text-white/55"
      >
        Your commute. Shared. Simpler.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: DURATION.fast }}
        className="mt-12 h-1 w-10 overflow-hidden rounded-full bg-white/15"
      >
        <motion.div
          className="h-full rounded-full bg-lime-500"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: DURATION.story, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}
