import { ROLES } from '../data/seedData';

export const canManageSchedule = (user, schedule) => {
  if (!user || !schedule) return false;
  if (user.role === ROLES.SUPER_ADMIN) return true;
  if ([ROLES.UKM_ADMIN, ROLES.LAB_ADMIN, ROLES.EVENT_ADMIN].includes(user.role)) {
    return user.organizationId === schedule.organizationId;
  }
  return false;
};

export const canApproveSchedule = (user) => {
  return user && user.role === ROLES.SUPER_ADMIN;
};

export const isOrgAdmin = (user) => {
  return user && [ROLES.UKM_ADMIN, ROLES.LAB_ADMIN, ROLES.EVENT_ADMIN].includes(user.role);
};

export const isStudent = (user) => user && user.role === ROLES.STUDENT;
export const isSuperAdmin = (user) => user && user.role === ROLES.SUPER_ADMIN;

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN: return '/admin';
    case ROLES.UKM_ADMIN: return '/ukm';
    case ROLES.LAB_ADMIN: return '/lab';
    case ROLES.EVENT_ADMIN: return '/event';
    case ROLES.STUDENT: return '/student';
    default: return '/';
  }
};

