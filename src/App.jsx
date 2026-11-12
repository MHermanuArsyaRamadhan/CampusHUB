import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { initializeData } from './services/dataInitService';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import CalendarPage from './pages/public/CalendarPage';
import OrganizationsPage from './pages/public/OrganizationsPage';
import ScheduleDetailPage from './pages/public/ScheduleDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Super Admin Pages
import AdminDashboard from './pages/super-admin/AdminDashboard';
import AccountManagement from './pages/super-admin/AccountManagement';
import OrganizationManagement from './pages/super-admin/OrganizationManagement';
import ApprovalPage from './pages/super-admin/ApprovalPage';
import AllSchedulesPage from './pages/super-admin/AllSchedulesPage';
import ReportsPage from './pages/super-admin/ReportsPage';
import ActivityLogsPage from './pages/super-admin/ActivityLogsPage';
import SettingsPage from './pages/super-admin/SettingsPage';

// Organization Pages
import OrgDashboardPage from './pages/organization/OrgDashboardPage';
import OrgSchedulesPage from './pages/organization/OrgSchedulesPage';
import OrgAddSchedulePage from './pages/organization/OrgAddSchedulePage';
import OrgEditSchedulePage from './pages/organization/OrgEditSchedulePage';
import OrgHistoryPage from './pages/organization/OrgHistoryPage';
import OrgProfilePage from './pages/organization/OrgProfilePage';
import EventRegistrationsPage from './pages/organization/EventRegistrationsPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCalendarPage from './pages/student/StudentCalendarPage';
import StudentActivitiesPage from './pages/student/StudentActivitiesPage';
import StudentOrganizationsPage from './pages/student/StudentOrganizationsPage';
import StudentFavoritesPage from './pages/student/StudentFavoritesPage';
import StudentRegistrationsPage from './pages/student/StudentRegistrationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

function App() {
  useEffect(() => {
    // Automatically seed localStorage data on first run
    initializeData();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/schedule/:id" element={<ScheduleDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Super Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/accounts"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AccountManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/organizations"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <OrganizationManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approval"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <ApprovalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schedules"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AllSchedulesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <ActivityLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* UKM Admin Routes */}
            <Route
              path="/ukm"
              element={
                <ProtectedRoute allowedRoles={['UKM_ADMIN']}>
                  <OrgDashboardPage orgType="UKM" basePath="/ukm" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ukm/schedules"
              element={
                <ProtectedRoute allowedRoles={['UKM_ADMIN']}>
                  <OrgSchedulesPage orgType="UKM" basePath="/ukm" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ukm/add-schedule"
              element={
                <ProtectedRoute allowedRoles={['UKM_ADMIN']}>
                  <OrgAddSchedulePage orgType="UKM" basePath="/ukm" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ukm/edit-schedule/:id"
              element={
                <ProtectedRoute allowedRoles={['UKM_ADMIN']}>
                  <OrgEditSchedulePage orgType="UKM" basePath="/ukm" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ukm/history"
              element={
                <ProtectedRoute allowedRoles={['UKM_ADMIN']}>
                  <OrgHistoryPage orgType="UKM" basePath="/ukm" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ukm/profile"
              element={
                <ProtectedRoute allowedRoles={['UKM_ADMIN']}>
                  <OrgProfilePage orgType="UKM" basePath="/ukm" />
                </ProtectedRoute>
              }
            />

            {/* LAB Admin Routes */}
            <Route
              path="/lab"
              element={
                <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
                  <OrgDashboardPage orgType="LAB" basePath="/lab" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab/schedules"
              element={
                <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
                  <OrgSchedulesPage orgType="LAB" basePath="/lab" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab/add-schedule"
              element={
                <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
                  <OrgAddSchedulePage orgType="LAB" basePath="/lab" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab/edit-schedule/:id"
              element={
                <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
                  <OrgEditSchedulePage orgType="LAB" basePath="/lab" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab/history"
              element={
                <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
                  <OrgHistoryPage orgType="LAB" basePath="/lab" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab/profile"
              element={
                <ProtectedRoute allowedRoles={['LAB_ADMIN']}>
                  <OrgProfilePage orgType="LAB" basePath="/lab" />
                </ProtectedRoute>
              }
            />

            {/* EVENT Admin Routes */}
            <Route
              path="/event"
              element={
                <ProtectedRoute allowedRoles={['EVENT_ADMIN']}>
                  <OrgDashboardPage orgType="EVENT" basePath="/event" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/schedules"
              element={
                <ProtectedRoute allowedRoles={['EVENT_ADMIN']}>
                  <OrgSchedulesPage orgType="EVENT" basePath="/event" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/add-schedule"
              element={
                <ProtectedRoute allowedRoles={['EVENT_ADMIN']}>
                  <OrgAddSchedulePage orgType="EVENT" basePath="/event" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/edit-schedule/:id"
              element={
                <ProtectedRoute allowedRoles={['EVENT_ADMIN']}>
                  <OrgEditSchedulePage orgType="EVENT" basePath="/event" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/history"
              element={
                <ProtectedRoute allowedRoles={['EVENT_ADMIN']}>
                  <OrgHistoryPage orgType="EVENT" basePath="/event" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/registrations"
              element={
                <ProtectedRoute allowedRoles={['EVENT_ADMIN']}>
                  <EventRegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/profile"
              element={
                <ProtectedRoute allowedRoles={['EVENT_ADMIN']}>
                  <OrgProfilePage orgType="EVENT" basePath="/event" />
                </ProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/calendar"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/activities"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentActivitiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/organizations"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentOrganizationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/favorites"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentFavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/registrations"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentRegistrationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
