/** Mock recurring-route service. */
import { useComuta } from '../store';
import type { DayIndex, RecurringRoute } from '../types';
import { nid } from '../utils/format';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const routeService = {
  async createRoute(input: {
    ownerId: string;
    fromId: string;
    toId: string;
    days: DayIndex[];
    time: string;
    seats: number;
    pricePerSeat: number;
    recurring?: boolean;
  }): Promise<{ ok: boolean; route?: RecurringRoute }> {
    await delay(500);
    const route: RecurringRoute = {
      id: nid('rt'),
      ownerId: input.ownerId,
      fromId: input.fromId,
      toId: input.toId,
      days: input.days,
      time: input.time,
      recurring: input.recurring !== false,
      seats: input.seats,
      pricePerSeat: input.pricePerSeat,
      active: true,
      paused: false,
      createdAt: new Date().toISOString(),
    };
    useComuta.getState().addRoute(route);
    return { ok: true, route };
  },

  async updateRoute(routeId: string, patch: Partial<RecurringRoute>) {
    await delay(350);
    useComuta.getState().updateRoute(routeId, patch);
    return { ok: true };
  },

  async pauseRoute(routeId: string) {
    await delay(300);
    useComuta.getState().updateRoute(routeId, { paused: true });
    return { ok: true };
  },

  async resumeRoute(routeId: string) {
    await delay(300);
    useComuta.getState().updateRoute(routeId, { paused: false });
    return { ok: true };
  },

  async cancelRoute(routeId: string) {
    await delay(300);
    useComuta.getState().updateRoute(routeId, { active: false });
    return { ok: true };
  },

  myRoutes(ownerId: string) {
    return useComuta
      .getState()
      .routes.filter((r) => r.ownerId === ownerId && r.active)
      .sort((a, b) => a.time.localeCompare(b.time));
  },
};
