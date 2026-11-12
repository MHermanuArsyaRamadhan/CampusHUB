import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Users, Building2, Calendar,
  CheckSquare, FileText, BarChart2, Settings, LogOut, Menu, X,
  Bell, ChevronDown, ClipboardList, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/common/NotificationBell';

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/accounts', icon: Users, label: 'Manajemen Akun' },
    { to: '/admin/organizations', icon: Building2, label: 'Organisasi' },
    { to: '/admin/approval', icon: CheckSquare, label: 'Persetujuan Jadwal' },
    { to: '/admin/schedules', icon: Calendar, label: 'Semua Jadwal' },
    { to: '/admin/reports', icon: BarChart2, label: 'Laporan' },
    { to: '/admin/logs', icon: Activity, label: 'Log Aktivitas' },
    { to: '/admin/settings', icon: Settings, label: 'Pengaturan' },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-slate-800 ${mobile ? 'w-72' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-white">Campus<span className="text-blue-400">HUB</span></span>
          <p className="text-xs text-slate-400">Super Admin</p>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} onClick={mobile ? () => setSidebarOpen(false) : undefined} />
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative sidebar-mobile-enter">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <NotificationBell />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

