import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Logo } from '../brand/Logo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** PWA install banner  -  shown only when the browser offers installation. */
export function InstallPrompt({ compact = false }: { compact?: boolean }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!deferred || dismissed) return null;

  const install = async () => {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') setDeferred(null);
  };

  if (compact) {
    return (
      <div className="fixed inset-x-3 bottom-24 z-40 mx-auto max-w-md rounded-2xl border border-line bg-white p-4 shadow-lift">
        <div className="flex items-center gap-3">
          <Logo size={30} wordmark={false} />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-extrabold text-onsurface">Install COMUTA</p>
            <p className="text-[11.5px] text-variant">Keep your commute one tap away.</p>
          </div>
          <Button size="sm" onClick={install}>
            Install app
          </Button>
          <button onClick={() => setDismissed(true)} aria-label="Not now" className="tap grid h-8 w-8 place-items-center rounded-full text-faint hover:bg-surface-2">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-5 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-forest-900 p-4 text-white shadow-lift">
      <Logo inverse size={34} wordmark={false} />
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-extrabold">Install COMUTA</p>
        <p className="text-[11.5px] text-white/60">Keep your commute one tap away.</p>
      </div>
      <Button size="sm" variant="lime" onClick={install}>
        Install app
      </Button>
      <button onClick={() => setDismissed(true)} aria-label="Not now" className="tap grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10">
        <X size={16} />
      </button>
    </div>
  );
}
