import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Page } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { Field, Segmented, SelectField, Stepper } from '../../components/ui/Inputs';
import { driverService } from '../../services/driverService';
import { routeService } from '../../services/routeService';
import { useComuta } from '../../store';
import { todayISO, addDaysISO } from '../../utils/dates';

export function PublishCommute() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const hubs = useComuta((s) => s.hubs);
  const [fromId, setFromId] = useState('hub_ikorodu');
  const [toId, setToId] = useState('hub_vi');
  const [pickupHubId, setPickupHubId] = useState('hub_ikorodu');
  const [date, setDate] = useState(addDaysISO(1));
  const [time, setTime] = useState('7:00 AM');
  const [seats, setSeats] = useState(4);
  const [price, setPrice] = useState('1500');
  const [recurring, setRecurring] = useState(false);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const publish = async () => {
    if (!session) return;
    const priceNum = Number(price);
    if (!priceNum || priceNum < 500) {
      setError('Set a price of at least ₦500 per seat.');
      return;
    }
    setError('');
    setPublishing(true);

    if (recurring) {
      const route = await routeService.createRoute({
        ownerId: session.userId,
        fromId,
        toId,
        days: days as (0 | 1 | 2 | 3 | 4 | 5 | 6)[],
        time,
        seats,
        pricePerSeat: priceNum,
      });
      if (route.route) {
        await driverService.publishCommute({
          driverId: session.userId,
          fromId,
          toId,
          pickupHubId,
          date,
          time,
          seats,
          pricePerSeat: priceNum,
          routeId: route.route.id,
        });
      }
    } else {
      await driverService.publishCommute({
        driverId: session.userId,
        fromId,
        toId,
        pickupHubId,
        date,
        time,
        seats,
        pricePerSeat: priceNum,
      });
    }
    setPublishing(false);
    navigate('/app/driver/trips', { replace: true });
  };

  const toggleDay = (d: number) =>
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d].sort()));

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Share your commute</h1>
      <p className="mt-1 text-[13.5px] text-variant">Recover part of your travel cost with every passenger.</p>

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
        <SelectField label="Pickup hub" value={pickupHubId} onChange={(e) => setPickupHubId(e.target.value)}>
          {hubs.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </SelectField>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-variant" htmlFor="dt">Date</label>
            <input
              id="dt"
              type="date"
              min={todayISO()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-line bg-surface px-3 text-[14px] font-medium outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <SelectField label="Time" value={time} onChange={(e) => setTime(e.target.value)}>
            {['6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '5:00 PM', '5:30 PM', '6:00 PM'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </SelectField>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-extrabold text-variant">Seats to share</p>
            <Stepper value={seats} onChange={setSeats} max={6} min={1} />
          </div>
        </div>

        <Field
          label="Price per seat (₦)"
          type="number"
          min={500}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          hint="Suggested for this corridor: ₦1,500"
        />

        <div className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
          <div>
            <p className="text-[14px] font-extrabold text-onsurface">Recurring commute</p>
            <p className="text-[12px] text-variant">Repeat this trip weekly</p>
          </div>
          <Segmented
            value={recurring ? 'yes' : 'no'}
            onChange={(v) => setRecurring(v === 'yes')}
            options={[
              { value: 'no', label: 'One-off' },
              { value: 'yes', label: 'Recurring' },
            ]}
          />
        </div>

        {recurring && (
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="mb-2 text-[13px] font-extrabold text-variant">Repeat days</p>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`h-11 w-11 rounded-xl border text-[13px] font-extrabold tap ${days.includes(i) ? 'border-forest-900 bg-forest-900 text-white' : 'border-line bg-white text-variant'}`}
                  aria-pressed={days.includes(i)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">{error}</p>}
        <Button block loading={publishing} onClick={publish}>
          Publish commute <ArrowRight size={16} />
        </Button>
      </div>
    </Page>
  );
}
