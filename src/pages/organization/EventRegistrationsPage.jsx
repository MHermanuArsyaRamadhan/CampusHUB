import React, { useState } from 'react';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getSchedulesByOrg, updateSchedule } from '../../services/scheduleService';
import { getRegistrationsBySchedule } from '../../services/registrationService';
import { getAllUsers } from '../../services/userService';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Users, Calendar, ToggleLeft, ToggleRight, Edit2,
  CheckCircle2, AlertCircle, X, Search, ShieldCheck
} from 'lucide-react';

const EventRegistrationsPage = () => {
  const { user } = useAuth();
  const { refresh } = useAppData();

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [editingCapacityId, setEditingCapacityId] = useState(null);
  const [newCapacity, setNewCapacity] = useState('');
  const [toast, setToast] = useState(null);

  const myEvents = user?.organizationId ? getSchedulesByOrg(user.organizationId) : [];
  const users = getAllUsers();
  const userMap = {};
  users.forEach(u => { userMap[u.id] = u; });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleRegistration = (event) => {
    const updatedStatus = !event.registrationOpen;
    const res = updateSchedule(
      event.id,
      {
        ...event,
        registrationOpen: updatedStatus,
      },
      user.id,
      user.organizationId
    );

    if (res.success) {
      showToast(`Pendaftaran untuk "${event.title}" telah ${updatedStatus ? 'DIBUKA' : 'DITUTUP'}.`);
      refresh();
    } else {
      showToast(res.error || 'Gagal mengubah status pendaftaran.', 'error');
    }
  };

  const handleSaveCapacity = (event) => {
    const cap = parseInt(newCapacity, 10);
    if (isNaN(cap) || cap < 1) {
      showToast('Kapasitas harus berupa angka positif.', 'error');
      return;
    }

    const res = updateSchedule(
      event.id,
      {
        ...event,
        capacity: cap,
      },
      user.id,
      user.organizationId
    );

    if (res.success) {
      showToast(`Kapasitas "${event.title}" diperbarui menjadi ${cap} peserta.`);
      setEditingCapacityId(null);
      refresh();
    } else {
      showToast(res.error || 'Gagal memperbarui kapasitas.', 'error');
    }
  };

  const selectedEvent = myEvents.find(e => e.id === selectedEventId);
  const attendees = selectedEvent ? getRegistrationsBySchedule(selectedEvent.id) : [];

  return (
    <OrganizationLayout basePath="/event" orgType="EVENT">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm flex items-center gap-2 animate-fadeIn ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pendaftaran & Kuota</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau jumlah peserta, kelola kuota kapasitas, dan buka/tutup pendaftaran event Anda secara langsung.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          {myEvents.length === 0 ? (
            <div className="card text-center py-16">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Belum ada event yang dibuat.</p>
            </div>
          ) : (
            myEvents.map(event => {
              const regs = getRegistrationsBySchedule(event.id);
              const count = regs.length;
              const cap = event.capacity || 'Tak Terbatas';
              const isSelected = selectedEventId === event.id;

              return (
                <div
                  key={event.id}
                  className={`card p-5 transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-md bg-blue-50/20' : 'hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedEventId(event.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={event.status} />
                        <span className="text-xs text-gray-400 font-medium">{event.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(event.startDate)} · {event.location}</p>
                    </div>

                    {/* Toggle Open/Close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRegistration(event);
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        event.registrationOpen
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {event.registrationOpen ? (
                        <>
                          <ToggleRight size={18} className="text-green-600" />
                          <span>Pendaftaran Buka</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={18} className="text-gray-400" />
                          <span>Pendaftaran Tutup</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Capacity progress & controls */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-blue-600" />
                      <span className="font-semibold text-gray-800">
                        {count} {event.capacity ? `/ ${event.capacity}` : ''} Peserta Terdaftar
                      </span>
                      {event.capacity && (
                        <span className="text-gray-400">
                          ({Math.min(100, Math.round((count / event.capacity) * 100))}%)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {editingCapacityId === event.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            value={newCapacity}
                            onChange={(e) => setNewCapacity(e.target.value)}
                            placeholder="Kapasitas"
                            className="w-20 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleSaveCapacity(event)}
                            className="bg-blue-600 text-white px-2 py-1 rounded font-semibold text-xs hover:bg-blue-700"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setEditingCapacityId(null)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCapacityId(event.id);
                            setNewCapacity(event.capacity || '');
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 text-xs"
                        >
                          <Edit2 size={12} /> Ubah Kuota
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Event Attendee List */}
        <div className="card">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              Daftar Peserta
            </h3>
            {selectedEvent && (
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                {attendees.length} orang
              </span>
            )}
          </div>

          {!selectedEvent ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Pilih salah satu event di sebelah kiri untuk melihat daftar mahasiswa yang telah mendaftar.
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-3 truncate">
                {selectedEvent.title}
              </p>

              {attendees.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Belum ada peserta yang mendaftar untuk event ini.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {attendees.map(reg => {
                    const student = userMap[reg.studentId];
                    return (
                      <div
                        key={reg.id}
                        className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-gray-900">
                            {student?.name || 'Mahasiswa'}
                          </p>
                          <p className="text-gray-500 font-mono text-[11px] mt-0.5">
                            NIM: {student?.nim || '-'} · {student?.email}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Daftar: {formatDateTime(reg.registeredAt)}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full shrink-0">
                          Terkonfirmasi
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </OrganizationLayout>
  );
};

export default EventRegistrationsPage;

