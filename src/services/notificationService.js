import { get, set, STORAGE_KEYS } from './storageService';

const generateId = () => 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

export const getAllNotifications = () => get(STORAGE_KEYS.NOTIFICATIONS) || [];

export const getNotificationsForUser = (userId) =>
  getAllNotifications().filter(n => n.userId === userId).sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

export const getUnreadCount = (userId) =>
  getNotificationsForUser(userId).filter(n => !n.isRead).length;

export const addNotification = ({ userId, type, title, message, scheduleId = null }) => {
  const notifications = getAllNotifications();
  const newNotif = {
    id: generateId(),
    userId,
    type,
    title,
    message,
    scheduleId,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(newNotif);
  set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  return newNotif;
};

export const markAsRead = (notifId) => {
  const notifications = getAllNotifications();
  const idx = notifications.findIndex(n => n.id === notifId);
  if (idx !== -1) {
    notifications[idx].isRead = true;
    set(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
};

export const markAllAsRead = (userId) => {
  const notifications = getAllNotifications();
  const updated = notifications.map(n =>
    n.userId === userId ? { ...n, isRead: true } : n
  );
  set(STORAGE_KEYS.NOTIFICATIONS, updated);
};

export const notifyNewSubmission = (schedule) => {
  addNotification({
    userId: 'user_super_admin',
    type: 'NEW_SUBMISSION',
    title: 'Jadwal Baru Diajukan',
    message: `${schedule.organizationType} mengajukan jadwal "${schedule.title}" untuk persetujuan.`,
    scheduleId: schedule.id,
  });
};

export default {
  getAllNotifications, getNotificationsForUser, getUnreadCount,
  addNotification, markAsRead, markAllAsRead, notifyNewSubmission
};

