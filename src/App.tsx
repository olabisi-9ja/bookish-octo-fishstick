import { useEffect, useState } from 'react';
import AuthApp from './AuthApp';
import Landing from './Landing';
import MarketingPage from './MarketingPage';
import OpsDashboard from './OpsDashboard';
import ProductApp from './product/ProductApp';
import { PlatformProvider, usePlatform } from './platform';

const marketingPages = new Set(['/how-it-works', '/safety', '/communities', '/drivers', '/about', '/help', '/privacy', '/terms']);

function Shell() {
  const [path, setPath] = useState(window.location.pathname);
  const { state } = usePlatform();
  const session = state.session;

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

  if (path.startsWith('/app')) {
    if (!session || !session.onboarded) return <AuthApp onEnter={() => navigate('/app/rider/home')} />;
    return <ProductApp path={path} onNavigate={navigate} onExit={() => navigate('/')} onOps={() => navigate('/ops/control-centre')} />;
  }
  if (path.startsWith('/ops')) {
    return <OpsDashboard path={path} onNavigate={navigate} onExit={() => navigate('/')} onApp={() => navigate(session ? '/app/rider/home' : '/app')} />;
  }
  if (marketingPages.has(path)) {
    return <MarketingPage path={path} onNavigate={navigate} onOpenApp={() => navigate(session ? '/app/rider/home' : '/app')} onOpenOps={() => navigate('/ops/control-centre')} />;
  }
  return <Landing onNavigate={navigate} onOpenApp={() => navigate(session ? '/app/rider/home' : '/app')} onOpenOps={() => navigate('/ops/control-centre')} />;
}

export default function App() {
  return (
    <PlatformProvider>
      <Shell />
    </PlatformProvider>
  );
}
