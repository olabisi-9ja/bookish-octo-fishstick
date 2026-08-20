import { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, ChevronLeft, Phone, ShieldCheck, Smartphone, Star, Users } from 'lucide-react';
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
          <p className="auth-kicker">Nigeria's trusted recurring carpool network</p>
          <h1>Your people.<br />Your route.<br /><em>Half the cost.</em></h1>
          <p>Match with verified commuters heading your way, share the journey, and build a crew you can count on every weekday.</p>
          <div className="auth-faces">
            <Avatar initials="Ade" photo="/images/people/ade.jpg" size={36} />
            <Avatar initials="Tolu" photo="/images/people/tolu.jpg" size={36} />
            <Avatar initials="Amaka" photo="/images/people/amaka.jpg" size={36} />
            <Avatar initials="Musa" photo="/images/people/musa.jpg" size={36} />
            <span>2,000+ verified commuters</span>
          </div>
          <ul>
            <li><ShieldCheck size={16} /> Identity, vehicle and trip safety built in</li>
            <li><Users size={16} /> Workplace, estate and campus communities</li>
            <li><Star size={16} /> Recurring Ajah → VI, Ikeja → VI, Yaba → Lekki</li>
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
              <span className="auth-step">START WITH TRUST</span>
              <h2>Welcome to PadiGo</h2>
              <p>Sign in with your phone. We'll send a one-time code — no passwords to remember.</p>
              <button className="btn btn-primary btn-block" onClick={() => setStep('phone')}>Get started <ArrowRight size={18} /></button>
              <button className="btn btn-outline btn-block" onClick={() => setStep('phone')}>I already have an account</button>
              <button className="auth-demo" onClick={demo}>
                <BadgeCheck size={16} /> Continue as Olabisi · demo account
              </button>
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
              <button className="btn btn-primary btn-block" disabled={!canPhone} onClick={sendPhone}>Send code <ArrowRight size={18} /></button>
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
              <label className="auth-label">Email <small>optional</small><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></label>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn btn-primary btn-block" disabled={!canProfile} onClick={saveProfile}>Continue <ArrowRight size={18} /></button>
            </>
          )}

          {step === 'emergency' && (
            <>
              <span className="auth-step">SAFETY FIRST</span>
              <h2>Add an emergency contact</h2>
              <p>If you ever trigger SOS, PadiGo Safety and this person receive your live trip context.</p>
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
              <button className="btn btn-primary btn-block" disabled={!canEmergency} onClick={finish}>Enter PadiGo <ArrowRight size={18} /></button>
            </>
          )}
        </div>
        <p className="auth-legal">By continuing you agree to PadiGo's terms and privacy policy. This prototype does not send real SMS.</p>
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
