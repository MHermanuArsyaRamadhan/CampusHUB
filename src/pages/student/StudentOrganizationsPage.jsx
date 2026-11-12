import React, { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { getAllOrganizations } from '../../services/organizationService';
import { getApprovedSchedules } from '../../services/scheduleService';
import { ORG_COLORS } from '../../data/seedData';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import { Building2, Search, Mail, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentOrganizationsPage = () => {
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const organizations = getAllOrganizations().filter(o => o.isActive);
  const schedules = getApprovedSchedules();

  const filtered = organizations.filter(org => {
    if (filterType !== 'ALL' && org.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = org.name.toLowerCase().includes(q);
      const matchDesc = (org.description || '').toLowerCase().includes(q);
      return matchName || matchDesc;
    }
    return true;
  });

  return (
    <StudentLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Direktori Organisasi Kampus</h1>
        <p className="text-sm text-gray-500 mt-1">
          Daftar lengkap Unit Kegiatan Mahasiswa (UKM), Laboratorium & Organisasi (LAB), dan Panitia Acara.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari organisasi atau bidang minat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['ALL', 'UKM', 'LAB', 'EVENT'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'ALL' ? 'Semua Organisasi' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(org => {
          const orgSchedules = schedules.filter(s => s.organizationId === org.id);
          const color = ORG_COLORS[org.type] || '#2563EB';

          return (
            <div
              key={org.id}
              className="card flex flex-col justify-between border-t-4 hover:shadow-lg transition-all"
              style={{ borderTopColor: color }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <OrgTypeBadge type={org.type} />
                  <span className="text-xs text-gray-500 font-medium">
                    {orgSchedules.length} Kegiatan Aktif
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{org.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {org.description || 'Tidak ada deskripsi rinci.'}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Mail size={13} className="text-gray-400" />
                  <span className="truncate">{org.email}</span>
                </div>

                <Link
                  to="/student/calendar"
                  className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-blue-600 transition-colors"
                >
                  <Calendar size={13} />
                  Buka di Kalender
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </StudentLayout>
  );
};

export default StudentOrganizationsPage;

