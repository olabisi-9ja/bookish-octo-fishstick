import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Headphones, KeyRound, LogOut, ShieldCheck, SlidersHorizontal, Trash2, Users } from 'lucide-react';
import { Page, Avatar, StatusChip, Sheet, VERIFICATION_STATUS_TONE } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { Field, Segmented } from '../../components/ui/Inputs';
import { authService } from '../../services/authService';
import { useComuta } from '../../store';
import { prettyPhone } from '../../utils/format';
import { VERIFICATION_LABEL } from '../../constants';
import { ModeSwitch } from '../../layouts/AppLayout';

export function Account() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const user = useComuta((s) => s.users.find((u) => u.id === s.session?.userId));
  const [devSheet, setDevSheet] = useState(false);

  if (!session || !user) return null;

  return (
    <Page>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Account</h1>

      {/* Profile */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <Avatar initials={user.photoInitials} color={user.avatarColor} size={54} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-extrabold text-onsurface">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-[12.5px] font-semibold text-variant">{prettyPhone(user.phone)}</p>
        </div>
        <StatusChip label={VERIFICATION_LABEL[user.verificationStatus]} tone={VERIFICATION_STATUS_TONE[user.verificationStatus]} dot />
      </div>

      <div className="mt-5 space-y-2.5">
        <Row icon={<CreditCard size={18} />} label="Payment methods" onClick={() => navigate('/app/rider/account/payments')} />
        <Row icon={<Users size={18} />} label="Trusted contacts" onClick={() => navigate('/app/rider/account/contacts')} />
        <Row icon={<Headphones size={18} />} label="Support" onClick={() => navigate('/app/rider/support')} />
        <Row icon={<ShieldCheck size={18} />} label="Safety" onClick={() => navigate('/app/rider/safety')} />
        <Row icon={<SlidersHorizontal size={18} />} label="Settings" onClick={() => navigate('/app/rider/account/settings')} />
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-white p-3.5">
        <ModeSwitch mode="rider" />
      </div>

      <div className="mt-5 space-y-2.5">
        <Button
          block
          variant="secondary"
          onClick={() => {
            authService.logout();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut size={16} /> Log out
        </Button>
        <Button block variant="ghost" className="text-faint" onClick={() => setDevSheet(true)}>
          Developer options
        </Button>
      </div>

      <Sheet open={devSheet} onClose={() => setDevSheet(false)} title="Developer options">
        <p className="text-[13px] leading-relaxed text-variant">
          Frontend-only build. Everything lives in your browser's localStorage. Use this to reset the prototype to its seeded state.
        </p>
        <Button
          block
          variant="destructive"
          className="mt-4"
          onClick={() => {
            authService.clearLocalState();
            navigate('/onboarding', { replace: true });
          }}
        >
          <Trash2 size={16} /> Clear local state &amp; reset
        </Button>
      </Sheet>
    </Page>
  );
}

function Row({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-line-soft bg-white p-3.5 text-left shadow-soft tap">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-forest-700">{icon}</span>
      <span className="flex-1 text-[14px] font-extrabold text-onsurface">{label}</span>
      <ChevronRight size={17} className="text-faint" />
    </button>
  );
}

export function PaymentMethods() {
  const navigate = useNavigate();
  const [card, setCard] = useState('4084 •••• 4084');
  return (
    <Page>
      <Back onClick={() => navigate(-1)} />
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Payment methods</h1>
      <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-extrabold text-onsurface">Paystack card</p>
            <p className="text-[12.5px] font-semibold text-variant">{card} · expires 09/29</p>
          </div>
          <StatusChip label="Default" tone="green" dot />
        </div>
        <p className="mt-3 border-t border-line-soft pt-3 text-[11.5px] font-semibold text-faint">
          Mock payment method. Real Paystack cards are added after integration.
        </p>
      </div>
      <Button block variant="secondary" className="mt-4" onClick={() => setCard((c) => (c.includes('4084') ? '5399 •••• 1029' : '4084 •••• 4084'))}>
        <CreditCard size={16} /> Add another card
      </Button>
    </Page>
  );
}

export function TrustedContacts() {
  const navigate = useNavigate();
  const contacts = useComuta((s) => s.trustedContacts);
  const addTrustedContact = useComuta((s) => s.addTrustedContact);
  const removeTrustedContact = useComuta((s) => s.removeTrustedContact);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Friend');
  const [adding, setAdding] = useState(false);

  return (
    <Page>
      <Back onClick={() => navigate(-1)} />
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Trusted contacts</h1>
      <p className="mt-1 text-[13.5px] text-variant">These people can follow your live trips and receive SOS alerts.</p>

      <div className="mt-4 space-y-2.5">
        {contacts.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-soft">
            <Avatar initials={c.name.split(' ').map((p) => p[0]).join('').slice(0, 2)} color="#1e7386" size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-extrabold text-onsurface">{c.name}</p>
              <p className="text-[12px] font-semibold text-variant">{c.relation} · {prettyPhone(c.phone)}</p>
            </div>
            <button onClick={() => removeTrustedContact(c.id)} className="tap rounded-lg px-2 py-1.5 text-[12px] font-bold text-red-600 hover:bg-red-50">
              Remove
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <div className="mt-4 space-y-3 rounded-2xl border border-line bg-white p-4">
          <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Funmi" />
          <Field label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 000 0000" />
          <Segmented
            value={relation}
            onChange={setRelation}
            options={[
              { value: 'Mother', label: 'Mother' },
              { value: 'Brother', label: 'Brother' },
              { value: 'Friend', label: 'Friend' },
            ]}
          />
          <Button
            block
            size="md"
            disabled={!name.trim() || phone.replace(/\D/g, '').length < 10}
            onClick={() => {
              addTrustedContact({ id: `tc_${Date.now()}`, name: name.trim(), phone, relation });
              setName('');
              setPhone('');
              setAdding(false);
            }}
          >
            Save contact
          </Button>
        </div>
      ) : (
        <Button block variant="secondary" className="mt-4" onClick={() => setAdding(true)}>
          <Users size={16} /> Add a trusted contact
        </Button>
      )}
    </Page>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const settings = useComuta((s) => s.settings);
  const updateSettings = useComuta((s) => s.updateSettings);

  return (
    <Page>
      <Back onClick={() => navigate(-1)} />
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Settings</h1>

      <div className="mt-4 space-y-4">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[13px] font-extrabold text-variant">Language</p>
          <Segmented
            value={settings.language}
            onChange={(v) => updateSettings({ language: v })}
            options={[
              { value: 'English', label: 'English' },
              { value: 'Yoruba', label: 'Yorùbá' },
              { value: 'Pidgin', label: 'Pidgin' },
            ]}
            className="mt-2 w-full"
          />
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[13px] font-extrabold text-variant">Appearance</p>
          <Segmented
            value={settings.appearance}
            onChange={(v) => updateSettings({ appearance: v })}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ]}
            className="mt-2 w-full"
          />
        </div>
        <Toggle
          label="Push notifications"
          description="Driver confirmations, trip reminders and payment updates"
          checked={settings.pushNotifications}
          onChange={(v) => updateSettings({ pushNotifications: v })}
        />
        <Toggle
          label="Email notifications"
          description="Weekly summaries and receipts"
          checked={settings.emailNotifications}
          onChange={(v) => updateSettings({ emailNotifications: v })}
        />
        <Toggle
          label="Share trip by default"
          description="Auto-share live trips with trusted contacts"
          checked={settings.shareTripDefault}
          onChange={(v) => updateSettings({ shareTripDefault: v })}
        />

        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="flex items-center gap-2 text-[14px] font-extrabold text-onsurface">
            <KeyRound size={16} className="text-forest-700" /> Security
          </p>
          <p className="mt-1 text-[12.5px] text-variant">Biometric unlock arrives with the native app.</p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={() => navigate('/forgot')}>
            Change password
          </Button>
        </div>
      </div>
    </Page>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
      <div>
        <p className="text-[14px] font-extrabold text-onsurface">{label}</p>
        <p className="mt-0.5 text-[12px] text-variant">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-forest-900' : 'bg-line'}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
      <ChevronRight size={16} className="rotate-180" /> Back
    </button>
  );
}

