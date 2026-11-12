import React from 'react';
import { X, Calendar, MapPin, Clock, Users, Building2, Tag } from 'lucide-react';
import { formatDateRange, formatTime } from '../../utils/dateUtils';
import StatusBadge from '../common/StatusBadge';
import OrgTypeBadge from '../common/OrgTypeBadge';

const ScheduleDetailModal = ({ schedule, organization, onClose, children }) => {
  if (!schedule) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <OrgTypeBadge type={schedule.organizationType} />
              <StatusBadge status={schedule.status} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{schedule.title}</h2>
            {organization && (
              <p className="text-sm text-gray-500 mt-1">{organization.name}</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={22} />
          </button>
        </div>

        {/* Poster */}
        {schedule.poster && (
          <div className="px-6 pt-4">
            <img src={schedule.poster} alt="Poster" className="w-full max-h-48 object-cover rounded-lg" />
          </div>
        )}

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Tanggal</p>
                <p className="text-sm text-gray-900">{formatDateRange(schedule.startDate, schedule.endDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Waktu</p>
                <p className="text-sm text-gray-900">{formatTime(schedule.startTime)} – {formatTime(schedule.endTime)} WIB</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Lokasi</p>
                <p className="text-sm text-gray-900">{schedule.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Kategori</p>
                <p className="text-sm text-gray-900">{schedule.category}</p>
              </div>
            </div>
            {schedule.capacity && (
              <div className="flex items-start gap-3">
                <Users size={18} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Kapasitas</p>
                  <p className="text-sm text-gray-900">{schedule.capacity} peserta</p>
                </div>
              </div>
            )}
          </div>

          {schedule.description && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Deskripsi</p>
              <p className="text-sm text-gray-700 leading-relaxed">{schedule.description}</p>
            </div>
          )}

          {schedule.reviewNote && (
            <div className={`rounded-lg p-3 ${schedule.status === 'REJECTED' ? 'bg-red-50 border border-red-100' : 'bg-orange-50 border border-orange-100'}`}>
              <p className={`text-xs font-semibold mb-1 ${schedule.status === 'REJECTED' ? 'text-red-700' : 'text-orange-700'}`}>
                {schedule.status === 'REJECTED' ? 'Alasan Penolakan:' : 'Catatan Revisi:'}
              </p>
              <p className="text-sm text-gray-700">{schedule.reviewNote}</p>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;

