import React from 'react';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import { useAuth } from '../../context/AuthContext';
import { getSchedulesByOrg } from '../../services/scheduleService';
import { getApprovalHistory } from '../../services/approvalService';
import { getOrgById } from '../../services/organizationService';
import { formatDateTime } from '../../utils/dateUtils';
import { History, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const OrgHistoryPage = ({ orgType, basePath }) => {
  const { user } = useAuth();
  const org = user?.organizationId ? getOrgById(user.organizationId) : null;
  const mySchedules = user?.organizationId ? getSchedulesByOrg(user.organizationId) : [];

  const myScheduleIds = new Set(mySchedules.map(s => s.id));
  const schedMap = {};
  mySchedules.forEach(s => { schedMap[s.id] = s; });

  const history = getApprovalHistory()
    .filter(h => myScheduleIds.has(h.scheduleId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const actionConfig = {
    APPROVED: { label: 'Disetujui', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle },
    REVISION_REQUIRED: { label: 'Perlu Revisi', color: 'bg-orange-100 text-orange-700', icon: RotateCcw },
  };

  return (
    <OrganizationLayout basePath={basePath} orgType={orgType}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Persetujuan (Approval)</h1>
        <p className="text-sm text-gray-500 mt-1">
          Catatan riwayat evaluasi dan keputusan Super Admin untuk jadwal kegiatan <strong>{org?.name}</strong>.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-16">
          <History size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-700">Belum Ada Riwayat Approval</h3>
          <p className="text-sm text-gray-500 mt-1">
            Riwayat persetujuan, penolakan, atau permintaan revisi akan dicatat di sini.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Waktu Keputusan</th>
                  <th className="px-5 py-3 text-left">Kegiatan</th>
                  <th className="px-5 py-3 text-left">Keputusan Super Admin</th>
                  <th className="px-5 py-3 text-left">Peninjau</th>
                  <th className="px-5 py-3 text-left">Catatan / Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map(item => {
                  const cfg = actionConfig[item.action] || { label: item.action, color: 'bg-gray-100 text-gray-700', icon: Clock };
                  const Icon = cfg.icon;
                  const sched = schedMap[item.scheduleId];

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900 text-xs">
                        {sched ? sched.title : `[Jadwal #${item.scheduleId}]`}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                          <Icon size={13} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {item.reviewerName || 'Super Admin Universitas'}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 max-w-sm">
                        {item.note || <span className="text-gray-400 italic">Tidak ada catatan</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </OrganizationLayout>
  );
};

export default OrgHistoryPage;

