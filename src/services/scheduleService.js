import { get, set, STORAGE_KEYS } from './storageService';
import { SCHEDULE_STATUS, ORG_COLORS } from '../data/seedData';

const generateId = () => 'sched_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

export const getAllSchedules = () => get(STORAGE_KEYS.SCHEDULES) || [];

export const getApprovedSchedules = () =>
  getAllSchedules().filter(s => s.status === SCHEDULE_STATUS.APPROVED);

export const getSchedulesByOrg = (orgId) =>
  getAllSchedules().filter(s => s.organizationId === orgId);

export const getScheduleById = (id) => getAllSchedules().find(s => s.id === id) || null;

export const getSchedulesByStatus = (status) =>
  getAllSchedules().filter(s => s.status === status);

export const getPendingSchedules = () => getSchedulesByStatus(SCHEDULE_STATUS.PENDING);

export const createSchedule = (data, userId, orgId, orgType) => {
  const schedules = getAllSchedules();
  const newSchedule = {
    id: generateId(),
    title: data.title.trim(),
    organizationId: orgId,
    organizationType: orgType,
    category: data.category,
    description: data.description || '',
    startDate: data.startDate,
    endDate: data.endDate,
    startTime: data.startTime,
    endTime: data.endTime,
    location: data.location.trim(),
    poster: data.poster || null,
    capacity: data.capacity ? parseInt(data.capacity) : null,
    registrationOpen: data.registrationOpen || false,
    status: SCHEDULE_STATUS.PENDING,
    submittedBy: userId,
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  schedules.push(newSchedule);
  set(STORAGE_KEYS.SCHEDULES, schedules);
  return { success: true, schedule: newSchedule };
};

export const updateSchedule = (id, data, requestingUserId, requestingOrgId) => {
  const schedules = getAllSchedules();
  const idx = schedules.findIndex(s => s.id === id);
  if (idx === -1) return { success: false, error: 'Jadwal tidak ditemukan.' };
  if (schedules[idx].organizationId !== requestingOrgId) {
    return { success: false, error: 'Anda tidak memiliki izin untuk mengedit jadwal ini.' };
  }
  const allowedEdit = [SCHEDULE_STATUS.PENDING, SCHEDULE_STATUS.REVISION_REQUIRED, SCHEDULE_STATUS.REJECTED];
  if (!allowedEdit.includes(schedules[idx].status)) {
    return { success: false, error: 'Jadwal yang telah disetujui tidak dapat diedit langsung. Ajukan revisi.' };
  }
  schedules[idx] = {
    ...schedules[idx],
    title: data.title.trim(),
    category: data.category,
    description: data.description || '',
    startDate: data.startDate,
    endDate: data.endDate,
    startTime: data.startTime,
    endTime: data.endTime,
    location: data.location.trim(),
    poster: data.poster !== undefined ? data.poster : schedules[idx].poster,
    capacity: data.capacity ? parseInt(data.capacity) : null,
    registrationOpen: data.registrationOpen || false,
    status: SCHEDULE_STATUS.PENDING,
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
    updatedAt: new Date().toISOString(),
  };
  set(STORAGE_KEYS.SCHEDULES, schedules);
  return { success: true, schedule: schedules[idx] };
};

export const deleteSchedule = (id, requestingOrgId) => {
  const schedules = getAllSchedules();
  const schedule = schedules.find(s => s.id === id);
  if (!schedule) return { success: false, error: 'Jadwal tidak ditemukan.' };
  if (schedule.organizationId !== requestingOrgId) {
    return { success: false, error: 'Anda tidak memiliki izin untuk menghapus jadwal ini.' };
  }
  const filtered = schedules.filter(s => s.id !== id);
  set(STORAGE_KEYS.SCHEDULES, filtered);
  return { success: true };
};

export const checkConflict = (data, excludeId = null) => {
  const schedules = getApprovedSchedules();
  return schedules.filter(s => {
    if (s.id === excludeId) return false;
    if (s.location.toLowerCase() !== data.location.toLowerCase()) return false;
    const sStart = new Date(`${s.startDate}T${s.startTime}`);
    const sEnd = new Date(`${s.endDate}T${s.endTime}`);
    const dStart = new Date(`${data.startDate}T${data.startTime}`);
    const dEnd = new Date(`${data.endDate}T${data.endTime}`);
    return sStart < dEnd && sEnd > dStart;
  });
};

export const getCalendarEvents = () => {
  return getApprovedSchedules().map(s => ({
    id: s.id,
    title: s.title,
    start: `${s.startDate}T${s.startTime}`,
    end: `${s.endDate}T${s.endTime}`,
    backgroundColor: ORG_COLORS[s.organizationType] || '#6B7280',
    borderColor: ORG_COLORS[s.organizationType] || '#6B7280',
    extendedProps: { ...s },
  }));
};

export default {
  getAllSchedules, getApprovedSchedules, getSchedulesByOrg,
  getScheduleById, getPendingSchedules, createSchedule, updateSchedule,
  deleteSchedule, checkConflict, getCalendarEvents, getSchedulesByStatus,
};

