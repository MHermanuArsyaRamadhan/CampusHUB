import { get, set, STORAGE_KEYS } from './storageService';
import { SCHEDULE_STATUS } from '../data/seedData';
import { addNotification } from './notificationService';

const generateId = () => 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

export const getApprovalHistory = () => get(STORAGE_KEYS.APPROVAL_HISTORY) || [];

export const getHistoryBySchedule = (scheduleId) =>
  getApprovalHistory().filter(h => h.scheduleId === scheduleId);

const updateScheduleStatus = (scheduleId, status, reviewedBy, reviewerName, note) => {
  const schedules = get(STORAGE_KEYS.SCHEDULES) || [];
  const idx = schedules.findIndex(s => s.id === scheduleId);
  if (idx === -1) return null;
  schedules[idx] = {
    ...schedules[idx],
    status,
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    reviewNote: note || null,
    updatedAt: new Date().toISOString(),
  };
  set(STORAGE_KEYS.SCHEDULES, schedules);
  return schedules[idx];
};

const addHistory = (scheduleId, action, reviewedBy, reviewerName, note) => {
  const history = getApprovalHistory();
  const entry = {
    id: generateId(),
    scheduleId,
    action,
    reviewedBy,
    reviewerName,
    note: note || null,
    createdAt: new Date().toISOString(),
  };
  history.push(entry);
  set(STORAGE_KEYS.APPROVAL_HISTORY, history);
  return entry;
};

export const approveSchedule = (scheduleId, reviewUser) => {
  const schedule = updateScheduleStatus(scheduleId, SCHEDULE_STATUS.APPROVED, reviewUser.id, reviewUser.name, null);
  if (!schedule) return { success: false, error: 'Jadwal tidak ditemukan.' };
  addHistory(scheduleId, 'APPROVED', reviewUser.id, reviewUser.name, null);
  addNotification({
    userId: schedule.submittedBy,
    type: 'APPROVED',
    title: 'Jadwal Disetujui',
    message: `Jadwal "${schedule.title}" telah disetujui oleh Super Admin.`,
    scheduleId,
  });
  return { success: true };
};

export const rejectSchedule = (scheduleId, reviewUser, reason) => {
  if (!reason || !reason.trim()) return { success: false, error: 'Alasan penolakan wajib diisi.' };
  const schedule = updateScheduleStatus(scheduleId, SCHEDULE_STATUS.REJECTED, reviewUser.id, reviewUser.name, reason);
  if (!schedule) return { success: false, error: 'Jadwal tidak ditemukan.' };
  addHistory(scheduleId, 'REJECTED', reviewUser.id, reviewUser.name, reason);
  addNotification({
    userId: schedule.submittedBy,
    type: 'REJECTED',
    title: 'Jadwal Ditolak',
    message: `Jadwal "${schedule.title}" ditolak. Alasan: ${reason}`,
    scheduleId,
  });
  return { success: true };
};

export const requestRevision = (scheduleId, reviewUser, notes) => {
  if (!notes || !notes.trim()) return { success: false, error: 'Catatan revisi wajib diisi.' };
  const schedule = updateScheduleStatus(scheduleId, SCHEDULE_STATUS.REVISION_REQUIRED, reviewUser.id, reviewUser.name, notes);
  if (!schedule) return { success: false, error: 'Jadwal tidak ditemukan.' };
  addHistory(scheduleId, 'REVISION_REQUIRED', reviewUser.id, reviewUser.name, notes);
  addNotification({
    userId: schedule.submittedBy,
    type: 'REVISION_REQUIRED',
    title: 'Revisi Jadwal Diperlukan',
    message: `Super Admin meminta revisi untuk jadwal "${schedule.title}". Catatan: ${notes}`,
    scheduleId,
  });
  return { success: true };
};

export default { getApprovalHistory, getHistoryBySchedule, approveSchedule, rejectSchedule, requestRevision };

