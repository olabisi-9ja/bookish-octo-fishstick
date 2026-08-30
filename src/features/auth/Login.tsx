import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, PasswordField, Segmented } from '../../components/ui/Inputs';
import { SocialAuthButtons } from './SocialAuthButtons';
import { authService } from '../../services/authService';
import { useComuta } from '../../store';

export function Login() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setSession = useComuta((s) => s.setSession);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const identifier = method === 'email' ? email : phone;
    // phone login maps to the account's email in the mock backend
    const emailToTry = method === 'phone' ? findEmailByPhone(phone) : email;
    const res = await authService.login(emailToTry, password);
    setLoading(false);
    if (!res.ok || !res.session) {
      setError(res.error ?? 'Something went wrong. Try again.');
      return;
    }
    const { users } = useComuta.getState();
    const user = users.find((u) => u.id === res.session!.userId)!;
    setSession({
      userId: user.id,
      role: user.role,
      onboarded: true,
      kycComplete: user.verificationStatus === 'verified',
      driverOnboarded: user.role === 'driver',
    });
    navigate(user.role === 'driver' ? '/app/driver/home' : '/app/rider/home', { replace: true });
    void identifier;
  };

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-extrabold tracking-tight text-onsurface">Welcome back</h1>
      <p className="mt-1.5 text-[14px] text-variant">Log in to continue.</p>

      <div className="mt-6">
        <SocialAuthButtons />
      </div>

      <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-faint">
        <span className="h-px flex-1 bg-line" />
        or log in with
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4">
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
          <Field
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        ) : (
          <Field
            name="phone"
            type="tel"
            label="Phone number"
            placeholder="0803 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        )}
        <div>
          <PasswordField
            name="password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mt-2 text-right">
            <Link to="/forgot" className="text-[13px] font-bold text-forest-700 hover:text-forest-600">
              Forgot password?
            </Link>
          </div>
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">
            {error}
          </p>
        )}
        <Button block loading={loading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-[14px] text-variant">
        New to COMUTA?{' '}
        <Link to="/signup" className="font-extrabold text-forest-900 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

function findEmailByPhone(phone: string) {
  const { users } = useComuta.getState();
  const digits = phone.replace(/\D/g, '');
  const user = users.find((u) => u.phone.replace(/\D/g, '') === digits || (digits.length === 11 && u.phone.replace(/\D/g, '') === `0${digits.slice(3)}`));
  return user?.email ?? phone;
}
