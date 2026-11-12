import { get, set, STORAGE_KEYS } from './storageService';
import { ORG_COLORS } from '../data/seedData';

export const getAllOrganizations = () => get(STORAGE_KEYS.ORGANIZATIONS) || [];

export const getOrgById = (id) => {
  const orgs = getAllOrganizations();
  return orgs.find(o => o.id === id) || null;
};

export const getOrgsByType = (type) => getAllOrganizations().filter(o => o.type === type);

export const createOrganization = ({ name, type, description, email, adminUserId }) => {
  const orgs = getAllOrganizations();
  const id = 'org_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const newOrg = {
    id,
    name: name.trim(),
    type,
    description: description || '',
    logo: null,
    adminUserId,
    email: email.toLowerCase().trim(),
    isActive: true,
    createdAt: new Date().toISOString(),
    color: ORG_COLORS[type] || '#6B7280',
  };
  orgs.push(newOrg);
  set(STORAGE_KEYS.ORGANIZATIONS, orgs);
  return { success: true, org: newOrg };
};

export const updateOrganization = (id, updates) => {
  const orgs = getAllOrganizations();
  const idx = orgs.findIndex(o => o.id === id);
  if (idx === -1) return { success: false, error: 'Organization not found' };
  orgs[idx] = { ...orgs[idx], ...updates };
  set(STORAGE_KEYS.ORGANIZATIONS, orgs);
  return { success: true, org: orgs[idx] };
};

export const toggleOrgActive = (id) => {
  const orgs = getAllOrganizations();
  const idx = orgs.findIndex(o => o.id === id);
  if (idx === -1) return { success: false };
  orgs[idx].isActive = !orgs[idx].isActive;
  set(STORAGE_KEYS.ORGANIZATIONS, orgs);
  return { success: true };
};

export default { getAllOrganizations, getOrgById, getOrgsByType, createOrganization, updateOrganization, toggleOrgActive };

