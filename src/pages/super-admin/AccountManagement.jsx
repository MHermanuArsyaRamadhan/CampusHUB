import React, { useState } from 'react';
import { Plus, Search, Eye, EyeOff, Edit2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { getAllUsers, createOrgUser, toggleUserActive } from '../../services/userService';
import { getAllOrganizations, createOrganization } from '../../services/organizationService';
import { ROLES, ORG_TYPES } from '../../data/seedData';
import { formatDateTime } from '../../utils/dateUtils';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import { useAppData } from '../../context/AppDataContext';

const roleLabel = { SUPER_ADMIN: 'Super Admin', UKM_ADMIN: 'UKM Admin', LAB_ADMIN: 'LAB Admin', EVENT_ADMIN: 'Event Admin', STUDENT: 'Mahasiswa' };

const CreateOrgModal = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ orgName: '', orgType: '', orgDesc: '', email: '', password: '', confirmPass: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.orgName.trim()) errs.orgName = 'Nama organisasi wajib diisi.';
    if (!form.orgType) errs.orgType = 'Tipe organisasi wajib dipilih.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email tidak valid.';
    if (!form.password || form.password.length < 6) errs.password = 'Password minimal 6 karakter.';
    if (form.password !== form.confirmPass) errs.confirmPass = 'Password tidak cocok.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const roleMap = { UKM: ROLES.UKM_ADMIN, LAB: ROLES.LAB_ADMIN, EVENT: ROLES.EVENT_ADMIN };

    // Create org first (temporary user id)
    const tempOrgId = 'org_' + Date.now();
    const orgResult = createOrganization({
      name: form.orgName,
      type: form.orgType,
      description: form.orgDesc,
      email: form.email,
      adminUserId: tempOrgId,
    });

    if (!orgResult.success) {
      setErrors({ general: orgResult.error });
      setLoading(false);
      return;
    }

    const userResult = createOrgUser({
      name: form.orgName,
      email: form.email,
      password: form.password,
      role: roleMap[form.orgType],
      organizationId: orgResult.org.id,
    });

    if (!userResult.success) {
      setErrors({ email: userResult.error });
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Buat Akun Organisasi</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{errors.general}</div>
          )}

          <div>
            <label className="label">Tipe Organisasi *</label>
            <select className={`input-field ${errors.orgType ? 'border-red-400' : ''}`} value={form.orgType} onChange={handleChange('orgType')}>
              <option value="">Pilih tipe...</option>
              <option value="UKM">UKM – Unit Kegiatan Mahasiswa</option>
              <option value="LAB">LAB – Laboratorium/Organisasi</option>
              <option value="EVENT">EVENT – Panitia Event</option>
            </select>
            {errors.orgType && <p className="text-xs text-red-500 mt-1">{errors.orgType}</p>}
          </div>

          <div>
            <label className="label">Nama Organisasi *</label>
            <input type="text" className={`input-field ${errors.orgName ? 'border-red-400' : ''}`}
              placeholder="Contoh: UKM Badminton" value={form.orgName} onChange={handleChange('orgName')} />
            {errors.orgName && <p className="text-xs text-red-500 mt-1">{errors.orgName}</p>}
          </div>

          <div>
            <label className="label">Deskripsi Organisasi</label>
            <textarea className="input-field resize-none" rows={3}
              placeholder="Deskripsi singkat..." value={form.orgDesc} onChange={handleChange('orgDesc')} />
          </div>

          <div>
            <label className="label">Email Akun *</label>
            <input type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`}
              placeholder="contoh@email.com" value={form.email} onChange={handleChange('email')} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Password *</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                placeholder="Minimal 6 karakter" value={form.password} onChange={handleChange('password')} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="label">Konfirmasi Password *</label>
            <input type="password" className={`input-field ${errors.confirmPass ? 'border-red-400' : ''}`}
              placeholder="Ulangi password" value={form.confirmPass} onChange={handleChange('confirmPass')} />
            {errors.confirmPass && <p className="text-xs text-red-500 mt-1">{errors.confirmPass}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><CheckCircle2 size={16} /> Buat Akun</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AccountManagement = () => {
  const { refresh } = useAppData();
  const [users, setUsers] = useState(getAllUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (userId) => {
    toggleUserActive(userId);
    setUsers(getAllUsers());
    refresh();
    showToast('Status akun diperbarui.');
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    setUsers(getAllUsers());
    refresh();
    showToast('Akun organisasi berhasil dibuat!');
  };

  const orgs = getAllOrganizations();
  const orgMap = {};
  orgs.forEach(o => { orgMap[o.id] = o; });

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 animate-fadeIn ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Akun</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} akun terdaftar</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={18} /> Buat Akun Organisasi
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari akun..." className="input-field pl-9"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-48" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">Semua Role</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="UKM_ADMIN">UKM Admin</option>
          <option value="LAB_ADMIN">LAB Admin</option>
          <option value="EVENT_ADMIN">Event Admin</option>
          <option value="STUDENT">Mahasiswa</option>
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Organisasi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => {
                const org = u.organizationId ? orgMap[u.organizationId] : null;
                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      {org ? (
                        <OrgTypeBadge type={org.type} />
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.role === ROLES.SUPER_ADMIN ? 'bg-red-100 text-red-700' :
                          u.role === ROLES.STUDENT ? 'bg-indigo-100 text-indigo-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{roleLabel[u.role]}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{org?.name || (u.nim ? `NIM: ${u.nim}` : '–')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== ROLES.SUPER_ADMIN && (
                        <button
                          onClick={() => handleToggle(u.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        >
                          {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Tidak ada akun yang cocok</div>
          )}
        </div>
      </div>

      {showCreate && <CreateOrgModal onClose={() => setShowCreate(false)} onSuccess={handleCreateSuccess} />}
    </AdminLayout>
  );
};

export default AccountManagement;

