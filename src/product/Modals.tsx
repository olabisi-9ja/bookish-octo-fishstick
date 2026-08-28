import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRight, BadgeCheck, CalendarDays, CarFront, Check, CheckCircle2, ChevronDown,
  ChevronLeft, Clock3, Coins, CreditCard, Headphones, LocateFixed, MapPin, Phone, Plus, Repeat2,
  Search, Shield, ShieldCheck, Star, User,
} from 'lucide-react';
import { Avatar, Modal, Stepper } from '../components/UI';
import {
  formatNaira, placeById, quoteRoute, searchPlaces, usePlatform, type Place, type RideCard,
} from '../platform';
import { MapArtwork, MatchMeter } from './shared';

function PlaceField({ label, value, onChange, tone }: { label: string; value: string; onChange: (id: string) => void; tone: 'start' | 'end' }) {
  const selected = placeById(value);
  const [query, setQuery] = useState(selected.name);
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => searchPlaces(query), [query]);
  useEffect(() => setQuery(placeById(value).name), [value]);
  return (
    <label className="place-field">
      <span>{label}</span>
      <div>
        <i className={`dot ${tone}`} />
        <input value={query} onFocus={() => setOpen(true)} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} />
        {tone === 'start' ? <LocateFixed /> : <MapPin />}
      </div>
      {open && (
        <ul className="place-menu">
          {hits.slice(0, 6).map((place) => (
            <li key={place.id}>
              <button type="button" onClick={() => { onChange(place.id); setQuery(place.name); setOpen(false); }}>
                <strong>{place.name}</strong>
                <small>{place.area}, {place.city}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}

export function FindRideModal({ open, onClose, onResults }: { open: boolean; onClose: () => void; onResults: () => void }) {
  const { state, setSearch } = usePlatform();
  const [fromId, setFromId] = useState(state.search.fromId);
  const [toId, setToId] = useState(state.search.toId);
  const [time, setTime] = useState(state.search.time);
  const [recurring, setRecurring] = useState(state.search.recurring);
  const quote = quoteRoute(placeById(fromId), placeById(toId));
  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="flow-modal-head">
        <span className="flow-icon"><Search /></span>
        <div>
          <span>FIND A RIDE</span>
          <h2>Where are you headed?</h2>
          <p>We'll compare route overlap, timing and trust to find your best matches.</p>
        </div>
      </div>
      <div className="flow-route-fields">
        <PlaceField label="LEAVING FROM" value={fromId} onChange={setFromId} tone="start" />
        <em />
        <PlaceField label="GOING TO" value={toId} onChange={setToId} tone="end" />
      </div>
      <div className="modal-form-grid">
        <label><span>DATE</span><div className="input-shell"><CalendarDays /><input defaultValue="Tomorrow" /><ChevronDown /></div></label>
        <label><span>DEPARTURE WINDOW</span><div className="input-shell"><Clock3 /><input value={time} onChange={(e) => setTime(e.target.value)} /><ChevronDown /></div></label>
        <label><span>PASSENGERS</span><div className="input-shell"><User /><input defaultValue="1 passenger" /><ChevronDown /></div></label>
      </div>
      <p className="quote-hint">Recommended seat contribution for {quote.distanceKm} km · {quote.durationMin} min is {formatNaira(quote.seat)}.</p>
      <button className={`recurring-toggle ${recurring ? 'on' : ''}`} onClick={() => setRecurring(!recurring)}>
        <span><Repeat2 /><div><strong>Make this a recurring commute</strong><small>Every Monday to Friday</small></div></span>
        <i><em /></i>
      </button>
      <div className="flow-modal-foot">
        <span><ShieldCheck />Only verified people appear first in results</span>
        <button className="btn btn-primary" onClick={() => { setSearch({ fromId, toId, time, recurring }); onResults(); }}>Find matching rides <ArrowRight /></button>
      </div>
    </Modal>
  );
}

export function OfferRideModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const { publishRide } = usePlatform();
  const [step, setStep] = useState(1);
  const [fromId, setFromId] = useState('vi');
  const [toId, setToId] = useState('ajah');
  const [time, setTime] = useState('5:30 PM');
  const [seats, setSeats] = useState(3);
  const [recurring, setRecurring] = useState(true);
  const quote = quoteRoute(placeById(fromId), placeById(toId));
  const [price, setPrice] = useState(quote.seat);
  const close = () => { setStep(1); onClose(); };
  return (
    <Modal open={open} onClose={close} wide>
      <div className="flow-modal-head">
        <span className="flow-icon"><CarFront /></span>
        <div>
          <span>OFFER A RIDE · STEP {step} OF 3</span>
          <h2>{step === 1 ? 'Share where you’re going' : step === 2 ? 'Set your schedule' : 'Seats and contribution'}</h2>
          <p>{step === 1 ? 'Your route stays private until a passenger is confirmed.' : step === 2 ? 'Create a single journey or make it your regular route.' : 'We recommend a fair contribution based on route cost.'}</p>
        </div>
      </div>
      <Stepper active={step} total={3} />
      {step === 1 && (
        <div className="flow-route-fields offer-fields">
          <PlaceField label="STARTING FROM" value={fromId} onChange={setFromId} tone="start" />
          <em />
          <PlaceField label="GOING TO" value={toId} onChange={setToId} tone="end" />
          <div className="route-preview-mini"><MapArtwork /><span>{quote.durationMin} min · {quote.distanceKm} km</span></div>
        </div>
      )}
      {step === 2 && (
        <div className="schedule-form">
          <div className="frequency">
            <button className={!recurring ? 'active' : ''} onClick={() => setRecurring(false)}>One time</button>
            <button className={recurring ? 'active' : ''} onClick={() => setRecurring(true)}><Repeat2 />Recurring</button>
          </div>
          <label><span>TRAVEL DAYS</span><div className="day-pills">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <button className={i < 5 ? 'active' : ''} key={i}>{d}</button>)}</div></label>
          <div className="modal-form-grid two">
            <label><span>DEPARTURE TIME</span><div className="input-shell"><Clock3 /><input value={time} onChange={(e) => setTime(e.target.value)} /></div></label>
            <label><span>STARTING</span><div className="input-shell"><CalendarDays /><input defaultValue="Tomorrow" /></div></label>
          </div>
          <label className="flexible-check"><i><Check /></i><span><strong>I'm flexible by 15 minutes</strong><small>More riders can match with your route</small></span></label>
        </div>
      )}
      {step === 3 && (
        <div className="seat-price-form">
          <div>
            <span>AVAILABLE SEATS</span>
            <div className="counter">
              <button onClick={() => setSeats(Math.max(1, seats - 1))}>−</button>
              <strong>{seats}</strong>
              <button onClick={() => setSeats(Math.min(4, seats + 1))}>+</button>
            </div>
            <small>Your vehicle is approved for 4 passengers.</small>
          </div>
          <div>
            <span>CONTRIBUTION PER SEAT</span>
            <div className="price-input"><b>₦</b><input value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} /><span>/ seat</span></div>
            <small className="recommended"><CheckCircle2 />Recommended range: {formatNaira(quote.band.low)} to {formatNaira(quote.band.high)}</small>
          </div>
          <div className="earning-estimate">
            <span><Coins /></span>
            <div>
              <small>ESTIMATED WEEKLY CONTRIBUTION</small>
              <strong>{formatNaira(price * seats * (recurring ? 5 : 1))}</strong>
              <p>Before Comuta's service fee · if all seats are filled</p>
            </div>
          </div>
        </div>
      )}
      <div className="flow-modal-foot">
        <button className="text-button" onClick={() => step === 1 ? close() : setStep(step - 1)}><ChevronLeft /> {step === 1 ? 'Cancel' : 'Back'}</button>
        <button className="btn btn-primary" onClick={() => {
          if (step < 3) {
            if (step === 1) setPrice(quote.seat);
            setStep(step + 1);
            return;
          }
          publishRide({ fromId, toId, pickupId: fromId, dropoffId: toId, time, seats, price, recurring, days: [1, 2, 3, 4, 5], when: 'tomorrow' });
          setStep(1);
          onDone();
        }}>{step < 3 ? 'Continue' : 'Publish recurring ride'} <ArrowRight /></button>
      </div>
    </Modal>
  );
}

export function RideBookingModal({ ride, step, setStep, onClose, onDone, notify }: { ride: RideCard | null; step: number; setStep: (n: number) => void; onClose: () => void; onDone: () => void; notify: (s: string) => void }) {
  const { requestSeat, payBooking, riderBookings, state } = usePlatform();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const booking = state.bookings.find((item) => item.id === bookingId) ?? riderBookings.find((item) => item.rideId === ride?.id && item.status !== 'cancelled' && item.status !== 'declined');
  if (!ride) return null;

  const request = () => {
    const result = requestSeat(ride.id);
    if (!result.ok && !result.booking) {
      notify(result.message);
      return;
    }
    setBookingId(result.booking?.id ?? null);
    setStep(2);
  };

  const pay = () => {
    const id = booking?.id;
    if (!id) {
      const created = requestSeat(ride.id);
      if (!created.booking) return notify(created.message);
      const paid = payBooking(created.booking.id);
      notify(paid.message);
      setStep(3);
      return;
    }
    const paid = payBooking(id);
    notify(paid.message);
    setStep(3);
  };

  return (
    <Modal open={!!ride} onClose={onClose} wide>
      {step === 1 && (
        <>
          <div className="ride-modal-head">
            <div>
              <span>{ride.match}% ROUTE MATCH</span>
              <h2>{ride.from} to {ride.to}</h2>
              <p>{ride.time} · {ride.eta} · {ride.distanceKm} km</p>
            </div>
            <div className="match-ring"><strong>{ride.match}</strong><small>MATCH</small></div>
          </div>
          <div className="ride-modal-map">
            <MapArtwork />
            <div className="rm-start">A</div>
            <div className="rm-end">VI</div>
            <span>+ 5 min driver detour</span>
          </div>
          <div className="ride-modal-grid">
            <section>
              <h4>YOUR DRIVER</h4>
              <div className="ride-modal-driver">
                <Avatar initials={ride.initials} color={ride.avatarColor} size={60} photo={ride.photo} />
                <div>
                  <h3>{ride.driver}<BadgeCheck fill="currentColor" /></h3>
                  <p><Star fill="currentColor" /> {ride.rating} · {ride.trips} completed trips</p>
                  <span>{ride.community}</span>
                </div>
              </div>
              <div className="verification-list">
                <span><CheckCircle2 />Identity verified</span>
                <span><CheckCircle2 />Driver licence</span>
                <span><CheckCircle2 />Vehicle verified</span>
                <span><CheckCircle2 />Phone verified</span>
              </div>
            </section>
            <section>
              <h4>WHY THIS MATCH</h4>
              <MatchMeter ride={ride} />
              <div className="vehicle-visual" style={{ marginTop: 10 }}>
                <CarFront />
                <div><strong>{ride.car}</strong><span>Plate · {ride.plate}</span></div>
                <b>{ride.seats} seats</b>
              </div>
            </section>
          </div>
          <div className="ride-modal-route">
            <div><i /><span><small>PICKUP · {ride.time}</small><strong>{ride.pickup}</strong><em>Exact location is shared after confirmation</em></span></div>
            <b />
            <div><i /><span><small>ARRIVAL</small><strong>{ride.dropoff}</strong><em>Short walk to your destination</em></span></div>
          </div>
          <div className="booking-bar">
            <div>
              <small>ONE SEAT</small>
              <strong>{formatNaira(ride.price)}</strong>
              <span>Secure payment · free cancellation for 10 min</span>
            </div>
            <button className="btn btn-primary" onClick={request}>Request this seat <ArrowRight /></button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="flow-modal-head">
            <span className="flow-icon"><CreditCard /></span>
            <div>
              <span>SECURE CHECKOUT</span>
              <h2>Confirm and pay</h2>
              <p>Your payment is held until the trip is completed. Simulated drivers accept automatically.</p>
            </div>
          </div>
          <div className="checkout-layout">
            <section>
              <div className="checkout-trip">
                <div>
                  <span>{ride.time}</span>
                  <strong>{ride.from} <ArrowRight /> {ride.to}</strong>
                  <small>1 seat with {ride.driver}</small>
                </div>
                <Avatar initials={ride.initials} color={ride.avatarColor} photo={ride.photo} />
              </div>
              <h4>PAYMENT METHOD</h4>
              <button className="payment-method active">
                <span className="visa-box">VISA</span>
                <div><strong>Visa ending in 2048</strong><small>Expires 09/28</small></div>
                <CheckCircle2 fill="currentColor" />
              </button>
              <button className="payment-method">
                <span className="bank-box">▣</span>
                <div><strong>Pay with bank transfer</strong><small>Instant secure transfer</small></div>
              </button>
              <button className="add-payment"><Plus />Add another payment method</button>
            </section>
            <aside className="order-summary">
              <h3>Payment summary</h3>
              <div><span>Seat contribution</span><strong>{formatNaira(ride.price)}</strong></div>
              <div><span>Comuta protection fee</span><strong>₦120</strong></div>
              <div className="promo"><span>Promo credit</span><strong>−₦120</strong></div>
              <hr />
              <div className="total"><span>Total</span><strong>{formatNaira(ride.price)}</strong></div>
              <p><ShieldCheck />Payment is encrypted and held securely until your trip is completed.</p>
            </aside>
          </div>
          <div className="flow-modal-foot">
            <button className="text-button" onClick={() => setStep(1)}><ChevronLeft />Back</button>
            <button className="btn btn-primary" onClick={pay}><ShieldCheck />Pay {formatNaira(ride.price)}</button>
          </div>
        </>
      )}
      {step === 3 && (
        <div className="booking-success">
          <span className="success-ring"><Check /></span>
          <span className="success-label">SEAT CONFIRMED</span>
          <h2>You're riding with {ride.driver.split(' ')[0]}!</h2>
          <p>We'll remind you when it's time to leave. Your ride PIN is {booking?.pin ?? 'sent after acceptance'}.</p>
          <div className="success-ticket">
            <div>
              <span><small>FROM</small><strong>{ride.from}</strong></span>
              <ArrowRight />
              <span><small>TO</small><strong>{ride.to}</strong></span>
            </div>
            <div>
              <span><CalendarDays />{ride.time}</span>
              <span><Clock3 />{ride.eta}</span>
              <span><User />1 seat</span>
            </div>
            <div>
              <Avatar initials={ride.initials} color={ride.avatarColor} photo={ride.photo} />
              <span><strong>{ride.driver}</strong><small>{ride.car}</small></span>
              <b>{ride.plate}</b>
            </div>
          </div>
          <div className="success-actions">
            <button className="btn btn-outline"><CalendarDays />Add to calendar</button>
            <button className="btn btn-primary" onClick={onDone}>View my trip <ArrowRight /></button>
          </div>
          <small className="success-note">Booking ID · {booking?.id ?? ride.id} · Payment held until completion</small>
        </div>
      )}
    </Modal>
  );
}

export function SosModal({ open, onClose, tripId }: { open: boolean; onClose: () => void; tripId?: string }) {
  const { triggerSos } = usePlatform();
  const [armed, setArmed] = useState(false);
  return (
    <Modal open={open} onClose={() => { setArmed(false); onClose(); }}>
      <div className="sos-modal">
        <span className="sos-shield"><Shield /></span>
        <span>COMUTA SAFETY</span>
        <h2>{armed ? 'Help request ready' : 'Do you need help?'}</h2>
        <p>{armed ? 'Your live location and trip details are ready to send to Comuta Safety and your emergency contact.' : 'Choose an option below. Emergency actions share your live trip context with our safety team.'}</p>
        {armed ? (
          <>
            <div className="sos-location"><LocateFixed /><span><strong>Live location captured</strong><small>Updated just now · {tripId ?? 'No active trip'}</small></span><CheckCircle2 /></div>
            <button className="btn btn-danger btn-block" onClick={() => { if (tripId) triggerSos(tripId, 'sos', 'Emergency services requested'); setArmed(false); onClose(); }}><Phone />Call emergency services</button>
            <button className="btn btn-dark btn-block" onClick={() => { if (tripId) triggerSos(tripId, 'unsafe', 'Alerted Comuta Safety'); setArmed(false); onClose(); }}><Headphones />Alert Comuta Safety</button>
          </>
        ) : (
          <div className="sos-options">
            <button onClick={() => setArmed(true)}><AlertTriangle /><span><strong>I feel unsafe</strong><small>Alert safety operations now</small></span></button>
            <button onClick={() => { if (tripId) triggerSos(tripId, 'sos', 'Direct emergency call'); onClose(); }}><Phone /><span><strong>Call emergency services</strong><small>Use your phone to place the call</small></span></button>
            <button onClick={() => { if (tripId) triggerSos(tripId, 'report', 'Trip issue reported'); onClose(); }}><Headphones /><span><strong>Report a trip issue</strong><small>Support for non urgent issues</small></span></button>
          </div>
        )}
        <button className="sos-cancel" onClick={() => { setArmed(false); onClose(); }}>I'm okay, close safety centre</button>
      </div>
    </Modal>
  );
}

export function PinModal({ tripId, open, onClose, notify }: { tripId: string | null; open: boolean; onClose: () => void; notify: (s: string) => void }) {
  const { state, verifyPin, completeTrip } = usePlatform();
  const [pin, setPin] = useState('');
  const trip = state.trips.find((item) => item.id === tripId);
  if (!open || !trip) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="pin-modal">
        <span className="auth-step">START TRIP</span>
        <h2>Enter the rider's PIN</h2>
        <p>Ask your passenger for the 4-digit code shown in their trip screen. Demo PIN is <strong>{trip.pin}</strong>.</p>
        <input className="pin-input" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="••••" />
        <button className="btn btn-primary btn-block" onClick={() => {
          const result = verifyPin(trip.id, pin);
          notify(result.message);
          if (result.ok) onClose();
        }}>Confirm PIN and start</button>
        {trip.status === 'in_progress' && (
          <button className="btn btn-outline btn-block" onClick={() => { completeTrip(trip.id); notify('Trip completed. Earnings settled.'); onClose(); }}>Complete trip</button>
        )}
      </div>
    </Modal>
  );
}

export function RatingModal({ tripId, open, onClose, notify }: { tripId: string | null; open: boolean; onClose: () => void; notify: (s: string) => void }) {
  const { rateTrip } = usePlatform();
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(['Punctual']);
  const options = ['Punctual', 'Clean', 'Safe driving', 'Good conversation', 'Quiet ride'];
  if (!open || !tripId) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="pin-modal">
        <span className="auth-step">HOW WAS THE JOURNEY?</span>
        <h2>Rate this trip</h2>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={n <= stars ? 'on' : ''} onClick={() => setStars(n)}><Star fill="currentColor" /></button>
          ))}
        </div>
        <div className="tag-row">
          {options.map((tag) => (
            <button key={tag} className={tags.includes(tag) ? 'on' : ''} onClick={() => setTags(tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag])}>{tag}</button>
          ))}
        </div>
        <button className="btn btn-primary btn-block" onClick={() => { rateTrip(tripId, stars, tags, ''); notify('Thanks for the rating'); onClose(); }}>Submit rating</button>
      </div>
    </Modal>
  );
}

export function ReceiptModal({ bookingId, open, onClose }: { bookingId: string | null; open: boolean; onClose: () => void }) {
  const { state, rideById, memberById } = usePlatform();
  const booking = state.bookings.find((item) => item.id === bookingId);
  const ride = booking ? rideById(booking.rideId) : undefined;
  const driver = ride ? memberById(ride.driverId) : undefined;
  if (!open || !booking || !ride || !driver) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="pin-modal">
        <span className="auth-step">RECEIPT · {booking.id}</span>
        <h2>{formatNaira(booking.total)}</h2>
        <p>{fullNameSafe(driver)} · {ride.id}</p>
        <div className="receipt-rows">
          <div><span>Seat contribution</span><strong>{formatNaira(booking.amount)}</strong></div>
          <div><span>Protection fee</span><strong>{formatNaira(booking.protectionFee)}</strong></div>
          <div><span>Promo</span><strong>−{formatNaira(booking.discount)}</strong></div>
          <div className="total"><span>Total paid</span><strong>{formatNaira(booking.total)}</strong></div>
        </div>
        <p className="success-note">Held until completion · {booking.status}</p>
      </div>
    </Modal>
  );
}

function fullNameSafe(member: { firstName: string; lastName: string }) {
  return `${member.firstName} ${member.lastName}`;
}

export function DriverOnboardModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const { completeDriverOnboarding } = usePlatform();
  const [licence, setLicence] = useState('');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Corolla');
  const [color, setColor] = useState('Silver');
  const [plate, setPlate] = useState('');
  const [bank, setBank] = useState('Guaranty Trust Bank');
  const [last4, setLast4] = useState('');
  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="flow-modal-head">
        <span className="flow-icon"><CarFront /></span>
        <div>
          <span>DRIVER ONBOARDING</span>
          <h2>Verify your licence and vehicle</h2>
          <p>Admin review is simulated. In production this queue lives in operations.</p>
        </div>
      </div>
      <div className="onboard-grid">
        <label className="auth-label">Driver licence number<input value={licence} onChange={(e) => setLicence(e.target.value)} placeholder="LAG-20491832" /></label>
        <label className="auth-label">Plate number<input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="APP 412 GH" /></label>
        <label className="auth-label">Make<input value={make} onChange={(e) => setMake(e.target.value)} /></label>
        <label className="auth-label">Model<input value={model} onChange={(e) => setModel(e.target.value)} /></label>
        <label className="auth-label">Colour<input value={color} onChange={(e) => setColor(e.target.value)} /></label>
        <label className="auth-label">Bank<input value={bank} onChange={(e) => setBank(e.target.value)} /></label>
        <label className="auth-label">Account last 4<input value={last4} onChange={(e) => setLast4(e.target.value)} placeholder="0294" /></label>
      </div>
      <div className="flow-modal-foot">
        <button className="text-button" onClick={onClose}>Not now</button>
        <button className="btn btn-primary" disabled={!licence || !plate || last4.length < 4} onClick={() => {
          completeDriverOnboarding({ licenceNumber: licence, make, model, color, plate, bankName: bank, bankLast4: last4 });
          onDone();
        }}>Submit for verification</button>
      </div>
    </Modal>
  );
}

export type { Place };
