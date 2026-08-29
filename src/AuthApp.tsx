import { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, ChevronLeft, Phone, ShieldCheck, Users } from 'lucide-react';
import Brand from './components/Brand';
import { Avatar } from './components/UI';
import { DEMO_OTP, DEMO_PHONE, prettyPhone, usePlatform } from './platform';

type Step = 'welcome' | 'phone' | 'otp' | 'profile' | 'emergency';

const ID_TYPES = ['National ID (NIN)', "Driver's licence", 'International passport', 'BVN'];
const LOCATIONS = ['Ajah', 'Sangotedo', 'Victoria Island', 'Lekki Phase 1', 'Ikeja', 'Yaba', 'Berger', 'Ikorodu', 'Akoka'];

export default function AuthApp({ onEnter }: { onEnter: () => void }) {
  const { login, completeProfile, addEmergencyContact } = usePlatform();
  const [step, setStep] = useState<Step>('welcome');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [idType, setIdType] = useState(ID_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relation, setRelation] = useState('Family');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const canPhone = phone.replace(/\D/g, '').length >= 10;
  const canOtp = otp.replace(/\D/g, '').length === 4;
  const canProfile = firstName.trim().length > 1 && lastName.trim().length > 1 && !!idType && !!location;
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
    if (!canProfile) return setError('Tell us your name, ID type and location.');
    completeProfile(firstName.trim(), lastName.trim(), email.trim() || undefined, idType, location);
    setError('');
    setStep('emergency');
  };

  const finish = () => {
    if (!canEmergency) return setError('Add someone we can reach in an emergency.');
    addEmergencyContact(contactName.trim(), contactPhone.trim(), relation);
    onEnter();
  };

  const demo = () => {
    const result = login(DEMO_PHONE, DEMO_OTP);
    if (result.ok) onEnter();
  };

  return (
    <main className="auth-app">
      <section className="auth-story">
        <div className="auth-story-bg" />
        <div className="auth-story-copy">
          <Brand inverse />
          <p className="auth-kicker">Nigeria's trusted carpool network</p>
          <h1>Your people.<br />Your route.<br /><em>One commute.</em></h1>
          <p>Match with verified commuters heading your way, share the journey, and build a crew you can count on every weekday.</p>
          <div className="auth-faces">
            <Avatar initials="AB" color="#d96e4b" size={36} />
            <Avatar initials="TA" color="#1c6e54" size={36} />
            <Avatar initials="AE" color="#155e6e" size={36} />
            <Avatar initials="ML" color="#37474f" size={36} />
            <span>2,000+ verified commuters</span>
          </div>
          <ul>
            <li><ShieldCheck size={16} /> Identity, vehicle and trip safety built in</li>
            <li><Users size={16} /> Workplace, estate and campus communities</li>
            <li><BadgeCheck size={16} /> Recurring Ajah → VI, Ikeja → VI, Yaba → Lekki</li>
          </ul>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          {step !== 'welcome' && (
            <button className="auth-back" onClick={() => { setError(''); setStep(step === 'otp' ? 'phone' : step === 'profile' ? 'otp' : step === 'emergency' ? 'profile' : 'welcome'); }}>
              <ChevronLeft size={18} /> Back
            </button>
          )}

          {step === 'welcome' && (
            <>
              <span className="auth-step">WELCOME</span>
              <h2>Welcome to Comuta</h2>
              <p>Sign in or create your account. We verify your identity so every shared ride feels safe.</p>
              <button className="btn btn-primary btn-block" onClick={() => setStep('phone')}>Continue <ArrowRight size={18} /></button>
              <div className="auth-divider"><span>or continue with</span></div>
              <div className="auth-social">
                <button className="social-btn social-apple" onClick={demo}><AppleLogo /> Continue with Apple</button>
                <button className="social-btn social-google" onClick={demo}><GoogleLogo /> Continue with Google</button>
              </div>
              <button className="auth-demo" onClick={demo}>
                <BadgeCheck size={16} /> Continue as Olabisi · demo account
              </button>
              <p className="auth-note">Prototype: social sign-in signs in the demo account.</p>
            </>
          )}

          {step === 'phone' && (
            <>
              <span className="auth-step">STEP 1 OF 3</span>
              <h2>What's your number?</h2>
              <p>We'll text a 4-digit code. For this prototype, the code is always {DEMO_OTP}.</p>
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
              <button className="btn btn-primary btn-block" disabled={!canPhone} onClick={sendPhone}>Continue <ArrowRight size={18} /></button>
            </>
          )}

          {step === 'otp' && (
            <>
              <span className="auth-step">STEP 2 OF 3</span>
              <h2>Enter your code</h2>
              <p>Sent to {prettyPhone(phone) || 'your phone'}. Use <strong>{DEMO_OTP}</strong> to continue.</p>
              <OtpBoxes value={otp} onChange={setOtp} onComplete={(value) => { setOtp(value); }} />
              {error && <p className="auth-error">{error}</p>}
              <button className="btn btn-primary btn-block" disabled={!canOtp || busy} onClick={verify}>Continue <ArrowRight size={18} /></button>
            </>
          )}

          {step === 'profile' && (
            <>
              <span className="auth-step">STEP 3 OF 3</span>
              <h2>Tell us who you are</h2>
              <p>Your name is shown to drivers and riders after a seat is confirmed.</p>
              <div className="auth-grid">
                <label className="auth-label">First name<input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Olabisi" /></label>
                <label className="auth-label">Last name<input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ojo" /></label>
              </div>
              <div className="auth-grid">
                <label className="auth-label">ID type
                  <select value={idType} onChange={(e) => setIdType(e.target.value)}>
                    {ID_TYPES.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label className="auth-label">Location
                  <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    {LOCATIONS.map((area) => <option key={area}>{area}</option>)}
                  </select>
                </label>
              </div>
              <label className="auth-label">Email <small>optional</small><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></label>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn btn-primary btn-block" disabled={!canProfile} onClick={saveProfile}>Continue <ArrowRight size={18} /></button>
            </>
          )}

          {step === 'emergency' && (
            <>
              <span className="auth-step">SAFETY FIRST</span>
              <h2>Add an emergency contact</h2>
              <p>If you ever trigger SOS, Comuta Safety and this person receive your live trip context.</p>
              <label className="auth-label">Full name<input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Funmi Ojo" /></label>
              <div className="auth-grid">
                <label className="auth-label">Phone<input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="0805 441 2290" /></label>
                <label className="auth-label">Relation
                  <select value={relation} onChange={(e) => setRelation(e.target.value)}>
                    <option>Family</option>
                    <option>Partner</option>
                    <option>Friend</option>
                    <option>Colleague</option>
                  </select>
                </label>
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn btn-primary btn-block" disabled={!canEmergency} onClick={finish}>Continue <ArrowRight size={18} /></button>
            </>
          )}
        </div>
        <p className="auth-legal">By continuing you agree to Comuta's terms and privacy policy. This prototype does not send real SMS.</p>
      </section>
    </main>
  );
}

function OtpBoxes({ value, onChange, onComplete }: { value: string; onChange: (v: string) => void; onComplete: (v: string) => void }) {
  const digits = useMemo(() => (value.replace(/\D/g, '') + '    ').slice(0, 4).split(''), [value]);
  return (
    <div className="otp-boxes">
      {digits.map((digit, index) => (
        <input
          key={index}
          inputMode="numeric"
          maxLength={4}
          value={digit.trim()}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, '');
            if (next.length > 1) {
              const clipped = next.slice(0, 4);
              onChange(clipped);
              if (clipped.length === 4) onComplete(clipped);
              return;
            }
            const chars = value.replace(/\D/g, '').split('');
            chars[index] = next;
            const joined = chars.join('').slice(0, 4);
            onChange(joined);
            const sibling = e.target.nextElementSibling as HTMLInputElement | null;
            if (next && sibling) sibling.focus();
            if (joined.length === 4) onComplete(joined);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digit) {
              const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement | null;
              prev?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.36 12.79c-.03-2.53 2.07-3.74 2.16-3.8-1.18-1.72-3.01-1.96-3.66-1.99-1.56-.16-3.04.92-3.83.92-.79 0-2.01-.9-3.3-.87-1.7.03-3.27.99-4.14 2.5-1.77 3.06-.45 7.59 1.27 10.06.84 1.21 1.84 2.57 3.15 2.52 1.26-.05 1.74-.82 3.26-.82 1.52 0 1.95.82 3.28.79 1.36-.02 2.22-1.23 3.05-2.45.96-1.4 1.35-2.76 1.37-2.83-.03-.01-2.62-1.01-2.61-4.03zM13.84 5.06c.7-.85 1.17-2.03 1.04-3.21-1.01.04-2.23.67-2.95 1.52-.65.75-1.21 1.95-1.06 3.1 1.13.09 2.27-.57 2.97-1.41z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.28V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  );
}
