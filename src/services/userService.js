import { get, set, STORAGE_KEYS } from './storageService';
import { ROLES } from '../data/seedData';

export const getAllUsers = () => get(STORAGE_KEYS.USERS) || [];

export const getUserById = (id) => {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
};

export const createOrgUser = ({ name, email, password, role, organizationId }) => {
  const users = getAllUsers();
  const normalizedEmail = email.toLowerCase().trim();
  if (users.find(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'Email sudah terdaftar.' };
  }
  const allowedRoles = [ROLES.UKM_ADMIN, ROLES.LAB_ADMIN, ROLES.EVENT_ADMIN];
  if (!allowedRoles.includes(role)) {
    return { success: false, error: 'Role tidak valid untuk pembuatan akun organisasi.' };
  }
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    email: normalizedEmail,
    password,
    name: name.trim(),
    role,
    organizationId,
    avatar: null,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  users.push(newUser);
  set(STORAGE_KEYS.USERS, users);
  return { success: true, user: newUser };
};

export const updateUser = (id, updates) => {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { success: false, error: 'User not found' };
  users[idx] = { ...users[idx], ...updates };
  set(STORAGE_KEYS.USERS, users);
  return { success: true, user: users[idx] };
};

export const toggleUserActive = (id) => {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return { success: false };
  users[idx].isActive = !users[idx].isActive;
  set(STORAGE_KEYS.USERS, users);
  return { success: true };
};

export const getStudentUsers = () => getAllUsers().filter(u => u.role === ROLES.STUDENT);
export const getOrgAdminUsers = () =>
  getAllUsers().filter(u => [ROLES.UKM_ADMIN, ROLES.LAB_ADMIN, ROLES.EVENT_ADMIN].includes(u.role));

export default { getAllUsers, getUserById, createOrgUser, updateUser, toggleUserActive, getStudentUsers, getOrgAdminUsers };

