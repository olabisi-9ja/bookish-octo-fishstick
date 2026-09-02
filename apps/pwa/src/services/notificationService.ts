/** Mock notification service. */
import { useComuta } from '../store';

export const notificationService = {
  list(userId: string) {
    return useComuta.getState().notifications.filter((n) => n.userId === userId);
  },

  unreadCount(userId: string) {
    return this.list(userId).filter((n) => !n.read).length;
  },

  async markRead(id: string) {
    useComuta.getState().markNotificationRead(id);
    return true;
  },

  async markAllRead(userId: string) {
    useComuta.getState().markAllNotificationsRead(userId);
    return true;
  },
};
