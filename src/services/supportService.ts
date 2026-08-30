/** Mock support service — help centre categories and tickets. */
import { useComuta } from '../store';
import { nid } from '../utils/format';

export const HELP_CATEGORIES = ['Booking', 'Payments', 'Trips', 'Safety', 'Driver', 'Account'] as const;

export const supportService = {
  myTickets(userId: string) {
    return useComuta
      .getState()
      .tickets.filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async createTicket(input: { userId: string; subject: string; description: string; tripRef?: string }) {
    const ticket = {
      id: nid('tk'),
      userId: input.userId,
      subject: input.subject,
      description: input.description,
      tripRef: input.tripRef,
      status: 'open' as const,
      createdAt: new Date().toISOString(),
      messages: [{ id: nid('msg'), from: 'user' as const, text: input.description, at: new Date().toISOString() }],
    };
    useComuta.getState().addTicket(ticket);
    // Simulated support acknowledgement
    setTimeout(() => {
      useComuta.getState().replyTicket(ticket.id, 'support', 'Thanks for reaching out. A member of our team will follow up on this shortly.');
    }, 2500);
    return { ok: true, id: ticket.id };
  },

  async reply(ticketId: string, text: string) {
    useComuta.getState().replyTicket(ticketId, 'user', text);
    return { ok: true };
  },
};
