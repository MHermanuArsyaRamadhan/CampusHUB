
import React, { useState, useMemo, useRef } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import {
  Search,
  CalendarDays,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Filter,
  X,
  Building2
} from 'lucide-react';

import { getApprovedSchedules } from '../../services/scheduleService';
import { getAllOrganizations } from '../../services/organizationService';
import { ORG_COLORS } from '../../data/seedData';

import ScheduleDetailModal from '../modals/ScheduleDetailModal';

// WARNA UNIK SETIAP ORGANISASI
const ORGANIZATION_COLORS = [
  '#4285F4',
  '#A855F7',
  '#22C55E',
  '#F97316',
  '#EF4444',
  '#EAB308',
  '#06B6D4',
  '#EC4899',
  '#8B5CF6',
  '#14B8A6',
  '#64748B',
  '#D946EF'
];

// FORMAT TANGGAL YYYY-MM-DD
const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// FORMAT TANGGAL INDONESIA
const formatDate = (date) => {
  if (!date) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// FORMAT JAM
const formatTime = (time) => {
  if (!time) return '--:--';

  return String(time).slice(0, 5);
};

// PARSE TANGGAL DAN JAM
const parseDateTime = (date, time = '00:00:00') => {
  if (!date) return null;

  const parsed = new Date(`${date}T${time}`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// NAMA BULAN
const getMonthName = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const CampusCalendar = ({
  initialView = 'dayGridMonth',
  height = 'auto'
}) => {

  // STATE
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedOrgIds, setSelectedOrgIds] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());

  const calendarRef = useRef(null);

  // DATA
  const schedules = getApprovedSchedules() || [];
  const organizations = getAllOrganizations() || [];

  // ORGANIZATION MAP
  const orgMap = useMemo(() => {
    const map = {};

    organizations.forEach(org => {
      map[org.id] = org;
    });

    return map;
  }, [organizations]);

  // COLOR ORGANIZATION
  const orgColors = useMemo(() => {
    const colors = {};

    organizations.forEach((org, index) => {
      colors[org.id] =
        ORGANIZATION_COLORS[index % ORGANIZATION_COLORS.length];
    });

    return colors;
  }, [organizations]);

  // FILTER SCHEDULES
  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {

      // ONLY APPROVED
      if (schedule.status !== 'APPROVED') return false;

      // FILTER TYPE
      if (
        typeFilter !== 'ALL' &&
        schedule.organizationType !== typeFilter
      ) return false;

      // FILTER ORGANIZATION
      if (
        selectedOrgIds !== null &&
        !selectedOrgIds.includes(schedule.organizationId)
      ) return false;

      // SEARCH
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        const title = (schedule.title || '').toLowerCase();
        const location = (schedule.location || '').toLowerCase();
        const category = (schedule.category || '').toLowerCase();

        const organization =
          orgMap[schedule.organizationId]?.name?.toLowerCase() || '';

        const matches =
          title.includes(query) ||
          location.includes(query) ||
          category.includes(query) ||
          organization.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  }, [
    schedules,
    typeFilter,
    selectedOrgIds,
    searchQuery,
    orgMap
  ]);

  // FULLCALENDAR EVENTS
  const calendarEvents = useMemo(() => {
    return filteredSchedules.map(schedule => {
      const color =
        orgColors[schedule.organizationId] ||
        ORG_COLORS[schedule.organizationType] ||
        '#2563EB';

      return {
        id: String(schedule.id),
        title: schedule.title,
        start: `${schedule.startDate}T${schedule.startTime || '00:00:00'}`,
        end: `${schedule.endDate || schedule.startDate}T${schedule.endTime || '23:59:59'}`,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        extendedProps: {
          schedule,
          organization: orgMap[schedule.organizationId]
        }
      };
    });
  }, [filteredSchedules, orgColors, orgMap]);

  // NAVIGATE CALENDAR
  const navigateCalendar = (direction) => {
    const api = calendarRef.current?.getApi();

    if (!api) return;

    if (direction === 'prev') {
      api.prev();
    } else if (direction === 'next') {
      api.next();
    } else {
      api.today();
    }

    setCalendarDate(api.getDate());
    setSelectedDate(api.getDate());
  };

  // MINI CALENDAR
  const miniCalendarDays = useMemo(() => {
    const firstDay = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      1
    );

    // MONDAY AS FIRST DAY
    const offset = (firstDay.getDay() + 6) % 7;

    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - offset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);

      return date;
    });
  }, [calendarDate]);

  // SELECT MINI CALENDAR DATE
  const selectMiniDate = (date) => {
    setSelectedDate(date);
    setCalendarDate(date);

    calendarRef.current?.getApi().gotoDate(date);
  };

  // FILTER ORGANIZATION
  const toggleOrganization = (id) => {
    const current =
      selectedOrgIds === null
        ? organizations.map(org => org.id)
        : selectedOrgIds;

    const next = current.includes(id)
      ? current.filter(orgId => orgId !== id)
      : [...current, id];

    setSelectedOrgIds(next);
  };

  // SELECT ALL ORGANIZATIONS
  const selectAllOrganizations = () => {
    setSelectedOrgIds(null);
  };

  // EVENT CLICK
  const handleEventClick = (info) => {
    info.jsEvent.preventDefault();

    setSelectedEvent(info.event.extendedProps.schedule);
  };

  // DATE CLICK
  const handleDateClick = (info) => {
    setSelectedDate(info.date);
  };

  // CALENDAR NAVIGATION UPDATE
  const handleDatesSet = (info) => {
    setCalendarDate(info.view.currentStart);
  };

  // SELECTED DATE SCHEDULES
  const selectedDateKey = getDateKey(selectedDate);

  const todaySchedules = useMemo(() => {
    return filteredSchedules
      .filter(schedule => {
        return (
          schedule.startDate <= selectedDateKey &&
          (schedule.endDate || schedule.startDate) >= selectedDateKey
        );
      })
      .sort((a, b) => {
        return (a.startTime || '').localeCompare(b.startTime || '');
      });
  }, [filteredSchedules, selectedDateKey]);

  // STATISTICS
  const statistics = useMemo(() => {
    const now = new Date();
    const todayKey = getDateKey(now);

    const weekStart = new Date(now);
    const offset = (now.getDay() + 6) % 7;

    weekStart.setDate(now.getDate() - offset);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekCount = filteredSchedules.filter(schedule => {
      const date = parseDateTime(schedule.startDate);

      return date && date >= weekStart && date < weekEnd;
    }).length;

    const monthCount = filteredSchedules.filter(schedule => {
      const date = parseDateTime(schedule.startDate);

      return (
        date &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    const todayCount = filteredSchedules.filter(schedule => {
      return (
        schedule.startDate <= todayKey &&
        (schedule.endDate || schedule.startDate) >= todayKey
      );
    }).length;

    return {
      weekCount,
      monthCount,
      todayCount
    };
  }, [filteredSchedules]);

  // CONFLICT DETECTION
  const conflicts = useMemo(() => {
    const results = [];

    for (let i = 0; i < filteredSchedules.length; i++) {
      for (let j = i + 1; j < filteredSchedules.length; j++) {

        const first = filteredSchedules[i];
        const second = filteredSchedules[j];

        const locationA = (first.location || '').trim().toLowerCase();
        const locationB = (second.location || '').trim().toLowerCase();

        if (!locationA || locationA !== locationB) continue;

        const startA = parseDateTime(
          first.startDate,
          first.startTime || '00:00:00'
        );

        const endA = parseDateTime(
          first.endDate || first.startDate,
          first.endTime || '23:59:59'
        );

        const startB = parseDateTime(
          second.startDate,
          second.startTime || '00:00:00'
        );

        const endB = parseDateTime(
          second.endDate || second.startDate,
          second.endTime || '23:59:59'
        );

        if (
          startA &&
          endA &&
          startB &&
          endB &&
          startA < endB &&
          startB < endA
        ) {
          results.push({
            first,
            second,
            location: first.location
          });
        }
      }
    }

    return results;
  }, [filteredSchedules]);

  // UPCOMING EVENTS
  const upcomingEvents = useMemo(() => {
    const today = getDateKey(new Date());

    return filteredSchedules
      .filter(schedule => schedule.startDate >= today)
      .sort((a, b) => {
        const dateCompare = a.startDate.localeCompare(b.startDate);

        if (dateCompare !== 0) return dateCompare;

        return (a.startTime || '').localeCompare(b.startTime || '');
      })
      .slice(0, 5);
  }, [filteredSchedules]);

  const selectedOrgCount =
    selectedOrgIds === null
      ? organizations.length
      : selectedOrgIds.length;

  return (
    <div className="organization-planner">

      {/* MAIN DASHBOARD GRID */}
      <div className="planner-layout">

        {/* LEFT SIDEBAR */}
        <aside className="planner-sidebar">

          <div className="mini-calendar-header">
            <strong>{getMonthName(calendarDate)}</strong>

            <div>
              <button onClick={() => navigateCalendar('prev')}>
                <ChevronLeft size={17} />
              </button>

              <button onClick={() => navigateCalendar('next')}>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* MINI CALENDAR */}
          <div className="mini-calendar-grid">

            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
              <span className="mini-weekday" key={day}>
                {day}
              </span>
            ))}

            {miniCalendarDays.map((date, index) => {
              const isCurrentMonth =
                date.getMonth() === calendarDate.getMonth();

              const isSelected =
                getDateKey(date) === getDateKey(selectedDate);

              const isToday =
                getDateKey(date) === getDateKey(new Date());

              return (
                <button
                  key={index}
                  onClick={() => selectMiniDate(date)}
                  className={[
                    'mini-day',
                    !isCurrentMonth ? 'mini-day-muted' : '',
                    isSelected ? 'mini-day-selected' : '',
                    isToday ? 'mini-day-today' : ''
                  ].join(' ')}
                >
                  {date.getDate()}
                </button>
              );
            })}

          </div>

          <div className="sidebar-divider" />

          {/* ORGANIZATION FILTER */}
          <div className="organization-section">

            <div className="organization-heading">
              <h3>ORGANIZATIONS</h3>

              <span>
                {selectedOrgCount}/{organizations.length}
              </span>
            </div>

            <button
              className="select-all-org"
              onClick={selectAllOrganizations}
            >
              <CheckCircle2 size={15} />
              Semua Organisasi
            </button>

            {organizations.map(org => {
              const color = orgColors[org.id];

              const checked =
                selectedOrgIds === null ||
                selectedOrgIds.includes(org.id);

              const count = schedules.filter(schedule => {
                return (
                  schedule.status === 'APPROVED' &&
                  schedule.organizationId === org.id
                );
              }).length;

              return (
                <label
                  key={org.id}
                  className="organization-option"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOrganization(org.id)}
                  />

                  <span
                    className="organization-dot"
                    style={{ backgroundColor: color }}
                  />

                  <span className="organization-name">
                    {org.name}
                  </span>

                  <span className="organization-count">
                    {count}
                  </span>
                </label>
              );
            })}

          </div>

          <div className="sidebar-divider" />

          {/* TYPE FILTER */}
          <div className="type-filter-section">
            <h3>JENIS KEGIATAN</h3>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="ALL">Semua Jenis</option>
              <option value="EVENT">EVENT</option>
              <option value="UKM">UKM</option>
              <option value="LAB">LAB</option>
            </select>
          </div>

          <div className="sidebar-bottom">
            <CalendarCheck size={17} />
            <span>Agenda Terjadwal</span>
            <strong>{filteredSchedules.length}</strong>
          </div>

        </aside>

        {/* CENTER CONTENT */}
        <main className="planner-main">

          {/* CALENDAR TOOLBAR */}
          <section className="planner-calendar-toolbar">

            <div className="calendar-toolbar-left">

              <button
                className="calendar-nav-button"
                onClick={() => navigateCalendar('prev')}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                className="calendar-today-button"
                onClick={() => navigateCalendar('today')}
              >
                Hari Ini
              </button>

              <button
                className="calendar-nav-button"
                onClick={() => navigateCalendar('next')}
              >
                <ChevronRight size={18} />
              </button>

            </div>

            <div className="calendar-toolbar-title">
              <h1>{getMonthName(calendarDate)}</h1>
              <span>ORGANIZATION SCHEDULE</span>
            </div>

            <div className="calendar-toolbar-right">

              <span className="approved-indicator">
                <CheckCircle2 size={14} />
                Approved Only
              </span>

              <span className="filter-indicator">
                <Filter size={14} />
                {selectedOrgCount} Organisasi
              </span>

            </div>

          </section>

          {/* STATISTICS */}
          <section className="planner-stats">

            <div className="planner-stat-card">
              <div>
                <span>KEGIATAN MINGGU INI</span>
                <h2>{statistics.weekCount}</h2>
                <small>Agenda terjadwal</small>
              </div>

              <div className="stat-icon blue-icon">
                <CalendarDays size={21} />
              </div>
            </div>

            <div className="planner-stat-card">
              <div>
                <span>KEGIATAN BULAN INI</span>
                <h2>{statistics.monthCount}</h2>
                <small>Lintas organisasi</small>
              </div>

              <div className="stat-icon purple-icon">
                <CalendarCheck size={21} />
              </div>
            </div>

            <div className="planner-stat-card">
              <div>
                <span>JADWAL HARI INI</span>
                <h2>{statistics.todayCount}</h2>
                <small>Acara berlangsung</small>
              </div>

              <div className="stat-icon green-icon">
                <Clock size={21} />
              </div>
            </div>

            <div className="planner-stat-card conflict-stat-card">
              <div>
                <span>JADWAL BERTABRAKAN</span>
                <h2>{conflicts.length}</h2>
                <small>Perlu diperiksa</small>
              </div>

              <div className="stat-icon red-icon">
                <AlertTriangle size={21} />
              </div>
            </div>

          </section>

          {/* FULLCALENDAR */}
          <section className="planner-calendar-card">

            <div className="campus-calendar-wrapper">

              <FullCalendar
                ref={calendarRef}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin
                ]}
                initialView={initialView}
                headerToolbar={{
                  left: '',
                  center: '',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                }}
                buttonText={{
                  month: 'Bulan',
                  week: 'Minggu',
                  day: 'Hari',
                  list: 'Daftar'
                }}
                events={calendarEvents}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                datesSet={handleDatesSet}
                locale="id"
                firstDay={1}
                dayHeaderFormat={{ weekday: 'long' }}
                height={height}
                dayMaxEvents={3}
                moreLinkText="lainnya"
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: false,
                  hour12: false
                }}
                allDaySlot={false}
                slotMinTime="07:00:00"
                slotMaxTime="23:00:00"
                nowIndicator={true}
                eventDisplay="block"
              />

            </div>

          </section>

          {/* COLOR LEGEND */}
          <section className="planner-legend">

            <strong>WARNA ORGANISASI:</strong>

            {organizations.map(org => (
              <span key={org.id}>
                <i
                  style={{
                    backgroundColor: orgColors[org.id]
                  }}
                />

                {org.name}
              </span>
            ))}

          </section>

        </main>

        {/* RIGHT PANEL */}
        <aside className="planner-right-panel">

          {/* TODAY AGENDA */}
          <section className="planner-panel-card">

            <div className="panel-heading">
              <h3>
                <CalendarDays size={17} />
                Jadwal Tanggal Ini
              </h3>

              <span>{todaySchedules.length} Sesi</span>
            </div>

            <p className="selected-date-label">
              {formatDate(selectedDate)}
            </p>

            {todaySchedules.length === 0 ? (
              <div className="empty-agenda">
                Belum ada kegiatan pada tanggal ini.
              </div>
            ) : (
              todaySchedules.map(schedule => {
                const org = orgMap[schedule.organizationId];
                const color = orgColors[schedule.organizationId];

                return (
                  <button
                    key={schedule.id}
                    className="agenda-event-card"
                    style={{ borderLeftColor: color }}
                    onClick={() => setSelectedEvent(schedule)}
                  >

                    <div className="agenda-event-top">
                      <span style={{ color }}>
                        {org?.name || 'Organisasi'}
                      </span>

                      <small>
                        {formatTime(schedule.startTime)}
                      </small>
                    </div>

                    <strong>{schedule.title}</strong>

                    <div className="agenda-event-info">
                      <Clock size={13} />

                      {formatTime(schedule.startTime)}
                      {' - '}
                      {formatTime(schedule.endTime)}
                    </div>

                    <div className="agenda-event-info">
                      <MapPin size={13} />

                      {schedule.location || 'Lokasi belum ditentukan'}
                    </div>

                  </button>
                );
              })
            )}

          </section>

          {/* CONFLICT DETECTION */}
          <section className="planner-panel-card">

            <div className="panel-heading">
              <h3>
                <AlertTriangle size={17} />
                Deteksi Bentrokan
              </h3>

              <span
                className={
                  conflicts.length
                    ? 'conflict-badge'
                    : 'safe-badge'
                }
              >
                {conflicts.length} Aktif
              </span>
            </div>

            {conflicts.length === 0 ? (
              <div className="empty-conflict">
                <CheckCircle2 size={19} />
                Tidak ditemukan bentrokan lokasi dan waktu.
              </div>
            ) : (
              conflicts.map((conflict, index) => (
                <div className="conflict-item" key={index}>

                  <strong>Bentrokan Lokasi</strong>

                  <p>
                    {conflict.first.title}
                    {' dan '}
                    {conflict.second.title}
                  </p>

                  <small>
                    <MapPin size={12} />
                    {conflict.location}
                  </small>

                  <small>
                    {formatDate(
                      parseDateTime(conflict.first.startDate)
                    )}
                  </small>

                </div>
              ))
            )}

          </section>

          {/* UPCOMING EVENTS */}
          <section className="planner-panel-card">

            <div className="panel-heading">
              <h3>
                <CalendarCheck size={17} />
                Acara Mendatang
              </h3>

              <span>5 Terdekat</span>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="empty-agenda">
                Belum ada acara mendatang.
              </div>
            ) : (
              upcomingEvents.map(schedule => {
                const org = orgMap[schedule.organizationId];
                const color = orgColors[schedule.organizationId];

                return (
                  <button
                    key={schedule.id}
                    className="upcoming-event"
                    onClick={() => setSelectedEvent(schedule)}
                  >

                    <span
                      className="upcoming-dot"
                      style={{ backgroundColor: color }}
                    />

                    <div>
                      <strong>{schedule.title}</strong>

                      <p>
                        {formatDate(
                          parseDateTime(schedule.startDate)
                        )}
                        {' · '}
                        {formatTime(schedule.startTime)}
                      </p>

                      <small>
                        {org?.name || 'Organisasi'}
                      </small>
                    </div>

                  </button>
                );
              })
            )}

          </section>

        </aside>

      </div>

      {/* DETAIL MODAL */}
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
