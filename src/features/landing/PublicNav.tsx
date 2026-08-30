/**
 * Sticky nav shared by every public COMUTA page (landing + company pages).
 */
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';

export function PublicNav() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-line-soft bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <button type="button" onClick={() => navigate('/')} aria-label="COMUTA home" className="tap">
          <Logo size={28} />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="tap rounded-xl px-4 py-2 text-[13.5px] font-bold text-forest-900 hover:bg-surface-2"
          >
            Log in
          </button>
          <Button size="md" onClick={() => navigate('/signup')}>
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
}
