import { get, set, STORAGE_KEYS } from './storageService';

const generateId = () => 'reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

export const getAllRegistrations = () => get(STORAGE_KEYS.REGISTRATIONS) || [];

export const getRegistrationsByStudent = (studentId) =>
  getAllRegistrations().filter(r => r.studentId === studentId);

export const getRegistrationsBySchedule = (scheduleId) =>
  getAllRegistrations().filter(r => r.scheduleId === scheduleId);

export const getRegistrationCount = (scheduleId) =>
  getRegistrationsBySchedule(scheduleId).length;

export const isRegistered = (studentId, scheduleId) =>
  getAllRegistrations().some(r => r.studentId === studentId && r.scheduleId === scheduleId);

export const registerForEvent = (studentId, scheduleId, capacity) => {
  if (isRegistered(studentId, scheduleId)) {
    return { success: false, error: 'Anda sudah terdaftar untuk kegiatan ini.' };
  }
  const count = getRegistrationCount(scheduleId);
  if (capacity && count >= capacity) {
    return { success: false, error: 'Kuota pendaftaran penuh.' };
  }
  const registrations = getAllRegistrations();
  const newReg = {
    id: generateId(),
    studentId,
    scheduleId,
    registeredAt: new Date().toISOString(),
    status: 'CONFIRMED',
  };
  registrations.push(newReg);
  set(STORAGE_KEYS.REGISTRATIONS, registrations);
  return { success: true, registration: newReg };
};

export const cancelRegistration = (studentId, scheduleId) => {
  const registrations = getAllRegistrations();
  const filtered = registrations.filter(
    r => !(r.studentId === studentId && r.scheduleId === scheduleId)
  );
  set(STORAGE_KEYS.REGISTRATIONS, filtered);
  return { success: true };
};

export const getAllFavorites = () => get(STORAGE_KEYS.FAVORITES) || [];

export const getFavoritesByStudent = (studentId) =>
  getAllFavorites().filter(f => f.studentId === studentId);

export const isFavorited = (studentId, scheduleId) =>
  getAllFavorites().some(f => f.studentId === studentId && f.scheduleId === scheduleId);

export const toggleFavorite = (studentId, scheduleId) => {
  const favorites = getAllFavorites();
  const existing = favorites.findIndex(
    f => f.studentId === studentId && f.scheduleId === scheduleId
  );
  if (existing !== -1) {
    favorites.splice(existing, 1);
    set(STORAGE_KEYS.FAVORITES, favorites);
    return { success: true, favorited: false };
  } else {
    const newFav = {
      id: 'fav_' + Date.now(),
      studentId,
      scheduleId,
      addedAt: new Date().toISOString(),
    };
    favorites.push(newFav);
    set(STORAGE_KEYS.FAVORITES, favorites);
    return { success: true, favorited: true };
  }
};

export default {
  getAllRegistrations, getRegistrationsByStudent, getRegistrationsBySchedule,
  getRegistrationCount, isRegistered, registerForEvent, cancelRegistration,
  getAllFavorites, getFavoritesByStudent, isFavorited, toggleFavorite,
};

