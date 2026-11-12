import { get, set, STORAGE_KEYS } from './storageService';
import { ROLES } from '../data/seedData';

export const login = (email, password) => {
  const users = get(STORAGE_KEYS.USERS) || [];
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === password
  );
  if (!user) return { success: false, error: 'Email atau password salah.' };
  if (!user.isActive) return { success: false, error: 'Akun ini dinonaktifkan. Hubungi administrator.' };
  const sessionUser = { ...user };
  delete sessionUser.password;
  set(STORAGE_KEYS.CURRENT_USER, sessionUser);
  return { success: true, user: sessionUser };
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUser = () => {
  return get(STORAGE_KEYS.CURRENT_USER);
};

export const register = ({ name, email, password, nim }) => {
  const users = get(STORAGE_KEYS.USERS) || [];
  const normalizedEmail = email.toLowerCase().trim();
  if (users.find(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'Email sudah terdaftar. Silakan gunakan email lain.' };
  }
  if (nim) {
    const normalizedNim = nim.trim();
    if (users.find(u => u.nim === normalizedNim)) {
      return { success: false, error: 'NIM sudah terdaftar.' };
    }
  }
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    email: normalizedEmail,
    password,
    name: name.trim(),
    role: ROLES.STUDENT,
    nim: nim ? nim.trim() : null,
    avatar: null,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  users.push(newUser);
  set(STORAGE_KEYS.USERS, users);
  const sessionUser = { ...newUser };
  delete sessionUser.password;
  set(STORAGE_KEYS.CURRENT_USER, sessionUser);
  return { success: true, user: sessionUser };
};

export const updateCurrentUser = (updates) => {
  const current = getCurrentUser();
  if (!current) return { success: false, error: 'Not logged in' };
  const users = get(STORAGE_KEYS.USERS) || [];
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) return { success: false, error: 'User not found' };
  users[idx] = { ...users[idx], ...updates };
  set(STORAGE_KEYS.USERS, users);
  const sessionUser = { ...users[idx] };
  delete sessionUser.password;
  set(STORAGE_KEYS.CURRENT_USER, sessionUser);
  return { success: true, user: sessionUser };
};

export default { login, logout, getCurrentUser, register, updateCurrentUser };

