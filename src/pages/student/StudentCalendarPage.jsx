import React from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import CampusCalendar from '../../components/calendar/CampusCalendar';
import { Calendar as CalendarIcon } from 'lucide-react';

const StudentCalendarPage = () => {
  return (
    <StudentLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kalender Kampus Terintegrasi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau seluruh agenda UKM, LAB, dan EVENT universitas yang telah diverifikasi Super Admin.
        </p>
      </div>

      <CampusCalendar initialView="dayGridMonth" height="740px" />
    </StudentLayout>
  );
};

export default StudentCalendarPage;

