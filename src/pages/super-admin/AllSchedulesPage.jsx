import React, { useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllSchedules } from '../../services/scheduleService';
import { getAllOrganizations } from '../../services/organizationService';
import { SCHEDULE_STATUS, ORG_TYPES } from '../../data/seedData';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import ScheduleDetailModal from '../../components/modals/ScheduleDetailModal';

const AllSchedulesPage = () => {
  const [schedules] = useState(getAllSchedules());
  const orgs = getAllOrganizations();
  const orgMap = {};
  orgs.forEach(o => { orgMap[o.id] = o; });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = schedules.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      (orgMap[s.organizationId]?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchType = typeFilter === 'all' || s.organizationType === typeFilter;
    return matchSearch && matchStatus && matchType;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Semua Jadwal</h1>
        <p className="text-gray-500 text-sm mt-1">{schedules.length} total jadwal terdaftar</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari jadwal..." className="input-field pl-9"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">Semua Status</option>
          <option value="PENDING">Menunggu</option>
          <option value="APPROVED">Disetujui</option>
          <option value="REJECTED">Ditolak</option>
          <option value="REVISION_REQUIRED">Perlu Revisi</option>
        </select>
        <select className="input-field sm:w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">Semua Tipe</option>
          <option value="UKM">UKM</option>
          <option value="LAB">LAB</option>
          <option value="EVENT">EVENT</option>
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Judul</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipe</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Organisasi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tanggal</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{s.title}</td>
                  <td className="px-4 py-3"><OrgTypeBadge type={s.organizationType} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{orgMap[s.organizationId]?.name || '–'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(s.startDate)}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(s)} className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1">
                      <Eye size={14} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Tidak ada jadwal yang cocok</div>
          )}
        </div>
      </div>

      {selected && (
        <ScheduleDetailModal
          schedule={selected}
          organization={orgMap[selected.organizationId]}
          onClose={() => setSelected(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AllSchedulesPage;

