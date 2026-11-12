import React, { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { updateCurrentUser } from '../../services/authService';
import { getRegistrationsByStudent, getFavoritesByStudent } from '../../services/registrationService';
import { User, Mail, Award, CheckCircle2, AlertCircle, Save, Calendar, Bookmark } from 'lucide-react';

const StudentProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const myRegistrations = user ? getRegistrationsByStudent(user.id) : [];
  const myFavorites = user ? getFavoritesByStudent(user.id) : [];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama lengkap tidak boleh kosong.', 'error');
      return;
    }

    setLoading(true);
    const res = updateCurrentUser({ name: name.trim() });
    setLoading(false);

    if (res.success) {
      refreshUser();
      showToast('Profil mahasiswa berhasil diperbarui!');
    } else {
      showToast(res.error || 'Gagal memperbarui profil.', 'error');
    }
  };

  return (
    <StudentLayout>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm flex items-center gap-2 animate-fadeIn ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profil Mahasiswa</h1>
          <p className="text-sm text-gray-500 mt-1">
            Informasi akun dan riwayat aktivitas kegiatan kampus Anda
          </p>
        </div>

        {/* Stats Highlight */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
              <Calendar size={22} />
            </div>
            <div>
              <div className="text-2xl font-black text-blue-950">{myRegistrations.length}</div>
              <div className="text-xs text-blue-700 font-medium">Kegiatan Terdaftar</div>
            </div>
          </div>

          <div className="card p-5 flex items-center gap-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-sm">
              <Bookmark size={22} />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-950">{myFavorites.length}</div>
              <div className="text-xs text-amber-700 font-medium">Kegiatan Tersimpan</div>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
              {user?.name?.charAt(0) || 'M'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                NIM: <span className="font-mono font-bold text-gray-700">{user?.nim || '–'}</span> · Mahasiswa Aktif
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label">Nama Lengkap</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Nomor Induk Mahasiswa (NIM)</label>
              <input
                type="text"
                className="input-field bg-gray-50 text-gray-500 cursor-not-allowed font-mono"
                value={user?.nim || ''}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">NIM bersifat unik dan diverifikasi pada saat registrasi awal.</p>
            </div>

            <div>
              <label className="label">Alamat Email</label>
              <input
                type="email"
                className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
                value={user?.email || ''}
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Email digunakan untuk login autentikasi ke akun CampusHub.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5"
              >
                <Save size={16} />
                {loading ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfilePage;

