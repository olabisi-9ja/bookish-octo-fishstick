import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BadgeCheck, Users } from 'lucide-react';
import type { TripWithMeta } from '../../services/tripService';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { dayLabel } from '../../utils/dates';
import { Avatar, StatusChip, TRIP_STATUS_TONE } from '../../components/ui/Misc';
import { TRIP_STATUS_LABEL } from '../../constants';
import { DURATION } from '../../constants';

/**
 * Trip card — the primary reusable decision component.
 * Hierarchy: time → price → route → driver trust → vehicle → availability → hub.
 */
export function TripCard({ trip, index = 0 }: { trip: TripWithMeta; index?: number }) {
  const navigate = useNavigate();
  const hubs = useComuta((s) => s.hubs);
  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const hub = hubs.find((h) => h.id === trip.pickupHubId);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, delay: Math.min(index * 0.06, 0.4) }}
      onClick={() => navigate(`/app/rider/trip/${trip.id}`)}
      className="w-full rounded-2xl border border-line-soft bg-white p-4 text-left shadow-soft transition-shadow hover:shadow-lift tap"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[17px] font-extrabold tracking-tight text-onsurface">{trip.departureTime}</span>
          <span className="text-[12px] font-semibold text-faint">· {dayLabel(trip.date)}</span>
        </div>
        <span className="text-[16px] font-extrabold tracking-tight text-forest-900">{naira(trip.pricePerSeat)}</span>
      </div>

      <div className="mt-1.5 flex items-center gap-2 text-[14px] font-bold text-onsurface">
        <span>{from?.name.replace(' Hub', '')}</span>
        <span className="flex items-center gap-0.5 text-faint" aria-hidden>
          <span className="h-0.5 w-4 rounded-full bg-line" />
          <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
          <span className="h-0.5 w-4 rounded-full bg-line" />
        </span>
        <span>{to?.name.replace(' Hub', '')}</span>
      </div>

      <div className="mt-3.5 flex items-center gap-3 border-t border-line-soft pt-3.5">
        <Avatar initials={trip.driverInitials} color={trip.avatarColor} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[13.5px] font-extrabold text-onsurface">{trip.driverName}</p>
            <BadgeCheck size={14} className="shrink-0 text-forest-700" aria-label="Verified driver" />
          </div>
          <p className="text-[11.5px] font-semibold text-variant">
            Verified · {trip.completionRate}% completion · {trip.onTimeRate}% on time
          </p>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-faint">
          {trip.vehicle.make} {trip.vehicle.model}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] font-bold text-variant">
          <Users size={13} />
          {trip.seatsLeft} seat{trip.seatsLeft === 1 ? '' : 's'} left
        </span>
        <span className="truncate text-[11.5px] font-semibold text-faint">{hub?.name}</span>
        {trip.status !== 'confirmed' && trip.status !== 'scheduled' && (
          <StatusChip label={TRIP_STATUS_LABEL[trip.status]} tone={TRIP_STATUS_TONE[trip.status]} />
        )}
        <span className="inline-flex items-center gap-1 text-[12.5px] font-extrabold text-forest-900">
          View trip <ArrowRight size={14} />
        </span>
      </div>
    </motion.button>
  );
}
