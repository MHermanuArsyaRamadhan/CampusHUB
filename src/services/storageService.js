// Storage keys
export const STORAGE_KEYS = {
  USERS: 'campushub_users',
  CURRENT_USER: 'campushub_current_user',
  ORGANIZATIONS: 'campushub_organizations',
  SCHEDULES: 'campushub_schedules',
  NOTIFICATIONS: 'campushub_notifications',
  REGISTRATIONS: 'campushub_registrations',
  FAVORITES: 'campushub_favorites',
  APPROVAL_HISTORY: 'campushub_approval_history',
  INITIALIZED: 'campushub_initialized',
};

export const get = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Error reading localStorage key "${key}":`, e);
    return null;
  }
};

export const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting localStorage key "${key}":`, e);
  }
};

export const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing localStorage key "${key}":`, e);
  }
};

export const clear = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
};

export default { get, set, remove, clear, STORAGE_KEYS };

