import React, { useState, useMemo, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import interactionPlugin from '@fullcalendar/react/interaction';
import listPlugin from '@fullcalendar/react/list';
import classicThemePlugin from '@fullcalendar/react/themes/classic';
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/classic/theme.css';
import '@fullcalendar/react/themes/classic/palette.css';
import { Search, Filter, Calendar as CalendarIcon, Info, Building2, MapPin, Clock, Tag } from 'lucide-react';
import { getApprovedSchedules } from '../../services/scheduleService';
import { getAllOrganizations } from '../../services/organizationService';
import { ORG_COLORS, ORG_TYPES } from '../../data/seedData';
import ScheduleDetailModal from '../modals/ScheduleDetailModal';

const CampusCalendar = ({ initialView = 'dayGridMonth', height = 'auto' }) => {
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [orgFilter, setOrgFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);

  const schedules = getApprovedSchedules();
  const organizations = getAllOrganizations();

  const orgMap = useMemo(() => {
    const map = {};
    organizations.forEach(o => { map[o.id] = o; });
    return map;
  }, [organizations]);

  // Filter approved schedules only
  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      // Must be approved
      if (s.status !== 'APPROVED') return false;

      // Type filter
      if (typeFilter !== 'ALL' && s.organizationType !== typeFilter) return false;

      // Org filter
      if (orgFilter !== 'ALL' && s.organizationId !== orgFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(query);
        const matchesLocation = s.location.toLowerCase().includes(query);
        const matchesCategory = s.category.toLowerCase().includes(query);
        const orgName = orgMap[s.organizationId]?.name?.toLowerCase() || '';
        const matchesOrg = orgName.includes(query);
        if (!matchesTitle && !matchesLocation && !matchesCategory && !matchesOrg) return false;
      }

      return true;
    });
  }, [schedules, typeFilter, orgFilter, searchQuery, orgMap]);

  // Convert to FullCalendar events format with automatic strict colors
  const calendarEvents = useMemo(() => {
    return filteredSchedules.map(s => {
      const color = ORG_COLORS[s.organizationType] || '#2563EB';
      return {
        id: s.id,
        title: s.title,
        start: `${s.startDate}T${s.startTime || '00:00:00'}`,
        end: `${s.endDate}T${s.endTime || '23:59:59'}`,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        extendedProps: {
          schedule: s,
          organization: orgMap[s.organizationId]
        }
      };
    });
  }, [filteredSchedules, orgMap]);

  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();
    setSelectedEvent(info.event.extendedProps.schedule);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      {/* Header Controls & Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="font-semibold text-gray-700 flex items-center gap-1.5">
              <CalendarIcon size={16} className="text-blue-600" />
              Kategori Kegiatan:
            </span>
            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-200">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ORG_COLORS.EVENT }}></span>
              EVENT ({schedules.filter(s => s.organizationType === 'EVENT').length})
            </div>
            <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium border border-purple-200">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ORG_COLORS.UKM }}></span>
              UKM ({schedules.filter(s => s.organizationType === 'UKM').length})
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-200">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ORG_COLORS.LAB }}></span>
              LAB ({schedules.filter(s => s.organizationType === 'LAB').length})
            </div>
          </div>

          <div className="text-xs text-gray-500 italic flex items-center gap-1">
            <Info size={14} className="text-blue-500" />
            Hanya jadwal berstatus <strong>APPROVED</strong> yang ditampilkan
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kegiatan, lokasi, atau organisasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Semua Jenis Kegiatan (UKM, LAB, EVENT)</option>
              <option value="EVENT">EVENT (Kegiatan & Acara Kampus)</option>
              <option value="UKM">UKM (Unit Kegiatan Mahasiswa)</option>
              <option value="LAB">LAB (Organisasi & Riset Dosen)</option>
            </select>
          </div>

          <div>
            <select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Semua Organisasi ({organizations.length})</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  [{org.type}] {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="campus-calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, classicThemePlugin]}
          themeSystem="classic"
          initialView={initialView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
          }}
          buttonText={{
            today: 'Hari Ini',
            month: 'Bulan',
            week: 'Minggu',
            day: 'Hari',
            list: 'Daftar'
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          locale="id"
          dayHeaderFormat={{ weekday: 'short' }}
          height={height}
          dayMaxEvents={3}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="23:00:00"
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <ScheduleDetailModal
          schedule={selectedEvent}
          organization={orgMap[selectedEvent.organizationId]}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default CampusCalendar;

