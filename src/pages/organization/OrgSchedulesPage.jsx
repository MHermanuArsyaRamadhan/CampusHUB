import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getSchedulesByOrg, deleteSchedule } from '../../services/scheduleService';
import { getOrgById } from '../../services/organizationService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import ScheduleDetailModal from '../../components/modals/ScheduleDetailModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import {
  Calendar, PlusCircle, Search, Edit3, Trash2, Eye,
  AlertCircle, CheckCircle2, RotateCcw, Clock, MapPin
} from 'lucide-react';

const OrgSchedulesPage = ({ orgType, basePath }) => {
  const { user } = useAuth();
  const { refresh } = useAppData();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const org = user?.organizationId ? getOrgById(user.organizationId) : null;
  // Strict ownership check: Only schedules belonging to this organization
  const schedules = user?.organizationId ? getSchedulesByOrg(user.organizationId) : [];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = schedules.filter(s => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDelete = () => {
    if (!deleteTarget || !user?.organizationId) return;
    const res = deleteSchedule(deleteTarget.id, user.organizationId);
    if (res.success) {
      showToast('Jadwal berhasil dihapus.');
      refresh();
    } else {
      showToast(res.error, 'error');
    }
    setDeleteTarget(null);
  };

  const isEditable = (schedule) => {
    // Editable if PENDING, REVISION_REQUIRED, or REJECTED
    return ['PENDING', 'REVISION_REQUIRED', 'REJECTED', 'APPROVED'].includes(schedule.status);
  };

  return (
    <OrganizationLayout basePath={basePath} orgType={orgType}>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm flex items-center gap-2 animate-fadeIn ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {orgType === 'EVENT' ? 'Daftar Event' : 'Daftar Jadwal Kegiatan'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola jadwal kegiatan resmi dari <strong>{org?.name}</strong>
          </p>
        </div>

        <Link
          to={`${basePath}/add-schedule`}
          className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto text-sm"
        >
          <PlusCircle size={16} />
          {orgType === 'EVENT' ? 'Tambah Event Baru' : 'Ajukan Jadwal Baru'}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari jadwal kegiatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REVISION_REQUIRED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {st === 'ALL' ? 'Semua' :
               st === 'PENDING' ? 'Menunggu' :
               st === 'APPROVED' ? 'Disetujui' :
               st === 'REVISION_REQUIRED' ? 'Perlu Revisi' : 'Ditolak'}
            </button>
          ))}
        </div>
      </div>

      {/* Schedules List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-700">Tidak ada jadwal ditemukan</h3>
          <p className="text-sm text-gray-500 mt-1">
            {statusFilter !== 'ALL'
              ? 'Tidak ada jadwal dengan status filter yang dipilih.'
              : 'Mulai dengan mengajukan jadwal kegiatan pertama Anda.'}
          </p>
          <Link
            to={`${basePath}/add-schedule`}
            className="btn-primary inline-flex items-center gap-2 mt-5 text-sm"
          >
            <PlusCircle size={16} />
            {orgType === 'EVENT' ? 'Tambah Event' : 'Ajukan Jadwal'}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(schedule => (
            <div
              key={schedule.id}
              className="card hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 p-5"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <StatusBadge status={schedule.status} />
                  <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {schedule.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-1">{schedule.title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-500" />
                    {formatDate(schedule.startDate)}
                    {schedule.endDate !== schedule.startDate && ` - ${formatDate(schedule.endDate)}`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-500" />
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)} WIB
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-500" />
                    {schedule.location}
                  </span>
                </div>

                {schedule.reviewNote && (
                  <div className={`mt-3 p-2.5 rounded-lg text-xs ${
                    schedule.status === 'REVISION_REQUIRED'
                      ? 'bg-orange-50 border border-orange-200 text-orange-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <strong>
                      {schedule.status === 'REVISION_REQUIRED' ? 'Catatan Revisi Super Admin:' : 'Alasan Penolakan:'}
                    </strong>{' '}
                    {schedule.reviewNote}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                <button
                  onClick={() => setSelectedSchedule(schedule)}
                  className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
                >
                  <Eye size={14} /> Detail
                </button>

                {isEditable(schedule) && (
                  <button
                    onClick={() => navigate(`${basePath}/edit-schedule/${schedule.id}`)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 size={14} />
                    {schedule.status === 'REVISION_REQUIRED' ? 'Perbaiki Revisi' : 'Edit'}
                  </button>
                )}

                <button
                  onClick={() => setDeleteTarget(schedule)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSchedule && (
        <ScheduleDetailModal
          schedule={selectedSchedule}
          organization={org}
          onClose={() => setSelectedSchedule(null)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Hapus Jadwal Kegiatan"
        message={`Apakah Anda yakin ingin menghapus jadwal "${deleteTarget?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </OrganizationLayout>
  );
};

export default OrgSchedulesPage;

