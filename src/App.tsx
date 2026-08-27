import { useEffect, useState } from 'react';
import {
  CarFront, ExternalLink, Globe, LayoutDashboard, RefreshCw, RotateCcw, ShieldCheck,
  Smartphone, Sparkles, User,
} from 'lucide-react';
import AuthApp from './AuthApp';
import Landing from './Landing';
import MarketingPage from './MarketingPage';
import OpsDashboard from './OpsDashboard';
import ProductApp from './product/ProductApp';
import FigmaSpecViewer from './FigmaSpecViewer';
import { PlatformProvider, usePlatform } from './platform';

const marketingPages = new Set([
  '/how-it-works',
  '/safety',
  '/communities',
  '/drivers',
  '/about',
  '/help',
  '/privacy',
  '/terms',
]);

function Shell() {
  const [path, setPath] = useState(window.location.pathname);
  const [figmaOpen, setFigmaOpen] = useState(false);
  const { state, resetDemo, setRole } = usePlatform();
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

  const isApp = path.startsWith('/app');
  const isOps = path.startsWith('/ops');
  const isWeb = !isApp && !isOps;

  return (
    <div className="comuta-root-environment">
      {/* Global Quick Surface Switcher Header */}
      <aside className="global-surface-switcher-bar">
        <div className="gss-left">
          <span className="gss-brand">COMUTA</span>
          <span className="gss-tagline">“My daily commute is already taken care of”</span>
        </div>

        <nav className="gss-nav">
          <button
            className={`gss-btn ${isApp ? 'active' : ''}`}
            onClick={() => navigate('/app')}
            title="Launch COMUTA Mobile Application with Rider and Driver modes"
          >
            <Smartphone size={14} />
            <span>Mobile App</span>
            <span className="sub-badge">Rider + Driver</span>
          </button>

          <button
            className={`gss-btn ${isOps ? 'active' : ''}`}
            onClick={() => navigate('/ops/overview')}
            title="Launch Operations Dashboard: live corridor monitoring & at-risk recovery"
          >
            <ShieldCheck size={14} />
            <span>Operations Dashboard</span>
            <span className="sub-badge danger">3 At-Risk</span>
          </button>

          <button
            className={`gss-btn ${isWeb ? 'active' : ''}`}
            onClick={() => navigate('/')}
            title="Public Web marketing, driver economics calculator & hub directory"
          >
            <Globe size={14} />
            <span>Public Web</span>
          </button>

          <button
            className="gss-btn figma-spec"
            onClick={() => setFigmaOpen(true)}
            title="Open Figma master build specification, design system foundations & 366-screen taxonomy"
          >
            <span className="f-mark">❖</span>
            <span>Figma Spec</span>
            <span className="sub-badge locked">Locked</span>
          </button>

          <button
            className="gss-btn reset-btn"
            onClick={() => {
              resetDemo();
              navigate('/app');
            }}
            title="Reset simulation state to fresh seed"
          >
            <RotateCcw size={13} />
            <span>Reset State</span>
          </button>
        </nav>
      </aside>

      {/* Surface Render */}
      <div className="surface-viewport">
        {isApp && (
          session ? (
            <ProductApp
              path={path}
              onNavigate={navigate}
              onExit={() => navigate('/')}
              onOps={() => navigate('/ops/overview')}
            />
          ) : (
            <AuthApp onEnter={() => navigate('/app/rider/home')} />
          )
        )}

        {isOps && (
          <OpsDashboard
            path={path}
            onNavigate={navigate}
            onExit={() => navigate('/')}
            onApp={() => navigate('/app')}
          />
        )}

        {isWeb && (
          marketingPages.has(path) ? (
            <MarketingPage
              path={path}
              onNavigate={navigate}
              onOpenApp={() => navigate('/app')}
              onOpenOps={() => navigate('/ops/overview')}
            />
          ) : (
            <Landing
              onNavigate={navigate}
              onOpenApp={() => navigate('/app')}
              onOpenOps={() => navigate('/ops/overview')}
            />
          )
        )}
      </div>

      {/* Figma Build Specification & Design System Inspector Modal */}
      {figmaOpen && (
        <FigmaSpecViewer
          onClose={() => setFigmaOpen(false)}
          onOpenRider={() => {
            setFigmaOpen(false);
            setRole('rider');
            navigate('/app');
          }}
          onOpenDriver={() => {
            setFigmaOpen(false);
            setRole('driver');
            navigate('/app');
          }}
          onOpenOps={() => {
            setFigmaOpen(false);
            navigate('/ops/overview');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <PlatformProvider>
      <Shell />
    </PlatformProvider>
  );
}
