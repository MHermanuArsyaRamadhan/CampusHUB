
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  Bookmark,
  ClipboardList,
  LogOut,
  Menu,
  X,
  User,
  Building2,
  Search
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/common/NotificationBell';

// NAVIGATION ITEM
const NavItem = ({ to, icon: Icon, label, onClick, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `sidebar-link ${isActive
        ? 'sidebar-link-active'
        : 'sidebar-link-inactive'
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

// STUDENT LAYOUT
const StudentLayout = ({ children, fullWidth = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // LOGOUT
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // NAVIGATION MENU
  const navItems = [
    {
      to: '/student',
      icon: LayoutDashboard,
      label: 'Dashboard',
      end: true
    },
    {
      to: '/student/calendar',
      icon: Calendar,
      label: 'Kalender Kampus'
    },
    {
      to: '/student/activities',
      icon: Search,
      label: 'Jelajahi Kegiatan'
    },
    {
      to: '/student/organizations',
      icon: Building2,
      label: 'Direktori Organisasi'
    },
    {
      to: '/student/favorites',
      icon: Bookmark,
      label: 'Favorit Saya'
    },
    {
      to: '/student/registrations',
      icon: ClipboardList,
      label: 'Pendaftaran Saya'
    },
    {
      to: '/student/profile',
      icon: User,
      label: 'Profil'
    }
  ];

  // SIDEBAR COMPONENT
  const Sidebar = ({ mobile = false }) => (
    <div
      className={`flex flex-col h-full bg-slate-800 ${mobile ? 'w-72' : 'w-64'
        }`}
    >

      {/* BRAND */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">

        <div className="bg-blue-600 p-1.5 rounded-lg">
          <GraduationCap size={20} className="text-white" />
        </div>

        <div>
          <span className="text-lg font-bold text-white">
            Campus<span className="text-blue-400">HUB</span>
          </span>

          <p className="text-xs text-slate-400">
            Portal Mahasiswa
          </p>
        </div>

        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-slate-400"
          >
            <X size={20} />
          </button>
        )}

      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">

        {navItems.map(item => (
          <NavItem
            key={item.to}
            {...item}
            onClick={
              mobile
                ? () => setSidebarOpen(false)
                : undefined
            }
          />
        ))}

      </nav>

      {/* USER PROFILE */}
      <div className="px-4 py-4 border-t border-slate-700">

        <div className="flex items-center gap-3 mb-3">

          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0) || 'S'}
          </div>

          <div className="flex-1 min-w-0">

            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>

            {user?.nim && (
              <p className="text-xs text-slate-400">
                NIM: {user.nim}
              </p>
            )}

          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Keluar
        </button>

      </div>

    </div>
  );

  return (
    <div className="flex min-h-screen h-screen bg-gray-50 overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="relative sidebar-mobile-enter">
            <Sidebar mobile />
          </div>

        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 shrink-0">

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* NOTIFICATION */}
          <NotificationBell />

          {/* USER */}
          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'S'}
            </div>

            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.name}
            </span>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 min-w-0 overflow-y-auto">

          <div
            className={
              fullWidth
                ? "w-full min-w-0 p-3 sm:p-4 lg:p-5"
                : "max-w-6xl mx-auto p-4 sm:p-6"
            }
          >
            {children}
          </div>

        </main>

      </div>

    </div>
  );
};

export default StudentLayout;
