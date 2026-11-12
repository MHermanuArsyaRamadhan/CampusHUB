import React from 'react';
import { Activity, Clock } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getApprovalHistory } from '../../services/approvalService';
import { getAllSchedules } from '../../services/scheduleService';
import { getAllUsers } from '../../services/userService';
import { formatDateTime } from '../../utils/dateUtils';

const ActivityLogsPage = () => {
  const history = getApprovalHistory().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const schedules = getAllSchedules();
  const users = getAllUsers();
  const schedMap = {};
  schedules.forEach(s => { schedMap[s.id] = s; });

  const actionConfig = {
    APPROVED: { label: 'Jadwal Disetujui', color: 'bg-green-100 text-green-700', icon: '✓' },
    REJECTED: { label: 'Jadwal Ditolak', color: 'bg-red-100 text-red-700', icon: '✕' },
    REVISION_REQUIRED: { label: 'Revisi Diminta', color: 'bg-orange-100 text-orange-700', icon: '↩' },
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas</h1>
        <p className="text-gray-500 text-sm mt-1">Riwayat semua tindakan approval jadwal</p>
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-16">
          <Activity size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Belum ada log aktivitas</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Waktu</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Aksi</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Jadwal</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Reviewer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map(h => {
                  const schedule = schedMap[h.scheduleId];
                  const cfg = actionConfig[h.action] || { label: h.action, color: 'bg-gray-100 text-gray-700', icon: '•' };
                  return (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {formatDateTime(h.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium text-xs">
                        {schedule?.title || `[Jadwal dihapus]`}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{h.reviewerName}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{h.note || '–'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ActivityLogsPage;

