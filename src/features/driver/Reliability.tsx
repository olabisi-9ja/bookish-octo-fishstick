import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, CircleDollarSign, ShieldCheck, Timer } from 'lucide-react';
import { Page, Avatar, StatusChip } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { useComuta } from '../../store';
import { authService } from '../../services/authService';
import { ModeSwitch } from '../../layouts/AppLayout';
import { naira } from '../../utils/format';

export function DriverReliability() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const profile = useComuta((s) => (session ? s.driverProfiles[session.userId] : undefined));

  if (!profile) {
    return (
      <Page>
        <p className="py-10 text-center text-[14px] text-variant">Reliability data is available after your first commute.</p>
      </Page>
    );
  }

  const stats = [
    { label: 'Completion', value: `${profile.completionRate}%`, icon: ShieldCheck, tone: 'text-forest-700 bg-forest-50' },
    { label: 'On time', value: `${profile.onTimeRate}%`, icon: Timer, tone: 'text-teal-700 bg-teal-50' },
    { label: 'Late cancellations', value: String(profile.lateCancellations), icon: Timer, tone: 'text-amber-600 bg-amber-50' },
    { label: 'No-shows', value: String(profile.noShows), icon: BadgeCheck, tone: 'text-variant bg-surface-2' },
  ];

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Your COMUTA reliability</h1>

      <div className="mt-4 rounded-3xl bg-forest-900 p-6 text-center text-white shadow-lift">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-lime-500">Reliability score</p>
        <p className="mt-2 text-[56px] font-extrabold leading-none tracking-tight">{profile.completionRate}%</p>
        <div className="mx-auto mt-4 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-lime-500" style={{ width: `${profile.completionRate}%` }} />
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-lime-500">
          <ShieldCheck size={15} /> Excellent standing
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4 shadow-soft">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${s.tone}`}>
              <s.icon size={17} />
            </span>
            <p className="mt-3 text-[22px] font-extrabold tracking-tight text-onsurface">{s.value}</p>
            <p className="text-[12px] font-semibold text-variant">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <p className="text-[13.5px] font-bold text-onsurface">What keeps your score healthy</p>
        <ul className="mt-2 space-y-1.5 text-[12.5px] font-semibold text-variant">
          <li>• Confirm commutes before the 11:00 PM deadline</li>
          <li>• Complete trips you've confirmed</li>
          <li>• Arrive at the pickup hub on time</li>
          <li>• Riders see your score before booking — great scores get more bookings</li>
        </ul>
      </div>
    </Page>
  );
}

export function DriverEarnings() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const profile = useComuta((s) => (session ? s.driverProfiles[session.userId] : undefined));
  const payouts = useComuta((s) => s.payouts.filter((p) => p.driverId === s.session?.userId));
  const tripsShared = useComuta((s) => s.trips.filter((t) => t.driverId === s.session?.userId && t.status === 'completed').length);

  const pending = payouts.filter((p) => p.status === 'pending').reduce((a, p) => a + p.amount, 0);
  const completed = payouts.filter((p) => p.status === 'completed').reduce((a, p) => a + p.amount, 0);

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Cost recovery</h1>

      <div className="mt-4 rounded-3xl bg-forest-900 p-6 text-white shadow-lift">
        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-lime-500">
          <CircleDollarSign size={14} /> Recovered this month
        </p>
        <p className="mt-2 text-[38px] font-extrabold leading-none tracking-tight">{naira(profile?.monthlyRecovered ?? 0)}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Trips shared</p>
            <p className="mt-0.5 text-[20px] font-extrabold">{profile?.monthlyTrips ?? tripsShared}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Passengers</p>
            <p className="mt-0.5 text-[20px] font-extrabold">{profile?.monthlyPassengers ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[12px] font-semibold text-variant">Available</p>
          <p className="text-[20px] font-extrabold text-forest-900">{naira(pending)}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[12px] font-semibold text-variant">Paid out</p>
          <p className="text-[20px] font-extrabold text-forest-900">{naira(completed)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <p className="text-[13px] font-extrabold text-variant">Bank account</p>
        <p className="mt-1 text-[15px] font-extrabold text-onsurface">Access Bank ···· 4412</p>
        <p className="mt-1 text-[11.5px] font-semibold text-faint">Payouts settle on the 1st of each month.</p>
      </div>

      <h2 className="mt-6 text-[15px] font-extrabold text-onsurface">Transaction history</h2>
      <div className="mt-3 space-y-2.5">
        {payouts.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-line-soft bg-white p-4">
            <Avatar initials="S" color="#155942" size={38} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-extrabold text-onsurface">{p.note}</p>
              <p className="text-[11.5px] font-semibold text-variant">{p.method}</p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-extrabold text-forest-900">{naira(p.amount)}</p>
              <StatusChip label={p.status === 'pending' ? 'Pending' : 'Paid'} tone={p.status === 'pending' ? 'amber' : 'green'} />
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}

export function DriverAccount() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const user = useComuta((s) => s.users.find((u) => u.id === s.session?.userId));
  const profile = useComuta((s) => (session ? s.driverProfiles[session.userId] : undefined));
  const vehicle = useComuta((s) => (profile ? s.vehicles.find((v) => v.id === profile.vehicleId) : undefined));

  if (!session || !user) return null;

  return (
    <Page>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Account</h1>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <Avatar initials={user.photoInitials} color={user.avatarColor} size={52} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-extrabold text-onsurface">{user.firstName} {user.lastName}</p>
          <p className="text-[12.5px] font-semibold text-variant">Driver · {user.phone}</p>
        </div>
        <StatusChip label="Verified" tone="green" dot />
      </div>

      {vehicle && (
        <div className="mt-4 rounded-2xl border border-line bg-white p-4">
          <p className="text-[13px] font-extrabold text-variant">Vehicle</p>
          <p className="mt-1 text-[15px] font-extrabold text-onsurface">
            {vehicle.color} {vehicle.make} {vehicle.model} · {vehicle.year}
          </p>
          <p className="font-mono text-[13px] font-bold text-variant">{vehicle.plate}</p>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-line bg-white p-3.5">
        <ModeSwitch mode="driver" />
      </div>

      <Button
        block
        variant="secondary"
        className="mt-5"
        onClick={() => {
          authService.logout();
          navigate('/login', { replace: true });
        }}
      >
        Log out
      </Button>
    </Page>
  );
}
