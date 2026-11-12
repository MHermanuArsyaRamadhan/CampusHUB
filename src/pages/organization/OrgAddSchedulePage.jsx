import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import ScheduleForm from '../../components/forms/ScheduleForm';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { createSchedule } from '../../services/scheduleService';
import { notifyNewSubmission } from '../../services/notificationService';
import { getOrgById } from '../../services/organizationService';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const OrgAddSchedulePage = ({ orgType, basePath }) => {
  const { user } = useAuth();
  const { refresh } = useAppData();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const org = user?.organizationId ? getOrgById(user.organizationId) : null;

  const handleSubmit = (formData) => {
    if (!user || !user.organizationId) return;

    setLoading(true);
    const res = createSchedule(
      formData,
      user.id,
      user.organizationId,
      orgType
    );
    setLoading(false);

    if (res.success) {
      notifyNewSubmission(res.schedule);
      refresh();
      setSuccessMessage('Jadwal berhasil diajukan dan sedang menunggu persetujuan Super Admin Universitas.');
      setTimeout(() => {
        navigate(`${basePath}/schedules`);
      }, 1800);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">
            {orgType === 'EVENT' ? 'Pengajuan Event Baru' : 'Pengajuan Jadwal Baru'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Isi formulir pengajuan jadwal kegiatan untuk <strong>{org?.name}</strong>. Semua jadwal yang diajukan akan ditinjau oleh Super Admin Universitas.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-center gap-3 text-sm animate-fadeIn">
            <CheckCircle2 size={20} className="text-green-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <div className="card p-6 sm:p-8">
          <ScheduleForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel={orgType === 'EVENT' ? 'Ajukan Event Baru' : 'Ajukan Jadwal'}
          />
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default OrgAddSchedulePage;

