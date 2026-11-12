import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Eye, Clock, Calendar, MapPin, Building2 } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllSchedules } from '../../services/scheduleService';
import { getAllOrganizations } from '../../services/organizationService';
import { approveSchedule, rejectSchedule, requestRevision } from '../../services/approvalService';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { SCHEDULE_STATUS } from '../../data/seedData';
import { formatDate, formatTime } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import ScheduleDetailModal from '../../components/modals/ScheduleDetailModal';

const ApprovalPage = () => {
  const { user } = useAuth();
  const { refresh } = useAppData();
  const [schedules, setSchedules] = useState(getAllSchedules());
  const [filter, setFilter] = useState('PENDING');
  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState('');
  const [toast, setToast] = useState(null);

  const orgs = getAllOrganizations();
  const orgMap = {};
  orgs.forEach(o => { orgMap[o.id] = o; });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refreshData = () => {
    setSchedules(getAllSchedules());
    refresh();
  };

  const handleApprove = () => {
    if (!selected) return;
    const result = approveSchedule(selected.id, user);
    if (result.success) {
      showToast('Jadwal berhasil disetujui!');
      setSelected(null);
      setAction(null);
      refreshData();
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleReject = () => {
    if (!selected || !reason.trim()) {
      showToast('Alasan penolakan wajib diisi.', 'error');
      return;
    }
    const result = rejectSchedule(selected.id, user, reason);
    if (result.success) {
      showToast('Jadwal ditolak.');
      setSelected(null);
      setAction(null);
      setReason('');
      refreshData();
    } else {
      showToast(result.error, 'error');
    }
  };

  const handleRevision = () => {
    if (!selected || !reason.trim()) {
      showToast('Catatan revisi wajib diisi.', 'error');
      return;
    }
    const result = requestRevision(selected.id, user, reason);
    if (result.success) {
      showToast('Permintaan revisi dikirim.');
      setSelected(null);
      setAction(null);
      setReason('');
      refreshData();
    } else {
      showToast(result.error, 'error');
    }
  };

  const filtered = schedules
    .filter(s => s.status === filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const counts = {
    PENDING: schedules.filter(s => s.status === SCHEDULE_STATUS.PENDING).length,
    APPROVED: schedules.filter(s => s.status === SCHEDULE_STATUS.APPROVED).length,
    REJECTED: schedules.filter(s => s.status === SCHEDULE_STATUS.REJECTED).length,
    REVISION_REQUIRED: schedules.filter(s => s.status === SCHEDULE_STATUS.REVISION_REQUIRED).length,
  };

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 animate-fadeIn ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Persetujuan Jadwal</h1>
        <p className="text-gray-500 text-sm mt-1">Tinjau dan berikan keputusan untuk setiap jadwal yang diajukan</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: 'PENDING', label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
          { key: 'APPROVED', label: 'Disetujui', color: 'bg-green-100 text-green-800' },
          { key: 'REJECTED', label: 'Ditolak', color: 'bg-red-100 text-red-800' },
          { key: 'REVISION_REQUIRED', label: 'Perlu Revisi', color: 'bg-orange-100 text-orange-800' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${filter === tab.key ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === tab.key ? 'bg-white/20 text-white' : tab.color}`}>
              {counts[tab.key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Schedule List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Clock size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Tidak ada jadwal dengan status ini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => {
            const org = orgMap[s.organizationId];
            return (
              <div key={s.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <OrgTypeBadge type={s.organizationType} />
                      <StatusBadge status={s.status} />
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{s.category}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Building2 size={12} />{org?.name || '–'}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(s.startDate)}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} />{s.location}</span>
                    </div>
                    {s.reviewNote && (
                      <div className="mt-2 text-xs text-orange-700 bg-orange-50 rounded px-2 py-1">
                        📝 {s.reviewNote}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setSelected(s); setAction(null); setReason(''); }}
                      className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
                    >
                      <Eye size={14} /> Detail
                    </button>
                    {s.status === SCHEDULE_STATUS.PENDING && (
                      <>
                        <button
                          onClick={() => { setSelected(s); setAction('approve'); setReason(''); }}
                          className="btn-success text-xs px-3 py-2 flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Setujui
                        </button>
                        <button
                          onClick={() => { setSelected(s); setAction('revision'); setReason(''); }}
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1.5"
                        >
                          <RotateCcw size={14} /> Revisi
                        </button>
                        <button
                          onClick={() => { setSelected(s); setAction('reject'); setReason(''); }}
                          className="btn-danger text-xs px-3 py-2 flex items-center gap-1.5"
                        >
                          <XCircle size={14} /> Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selected && !action && (
        <ScheduleDetailModal
          schedule={selected}
          organization={orgMap[selected.organizationId]}
          onClose={() => setSelected(null)}
        >
          {selected.status === SCHEDULE_STATUS.PENDING && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 mt-2">
              <button onClick={() => setAction('approve')} className="btn-success text-sm flex items-center gap-2">
                <CheckCircle2 size={16} /> Setujui
              </button>
              <button onClick={() => setAction('revision')} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                <RotateCcw size={16} /> Minta Revisi
              </button>
              <button onClick={() => setAction('reject')} className="btn-danger text-sm flex items-center gap-2">
                <XCircle size={16} /> Tolak
              </button>
            </div>
          )}
        </ScheduleDetailModal>
      )}

      {/* Action Modal */}
      {selected && action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setAction(null); setReason(''); }}></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {action === 'approve' ? '✓ Setujui Jadwal' :
               action === 'reject' ? '✕ Tolak Jadwal' : '↩ Minta Revisi'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{selected.title}</p>

            {action !== 'approve' && (
              <div className="mb-4">
                <label className="label">{action === 'reject' ? 'Alasan Penolakan *' : 'Catatan Revisi *'}</label>
                <textarea
                  className="input-field resize-none"
                  rows={4}
                  placeholder={action === 'reject' ? 'Jelaskan alasan penolakan...' : 'Tuliskan catatan revisi...'}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                />
              </div>
            )}

            {action === 'approve' && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700">Jadwal ini akan disetujui dan langsung tampil di kalender publik.</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setAction(null); setReason(''); }} className="btn-secondary flex-1">Batal</button>
              <button
                onClick={action === 'approve' ? handleApprove : action === 'reject' ? handleReject : handleRevision}
                className={`flex-1 font-semibold px-4 py-2 rounded-lg text-white transition-colors ${
                  action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  action === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {action === 'approve' ? 'Ya, Setujui' : action === 'reject' ? 'Ya, Tolak' : 'Kirim Revisi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ApprovalPage;

