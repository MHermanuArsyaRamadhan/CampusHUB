import React, { useState } from 'react';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getOrgById, updateOrganization } from '../../services/organizationService';
import { ORG_COLORS } from '../../data/seedData';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import { Building2, Mail, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const OrgProfilePage = ({ orgType, basePath }) => {
  const { user } = useAuth();
  const { refresh } = useAppData();

  const org = user?.organizationId ? getOrgById(user.organizationId) : null;

  const [form, setForm] = useState({
    name: org?.name || '',
    description: org?.description || '',
    email: org?.email || '',
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!org) return;

    setLoading(true);
    const res = updateOrganization(org.id, {
      name: form.name.trim(),
      description: form.description.trim(),
    });
    setLoading(false);

    if (res.success) {
      showToast('Profil organisasi berhasil diperbarui.');
      refresh();
    } else {
      showToast(res.error || 'Gagal menyimpan profil.', 'error');
    }
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

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profil Organisasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola data dan informasi publik organisasi Anda
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-md"
              style={{ backgroundColor: ORG_COLORS[orgType] || '#2563EB' }}
            >
              {org?.name ? org.name.charAt(0) : 'O'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{org?.name}</h2>
                <OrgTypeBadge type={orgType} />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Mail size={13} />
                {org?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nama Organisasi</label>
              <input
                type="text"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="label">Tipe Organisasi</label>
              <input
                type="text"
                className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
                value={orgType}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Tipe organisasi dikelola oleh Super Admin Universitas.</p>
            </div>

            <div>
              <label className="label">Email Resmi</label>
              <input
                type="email"
                className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
                value={form.email}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email akun terhubung dengan login organisasi.</p>
            </div>

            <div>
              <label className="label">Deskripsi Organisasi</label>
              <textarea
                rows={5}
                className="input-field resize-none"
                placeholder="Tuliskan profil singkat, visi, atau fokus kegiatan organisasi Anda..."
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5"
              >
                <Save size={16} />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrgProfilePage;

