import { useMemo, useState } from 'react';
import {
  ArrowRight, BadgeCheck, ChevronLeft, Phone, ShieldCheck, Smartphone, Star, Users,
} from 'lucide-react';
import Brand from './components/Brand';
import { Avatar } from './components/UI';
import { DEMO_OTP, DEMO_PHONE, prettyPhone, usePlatform } from './platform';

type Step = 'welcome' | 'phone' | 'otp' | 'profile' | 'emergency';

export default function AuthApp({ onEnter }: { onEnter: () => void }) {
  const { login, completeProfile, addEmergencyContact } = usePlatform();
  const [step, setStep] = useState<Step>('welcome');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relation, setRelation] = useState('Family');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const canPhone = phone.replace(/\D/g, '').length >= 10;
  const canOtp = otp.replace(/\D/g, '').length === 4;
  const canProfile = firstName.trim().length > 1 && lastName.trim().length > 1;
  const canEmergency = contactName.trim().length > 1 && contactPhone.replace(/\D/g, '').length >= 10;

  const sendPhone = () => {
    if (!canPhone) return setError('Enter a valid Nigerian phone number.');
    setError('');
    setStep('otp');
  };

  const verify = () => {
    setBusy(true);
    const result = login(phone, otp.replace(/\D/g, ''));
    setBusy(false);
    if (!result.ok) return setError(result.message);
    setError('');
    if (result.isNew) setStep('profile');
    else onEnter();
  };

  const saveProfile = () => {
    if (!canProfile) return setError('Tell us your first and last name.');
    completeProfile(firstName.trim(), lastName.trim(), email.trim() || undefined);
    setError('');
    setStep('emergency');
  };

  const finish = () => {
    if (!canEmergency) return setError('Add at least one emergency contact.');
    addEmergencyContact(contactName.trim(), contactPhone.trim(), relation);
    setError('');
    onEnter();
  };

  const demo = () => {
    login(DEMO_PHONE, DEMO_OTP);
    onEnter();
  };

  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Brand tagline />
      </header>

      <main className="auth-content">
        <section className="auth-intro">
          <span className="auth-kicker">MY DAILY COMMUTE IS TAKEN CARE OF</span>
          <h1>Nigeria’s Corridor-Based Shared Commute Platform</h1>
          <p>
            Travel with verified drivers and riders along major Lagos transit corridors.
            Book ahead, know your seat, and arrive without stress.
          </p>
          <ul className="auth-bullets">
            <li><ShieldCheck size={16} /> Verified government NIN and driver licensing</li>
            <li><BadgeCheck size={16} /> 98%+ driver on-time completion standard</li>
            <li><Users size={16} /> Designated well-lit pickup hubs with waiting bays</li>
            <li><Star size={16} /> Recurring Ikorodu ➔ Victoria Island arterial schedule</li>
          </ul>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            {step !== 'welcome' && (
              <button
                className="auth-back"
                onClick={() => {
                  setError('');
                  setStep(step === 'otp' ? 'phone' : step === 'profile' ? 'otp' : step === 'emergency' ? 'profile' : 'welcome');
                }}
              >
                <ChevronLeft size={18} /> Back
              </button>
            )}

            {step === 'welcome' && (
              <>
                <span className="auth-step">START WITH TRUST</span>
                <h2>Welcome to COMUTA</h2>
                <p>Sign in with your phone. We'll send a one-time code — no passwords to remember.</p>
                <button className="btn btn-primary btn-block" onClick={() => setStep('phone')}>
                  Get started <ArrowRight size={18} />
                </button>
                <button className="btn btn-outline btn-block" onClick={() => setStep('phone')}>
                  I already have an account
                </button>
                <button className="auth-demo" onClick={demo}>
                  <BadgeCheck size={16} /> Continue as Olabisi · Demo Account (4827)
                </button>
              </>
            )}

            {step === 'phone' && (
              <>
                <span className="auth-step">STEP 1 OF 3</span>
                <h2>What's your number?</h2>
                <p>We'll text a 4-digit code. For this preview, the code is always <strong>{DEMO_OTP}</strong>.</p>
                <label className="auth-label">
                  Phone number
                  <div className="auth-input">
                    <span>+234</span>
                    <Phone size={16} />
                    <input
                      autoFocus
                      inputMode="tel"
                      placeholder="803 111 2841"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendPhone()}
                    />
                  </div>
                </label>
                {error && <p className="auth-error">{error}</p>}
                <button className="btn btn-primary btn-block" disabled={!canPhone} onClick={sendPhone}>
                  Send code <ArrowRight size={18} />
                </button>
              </>
            )}

            {step === 'otp' && (
              <>
                <span className="auth-step">STEP 2 OF 3</span>
                <h2>Enter your code</h2>
                <p>Sent to {prettyPhone(phone) || 'your phone'}. Use <strong>{DEMO_OTP}</strong> to continue.</p>
                <OtpBoxes value={otp} onChange={setOtp} onComplete={(value) => { setOtp(value); }} />
                {error && <p className="auth-error">{error}</p>}
                <button className="btn btn-primary btn-block" disabled={!canOtp || busy} onClick={verify}>
                  <Smartphone size={16} /> Verify and continue
                </button>
                <button className="btn-resend" onClick={() => setError('A new code was generated: ' + DEMO_OTP)}>
                  Resend code (4827)
                </button>
              </>
            )}

            {step === 'profile' && (
              <>
                <span className="auth-step">STEP 3 OF 3</span>
                <h2>Complete your profile</h2>
                <p>Use your real legal name as shown on your NIN or Driver's License.</p>
                <label className="auth-label">
                  First name
                  <input
                    placeholder="e.g. Olabisi"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="auth-label">
                  Last name
                  <input
                    placeholder="e.g. Ojo"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <label className="auth-label">
                  Work or personal email (optional)
                  <input
                    type="email"
                    placeholder="e.g. olabisi@company.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                {error && <p className="auth-error">{error}</p>}
                <button className="btn btn-primary btn-block" disabled={!canProfile} onClick={saveProfile}>
                  Next: Emergency Contact <ArrowRight size={18} />
                </button>
              </>
            )}

            {step === 'emergency' && (
              <>
                <span className="auth-step">SAFETY FIRST</span>
                <h2>Add trusted emergency contact</h2>
                <p>If you ever trigger SOS, COMUTA Operations and this contact immediately receive live corridor context.</p>
                <label className="auth-label">
                  Contact full name
                  <input
                    placeholder="e.g. Funmi Ojo"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </label>
                <label className="auth-label">
                  Phone number
                  <input
                    inputMode="tel"
                    placeholder="e.g. 0805 441 2290"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </label>
                <label className="auth-label">
                  Relationship
                  <select value={relation} onChange={(e) => setRelation(e.target.value)}>
                    <option>Family / Spouse</option>
                    <option>Colleague</option>
                    <option>Friend</option>
                  </select>
                </label>
                {error && <p className="auth-error">{error}</p>}
                <button className="btn btn-primary btn-block" disabled={!canEmergency} onClick={finish}>
                  Enter COMUTA <ArrowRight size={18} />
                </button>
              </>
            )}

            <p className="auth-legal">
              By continuing you agree to COMUTA's terms and NDPR data privacy policy.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function OtpBoxes({ value, onChange, onComplete }: { value: string; onChange: (v: string) => void; onComplete?: (v: string) => void }) {
  const digits = useMemo(() => {
    const raw = value.replace(/\D/g, '').slice(0, 4);
    return [raw[0] || '', raw[1] || '', raw[2] || '', raw[3] || ''];
  }, [value]);

  const handleChange = (index: number, char: string) => {
    const clean = char.replace(/\D/g, '');
    const current = value.replace(/\D/g, '').split('');
    if (!clean) {
      current[index] = '';
    } else {
      current[index] = clean[clean.length - 1];
    }
    const next = current.join('').slice(0, 4);
    onChange(next);
    if (next.length === 4 && onComplete) {
      onComplete(next);
    }
  };

  return (
    <div className="otp-container">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          className={`otp-digit-input ${digit ? 'filled' : ''}`}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          inputMode="numeric"
        />
      ))}
    </div>
  );
}
