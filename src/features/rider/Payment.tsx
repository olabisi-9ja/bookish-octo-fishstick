import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, Wallet } from 'lucide-react';
import { Page, Skeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Inputs';
import { tripService, type TripWithMeta } from '../../services/tripService';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { useComuta } from '../../store';
import { naira } from '../../utils/format';
import { DURATION } from '../../constants';

type Phase = 'method' | 'processing' | 'success' | 'failed';

export function Payment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const hubs = useComuta((s) => s.hubs);
  const seats = location.state?.seats ?? 1;
  const [trip, setTrip] = useState<TripWithMeta | null>(null);
  const [phase, setPhase] = useState<Phase>('method');
  const [cardNumber, setCardNumber] = useState('4084 4084 4084 4084');
  const [expiry, setExpiry] = useState('09/29');
  const [cvv, setCvv] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (id) tripService.getTrip(id).then(setTrip);
  }, [id]);

  useEffect(() => {
    if (phase === 'processing' && id && session) {
      (async () => {
        const total = (trip?.pricePerSeat ?? 1500) * seats;
        const res = await bookingService.createBooking({ riderId: session.userId, tripId: id, seats, amount: total });
        if (!res.ok || !res.booking) {
          setPhase('failed');
          return;
        }
        setBookingId(res.booking.id);
        const pay = await paymentService.pay({ bookingId: res.booking.id, riderId: session.userId, amount: res.booking.total, method: 'Paystack' });
        if (!pay.ok) {
          setPhase('failed');
          return;
        }
        setPhase('success');
        setTimeout(() => navigate(`/app/rider/confirmation/${id}?booking=${res.booking!.id}`, { replace: true }), 900);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, id, session]);

  if (!trip) {
    return (
      <Page>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-64 w-full" />
      </Page>
    );
  }

  const from = hubs.find((h) => h.id === trip.fromId);
  const to = hubs.find((h) => h.id === trip.toId);
  const total = trip.pricePerSeat * seats;

  if (phase === 'processing' || phase === 'success') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-8">
        {phase === 'processing' ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
              className="grid h-16 w-16 place-items-center rounded-full border-4 border-surface-2 border-t-forest-700"
            />
            <h1 className="mt-6 text-center text-[20px] font-extrabold tracking-tight text-onsurface">Processing payment…</h1>
            <p className="mt-2 text-center text-[13.5px] text-variant">Securing your seat on this commute.</p>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="text-center"
          >
            <CheckCircle2 size={64} className="mx-auto text-forest-700" />
            <h1 className="mt-5 text-[22px] font-extrabold tracking-tight text-onsurface">Payment successful</h1>
            <p className="mt-2 text-[14px] text-variant">{naira(total)} paid · your seat is secured.</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Payment</h1>

      <div className="mt-4 rounded-2xl bg-forest-900 p-5 text-white shadow-lift">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-lime-500">Total due</p>
        <p className="mt-1 text-[32px] font-extrabold tracking-tight">{naira(total)}</p>
        <p className="mt-1 text-[12.5px] font-semibold text-white/60">
          {seats} seat{seats > 1 ? 's' : ''} · {from?.name.replace(' Hub', '')} → {to?.name.replace(' Hub', '')} · {trip.departureTime}
        </p>
      </div>

      {phase === 'failed' && (
        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-[14px] font-extrabold text-red-700">Payment didn't go through.</p>
          <p className="mt-1 text-[13px] text-red-600/80">Your card wasn't charged. Please try again.</p>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[14px] font-extrabold text-onsurface">
            <Wallet size={17} className="text-forest-700" /> Payment method
          </p>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-extrabold text-variant">Paystack</span>
        </div>
        <p className="mt-2 text-[12px] font-semibold text-faint">
          Local mock checkout for this prototype — no real charge is made.
        </p>
      </div>

      <div className="mt-3 space-y-3 rounded-2xl border border-line bg-white p-4 shadow-soft">
        <p className="flex items-center gap-2 text-[13px] font-extrabold text-variant">
          <CreditCard size={15} /> Card details
        </p>
        <Field label="Card number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} inputMode="numeric" placeholder="0000 0000 0000 0000" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
          <Field label="CVV" type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="•••" inputMode="numeric" maxLength={4} />
        </div>
        <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-faint">
          <Lock size={12} /> Secured with 3-D Secure · PCI-DSS compliant (mock)
        </p>
      </div>

      <Button block className="mt-5" onClick={() => setPhase('processing')} disabled={cvv.length < 3}>
        Pay {naira(total)}
      </Button>
    </Page>
  );
}
