import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { Page, StatusChip } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { notificationService } from '../../services/notificationService';
import { useComuta } from '../../store';
import { relativeTime } from '../../utils/format';
import type { AppNotification } from '../../types';

const KIND_TONE: Record<AppNotification['kind'], 'green' | 'neutral' | 'amber' | 'red' | 'teal'> = {
  trip: 'green',
  booking: 'teal',
  payment: 'teal',
  safety: 'red',
  route: 'neutral',
  system: 'neutral',
};

export function Notifications() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const notifications = session ? notificationService.list(session.userId) : [];
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    if (session) setItems(notificationService.list(session.userId));
  }, [session, notifications.length]);

  const markAll = async () => {
    if (!session) return;
    await notificationService.markAllRead(session.userId);
    setItems(notificationService.list(session.userId));
  };

  return (
    <Page>
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Notifications</h1>
        {items.some((n) => !n.read) && (
          <Button size="sm" variant="ghost" onClick={markAll}>
            <CheckCheck size={15} /> Mark all read
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-2.5">
        {items.length === 0 && (
          <div className="rounded-2xl border border-line bg-white px-6 py-12 text-center">
            <Bell size={30} className="mx-auto text-faint" />
            <p className="mt-3 text-[15px] font-extrabold text-onsurface">You're all caught up</p>
            <p className="mt-1 text-[13px] text-variant">Trip updates and confirmations will appear here.</p>
          </div>
        )}
        {items.map((n) => (
          <button
            key={n.id}
            onClick={async () => {
              await notificationService.markRead(n.id);
              setItems(notificationService.list(session!.userId));
            }}
            className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-soft tap ${
              n.read ? 'border-line-soft bg-white' : 'border-forest-100 bg-forest-50'
            }`}
          >
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-line' : 'bg-lime-500'}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-extrabold text-onsurface">{n.title}</p>
                <span className="shrink-0 text-[11px] font-semibold text-faint">{relativeTime(n.at)}</span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-variant">{n.body}</p>
              <span className="mt-2 inline-block">
                <StatusChip label={n.kind} tone={KIND_TONE[n.kind]} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </Page>
  );
}
