import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import ScheduleForm from '../../components/forms/ScheduleForm';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getScheduleById, updateSchedule } from '../../services/scheduleService';
import { notifyNewSubmission } from '../../services/notificationService';
import { getOrgById } from '../../services/organizationService';
import { CheckCircle2, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';

const OrgEditSchedulePage = ({ orgType, basePath }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const { refresh } = useAppData();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const org = user?.organizationId ? getOrgById(user.organizationId) : null;

  useEffect(() => {
    const s = getScheduleById(id);
    if (!s) {
      setErrorMessage('Jadwal tidak ditemukan.');
      return;
    }

    // CRITICAL SECURITY SIMULATION: Strict ownership check
    if (s.organizationId !== user?.organizationId) {
      setErrorMessage('Akses Ditolak: Anda tidak memiliki izin untuk mengedit jadwal organisasi lain.');
      return;
    }

    setSchedule(s);
  }, [id, user]);

  const handleSubmit = (formData) => {
    if (!user || !user.organizationId || !schedule) return;

    setLoading(true);
    const res = updateSchedule(
      schedule.id,
      formData,
      user.id,
      user.organizationId
    );
    setLoading(false);

    if (res.success) {
      notifyNewSubmission(res.schedule);
      refresh();
      setSuccessMessage('Jadwal berhasil diperbarui dan diajukan ulang untuk persetujuan Super Admin Universitas.');
      setTimeout(() => {
        navigate(`${basePath}/schedules`);
      }, 1800);
    } else {
      setErrorMessage(res.error || 'Gagal memperbarui jadwal.');
    }
  };

  if (errorMessage) {
    return (
      <OrganizationLayout basePath={basePath} orgType={orgType}>
        <div className="max-w-xl mx-auto py-16 text-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-200 inline-block mb-4">
            <ShieldAlert size={36} className="mx-auto text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Peringatan Akses</h2>
          <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate(`${basePath}/schedules`)}
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Kembali ke Jadwal Saya
          </button>
        </div>
      </OrganizationLayout>
    );
  }

  if (!schedule) {
    return (
      <OrganizationLayout basePath={basePath} orgType={orgType}>
        <div className="p-8 text-center text-gray-400">Memuat data jadwal...</div>
      </OrganizationLayout>
    );
  }

  return (
    <OrganizationLayout basePath={basePath} orgType={orgType}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(`${basePath}/schedules`)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Daftar Jadwal
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Jadwal Kegiatan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ubah rincian kegiatan untuk <strong>{org?.name}</strong>. Jadwal yang telah diedit akan kembali berstatus PENDING untuk diverifikasi Super Admin.
          </p>
        </div>

        {schedule.reviewNote && (
          <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs">
            <strong className="block font-semibold mb-1">Catatan Revisi dari Super Admin:</strong>
            {schedule.reviewNote}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-center gap-3 text-sm animate-fadeIn">
            <CheckCircle2 size={20} className="text-green-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="card p-6 sm:p-8">
          <ScheduleForm
            initialData={schedule}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Simpan Perubahan & Ajukan Ulang"
            excludeId={schedule.id}
          />
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrgEditSchedulePage;

