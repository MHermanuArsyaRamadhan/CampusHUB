import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import { getScheduleById } from '../../services/scheduleService';
import { getOrgById } from '../../services/organizationService';
import { registerForEvent, cancelRegistration, isRegistered, getRegistrationCount, toggleFavorite, isFavorited } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import { formatDateRange, formatTime } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import {
  Calendar, MapPin, Clock, Users, Building2, Tag, ArrowLeft,
  Bookmark, CheckCircle2, AlertCircle, Share2
} from 'lucide-react';

const ScheduleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [schedule, setSchedule] = useState(null);
  const [org, setOrg] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [regCount, setRegCount] = useState(0);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const s = getScheduleById(id);
    if (s) {
      setSchedule(s);
      setOrg(getOrgById(s.organizationId));
      setRegCount(getRegistrationCount(s.id));
      if (user) {
        setRegistered(isRegistered(user.id, s.id));
        setFavorited(isFavorited(user.id, s.id));
      }
    }
  }, [id, user]);

  if (!schedule) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Kegiatan Tidak Ditemukan</h2>
          <p className="text-gray-500 mt-2">Jadwal yang Anda cari tidak tersedia atau belum disetujui.</p>
          <Link to="/calendar" className="btn-primary inline-flex items-center gap-2 mt-6">
            <ArrowLeft size={16} /> Kembali ke Kalender
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const handleRegister = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'STUDENT') {
      setMessage({ type: 'error', text: 'Hanya akun Mahasiswa yang dapat mendaftar kegiatan.' });
      return;
    }
    const res = registerForEvent(user.id, schedule.id, schedule.capacity);
    if (res.success) {
      setRegistered(true);
      setRegCount(c => c + 1);
      setMessage({ type: 'success', text: 'Berhasil mendaftar untuk kegiatan ini!' });
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  };

  const handleCancelRegister = () => {
    if (!user) return;
    const res = cancelRegistration(user.id, schedule.id);
    if (res.success) {
      setRegistered(false);
      setRegCount(c => Math.max(0, c - 1));
      setMessage({ type: 'info', text: 'Pendaftaran kegiatan telah dibatalkan.' });
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const res = toggleFavorite(user.id, schedule.id);
    if (res.success) {
      setFavorited(res.favorited);
    }
  };

  const isFull = schedule.capacity ? regCount >= schedule.capacity : false;

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Kembali
        </button>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm animate-fadeIn ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {schedule.poster && (
            <div className="w-full max-h-96 bg-gray-100 overflow-hidden">
              <img src={schedule.poster} alt={schedule.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <OrgTypeBadge type={schedule.organizationType} />
                <StatusBadge status={schedule.status} />
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
                  {schedule.category}
                </span>
              </div>

              {user?.role === 'STUDENT' && (
                <button
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    favorited
                      ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Bookmark size={14} className={favorited ? 'fill-amber-500 text-amber-500' : ''} />
                  {favorited ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              {schedule.title}
            </h1>

            {org && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-6">
                <Building2 size={16} className="text-blue-600" />
                Diselenggarakan oleh: <strong className="text-gray-800">{org.name}</strong>
              </p>
            )}

            {/* Quick Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-gray-50 rounded-2xl mb-8">
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tanggal</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDateRange(schedule.startDate, schedule.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Waktu</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)} WIB
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Lokasi</p>
                  <p className="text-sm font-semibold text-gray-800">{schedule.location}</p>
                </div>
              </div>

              {schedule.capacity && (
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Kapasitas Peserta</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {regCount} / {schedule.capacity} terdaftar {isFull && <span className="text-red-500 text-xs font-bold">(Penuh)</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Deskripsi Kegiatan</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {schedule.description || 'Tidak ada keterangan tambahan untuk kegiatan ini.'}
              </p>
            </div>

            {/* Action Bar / Registration */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">Status Pendaftaran:</p>
                <p className="text-sm font-bold text-gray-800">
                  {schedule.registrationOpen ? (
                    <span className="text-green-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Pendaftaran Terbuka
                    </span>
                  ) : (
                    <span className="text-gray-500">Pendaftaran Ditutup / Tidak Memerlukan Registrasi</span>
                  )}
                </p>
              </div>

              {schedule.registrationOpen && (
                <div className="w-full sm:w-auto">
                  {!registered ? (
                    <button
                      onClick={handleRegister}
                      disabled={isFull}
                      className={`w-full sm:w-auto btn-primary px-8 py-3 text-sm font-semibold shadow-md ${
                        isFull ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''
                      }`}
                    >
                      {isFull ? 'Kuota Penuh' : user ? 'Daftar Sekarang' : 'Masuk untuk Mendaftar'}
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Terdaftar
                      </span>
                      <button
                        onClick={handleCancelRegister}
                        className="text-xs text-red-600 hover:text-red-800 underline font-medium"
                      >
                        Batalkan Pendaftaran
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ScheduleDetailPage;

