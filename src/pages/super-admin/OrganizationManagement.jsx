import React, { useState } from 'react';
import { Plus, Building2, Users } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllOrganizations, toggleOrgActive } from '../../services/organizationService';
import { getAllUsers } from '../../services/userService';
import { ORG_COLORS } from '../../data/seedData';
import { formatDate } from '../../utils/dateUtils';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';

const OrganizationManagement = () => {
  const [orgs, setOrgs] = useState(getAllOrganizations());
  const users = getAllUsers();
  const userMap = {};
  users.forEach(u => { userMap[u.id] = u; });

  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = orgs.filter(o => typeFilter === 'all' || o.type === typeFilter);

  const handleToggle = (id) => {
    toggleOrgActive(id);
    setOrgs(getAllOrganizations());
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Organisasi</h1>
        <p className="text-gray-500 text-sm mt-1">{orgs.length} organisasi terdaftar</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {['UKM', 'LAB', 'EVENT'].map(type => (
          <div key={type} className="stat-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: ORG_COLORS[type] + '20' }}>
                <Building2 size={18} style={{ color: ORG_COLORS[type] }} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{orgs.filter(o => o.type === type).length}</div>
                <div className="text-xs text-gray-500">{type}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {['all', 'UKM', 'LAB', 'EVENT'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${typeFilter === t ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t === 'all' ? 'Semua' : t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(org => {
          const admin = userMap[org.adminUserId];
          return (
            <div key={org.id} className={`card border-l-4 hover:shadow-md transition-shadow ${!org.isActive ? 'opacity-60' : ''}`} style={{ borderLeftColor: ORG_COLORS[org.type] }}>
              <div className="flex items-start justify-between mb-3">
                <OrgTypeBadge type={org.type} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${org.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {org.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{org.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{org.description || 'Tidak ada deskripsi'}</p>
              {admin && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Users size={12} />
                  <span>Admin: {admin.email}</span>
                </div>
              )}
              <div className="text-xs text-gray-400 mb-3">Dibuat: {formatDate(org.createdAt)}</div>
              <button
                onClick={() => handleToggle(org.id)}
                className={`w-full text-xs py-1.5 rounded-lg font-medium transition-colors ${org.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
              >
                {org.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default OrganizationManagement;

