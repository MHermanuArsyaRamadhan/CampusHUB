import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Building2, Calendar, CheckSquare, Clock, XCircle, RotateCcw, TrendingUp
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { getAllSchedules } from '../../services/scheduleService';
import { getAllUsers } from '../../services/userService';
import { getAllOrganizations } from '../../services/organizationService';
import { SCHEDULE_STATUS, ROLES, ORG_TYPES } from '../../data/seedData';
import { formatDateTime } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';

const StatCard = ({ icon: Icon, label, value, color, to }) => {
  const content = (
    <div className="stat-card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {to && <span className="text-xs text-blue-500">Lihat →</span>}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const schedules = getAllSchedules();
  const users = getAllUsers();
  const orgs = getAllOrganizations();

  const stats = useMemo(() => ({
    totalStudents: users.filter(u => u.role === ROLES.STUDENT).length,
    totalUKM: orgs.filter(o => o.type === ORG_TYPES.UKM).length,
    totalLAB: orgs.filter(o => o.type === ORG_TYPES.LAB).length,
    totalEvent: orgs.filter(o => o.type === ORG_TYPES.EVENT).length,
    totalSchedules: schedules.length,
    pending: schedules.filter(s => s.status === SCHEDULE_STATUS.PENDING).length,
    approved: schedules.filter(s => s.status === SCHEDULE_STATUS.APPROVED).length,
    rejected: schedules.filter(s => s.status === SCHEDULE_STATUS.REJECTED).length,
    revision: schedules.filter(s => s.status === SCHEDULE_STATUS.REVISION_REQUIRED).length,
  }), []);

  const recentPending = schedules
    .filter(s => s.status === SCHEDULE_STATUS.PENDING)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const orgMap = {};
  orgs.forEach(o => { orgMap[o.id] = o; });

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Super Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang, {user?.name}. Pantau seluruh aktivitas kampus di sini.</p>
      </div>

      {/* Stats Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Mahasiswa" value={stats.totalStudents} color="bg-indigo-500" to="/admin/accounts" />
        <StatCard icon={Building2} label="UKM Aktif" value={stats.totalUKM} color="bg-purple-500" to="/admin/organizations" />
        <StatCard icon={Building2} label="LAB Aktif" value={stats.totalLAB} color="bg-green-500" to="/admin/organizations" />
        <StatCard icon={Building2} label="Panitia Event" value={stats.totalEvent} color="bg-blue-500" to="/admin/organizations" />
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Total Jadwal" value={stats.totalSchedules} color="bg-gray-600" to="/admin/schedules" />
        <StatCard icon={Clock} label="Menunggu Approval" value={stats.pending} color="bg-yellow-500" to="/admin/approval" />
        <StatCard icon={CheckSquare} label="Disetujui" value={stats.approved} color="bg-green-500" to="/admin/schedules" />
        <StatCard icon={XCircle} label="Ditolak" value={stats.rejected} color="bg-red-500" to="/admin/schedules" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Jadwal Menunggu Persetujuan</h2>
            <Link to="/admin/approval" className="text-sm text-blue-600 hover:underline">Lihat semua →</Link>
          </div>
          {recentPending.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <CheckSquare size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tidak ada jadwal yang menunggu persetujuan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPending.map(s => {
                const org = orgMap[s.organizationId];
                return (
                  <div key={s.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <OrgTypeBadge type={s.organizationType} />
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{org?.name} · {s.startDate}</p>
                    </div>
                    <Link
                      to={`/admin/approval`}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                    >
                      Tinjau →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-5">Aksi Cepat</h2>
          <div className="space-y-3">
            <Link to="/admin/approval" className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg hover:bg-yellow-100 transition-colors">
              <Clock size={18} className="text-yellow-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Review Jadwal Pending</p>
                <p className="text-xs text-gray-500">{stats.pending} jadwal menunggu</p>
              </div>
            </Link>
            <Link to="/admin/accounts" className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors">
              <Users size={18} className="text-indigo-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Kelola Akun</p>
                <p className="text-xs text-gray-500">Tambah atau nonaktifkan akun</p>
              </div>
            </Link>
            <Link to="/admin/organizations" className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors">
              <Building2 size={18} className="text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Manajemen Organisasi</p>
                <p className="text-xs text-gray-500">Lihat dan kelola organisasi</p>
              </div>
            </Link>
            <Link to="/admin/schedules" className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
              <Calendar size={18} className="text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Semua Jadwal</p>
                <p className="text-xs text-gray-500">{stats.totalSchedules} jadwal terdaftar</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

