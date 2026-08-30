import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CalendarPlus, Car as CarIcon, CircleDollarSign, Users } from 'lucide-react';
import { Page, StatusChip, Skeleton, Avatar } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { driverService } from '../../services/driverService';
import { useComuta } from '../../store';
import { naira, greetingFor } from '../../utils/format';
import { dayLabel } from '../../utils/dates';
import { DURATION, EASE } from '../../constants';
import type { Trip } from '../../types';

export function DriverHome() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const user = useComuta((s) => s.users.find((u) => u.id === s.session?.userId));
  const hubs = useComuta((s) => s.hubs);
  const profile = useComuta((s) => (session ? s.driverProfiles[session.userId] : undefined));
  const [next, setNext] = useState<Trip | null>(null);
  const trips = useComuta((s) => s.trips);

  useEffect(() => {
    if (session) {
      const t = driverService.nextCommitment(session.userId);
      setNext(t ?? null);
    }
  }, [session, trips]);

  const passengers = next ? driverService.passengers(next.id) : [];
  const from = hubs.find((h) => h.id === next?.fromId);
  const to = hubs.find((h) => h.id === next?.toId);

  return (
    <Page>
      <div>
        <p className="text-[13px] font-bold text-variant">{greetingFor()}</p>
        <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </h1>
      </div>

      {/* Next commute */}
      {next ? (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.standard, ease: EASE }}
          className="mt-5 overflow-hidden rounded-3xl bg-forest-900 p-5 text-white shadow-lift"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime-500">Your next commute</p>
            <StatusChip
              label={next.driverConfirmed ? 'Confirmed' : next.status === 'at_risk' ? 'Released' : 'Confirm by 11:00 PM'}
              tone={next.driverConfirmed ? 'lime' : next.status === 'at_risk' ? 'red' : 'amber'}
              dot
            />
          </div>
          <h2 className="mt-3 text-[22px] font-extrabold leading-tight tracking-tight">
            {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')}
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-white/70">
            {dayLabel(next.date)} · {next.departureTime}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-lime-500">
                <Users size={12} /> Passengers
              </p>
              <p className="mt-1 text-[18px] font-extrabold">{passengers.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Seats left</p>
              <p className="mt-1 text-[18px] font-extrabold">{next.seatsLeft}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Recovery</p>
              <p className="mt-1 text-[15px] font-extrabold">{naira(next.pricePerSeat * passengers.length)}</p>
            </div>
          </div>

          <Button
            variant="lime"
            className="mt-4 w-full"
            onClick={() => navigate(`/app/driver/trips/${next.id}`)}
          >
            {next.driverConfirmed ? 'Manage trip' : 'Confirm today'}
            <ArrowRight size={16} />
          </Button>
        </motion.section>
      ) : (
        <section className="mt-5 rounded-3xl border border-line bg-white p-5">
          <p className="text-[15px] font-extrabold text-onsurface">No upcoming commutes</p>
          <p className="mt-1 text-[13px] text-variant">Publish a commute and start recovering your travel cost.</p>
          <Button block className="mt-4" onClick={() => navigate('/app/driver/routes/new')}>
            Publish a commute
          </Button>
        </section>
      )}

      {/* Primary CTA */}
      <Button block size="lg" className="mt-6 bg-lime-500 text-forest-950 hover:bg-lime-400" onClick={() => navigate('/app/driver/routes/new')}>
        <CalendarPlus size={18} /> Publish a commute
      </Button>

      {/* Cost recovery */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, delay: 0.08, ease: EASE }}
        className="mt-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold tracking-tight text-onsurface">Cost recovery</h2>
          <button onClick={() => navigate('/app/driver/earnings')} className="text-[13px] font-extrabold text-forest-700 tap">
            View earnings
          </button>
        </div>
        <div className="mt-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold text-variant">Recovered this month</p>
              <p className="text-[24px] font-extrabold tracking-tight text-forest-900">
                {naira(profile?.monthlyRecovered ?? 0)}
              </p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100">
              <CircleDollarSign size={22} className="text-lime-700" />
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line-soft pt-3 text-[12.5px] font-semibold text-variant">
            <span>{profile?.monthlyTrips ?? 0} trips shared</span>
            <span className="text-right">{profile?.monthlyPassengers ?? 0} passengers</span>
          </div>
        </div>
      </motion.section>

      {/* Reliability strip */}
      {profile && (
        <button
          onClick={() => navigate('/app/driver/reliability')}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-soft tap"
        >
          <Avatar initials="R" color="#155942" size={40} />
          <div className="flex-1">
            <p className="text-[14px] font-extrabold text-onsurface">Your COMUTA reliability</p>
            <p className="text-[12px] font-semibold text-variant">
              {profile.completionRate}% completion · {profile.onTimeRate}% on time · Excellent standing
            </p>
          </div>
          <span className="text-[22px] font-extrabold tracking-tight text-forest-900">{profile.completionRate}%</span>
          <ArrowRight size={16} className="text-faint" />
        </button>
      )}
    </Page>
  );
}
