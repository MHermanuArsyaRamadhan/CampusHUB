import React, { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import { getAllOrganizations } from '../../services/organizationService';
import { getApprovedSchedules } from '../../services/scheduleService';
import { ORG_COLORS, ORG_TYPES } from '../../data/seedData';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import { Building2, Search, Mail, Calendar, ArrowRight, Award, BookOpen, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrganizationsPage = () => {
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
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 size={14} />
            Direktori Kampus
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Organisasi & Unit Kegiatan
          </h1>
          <p className="text-base text-gray-600 mt-2 max-w-2xl">
            Kenali berbagai Unit Kegiatan Mahasiswa (UKM), Laboratorium & Organisasi Mahasiswa (LAB), serta Panitia Event yang aktif di lingkungan universitas.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari organisasi atau bidang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: 'Semua Organisasi' },
              { id: 'UKM', label: 'UKM' },
              { id: 'LAB', label: 'LAB' },
              { id: 'EVENT', label: 'Event' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterType === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid cards */}
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
                    <span className="text-xs text-gray-400 font-medium">
                      {orgSchedules.length} Kegiatan Aktif
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{org.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {org.description || 'Tidak ada deskripsi rinci.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Mail size={14} className="text-gray-400" />
                    <span className="truncate">{org.email}</span>
                  </div>

                  <Link
                    to={`/calendar`}
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Calendar size={14} />
                    Lihat di Kalender
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada organisasi yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default OrganizationsPage;

