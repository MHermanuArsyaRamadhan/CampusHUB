import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getApprovedSchedules } from '../../services/scheduleService';
import { getAllOrganizations } from '../../services/organizationService';
import {
  registerForEvent, cancelRegistration, isRegistered, getRegistrationCount,
  toggleFavorite, isFavorited
} from '../../services/registrationService';
import { formatDate, formatTime, getDaysUntil } from '../../utils/dateUtils';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import ScheduleDetailModal from '../../components/modals/ScheduleDetailModal';
import {
  Search, Filter, Calendar, MapPin, Clock, Users,
  Bookmark, CheckCircle2, AlertCircle, Eye, ArrowRight
} from 'lucide-react';

const StudentActivitiesPage = () => {
  const { user } = useAuth();
  const { refresh } = useAppData();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'ALL';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [toast, setToast] = useState(null);

  const schedules = getApprovedSchedules();
  const organizations = getAllOrganizations();
  const orgMap = {};
  organizations.forEach(o => { orgMap[o.id] = o; });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const categories = useMemo(() => {
    const cats = new Set(schedules.map(s => s.category));
    return ['ALL', ...Array.from(cats)];
  }, [schedules]);

  const filtered = schedules.filter(s => {
    if (typeFilter !== 'ALL' && s.organizationType !== typeFilter) return false;
    if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const orgName = orgMap[s.organizationId]?.name?.toLowerCase() || '';
      return s.title.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || orgName.includes(q);
    }
    return true;
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const handleToggleFavorite = (scheduleId) => {
    if (!user) return;
    const res = toggleFavorite(user.id, scheduleId);
    if (res.success) {
      showToast(res.favorited ? 'Kegiatan ditambahkan ke favorit!' : 'Dihapus dari favorit.');
      refresh();
    }
  };

  const handleRegister = (schedule) => {
    if (!user) return;
    const res = registerForEvent(user.id, schedule.id, schedule.capacity);
    if (res.success) {
      showToast('Pendaftaran berhasil dikonfirmasi!');
      refresh();
    } else {
      showToast(res.error, 'error');
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Jelajahi Kegiatan Kampus</h1>
        <p className="text-sm text-gray-500 mt-1">
          Temukan berbagai kegiatan UKM, seminar LAB, dan festival kampus yang sesuai dengan minat Anda.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kegiatan, topik, atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field bg-white"
          >
            <option value="ALL">Semua Jenis (UKM, LAB, EVENT)</option>
            <option value="UKM">UKM (Unit Kegiatan Mahasiswa)</option>
            <option value="LAB">LAB (Organisasi & Riset Dosen)</option>
            <option value="EVENT">EVENT (Panitia Acara Kampus)</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field bg-white"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'Semua Kategori' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-700">Tidak ada kegiatan yang cocok</h3>
          <p className="text-sm text-gray-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter yang dipilih.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(schedule => {
            const org = orgMap[schedule.organizationId];
            const registered = user ? isRegistered(user.id, schedule.id) : false;
            const favorited = user ? isFavorited(user.id, schedule.id) : false;
            const regCount = getRegistrationCount(schedule.id);
            const isFull = schedule.capacity ? regCount >= schedule.capacity : false;
            const days = getDaysUntil(schedule.startDate);

            return (
              <div
                key={schedule.id}
                className="card p-5 flex flex-col justify-between hover:shadow-lg transition-all border border-gray-100"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <OrgTypeBadge type={schedule.organizationType} />
                      <span className="text-xs text-gray-500 font-medium">{schedule.category}</span>
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(schedule.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        favorited ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-gray-50'
                      }`}
                      title={favorited ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                    >
                      <Bookmark size={16} className={favorited ? 'fill-amber-500' : ''} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                    {schedule.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {org?.name || 'Organisasi Kampus'}
                  </p>

                  <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-blue-500 shrink-0" />
                      <span>{formatDate(schedule.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-blue-500 shrink-0" />
                      <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)} WIB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-blue-500 shrink-0" />
                      <span className="truncate">{schedule.location}</span>
                    </div>
                    {schedule.capacity && (
                      <div className="flex items-center gap-2">
                        <Users size={13} className="text-blue-500 shrink-0" />
                        <span>{regCount} / {schedule.capacity} Kuota {isFull && <strong className="text-red-500">(Penuh)</strong>}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
                  <Link
                    to={`/schedule/${schedule.id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Rincian <ArrowRight size={13} />
                  </Link>

                  {schedule.registrationOpen && (
                    registered ? (
                      <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-green-200">
                        <CheckCircle2 size={12} /> Terdaftar
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(schedule)}
                        disabled={isFull}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          isFull
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'btn-primary'
                        }`}
                      >
                        {isFull ? 'Penuh' : 'Daftar'}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedSchedule && (
        <ScheduleDetailModal
          schedule={selectedSchedule}
          organization={orgMap[selectedSchedule.organizationId]}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </StudentLayout>
  );
};

export default StudentActivitiesPage;

