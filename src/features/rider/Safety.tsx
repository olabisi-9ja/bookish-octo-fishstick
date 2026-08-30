import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Contact, ShieldCheck, Siren } from 'lucide-react';
import { Page, Sheet } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { SafetyArt } from '../../components/illustrations/Illustrations';
import { useComuta } from '../../store';
import { safetyService } from '../../services/safetyService';

export function Safety() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const contacts = useComuta((s) => s.trustedContacts);
  const [pinSheet, setPinSheet] = useState(false);
  const [pin, setPin] = useState('');

  return (
    <Page>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Safety</h1>
      <p className="mt-1 text-[13.5px] text-variant">Tools that keep your commute predictable and protected.</p>

      <div className="mt-4 rounded-2xl bg-forest-900 p-5 text-white shadow-lift">
        <div className="mx-auto max-w-[220px]">
          <SafetyArt />
        </div>
        <h2 className="mt-3 text-[17px] font-extrabold tracking-tight">Ride with confidence</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-white/70">
          Verified drivers, approved hubs, trip PINs and live trip sharing are built into every commute.
        </p>
      </div>

      <div className="mt-4 space-y-2.5">
        <SafetyRow icon={<ShieldCheck size={18} />} title="Verified network" body="Every driver, vehicle and hub is verified before the first trip." />
        <SafetyRow icon={<Siren size={18} />} title="Trip PIN" body="Confirm a 4-digit PIN before entering any vehicle." onClick={() => setPinSheet(true)} />
        <SafetyRow icon={<Contact size={18} />} title={`${contacts.length} trusted contacts`} body="They can follow your live trips and receive SOS alerts." onClick={() => navigate('/app/rider/account/contacts')} />
      </div>

      <Sheet open={pinSheet} onClose={() => setPinSheet(false)} title="Your trip PIN">
        <p className="text-[13.5px] text-variant">
          Every booking gets a unique PIN. Show it to your driver before entering. That's how you know the vehicle is the one you booked.
        </p>
        <div className="mt-4 rounded-2xl border-2 border-forest-900 bg-forest-900 p-5 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-lime-500">Example PIN</p>
          <p className="mt-1 font-mono text-[40px] font-bold tracking-[0.2em] text-white">4827</p>
        </div>
        <p className="mt-3 text-[12px] font-semibold text-faint">Your live PIN appears on the pickup screen before every trip.</p>
        <Button block variant="secondary" className="mt-4" onClick={() => setPinSheet(false)}>
          Got it
        </Button>
      </Sheet>
    </Page>
  );
}

function SafetyRow({ icon, title, body, onClick }: { icon: React.ReactNode; title: string; body: string; onClick?: () => void }) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-soft ${onClick ? 'tap hover:border-forest-600' : ''}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-forest-700">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-extrabold text-onsurface">{title}</p>
        <p className="mt-0.5 text-[12.5px] text-variant">{body}</p>
      </div>
      {onClick && <ChevronRight size={17} className="text-faint" />}
    </Comp>
  );
}
