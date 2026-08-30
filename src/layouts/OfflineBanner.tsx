import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

/** Global offline indicator — saved info stays available, actions may need a connection. */
export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-[13px] font-bold text-forest-950 safe-t">
      <WifiOff size={15} />
      You're offline — your saved trips and routes are still available.
    </div>
  );
}
