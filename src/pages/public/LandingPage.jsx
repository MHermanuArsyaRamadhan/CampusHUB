import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Calendar, Users, Building2, ArrowRight, CheckCircle2,
  Star, Zap, Shield, ChevronDown, ChevronUp, Award, BookOpen, Music
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';
import { getApprovedSchedules } from '../../services/scheduleService';
import { getAllOrganizations } from '../../services/organizationService';
import { formatDateRange, formatTime, getDaysUntil } from '../../utils/dateUtils';
import OrgTypeBadge from '../../components/common/OrgTypeBadge';
import { ORG_COLORS } from '../../data/seedData';

const StatCard = ({ value, label, icon: Icon, color }) => (
  <div className="text-center">
    <div className={`inline-flex p-3 rounded-xl mb-3 ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

const HowItWorksStep = ({ step, title, desc }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
      {step}
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const schedules = getApprovedSchedules();
  const organizations = getAllOrganizations();
  const upcoming = schedules
    .filter(s => new Date(s.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6);

  const stats = {
    ukm: organizations.filter(o => o.type === 'UKM').length,
    lab: organizations.filter(o => o.type === 'LAB').length,
    event: organizations.filter(o => o.type === 'EVENT').length,
    schedules: schedules.length,
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-blue-200 mb-8">
              <Zap size={14} />
              Platform Terintegrasi untuk Seluruh Kampus
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              One Platform,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                All Campus Activities.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover, manage, and stay connected with every campus activity through one integrated platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/student/activities"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/50 hover:shadow-xl hover:scale-105"
              >
                Jelajahi Kegiatan
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
              >
                Masuk ke Platform
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={stats.ukm} label="Unit Kegiatan Mahasiswa" icon={Award} color="bg-purple-500" />
          <StatCard value={stats.lab} label="Laboratorium Aktif" icon={BookOpen} color="bg-green-500" />
          <StatCard value={stats.event} label="Panitia Event" icon={Music} color="bg-blue-500" />
          <StatCard value={stats.schedules} label="Jadwal Disetujui" icon={Calendar} color="bg-orange-500" />
        </div>
      </section>

      {/* Activity Types */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Tiga Jenis Kegiatan Kampus</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">CampusHUB mengintegrasikan seluruh jenis kegiatan kampus dalam satu kalender terpadu</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                type: 'UKM',
                color: ORG_COLORS.UKM,
                bg: 'bg-purple-50',
                border: 'border-purple-100',
                title: 'Unit Kegiatan Mahasiswa',
                desc: 'Organisasi mahasiswa berbasis minat dan bakat, dari olahraga, seni, hingga akademik.',
                examples: ['UKM Basket', 'UKM Musik', 'UKM Fotografi'],
              },
              {
                type: 'LAB',
                color: ORG_COLORS.LAB,
                bg: 'bg-green-50',
                border: 'border-green-100',
                title: 'Laboratorium & Organisasi',
                desc: 'Organisasi mahasiswa yang difasilitasi universitas dan dipimpin/dibimbing oleh dosen.',
                examples: ['LAB Multimedia', 'LAB Riset', 'LAB Komputer'],
              },
              {
                type: 'EVENT',
                color: ORG_COLORS.EVENT,
                bg: 'bg-blue-50',
                border: 'border-blue-100',
                title: 'Event Kampus',
                desc: 'Berbagai acara dan kegiatan kampus yang diselenggarakan oleh panitia khusus.',
                examples: ['Campus Festival', 'Seminar Nasional', 'Cultural Day'],
              },
            ].map(item => (
              <div key={item.type} className={`${item.bg} border ${item.border} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: item.color }}>
                    {item.type}
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
                <ul className="space-y-1">
                  {item.examples.map(ex => (
                    <li key={ex} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Activities */}
      {upcoming.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Kegiatan Mendatang</h2>
              <p className="text-gray-500 mt-1">Jangan lewatkan kegiatan-kegiatan berikut</p>
            </div>
            <Link to="/calendar" className="btn-secondary text-sm hidden sm:flex items-center gap-2">
              Lihat Kalender <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map(s => {
              const days = getDaysUntil(s.startDate);
              const color = ORG_COLORS[s.organizationType] || '#6B7280';
              return (
                <div key={s.id} className="card hover:shadow-md transition-shadow">
                  {s.poster ? (
                    <img src={s.poster} alt="" className="w-full h-36 object-cover rounded-lg mb-4" />
                  ) : (
                    <div className="w-full h-36 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                      <Calendar size={36} style={{ color }} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <OrgTypeBadge type={s.organizationType} />
                    <span className="text-xs text-gray-500">{s.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{s.title}</h3>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {formatDateRange(s.startDate, s.endDate)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 size={12} />
                      {s.location}
                    </div>
                  </div>
                  {days !== null && days >= 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className={`text-xs font-semibold ${days === 0 ? 'text-red-600' : days <= 3 ? 'text-orange-600' : 'text-blue-600'}`}>
                        {days === 0 ? 'Hari ini!' : `${days} hari lagi`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="bg-gradient-to-br from-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Cara Kerja CampusHUB</h2>
              <p className="text-blue-200 mb-8">Proses yang transparan dan terstruktur untuk semua kegiatan kampus</p>
              <div className="space-y-6">
                <HowItWorksStep step="1" title="Organisasi Ajukan Jadwal" desc="UKM, LAB, dan panitia event mengajukan jadwal kegiatan melalui dashboard masing-masing." />
                <HowItWorksStep step="2" title="Super Admin Verifikasi" desc="Super Admin Universitas meninjau setiap jadwal dan memberikan keputusan: Setujui, Tolak, atau Minta Revisi." />
                <HowItWorksStep step="3" title="Tampil di Kalender Publik" desc="Jadwal yang disetujui otomatis tampil di kalender kampus terintegrasi dan dapat dilihat semua mahasiswa." />
                <HowItWorksStep step="4" title="Mahasiswa Daftar & Ikut" desc="Mahasiswa dapat menemukan, mendaftar, dan mengikuti kegiatan kampus dengan mudah." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'Sistem Approval', desc: 'Setiap jadwal melewati verifikasi Super Admin' },
                { icon: Calendar, label: 'Kalender Terintegrasi', desc: 'Semua kegiatan dalam satu kalender' },
                { icon: Users, label: 'Multi-Role', desc: 'Admin, Organisasi, dan Mahasiswa' },
                { icon: CheckCircle2, label: 'Real-time Update', desc: 'Status jadwal selalu terkini' },
              ].map(item => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <item.icon size={24} className="text-blue-300 mb-3" />
                  <h4 className="font-semibold text-sm mb-1">{item.label}</h4>
                  <p className="text-xs text-blue-200">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-blue-600 rounded-2xl p-10 text-white">
          <h2 className="text-3xl font-bold mb-4">Bergabung dengan CampusHUB</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Daftarkan diri sebagai mahasiswa dan mulai jelajahi seluruh kegiatan kampus Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors">
              Daftar Sekarang
            </Link>
            <Link to="/login" className="border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-colors">
              Sudah Punya Akun?
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;

