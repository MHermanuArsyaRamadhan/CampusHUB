import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Calendar, PlusCircle, History,
  LogOut, Menu, X, Settings, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/common/NotificationBell';
import { ORG_TYPES, ORG_COLORS } from '../data/seedData';
import { getOrgById } from '../services/organizationService';

const NavItem = ({ to, icon: Icon, label, onClick, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

const OrganizationLayout = ({ children, basePath, orgType }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const org = user?.organizationId ? getOrgById(user.organizationId) : null;
  const orgColor = ORG_COLORS[orgType] || '#2563EB';
  const orgTypeLabel = { UKM: 'UKM Admin', LAB: 'LAB Admin', EVENT: 'Event Admin' }[orgType] || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: basePath, icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: `${basePath}/schedules`, icon: Calendar, label: orgType === ORG_TYPES.EVENT ? 'Daftar Event' : 'Daftar Jadwal' },
    { to: `${basePath}/add-schedule`, icon: PlusCircle, label: orgType === ORG_TYPES.EVENT ? 'Tambah Event' : 'Ajukan Jadwal' },
    { to: `${basePath}/history`, icon: History, label: 'Riwayat Approval' },
    ...(orgType === ORG_TYPES.EVENT ? [{ to: `${basePath}/registrations`, icon: Users, label: 'Pendaftaran' }] : []),
    { to: `${basePath}/profile`, icon: Settings, label: 'Profil Organisasi' },
  ];

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-slate-800 ${mobile ? 'w-72' : 'w-64'}`}>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: orgColor }}>
          <GraduationCap size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-base font-bold text-white truncate block">Campus<span style={{ color: orgColor === ORG_COLORS.UKM ? '#c084fc' : orgColor === ORG_COLORS.LAB ? '#4ade80' : '#60a5fa' }}>HUB</span></span>
          <p className="text-xs text-slate-400">{orgTypeLabel}</p>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 ml-1">
            <X size={20} />
          </button>
        )}
      </div>

      {org && (
        <div className="px-4 py-3 mx-3 mt-3 rounded-lg" style={{ backgroundColor: orgColor + '20' }}>
          <p className="text-xs font-semibold text-white">{org.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{orgType}</p>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} onClick={mobile ? () => setSidebarOpen(false) : undefined} />
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: orgColor }}>
            {user?.name?.charAt(0) || 'O'}
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
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative sidebar-mobile-enter">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <NotificationBell />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: orgColor }}>
              {user?.name?.charAt(0) || 'O'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{org?.name || user?.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizationLayout;

