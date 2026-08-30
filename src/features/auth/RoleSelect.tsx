import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, User } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Inputs';
import { useComuta } from '../../store';
import { authService } from '../../services/authService';
import { driverService } from '../../services/driverService';

export function RoleSelect() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);

  return (
    <AuthLayout>
      <h1 className="text-[26px] font-extrabold tracking-tight text-onsurface">Want to give rides too?</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-variant">
        You're ready to book rides. You can also share your commute and recover part of your travel cost.
      </p>

      <div className="mt-7 space-y-3">
        <button
          onClick={() => navigate('/app/rider/home')}
          className="flex w-full items-center gap-4 rounded-2xl border border-line bg-white p-4 text-left transition-colors hover:border-forest-600 tap"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-forest-900">
            <User size={22} className="text-white" />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-extrabold text-onsurface">Just riding for now</span>
            <span className="block text-[13px] text-variant">Start booking shared commutes</span>
          </span>
        </button>
        <button
          onClick={() => navigate('/driver/onboarding')}
          className="flex w-full items-center gap-4 rounded-2xl border border-lime-500 bg-lime-50 p-4 text-left transition-colors hover:bg-lime-100 tap"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lime-500">
            <Car size={22} className="text-forest-950" />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-extrabold text-onsurface">I want to drive too</span>
            <span className="block text-[13px] text-variant">Verify your driver account and recover travel costs</span>
          </span>
        </button>
      </div>

      <p className="mt-6 text-center text-[13px] text-faint">You can switch between rider and driver mode any time.</p>
      {session && (
        <Button block variant="ghost" className="mt-2" onClick={() => { authService.switchMode('rider'); navigate('/app/rider/home'); }}>
          Skip for now
        </Button>
      )}
    </AuthLayout>
  );
}

/** Driver onboarding: licence + vehicle, then driver mode is live. */
export function DriverOnboarding() {
  const [licence, setLicence] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!session) return;
    if (!licence.trim() || !make.trim() || !model.trim() || !plate.trim() || !year.trim()) {
      setError('Complete all fields to continue.');
      return;
    }
    setLoading(true);
    const state = useComuta.getState();
    const vehicle = {
      id: `veh_${Math.random().toString(36).slice(2, 6)}`,
      ownerId: session.userId,
      make: make.trim(),
      model: model.trim(),
      color: color.trim() || 'Silver',
      plate: plate.trim().toUpperCase(),
      seats: 4,
      year: Number(year),
    };
    state.addVehicle(vehicle);
    state.setDriverProfile({
      userId: session.userId,
      licenceNumber: licence.trim(),
      vehicleId: vehicle.id,
      completedTrips: 0,
      completionRate: 100,
      onTimeRate: 100,
      lateCancellations: 0,
      noShows: 0,
      monthlyTrips: 0,
      monthlyPassengers: 0,
      monthlyRecovered: 0,
    });
    useComuta.getState().completeDriverOnboarding(session.userId);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    await driverService.publishCommute({
      driverId: session.userId,
      fromId: 'hub_ikorodu',
      toId: 'hub_vi',
      pickupHubId: 'hub_ikorodu',
      time: '7:00 AM',
      seats: 4,
      pricePerSeat: 1500,
    });
    navigate('/app/driver/home', { replace: true });
  };

  return (
    <AuthLayout>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-forest-700">Driver verification</p>
      <h1 className="mt-2 text-[26px] font-extrabold tracking-tight text-onsurface">Tell us about your vehicle</h1>
      <p className="mt-2 text-[14px] text-variant">Your vehicle will be listed on every commute you publish.</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field name="licence" label="Driver's licence number" placeholder="LAG-XXXXXXXX" value={licence} onChange={(e) => setLicence(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <Field name="make" label="Make" placeholder="Toyota" value={make} onChange={(e) => setMake(e.target.value)} required />
          <Field name="model" label="Model" placeholder="Corolla" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field name="color" label="Colour" placeholder="Silver" value={color} onChange={(e) => setColor(e.target.value)} />
          <Field name="year" label="Year" type="number" placeholder="2019" min={2000} max={2030} value={year} onChange={(e) => setYear(e.target.value)} required />
        </div>
        <Field name="plate" label="Plate number" placeholder="ABC 123 XY" value={plate} onChange={(e) => setPlate(e.target.value)} required autoCapitalize="characters" />
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">{error}</p>}
        <Button block loading={loading}>Verify driver account</Button>
      </form>
    </AuthLayout>
  );
}
