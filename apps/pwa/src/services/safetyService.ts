/** Mock safety service  -  trip sharing, SOS and route-deviation monitoring. */
import { useComuta } from '../store';
import { nid } from '../utils/format';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const safetyService = {
  /** Trip sharing is tracked per-trip; the real app uses a share link + contacts. */
  async shareTrip(tripId: string, userId: string, via: 'contact' | 'link'): Promise<{ ok: boolean }> {
    await delay(400);
    useComuta
      .getState()
      .pushNotification(userId, 'Trip sharing active', 'Your live trip is being shared with your trusted contacts.', 'safety');
    void tripId;
    void via;
    return { ok: true };
  },

  async stopSharing(): Promise<{ ok: boolean }> {
    await delay(300);
    return { ok: true };
  },

  async triggerSOS(tripId: string, userId: string, note: string): Promise<{ ok: boolean }> {
    await delay(500);
    useComuta.getState().addIncident({
      id: nid('inc'),
      tripId,
      userId,
      kind: 'sos',
      note,
      at: new Date().toISOString(),
      status: 'open',
    });
    return { ok: true };
  },

  async reportDeviation(tripId: string, userId: string): Promise<{ ok: boolean }> {
    await delay(400);
    useComuta.getState().addIncident({
      id: nid('inc'),
      tripId,
      userId,
      kind: 'deviation',
      note: 'Vehicle moved away from the planned route.',
      at: new Date().toISOString(),
      status: 'open',
    });
    return { ok: true };
  },

  async resolveIncident(id: string) {
    useComuta.getState().updateIncident(id, { status: 'closed' });
    return { ok: true };
  },
};
