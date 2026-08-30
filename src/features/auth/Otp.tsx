import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { OtpInput } from '../../components/ui/Inputs';
import { authService } from '../../services/authService';
import { DURATION, EASE } from '../../constants';

const EXPIRY_MS = 120_000;

export function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const purpose: 'signup' | 'reset' | 'login' = location.state?.purpose ?? 'signup';
  const identifier: string = location.state?.identifier ?? '';
  const display = identifier || 'your phone';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendIn, setResendIn] = useState(24);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [expired, setExpired] = useState(false);
  const sentAt = useRef(Date.now());

  useEffect(() => {
    if (resendIn <= 0) {
      setResendAvailable(true);
      return;
    }
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => {
        if (purpose === 'signup') navigate('/kyc', { replace: true });
        else if (purpose === 'reset') navigate('/reset/new', { state: { identifier }, replace: true });
        else navigate('/app/rider/home', { replace: true });
      }, 700);
      return () => clearTimeout(t);
    }
  }, [success, purpose, identifier, navigate]);

  const verify = async () => {
    setError('');
    if (code.length < 6) {
      setError('Enter the 6-digit code we sent you.');
      return;
    }
    if (Date.now() - sentAt.current > EXPIRY_MS) {
      setExpired(true);
      setError('This code has expired. Resend a new code.');
      return;
    }
    setLoading(true);
    const res = await authService.verifyOtp(code);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'That code doesn’t match. Check and try again.');
      return;
    }
    setSuccess(true);
  };

  const resend = async () => {
    await authService.sendOtp(identifier);
    sentAt.current = Date.now();
    setExpired(false);
    setResendAvailable(false);
    setResendIn(24);
    setError('');
    setCode('');
  };

  return (
    <AuthLayout narrow>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-forest-700">
        {purpose === 'reset' ? 'Password reset' : 'Verify your identity'}
      </p>
      <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-onsurface">Enter your code</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-variant">
        We sent a 6-digit code to <span className="font-bold text-onsurface">{display}</span>.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: EASE }}
        className="mt-7"
      >
        <OtpInput length={6} value={code} onChange={setCode} disabled={loading || success} />
      </motion.div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">
          {error}
        </p>
      )}

      <div className="mt-5">
        {resendAvailable ? (
          <button onClick={resend} className="text-[14px] font-extrabold text-forest-700 hover:underline tap">
            Resend code
          </button>
        ) : (
          <p className="text-[14px] font-semibold text-faint">
            Didn't get a code? Resend in <span className="font-mono text-onsurface">{resendIn}s</span>
          </p>
        )}
      </div>

      <Button block className="mt-8" loading={loading} onClick={verify}>
        Verify
      </Button>
      <Button block variant="ghost" className="mt-2" onClick={() => navigate(-1)}>
        Back
      </Button>

      {expired && (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-[12px] font-semibold text-amber-600">
          Codes expire after 2 minutes for your security. Send a fresh one above.
        </p>
      )}
    </AuthLayout>
  );
}
