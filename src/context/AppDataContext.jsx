import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllSchedules, getApprovedSchedules } from '../services/scheduleService';
import { getAllOrganizations } from '../services/organizationService';
import { getNotificationsForUser, getUnreadCount } from '../services/notificationService';
import { getAllUsers } from '../services/userService';

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  const getSchedules = useCallback(() => getAllSchedules(), [refreshKey]);
  const getApproved = useCallback(() => getApprovedSchedules(), [refreshKey]);
  const getOrganizations = useCallback(() => getAllOrganizations(), [refreshKey]);
  const getUserList = useCallback(() => getAllUsers(), [refreshKey]);
  const getUserNotifications = useCallback((userId) => getNotificationsForUser(userId), [refreshKey]);
  const getUnread = useCallback((userId) => getUnreadCount(userId), [refreshKey]);

  return (
    <AppDataContext.Provider value={{
      refreshKey,
      refresh,
      getSchedules,
      getApproved,
      getOrganizations,
      getUserList,
      getUserNotifications,
      getUnread,
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
};

export default AppDataContext;

