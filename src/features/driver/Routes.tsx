import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Page } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { useComuta } from '../../store';
import { routeService } from '../../services/routeService';

/** Driver's published routes (recurring commutes). */
export function DriverRoutes() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const routes = session ? routeService.myRoutes(session.userId) : [];
  const hubs = useComuta((s) => s.hubs);

  return (
    <Page>
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">My routes</h1>
        <Button size="sm" variant="secondary" onClick={() => navigate('/app/driver/routes/new')}>
          Publish
        </Button>
      </div>
      <p className="mt-1 text-[13.5px] text-variant">Recurring commutes you drive — passengers book seats on each one.</p>

      <div className="mt-4 space-y-3">
        {routes.length === 0 && (
          <div className="rounded-2xl border border-line bg-white px-6 py-10 text-center">
            <p className="text-[15px] font-extrabold text-onsurface">No routes yet</p>
            <p className="mt-1 text-[13px] text-variant">Share your daily commute and start recovering your travel cost.</p>
            <Button block className="mt-4" onClick={() => navigate('/app/driver/routes/new')}>
              Publish a commute
            </Button>
          </div>
        )}
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/app/driver/routes/${r.id}`)}
            className="flex w-full items-center gap-3 rounded-2xl border border-line-soft bg-white p-4 text-left shadow-soft tap"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-extrabold text-onsurface">
                {hubs.find((h) => h.id === r.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === r.toId)?.name.replace(' Hub', '')}
              </p>
              <p className="mt-0.5 text-[12px] font-semibold text-variant">
                {r.days.map((d) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]).join(' · ')} · {r.time} · {r.seats} seats
              </p>
            </div>
            <div className="text-right">
              <p className="text-[14px] font-extrabold text-forest-900">₦{r.pricePerSeat.toLocaleString()} / seat</p>
              <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-extrabold text-forest-700">
                View <ArrowRight size={12} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </Page>
  );
}

/** Driver route detail — actions on a recurring route. */
export function DriverRouteDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const session = useComuta((s) => s.session);
  const route = useComuta((s) => s.routes.find((r) => r.id === id));
  const hubs = useComuta((s) => s.hubs);

  if (!route || route.ownerId !== session?.userId) {
    return (
      <Page>
        <p className="py-10 text-center text-[14px] text-variant">Route not found.</p>
        <Button block variant="secondary" onClick={() => navigate('/app/driver/routes')}>Back to routes</Button>
      </Page>
    );
  }

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="rounded-2xl bg-forest-900 p-5 text-white shadow-lift">
        <p className="text-[19px] font-extrabold tracking-tight">
          {hubs.find((h) => h.id === route.fromId)?.name.replace(' Hub', '')} → {hubs.find((h) => h.id === route.toId)?.name.replace(' Hub', '')}
        </p>
        <p className="mt-1.5 text-[13px] font-semibold text-white/70">
          {route.days.map((d) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]).join(' · ')} · {route.time}
        </p>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Seats</p>
            <p className="text-[16px] font-extrabold">{route.seats}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-lime-500">Price / seat</p>
            <p className="text-[16px] font-extrabold">₦{route.pricePerSeat.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <Button block onClick={() => navigate('/app/driver/routes/new')}>
          Publish next trip on this route
        </Button>
        <Button
          block
          variant="secondary"
          onClick={async () => {
            if (route.paused) await routeService.resumeRoute(route.id);
            else await routeService.pauseRoute(route.id);
            navigate(0);
          }}
        >
          {route.paused ? 'Resume route' : 'Pause route'}
        </Button>
        <Button
          block
          variant="ghost"
          className="text-red-600 hover:bg-red-50"
          onClick={async () => {
            await routeService.cancelRoute(route.id);
            navigate('/app/driver/routes', { replace: true });
          }}
        >
          Cancel route
        </Button>
      </div>
    </Page>
  );
}
