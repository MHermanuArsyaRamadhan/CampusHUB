import React, { useState } from 'react';
import { Calendar, Clock, CheckSquare, XCircle, PlusCircle, Edit2, Trash2, Eye, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getSchedulesByOrg } from '../../services/scheduleService';
import { getOrgById } from '../../services/organizationService';
import { SCHEDULE_STATUS, ORG_COLORS } from '../../data/seedData';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card">
    <div className={`p-2.5 rounded-lg ${color} inline-block mb-2`}>
      <Icon size={18} className="text-white" />
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500 mt-0.5">{label}</div>
  </div>
);

const OrgDashboard = ({ orgType, basePath, children: layoutWrapper }) => {
  const { user } = useAuth();
  const org = user?.organizationId ? getOrgById(user.organizationId) : null;
  const schedules = user?.organizationId ? getSchedulesByOrg(user.organizationId) : [];

  const color = ORG_COLORS[orgType] || '#2563EB';

  const stats = {
    total: schedules.length,
    pending: schedules.filter(s => s.status === SCHEDULE_STATUS.PENDING).length,
    approved: schedules.filter(s => s.status === SCHEDULE_STATUS.APPROVED).length,
    rejected: schedules.filter(s => s.status === SCHEDULE_STATUS.REJECTED).length,
    revision: schedules.filter(s => s.status === SCHEDULE_STATUS.REVISION_REQUIRED).length,
  };

  const recent = schedules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <>
      {/* Welcome */}
      <div className="mb-6 p-5 rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm opacity-80 mb-1">Selamat datang,</p>
            <h1 className="text-xl font-bold">{org?.name || user?.name}</h1>
            <OrgTypeBadge type={orgType} />
          </div>
          <a
            href={`${basePath}/add-schedule`}
            className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusCircle size={16} />
            {orgType === 'EVENT' ? 'Tambah Event' : 'Ajukan Jadwal'}
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Calendar} label="Total Jadwal" value={stats.total} color="bg-gray-600" />
        <StatCard icon={Clock} label="Menunggu" value={stats.pending} color="bg-yellow-500" />
        <StatCard icon={CheckSquare} label="Disetujui" value={stats.approved} color="bg-green-500" />
        <StatCard icon={XCircle} label="Ditolak" value={stats.rejected} color="bg-red-500" />
      </div>

      {/* Revision Alert */}
      {stats.revision > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <RotateCcw size={20} className="text-orange-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-orange-800">
              {stats.revision} jadwal memerlukan revisi
            </p>
            <p className="text-xs text-orange-700 mt-0.5">Periksa catatan revisi dari Super Admin dan lakukan perubahan yang diperlukan.</p>
          </div>
          <a href={`${basePath}/schedules`} className="text-xs text-orange-700 font-semibold hover:underline whitespace-nowrap">
            Lihat jadwal →
          </a>
        </div>
      )}

      {/* Recent Schedules */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Jadwal Terbaru</h2>
          <a href={`${basePath}/schedules`} className="text-sm text-blue-600 hover:underline">Lihat semua →</a>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Belum ada jadwal. Mulai dengan mengajukan jadwal pertama Anda.</p>
            <a href={`${basePath}/add-schedule`} className="inline-flex items-center gap-2 mt-4 btn-primary text-sm">
              <PlusCircle size={16} /> Ajukan Jadwal
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map(s => (
              <div key={s.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={s.status} />
                    <span className="text-xs text-gray-400">{s.category}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{s.title}</p>
                  <p className="text-xs text-gray-500">{formatDate(s.startDate)} · {s.location}</p>
                </div>
                {s.status === SCHEDULE_STATUS.REVISION_REQUIRED && s.reviewNote && (
                  <div className="text-xs text-orange-600 max-w-xs truncate bg-orange-50 px-2 py-1 rounded">
                    📝 {s.reviewNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Org Info */}
      {org && (
        <div className="card mt-6">
          <h2 className="font-semibold text-gray-900 mb-4">Informasi Organisasi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 font-medium">Nama Organisasi</p>
              <p className="text-gray-900 font-medium mt-0.5">{org.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tipe</p>
              <OrgTypeBadge type={org.type} />
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500 font-medium">Deskripsi</p>
              <p className="text-gray-700 mt-0.5">{org.description || 'Tidak ada deskripsi.'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="text-gray-900 mt-0.5">{org.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Status</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${org.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {org.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrgDashboard;

