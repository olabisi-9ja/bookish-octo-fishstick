import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, OtpInput, PasswordField } from '../../components/ui/Inputs';
import { authService } from '../../services/authService';
import { VerificationSuccessArt } from '../../components/illustrations/Illustrations';

type Step = 'identify' | 'otp' | 'new' | 'success';

export function ForgotPassword() {
  const [step, setStep] = useState<Step>('identify');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(24);
  const [resendAvailable, setResendAvailable] = useState(false);
  const navigate = useNavigate();

  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await authService.resetPassword(identifier);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not start reset.');
      return;
    }
    await authService.sendOtp(identifier);
    setStep('otp');
    setResendIn(24);
    setResendAvailable(false);
  };

  const verify = async () => {
    setError('');
    if (code.length < 6) return setError('Enter the 6-digit code.');
    setLoading(true);
    const res = await authService.verifyOtp(code);
    setLoading(false);
    if (!res.ok) return setError(res.error ?? 'Code doesn’t match.');
    setStep('new');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords don’t match.');
    setLoading(true);
    const res = await authService.setNewPassword(identifier, password);
    setLoading(false);
    if (!res.ok) return setError(res.error ?? 'Could not update your password.');
    setStep('success');
  };

  const resend = async () => {
    await authService.sendOtp(identifier);
    setCode('');
    setResendAvailable(false);
    setResendIn(24);
  };

  if (step === 'success') {
    return (
      <AuthLayout narrow>
        <div className="mx-auto max-w-[220px]">
          <VerificationSuccessArt />
        </div>
        <h1 className="mt-2 text-center text-[26px] font-extrabold tracking-tight text-onsurface">You're all set.</h1>
        <p className="mt-2 text-center text-[14px] text-variant">Your password has been changed successfully.</p>
        <Button block className="mt-8" onClick={() => navigate('/login', { replace: true })}>
          Log in
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout narrow>
      <button onClick={() => (step === 'identify' ? navigate(-1) : setStep('identify'))} className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-forest-700">Reset password</p>

      {step === 'identify' && (
        <>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-onsurface">Reset your password</h1>
          <p className="mt-2 text-[14px] text-variant">Enter the email or phone number linked to your account.</p>
          <form onSubmit={start} className="mt-7 space-y-4">
            <Field name="identifier" label="Email or phone number" placeholder="you@example.com or 0803 000 0000" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">{error}</p>}
            <Button block loading={loading}>Continue</Button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-onsurface">Enter your code</h1>
          <p className="mt-2 text-[14px] text-variant">We sent a 6-digit code to <span className="font-bold text-onsurface">{identifier}</span>.</p>
          <div className="mt-7">
            <OtpInput length={6} value={code} onChange={setCode} />
          </div>
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">{error}</p>}
          <div className="mt-4">
            {resendAvailable ? (
              <button onClick={resend} className="text-[14px] font-extrabold text-forest-700 hover:underline tap">Resend code</button>
            ) : (
              <p className="text-[14px] font-semibold text-faint">Didn't get a code? Resend in <span className="font-mono">{resendIn}s</span></p>
            )}
          </div>
          <Button block className="mt-8" loading={loading} onClick={verify}>Verify</Button>
        </>
      )}

      {step === 'new' && (
        <>
          <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-onsurface">Set a new password</h1>
          <p className="mt-2 text-[14px] text-variant">Choose something you haven't used before.</p>
          <form onSubmit={save} className="mt-7 space-y-4">
            <PasswordField name="pw" label="New password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            <PasswordField name="confirm" label="Confirm password" placeholder="Repeat your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
            {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">{error}</p>}
            <Button block loading={loading}>Save password</Button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
