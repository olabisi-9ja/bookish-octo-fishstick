import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, PasswordField, Segmented } from '../../components/ui/Inputs';
import { SocialAuthButtons } from './SocialAuthButtons';
import { authService } from '../../services/authService';
import { useComuta } from '../../store';

export function Signup() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const res = await authService.signup({ firstName, lastName, email, phone, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not create your account.');
      return;
    }
    if (res.session) {
      useComuta.getState().setSession({
        userId: res.session.userId,
        role: 'rider',
        onboarded: true,
        kycComplete: false,
        driverOnboarded: false,
      });
    }
    navigate('/verify', { state: { purpose: 'signup', identifier: email || phone, email }, replace: true });
  };

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-extrabold tracking-tight text-onsurface">Create an account</h1>
      <p className="mt-1.5 text-[14px] text-variant">Plan and share your commute in a few simple steps.</p>

      <div className="mt-6">
        <SocialAuthButtons />
      </div>

      <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-faint">
        <span className="h-px flex-1 bg-line" />
        or sign up with
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field name="firstName" label="First name" placeholder="Ada" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" />
          <Field name="lastName" label="Last name" placeholder="Okafor" value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" />
        </div>
        <Segmented
          value={method}
          onChange={setMethod}
          options={[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone number' },
          ]}
          className="w-full"
        />
        {method === 'email' ? (
          <Field name="email" type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        ) : (
          <Field name="phone" type="tel" label="Phone number" placeholder="0803 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
        )}
        <PasswordField name="password" label="Password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" hint="Use a mix of letters and numbers." />
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">
            {error}
          </p>
        )}
        <Button block loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-faint">
        By creating an account you agree to COMUTA's Terms of Service and Privacy Policy.
      </p>
      <p className="mt-4 text-center text-[14px] text-variant">
        Already have an account?{' '}
        <Link to="/login" className="font-extrabold text-forest-900 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
