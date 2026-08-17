import { useEffect, useState } from 'react';
import Landing from './Landing';
import ProductApp from './ProductApp';
import OpsDashboard from './OpsDashboard';

type Route = '/' | '/app' | '/ops';

export default function App() {
  const routeFromPath = (): Route => window.location.pathname.startsWith('/ops')
    ? '/ops'
    : window.location.pathname.startsWith('/app') ? '/app' : '/';
  const [route, setRoute] = useState<Route>(routeFromPath());

  useEffect(() => {
    const onPop = () => setRoute(routeFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to: Route) => {
    window.history.pushState({}, '', to);
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (route === '/app') return <ProductApp onExit={() => navigate('/')} onOps={() => navigate('/ops')} />;
  if (route === '/ops') return <OpsDashboard onExit={() => navigate('/')} onApp={() => navigate('/app')} />;
  return <Landing onOpenApp={() => navigate('/app')} onOpenOps={() => navigate('/ops')} />;
}
