import React, { useState } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { resetData } from '../../services/dataInitService';
import { useAppData } from '../../context/AppDataContext';

const SettingsPage = () => {
  const { refresh } = useAppData();
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    setResetting(true);
    setTimeout(() => {
      resetData();
      refresh();
      setResetting(false);
      setConfirmReset(false);
      showToast('Data demo berhasil direset ke kondisi awal!');
    }, 1000);
  };

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm flex items-center gap-2 animate-fadeIn ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1">Konfigurasi dan manajemen data demo</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Reset Demo Data */}
        <div className="card border border-orange-100">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-2.5 rounded-lg shrink-0">
              <RefreshCw size={20} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 mb-1">Reset Data Demo</h2>
              <p className="text-sm text-gray-600 mb-4">
                Mengembalikan semua data ke kondisi awal demo. Semua perubahan data (jadwal baru, approval, dll.) akan dihapus dan data awal akan dimuat ulang. Sesi login Anda akan tetap aktif.
              </p>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={15} className="text-orange-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-orange-700">
                    Tindakan ini tidak dapat dibatalkan. Semua data yang Anda buat selama sesi demo akan dihapus.
                  </p>
                </div>
              </div>
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <RefreshCw size={16} /> Reset Data Demo
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-orange-700 font-medium">Konfirmasi reset?</p>
                  <button onClick={handleReset} disabled={resetting}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    {resetting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 size={15} />}
                    Ya, Reset Sekarang
                  </button>
                  <button onClick={() => setConfirmReset(false)} className="btn-secondary text-sm">Batal</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Tentang CampusHUB</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span>Versi</span>
              <span className="font-medium text-gray-900">1.0.0 Demo</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span>Stack Teknologi</span>
              <span className="font-medium text-gray-900">React + Vite + Tailwind CSS</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span>Storage</span>
              <span className="font-medium text-gray-900">Browser localStorage</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Backend</span>
              <span className="font-medium text-gray-900">Tidak diperlukan (Frontend Only)</span>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              CampusHUB adalah aplikasi demo frontend-only. Semua data disimpan di localStorage browser Anda. Tidak ada server, database, atau koneksi internet yang diperlukan.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;

