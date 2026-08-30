import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronDown, Clock, MapPin, Search } from 'lucide-react';
import { Page, Sheet } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { Field, Segmented } from '../../components/ui/Inputs';
import { ComutaMap } from '../../components/map/ComutaMap';
import { useComuta } from '../../store';
import { todayISO, addDaysISO, isoToDate, toISODate } from '../../utils/dates';
import { hubDistanceKm } from '../../utils/geo';
import type { Hub } from '../../types';

const TIME_PRESETS = ['6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '5:00 PM', '5:30 PM', '6:00 PM'];

export function Plan() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const hubs = useComuta((s) => s.hubs);
  const [fromId, setFromId] = useState(params.get('from') ?? 'hub_ikorodu');
  const [toId, setToId] = useState(params.get('to') ?? 'hub_vi');
  const [date, setDate] = useState(params.get('date') ?? addDaysISO(1));
  const [time, setTime] = useState(params.get('time') ?? '7:00 AM');
  const [type, setType] = useState<'oneoff' | 'recurring'>('oneoff');
  const [picker, setPicker] = useState<null | 'from' | 'to'>(null);

  const from = hubs.find((h) => h.id === fromId);
  const to = hubs.find((h) => h.id === toId);

  const weekDays = useMemo(() => {
    const out: { iso: string; label: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      out.push({
        iso: toISODate(d),
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      });
    }
    return out;
  }, []);

  const search = () => {
    const q = new URLSearchParams({ from: fromId, to: toId, date, time, recurring: type === 'recurring' ? '1' : '0' });
    navigate(`/app/rider/search?${q.toString()}`);
  };

  const swap = () => {
    setFromId(toId);
    setToId(fromId);
  };

  return (
    <Page>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Plan a commute</h1>
      <p className="mt-1 text-[13.5px] text-variant">Choose approved hubs — COMUTA only picks up at verified locations.</p>

      {/* Route fields */}
      <div className="relative mt-5 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <button onClick={() => setPicker('from')} className="flex w-full items-center gap-3 py-2 pr-10 text-left tap">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-forest-900" />
          <div className="flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-faint">From</p>
            <p className="text-[15px] font-extrabold text-onsurface">{from?.name}</p>
          </div>
          <ChevronDown size={17} className="text-faint" />
        </button>
        <div className="my-1 ml-[4px] h-5 border-l-2 border-dashed border-line" />
        <button onClick={() => setPicker('to')} className="flex w-full items-center gap-3 py-2 pr-10 text-left tap">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime-500" />
          <div className="flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-faint">To</p>
            <p className="text-[15px] font-extrabold text-onsurface">{to?.name}</p>
          </div>
          <ChevronDown size={17} className="text-faint" />
        </button>
        <button
          onClick={swap}
          aria-label="Swap origin and destination"
          className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-variant shadow-sm hover:text-forest-900 tap"
        >
          <ArrowRight size={15} className="rotate-90" />
        </button>
      </div>

      {/* Date */}
      <div className="mt-5">
        <p className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-variant">
          <Calendar size={14} /> Date
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((d) => (
            <button
              key={d.iso}
              onClick={() => setDate(d.iso)}
              className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl border text-[12px] font-bold tap ${
                date === d.iso ? 'border-forest-900 bg-forest-900 text-white' : 'border-line bg-white text-variant hover:border-forest-600'
              }`}
              aria-pressed={date === d.iso}
            >
              <span className="text-[10px] font-extrabold uppercase opacity-70">{d.label.slice(0, 3)}</span>
              <span className="text-[15px]">{isoToDate(d.iso).getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="mt-5">
        <p className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-variant">
          <Clock size={14} /> Time
        </p>
        <div className="flex flex-wrap gap-2">
          {TIME_PRESETS.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={`rounded-xl border px-3.5 py-2.5 text-[13px] font-bold tap ${
                time === t ? 'border-forest-900 bg-forest-900 text-white' : 'border-line bg-white text-variant hover:border-forest-600'
              }`}
              aria-pressed={time === t}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-[13px] font-extrabold text-variant">Trip type</p>
        <Segmented
          value={type}
          onChange={setType}
          options={[
            { value: 'oneoff', label: 'One-off' },
            { value: 'recurring', label: 'Recurring' },
          ]}
        />
      </div>
      {type === 'recurring' && (
        <p className="mt-2 rounded-xl bg-lime-50 px-3 py-2 text-[12.5px] font-semibold text-lime-700">
          After booking, we'll save this corridor so you can rebook it in one tap.
        </p>
      )}

      <Button block className="mt-7" onClick={search}>
        Find available trips <ArrowRight size={16} />
      </Button>

      <HubPicker
        open={picker !== null}
        role={picker}
        currentId={picker === 'from' ? fromId : toId}
        onSelect={(id) => {
          if (picker === 'from') setFromId(id);
          else setToId(id);
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
    </Page>
  );
}

/** Hub picker — approved hubs are first-class UI. */
function HubPicker({
  open,
  role,
  currentId,
  onSelect,
  onClose,
}: {
  open: boolean;
  role: 'from' | 'to' | null;
  currentId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const hubs = useComuta((s) => s.hubs);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(currentId);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hubs;
    return hubs.filter((h) => h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q) || h.city.toLowerCase().includes(q));
  }, [query, hubs]);

  const selected = hubs.find((h) => h.id === selectedId) ?? hubs[0];

  return (
    <Sheet open={open} onClose={onClose} title={role === 'from' ? 'Choose a pickup hub' : 'Choose a destination hub'}>
      <div className="relative">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
        <Field
          placeholder="Search approved hubs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          aria-label="Search hubs"
        />
      </div>

      <div className="mt-4 space-y-1">
        {results.map((h) => {
          const distance = role === 'from' && selected ? hubDistanceKm(h, selected) : selected && role === 'to' ? hubDistanceKm(h, selected) : 0;
          return (
            <button
              key={h.id}
              onClick={() => setSelectedId(h.id)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left tap ${selectedId === h.id ? 'bg-forest-50 ring-1 ring-forest-700' : 'hover:bg-surface-2'}`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${role === 'from' ? 'bg-forest-900' : 'bg-lime-500'}`}>
                <MapPin size={15} className={role === 'from' ? 'text-white' : 'text-forest-950'} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-extrabold text-onsurface">{h.name}</span>
                <span className="block text-[12px] font-semibold text-variant">
                  {h.area}, {h.city} · {distance > 0 ? `${distance.toFixed(1)} km away` : 'Main pickup area'}
                </span>
              </span>
              {selectedId === h.id && <span className="h-2.5 w-2.5 rounded-full bg-lime-500" />}
            </button>
          );
        })}
        {results.length === 0 && <p className="py-6 text-center text-[13px] text-faint">No hubs match “{query}”.</p>}
      </div>

      {/* mini map + safety */}
      <div className="mt-4">
        <ComutaMap from={selected} to={role === 'from' ? selected : selected} height={130} label={false} className="rounded-xl" />
        <p className="mt-2 flex items-start gap-2 rounded-xl bg-forest-50 px-3 py-2.5 text-[12.5px] font-semibold text-forest-800">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-forest-900">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
          </span>
          {selected.safetyNote}
        </p>
      </div>

      <Button block className="mt-4" onClick={() => onSelect(selectedId)}>
        Select {selected.name}
      </Button>
    </Sheet>
  );
}
