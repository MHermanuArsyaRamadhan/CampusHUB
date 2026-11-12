import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getApprovedSchedules } from '../../services/scheduleService';
import { getFavoritesByStudent, toggleFavorite } from '../../services/registrationService';
import { getAllOrganizations } from '../../services/organizationService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import { Bookmark, Calendar, Clock, MapPin, Trash2, ArrowRight } from 'lucide-react';

const StudentFavoritesPage = () => {
  const { user } = useAuth();
  const { refresh } = useAppData();

  const schedules = getApprovedSchedules();
  const schedMap = {};
  schedules.forEach(s => { schedMap[s.id] = s; });

  const orgs = getAllOrganizations();
  const orgMap = {};
  orgs.forEach(o => { orgMap[o.id] = o; });

  const favorites = user ? getFavoritesByStudent(user.id) : [];

  const handleRemoveFavorite = (scheduleId) => {
    if (!user) return;
    toggleFavorite(user.id, scheduleId);
    refresh();
  };

  return (
    <StudentLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kegiatan Favorit Saya</h1>
        <p className="text-sm text-gray-500 mt-1">
          Daftar kegiatan kampus yang Anda simpan untuk kemudahan pemantauan.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="card text-center py-16">
          <Bookmark size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-700">Belum Ada Kegiatan Favorit</h3>
          <p className="text-sm text-gray-500 mt-1">
            Simpan kegiatan menarik yang Anda temukan di menu Jelajahi Kegiatan atau Kalender Kampus.
          </p>
          <Link
            to="/student/activities"
            className="btn-primary inline-flex items-center gap-2 mt-5 text-sm"
          >
            Jelajahi Kegiatan Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map(fav => {
            const schedule = schedMap[fav.scheduleId];
            if (!schedule) return null;
            const org = orgMap[schedule.organizationId];

            return (
              <div
                key={fav.id}
                className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow border border-gray-100"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <OrgTypeBadge type={schedule.organizationType} />
                    <button
                      onClick={() => handleRemoveFavorite(schedule.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                      title="Hapus dari favorit"
                    >
                      <Trash2 size={16} />
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
                      <Calendar size={13} className="text-blue-500" />
                      <span>{formatDate(schedule.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-blue-500" />
                      <span>{formatTime(schedule.startTime)} WIB</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-blue-500" />
                      <span className="truncate">{schedule.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-[11px] text-gray-400">
                    Disimpan {formatDate(fav.addedAt)}
                  </span>
                  <Link
                    to={`/schedule/${schedule.id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Detail Kegiatan <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentFavoritesPage;

