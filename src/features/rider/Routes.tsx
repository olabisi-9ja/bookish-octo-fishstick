import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarPlus, MapPin, Pause, Play, SkipForward, Trash2 } from 'lucide-react';
import { Page, StatusChip, Sheet } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { SelectField } from '../../components/ui/Inputs';
import { NoRoutesArt } from '../../components/illustrations/Illustrations';
import { routeService } from '../../services/routeService';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { DAY_NAMES, DAY_NAMES_FULL } from '../../utils/dates';
import type { DayIndex } from '../../types';

const WEEKDAYS: DayIndex[] = [1, 2, 3, 4, 5];
const ALL_DAYS: DayIndex[] = [0, 1, 2, 3, 4, 5, 6];

export function MyRoutes() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const routes = session ? routeService.myRoutes(session.userId) : [];
  const hubs = useComuta((s) => s.hubs);

  return (
    <Page>
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">My routes</h1>
        <Button size="sm" variant="secondary" onClick={() => navigate('/app/rider/routes/new')}>
          <CalendarPlus size={15} /> New
        </Button>
      </div>
      <p className="mt-1 text-[13.5px] text-variant">Your regular commutes, ready to rebook in one tap.</p>

      <div className="mt-4 space-y-3">
        {routes.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white">
            <div className="mx-auto max-w-[220px] pt-6">
              <NoRoutesArt />
            </div>
            <div className="px-6 pb-6 text-center">
              <h2 className="text-[16px] font-extrabold text-onsurface">Save your regular commute</h2>
              <p className="mt-1 text-[13px] text-variant">Repeat the same trip every week without re-planning it.</p>
              <Button block className="mt-4" onClick={() => navigate('/app/rider/routes/new')}>
                Create route
              </Button>
            </div>
          </div>
        ) : (
          routes.map((r) => {
            const from = hubs.find((h) => h.id === r.fromId);
            const to = hubs.find((h) => h.id === r.toId);
            return (
              <button
                key={r.id}
                onClick={() => navigate(`/app/rider/routes/${r.id}`)}
                className="flex w-full items-center gap-3 rounded-2xl border border-line-soft bg-white p-4 text-left shadow-soft tap"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50">
                  <MapPin size={19} className="text-forest-700" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-extrabold text-onsurface">
                    {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-variant">
                    {r.days.map((d) => DAY_NAMES[d]).join(' · ')} · {r.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-extrabold text-forest-900">{naira(r.pricePerSeat)} / trip</p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-extrabold text-forest-700">
                    View <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Page>
  );
}

export function NewRoute() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const hubs = useComuta((s) => s.hubs);
  const [fromId, setFromId] = useState('hub_ikorodu');
  const [toId, setToId] = useState('hub_vi');
  const [days, setDays] = useState<DayIndex[]>(WEEKDAYS);
  const [time, setTime] = useState('7:00 AM');
  const [saving, setSaving] = useState(false);

  const toggleDay = (d: DayIndex) =>
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort()));

  const save = async () => {
    if (!session || days.length === 0) return;
    setSaving(true);
    const from = hubs.find((h) => h.id === fromId)!;
    const to = hubs.find((h) => h.id === toId)!;
    const price = 1500;
    await routeService.createRoute({
      ownerId: session.userId,
      fromId,
      toId,
      days,
      time,
      seats: 1,
      pricePerSeat: price,
    });
    setSaving(false);
    navigate('/app/rider/routes', { replace: true });
  };

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Make this a routine</h1>
      <p className="mt-1 text-[13.5px] text-variant">Pick your corridor, days and time — we'll keep it ready for you.</p>

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="From" value={fromId} onChange={(e) => setFromId(e.target.value)}>
            {hubs.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </SelectField>
          <SelectField label="To" value={toId} onChange={(e) => setToId(e.target.value)}>
            {hubs.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </SelectField>
        </div>

        <div>
          <p className="mb-2 text-[13px] font-extrabold text-variant">Days</p>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((d) => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={`h-11 w-11 rounded-xl border text-[13px] font-extrabold tap ${days.includes(d) ? 'border-forest-900 bg-forest-900 text-white' : 'border-line bg-white text-variant hover:border-forest-600'}`}
                aria-pressed={days.includes(d)}
                aria-label={DAY_NAMES_FULL[d]}
              >
                {DAY_NAMES[d][0]}
              </button>
            ))}
          </div>
          <button
            onClick={() => setDays(days.length === 5 ? ALL_DAYS : WEEKDAYS)}
            className="mt-2 text-[12.5px] font-bold text-forest-700 tap"
          >
            {days.length === 5 ? 'Every day' : 'Mon – Fri'}
          </button>
        </div>

        <SelectField label="Time" value={time} onChange={(e) => setTime(e.target.value)}>
          {['6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '5:00 PM', '5:30 PM', '6:00 PM'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </SelectField>

        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between text-[13.5px] font-semibold text-variant">
            <span>Estimated price</span>
            <span className="font-extrabold text-forest-900">₦1,500 / trip</span>
          </div>
          <p className="mt-1 text-[12px] text-faint">Final price comes from the driver you ride with.</p>
        </div>
      </div>

      <Button block className="mt-6" loading={saving} disabled={days.length === 0} onClick={save}>
        Save route
      </Button>
    </Page>
  );
}

export function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const route = useComuta((s) => s.routes.find((r) => r.id === id));
  const hubs = useComuta((s) => s.hubs);
  const [confirmSheet, setConfirmSheet] = useState<'pause' | 'cancel' | null>(null);
  const [skipped, setSkipped] = useState(false);

  if (!route) {
    return (
      <Page>
        <p className="py-10 text-center text-[14px] text-variant">This route is no longer active.</p>
        <Button block variant="secondary" onClick={() => navigate('/app/rider/routes')}>Back to routes</Button>
      </Page>
    );
  }

  const from = hubs.find((h) => h.id === route.fromId);
  const to = hubs.find((h) => h.id === route.toId);

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="rounded-2xl bg-forest-900 p-5 text-white shadow-lift">
        <div className="flex items-center justify-between">
          <p className="text-[19px] font-extrabold tracking-tight">
            {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
          </p>
          <StatusChip label={route.paused ? 'Paused' : 'Active'} tone={route.paused ? 'amber' : 'lime'} dot />
        </div>
        <p className="mt-1.5 text-[13px] font-semibold text-white/70">
          {route.days.map((d) => DAY_NAMES_FULL[d]).join(' · ')}
        </p>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Departure</p>
            <p className="text-[16px] font-extrabold">{route.time}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Price</p>
            <p className="text-[16px] font-extrabold">{naira(route.pricePerSeat)} / trip</p>
          </div>
        </div>
      </div>

      {skipped && (
        <div className="mt-3 rounded-2xl border border-lime-500/60 bg-lime-50 p-4">
          <p className="text-[13.5px] font-bold text-lime-700">
            Next trip skipped — we won't look for a seat on your next departure day.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-2.5">
        <Button block variant="secondary" onClick={() => navigate('/app/rider/plan')}>
          Book this route <ArrowRight size={15} />
        </Button>
        <Button
          block
          variant="secondary"
          onClick={async () => {
            setSkipped(true);
          }}
        >
          <SkipForward size={16} /> Skip next trip
        </Button>
        <Button
          block
          variant="secondary"
          onClick={async () => {
            if (route.paused) {
              await routeService.resumeRoute(route.id);
            } else {
              setConfirmSheet('pause');
            }
          }}
        >
          {route.paused ? <><Play size={16} /> Resume route</> : <><Pause size={16} /> Pause route</>}
        </Button>
        <Button block variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setConfirmSheet('cancel')}>
          <Trash2 size={16} /> Cancel route
        </Button>
      </div>

      <Sheet open={confirmSheet === 'pause'} onClose={() => setConfirmSheet(null)} title="Pause this route?">
        <p className="text-[13.5px] leading-relaxed text-variant">
          We'll stop looking for seats on this route until you resume. Your saved route stays here.
        </p>
        <Button
          block
          className="mt-5"
          onClick={async () => {
            await routeService.pauseRoute(route.id);
            setConfirmSheet(null);
          }}
        >
          Pause route
        </Button>
        <Button block variant="ghost" className="mt-2" onClick={() => setConfirmSheet(null)}>
          Keep it active
        </Button>
      </Sheet>

      <Sheet open={confirmSheet === 'cancel'} onClose={() => setConfirmSheet(null)} title="Cancel this route?">
        <p className="text-[13.5px] leading-relaxed text-variant">
          This removes the saved route from your account. You can create it again any time.
        </p>
        <Button
          block
          variant="destructive"
          className="mt-5"
          onClick={async () => {
            await routeService.cancelRoute(route.id);
            navigate('/app/rider/routes', { replace: true });
          }}
        >
          Cancel route
        </Button>
        <Button block variant="ghost" className="mt-2" onClick={() => setConfirmSheet(null)}>
          Keep this route
        </Button>
      </Sheet>
    </Page>
  );
}

