import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getApprovedSchedules } from '../../services/scheduleService';
import { getRegistrationsByStudent, cancelRegistration } from '../../services/registrationService';
import { getAllOrganizations } from '../../services/organizationService';
import { formatDate, formatDateTime, formatTime } from '../../utils/dateUtils';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import ConfirmModal from '../../components/modals/ConfirmModal';
import {
  ClipboardList, Calendar, Clock, MapPin, CheckCircle2,
  XCircle, AlertCircle, ArrowRight
} from 'lucide-react';

const StudentRegistrationsPage = () => {
  const { user } = useAuth();
  const { refresh } = useAppData();

  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const schedules = getApprovedSchedules();
  const schedMap = {};
  schedules.forEach(s => { schedMap[s.id] = s; });

  const orgs = getAllOrganizations();
  const orgMap = {};
  orgs.forEach(o => { orgMap[o.id] = o; });

  const registrations = user ? getRegistrationsByStudent(user.id) : [];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmCancel = () => {
    if (!user || !cancelTarget) return;
    const res = cancelRegistration(user.id, cancelTarget.scheduleId);
    if (res.success) {
      showToast('Pendaftaran kegiatan telah berhasil dibatalkan.');
      refresh();
    } else {
      showToast('Gagal membatalkan pendaftaran.', 'error');
    }
    setCancelTarget(null);
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pendaftaran & Riwayat Kegiatan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Daftar seluruh kegiatan kampus yang telah Anda daftarkan.
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="card text-center py-16">
          <ClipboardList size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-700">Belum Ada Pendaftaran Kegiatan</h3>
          <p className="text-sm text-gray-500 mt-1">
            Anda belum mendaftar ke kegiatan apapun. Jelajahi kegiatan aktif dan daftar sekarang.
          </p>
          <Link
            to="/student/activities"
            className="btn-primary inline-flex items-center gap-2 mt-5 text-sm"
          >
            Daftar Kegiatan Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map(reg => {
            const schedule = schedMap[reg.scheduleId];
            if (!schedule) return null;
            const org = orgMap[schedule.organizationId];

            return (
              <div
                key={reg.id}
                className="card p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <OrgTypeBadge type={schedule.organizationType} />
                    <span className="text-xs bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Terkonfirmasi
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{schedule.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1">{schedule.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{org?.name}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-blue-500" />
                      {formatDate(schedule.startDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-blue-500" />
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)} WIB
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-blue-500" />
                      {schedule.location}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-2">
                    Tanggal Pendaftaran: {formatDateTime(reg.registeredAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <Link
                    to={`/schedule/${schedule.id}`}
                    className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Detail Kegiatan <ArrowRight size={13} />
                  </Link>
                  <button
                    onClick={() => setCancelTarget(reg)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle size={14} /> Batalkan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={!!cancelTarget}
        title="Batalkan Pendaftaran Kegiatan"
        message="Apakah Anda yakin ingin membatalkan pendaftaran untuk kegiatan ini? Kuota Anda akan dilepaskan untuk mahasiswa lain."
        confirmLabel="Ya, Batalkan Pendaftaran"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </StudentLayout>
  );
};

export default StudentRegistrationsPage;

