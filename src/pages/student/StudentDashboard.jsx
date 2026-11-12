import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { getApprovedSchedules } from '../../services/scheduleService';
import { getRegistrationsByStudent, getFavoritesByStudent } from '../../services/registrationService';
import { getAllOrganizations } from '../../services/organizationService';
import { formatDate, formatTime, getDaysUntil } from '../../utils/dateUtils';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import {
  Calendar, Search, Bookmark, ClipboardList, Building2,
  ArrowRight, Clock, MapPin, CheckCircle2, Sparkles
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  const schedules = getApprovedSchedules();
  const myRegistrations = user ? getRegistrationsByStudent(user.id) : [];
  const myFavorites = user ? getFavoritesByStudent(user.id) : [];
  const organizations = getAllOrganizations().filter(o => o.isActive);

  const orgMap = {};
  organizations.forEach(o => { orgMap[o.id] = o; });

  const schedMap = {};
  schedules.forEach(s => { schedMap[s.id] = s; });

  // Upcoming approved activities
  const upcoming = schedules
    .filter(s => new Date(s.startDate) >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 4);

  return (
    <StudentLayout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles size={14} className="text-yellow-300" />
              Portal Mahasiswa Aktif
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              NIM: <span className="font-mono font-semibold">{user?.nim || '–'}</span> · Jelajahi dan ikuti kegiatan seru di kampus hari ini.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/student/activities"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm"
            >
              Jelajahi Kegiatan
            </Link>
            <Link
              to="/student/calendar"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
            >
              Buka Kalender
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/student/registrations" className="stat-card hover:shadow-md transition-shadow">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl inline-block mb-2">
            <ClipboardList size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{myRegistrations.length}</div>
          <div className="text-xs text-gray-500 font-medium">Kegiatan Diikuti</div>
        </Link>

        <Link to="/student/favorites" className="stat-card hover:shadow-md transition-shadow">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl inline-block mb-2">
            <Bookmark size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{myFavorites.length}</div>
          <div className="text-xs text-gray-500 font-medium">Disimpan di Favorit</div>
        </Link>

        <Link to="/student/activities" className="stat-card hover:shadow-md transition-shadow">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl inline-block mb-2">
            <Calendar size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{schedules.length}</div>
          <div className="text-xs text-gray-500 font-medium">Kegiatan Tersedia</div>
        </Link>

        <Link to="/student/organizations" className="stat-card hover:shadow-md transition-shadow">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl inline-block mb-2">
            <Building2 size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-900">{organizations.length}</div>
          <div className="text-xs text-gray-500 font-medium">Unit & Organisasi</div>
        </Link>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Activities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              Kegiatan Mendatang
            </h2>
            <Link to="/student/activities" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {upcoming.map(item => {
              const days = getDaysUntil(item.startDate);
              const org = orgMap[item.organizationId];

              return (
                <div
                  key={item.id}
                  className="card p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <OrgTypeBadge type={item.organizationType} />
                      <span className="text-xs text-gray-400 font-medium">{item.category}</span>
                      {days !== null && days >= 0 && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          days === 0 ? 'bg-red-100 text-red-700' :
                          days <= 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {days === 0 ? 'Hari ini' : `${days} hari lagi`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{org?.name}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-blue-500" />
                        {formatDate(item.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-blue-500" />
                        {formatTime(item.startTime)} WIB
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-blue-500" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/schedule/${item.id}`}
                    className="btn-secondary text-xs px-4 py-2 self-start sm:self-auto shrink-0 flex items-center gap-1.5 font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Detail & Daftar
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Registered Activities Summary */}
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                Pendaftaran Saya
              </h3>
              <Link to="/student/registrations" className="text-xs text-blue-600 font-medium hover:underline">
                Kelola
              </Link>
            </div>

            {myRegistrations.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                Anda belum mendaftar kegiatan apapun.
              </div>
            ) : (
              <div className="space-y-3">
                {myRegistrations.slice(0, 3).map(reg => {
                  const s = schedMap[reg.scheduleId];
                  if (!s) return null;

                  return (
                    <div key={reg.id} className="p-3 bg-gray-50 rounded-xl text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <OrgTypeBadge type={s.organizationType} />
                        <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                          Terkonfirmasi
                        </span>
                      </div>
                      <p className="font-bold text-gray-800 truncate mt-1">{s.title}</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{formatDate(s.startDate)} · {s.location}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Categories */}
          <div className="card">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Jelajahi Berdasarkan Kategori</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Olahraga', 'Seni & Budaya', 'Workshop', 'Seminar', 'Festival', 'Kompetisi'].map(cat => (
                <Link
                  key={cat}
                  to={`/student/activities?cat=${cat}`}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 text-xs font-medium rounded-lg transition-colors border border-gray-100"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;

