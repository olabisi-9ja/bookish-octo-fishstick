import { useEffect, useState } from 'react';
import Landing from './Landing';
import MarketingPage from './MarketingPage';
import ProductApp from './ProductApp';
import OpsDashboard from './OpsDashboard';

const marketingPages = new Set(['/how-it-works', '/safety', '/communities', '/drivers', '/about', '/help', '/privacy', '/terms']);

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to: string) => {
    if (to !== window.location.pathname) window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (path.startsWith('/app')) return <ProductApp path={path} onNavigate={navigate} onExit={() => navigate('/')} onOps={() => navigate('/ops/control-centre')} />;
  if (path.startsWith('/ops')) return <OpsDashboard path={path} onNavigate={navigate} onExit={() => navigate('/')} onApp={() => navigate('/app/rider/home')} />;
  if (marketingPages.has(path)) return <MarketingPage path={path} onNavigate={navigate} onOpenApp={() => navigate('/app/rider/home')} onOpenOps={() => navigate('/ops/control-centre')} />;
  return <Landing onNavigate={navigate} onOpenApp={() => navigate('/app/rider/home')} onOpenOps={() => navigate('/ops/control-centre')} />;
}
