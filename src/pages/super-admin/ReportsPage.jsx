import React from 'react';
import { BarChart2, Users, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllSchedules } from '../../services/scheduleService';
import { getAllUsers } from '../../services/userService';
import { getAllOrganizations } from '../../services/organizationService';
import { SCHEDULE_STATUS, ROLES, ORG_TYPES, ORG_COLORS } from '../../data/seedData';

const ReportsPage = () => {
  const schedules = getAllSchedules();
  const users = getAllUsers();
  const orgs = getAllOrganizations();

  const stats = {
    totalSchedules: schedules.length,
    pending: schedules.filter(s => s.status === SCHEDULE_STATUS.PENDING).length,
    approved: schedules.filter(s => s.status === SCHEDULE_STATUS.APPROVED).length,
    rejected: schedules.filter(s => s.status === SCHEDULE_STATUS.REJECTED).length,
    revision: schedules.filter(s => s.status === SCHEDULE_STATUS.REVISION_REQUIRED).length,
  };

  const byType = {
    UKM: schedules.filter(s => s.organizationType === ORG_TYPES.UKM).length,
    LAB: schedules.filter(s => s.organizationType === ORG_TYPES.LAB).length,
    EVENT: schedules.filter(s => s.organizationType === ORG_TYPES.EVENT).length,
  };

  const byCategory = schedules.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const approvalRate = stats.totalSchedules > 0
    ? Math.round((stats.approved / stats.totalSchedules) * 100) : 0;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Laporan & Statistik</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan data platform CampusHUB</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Jadwal', value: stats.totalSchedules, icon: Calendar, color: 'bg-blue-500' },
          { label: 'Tingkat Persetujuan', value: `${approvalRate}%`, icon: CheckCircle2, color: 'bg-green-500' },
          { label: 'Total Mahasiswa', value: users.filter(u => u.role === ROLES.STUDENT).length, icon: Users, color: 'bg-indigo-500' },
          { label: 'Organisasi Aktif', value: orgs.filter(o => o.isActive).length, icon: BarChart2, color: 'bg-purple-500' },
        ].map(item => (
          <div key={item.label} className="stat-card">
            <div className={`p-2 rounded-lg ${item.color} inline-block mb-2`}>
              <item.icon size={18} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-5">Status Jadwal</h2>
          <div className="space-y-3">
            {[
              { label: 'Disetujui', value: stats.approved, color: 'bg-green-500' },
              { label: 'Menunggu', value: stats.pending, color: 'bg-yellow-500' },
              { label: 'Ditolak', value: stats.rejected, color: 'bg-red-500' },
              { label: 'Perlu Revisi', value: stats.revision, color: 'bg-orange-500' },
            ].map(item => {
              const pct = stats.totalSchedules > 0 ? (item.value / stats.totalSchedules) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Type */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-5">Jadwal per Tipe Organisasi</h2>
          <div className="space-y-4">
            {Object.entries(byType).map(([type, count]) => {
              const pct = schedules.length > 0 ? (count / schedules.length) * 100 : 0;
              const color = ORG_COLORS[type];
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                      <span className="text-sm text-gray-700">{type}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-5">Kategori Terpopuler</h2>
          <div className="space-y-3">
            {topCategories.map(([cat, count], i) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{i+1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{cat}</span>
                    <span className="text-xs font-semibold text-gray-900">{count} jadwal</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / topCategories[0][1]) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users Summary */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-5">Ringkasan Pengguna</h2>
          <div className="space-y-3">
            {[
              { label: 'Mahasiswa', count: users.filter(u => u.role === ROLES.STUDENT).length, color: 'bg-indigo-100 text-indigo-700' },
              { label: 'UKM Admin', count: users.filter(u => u.role === ROLES.UKM_ADMIN).length, color: 'bg-purple-100 text-purple-700' },
              { label: 'LAB Admin', count: users.filter(u => u.role === ROLES.LAB_ADMIN).length, color: 'bg-green-100 text-green-700' },
              { label: 'Event Admin', count: users.filter(u => u.role === ROLES.EVENT_ADMIN).length, color: 'bg-blue-100 text-blue-700' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">{item.label}</span>
                <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;

