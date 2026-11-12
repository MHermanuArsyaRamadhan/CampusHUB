import React from 'react';
import PublicLayout from '../../layouts/PublicLayout';
import CampusCalendar from '../../components/calendar/CampusCalendar';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

const CalendarPage = () => {
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <CalendarIcon size={14} />
            Jadwal Terintegrasi
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Kalender Kegiatan Kampus
          </h1>
          <p className="text-base text-gray-600 mt-2 max-w-2xl">
            Satu kalender untuk semua aktivitas UKM, LAB, dan EVENT universitas yang telah diverifikasi dan disetujui resmi oleh Super Admin Universitas.
          </p>
        </div>

        {/* Calendar widget */}
        <CampusCalendar initialView="dayGridMonth" height="780px" />
      </div>
    </PublicLayout>
  );
};

export default CalendarPage;

