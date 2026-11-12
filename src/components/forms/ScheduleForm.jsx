import React, { useState, useRef } from 'react';
import { AlertTriangle, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateScheduleForm } from '../../utils/validation';
import { checkConflict } from '../../services/scheduleService';

const CATEGORIES = [
  'Olahraga', 'Seni & Budaya', 'Workshop', 'Seminar', 'Pelatihan',
  'Kompetisi', 'Pameran', 'Festival', 'Diskusi', 'Rapat', 'Lainnya'
];

const ScheduleForm = ({ initialData = {}, onSubmit, loading, submitLabel = 'Ajukan Jadwal', excludeId = null }) => {
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    poster: null,
    capacity: '',
    registrationOpen: false,
    ...initialData,
  });
  const [errors, setErrors] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [posterPreview, setPosterPreview] = useState(initialData.poster || null);
  const fileRef = useRef();

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors(er => ({ ...er, poster: 'Ukuran file maksimal 2MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPosterPreview(ev.target.result);
      setForm(f => ({ ...f, poster: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateScheduleForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Check conflicts
    const conflicting = checkConflict(form, excludeId);
    setConflicts(conflicting);
    // Don't block, just warn
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {conflicts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-orange-800">Peringatan: Potensi Konflik Jadwal</p>
              <p className="text-xs text-orange-700 mt-1">Lokasi dan waktu yang sama ditemukan pada jadwal yang telah disetujui:</p>
              <ul className="mt-1 space-y-1">
                {conflicts.map(c => (
                  <li key={c.id} className="text-xs text-orange-700">• {c.title} ({c.startDate} {c.startTime}–{c.endTime})</li>
                ))}
              </ul>
              <p className="text-xs text-orange-600 mt-1">Anda tetap dapat mengajukan jadwal, namun pertimbangkan untuk mengubah lokasi atau waktu.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="label">Nama Kegiatan *</label>
          <input
            type="text"
            className={`input-field ${errors.title ? 'border-red-400' : ''}`}
            placeholder="Contoh: Latihan Rutin Basket"
            value={form.title}
            onChange={handleChange('title')}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="label">Kategori *</label>
          <select
            className={`input-field ${errors.category ? 'border-red-400' : ''}`}
            value={form.category}
            onChange={handleChange('category')}
          >
            <option value="">Pilih kategori...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="label">Lokasi *</label>
          <input
            type="text"
            className={`input-field ${errors.location ? 'border-red-400' : ''}`}
            placeholder="Contoh: Aula Utama Universitas"
            value={form.location}
            onChange={handleChange('location')}
          />
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="label">Tanggal Mulai *</label>
          <input
            type="date"
            className={`input-field ${errors.startDate ? 'border-red-400' : ''}`}
            value={form.startDate}
            onChange={handleChange('startDate')}
          />
          {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="label">Tanggal Selesai *</label>
          <input
            type="date"
            className={`input-field ${errors.endDate ? 'border-red-400' : ''}`}
            value={form.endDate}
            onChange={handleChange('endDate')}
            min={form.startDate}
          />
          {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
        </div>

        <div>
          <label className="label">Jam Mulai *</label>
          <input
            type="time"
            className={`input-field ${errors.startTime ? 'border-red-400' : ''}`}
            value={form.startTime}
            onChange={handleChange('startTime')}
          />
          {errors.startTime && <p className="text-xs text-red-500 mt-1">{errors.startTime}</p>}
        </div>

        <div>
          <label className="label">Jam Selesai *</label>
          <input
            type="time"
            className={`input-field ${errors.endTime ? 'border-red-400' : ''}`}
            value={form.endTime}
            onChange={handleChange('endTime')}
          />
          {errors.endTime && <p className="text-xs text-red-500 mt-1">{errors.endTime}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label">Deskripsi</label>
          <textarea
            className="input-field resize-none"
            rows={4}
            placeholder="Deskripsi singkat tentang kegiatan ini..."
            value={form.description}
            onChange={handleChange('description')}
          />
        </div>

        <div>
          <label className="label">Kapasitas Peserta (opsional)</label>
          <input
            type="number"
            className="input-field"
            placeholder="Biarkan kosong jika tidak terbatas"
            min="1"
            value={form.capacity}
            onChange={handleChange('capacity')}
          />
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded text-blue-600"
              checked={form.registrationOpen}
              onChange={handleChange('registrationOpen')}
            />
            <span className="text-sm font-medium text-gray-700">Buka pendaftaran peserta</span>
          </label>
          <p className="text-xs text-gray-400 mt-1 ml-6">Aktifkan agar mahasiswa bisa mendaftar kegiatan ini</p>
        </div>

        {/* Poster Upload */}
        <div className="md:col-span-2">
          <label className="label">Poster Kegiatan (opsional, maks. 2MB)</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
            {posterPreview ? (
              <div className="flex items-center gap-4">
                <img src={posterPreview} alt="Poster preview" className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">Poster diunggah</p>
                  <button
                    type="button"
                    onClick={() => { setPosterPreview(null); setForm(f => ({ ...f, poster: null })); }}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mt-1"
                  >
                    <X size={12} /> Hapus poster
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center w-full py-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Upload size={24} className="mb-2" />
                <span className="text-sm">Klik untuk unggah poster</span>
                <span className="text-xs mt-1">JPG, PNG, WEBP – Maks. 2MB</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePosterChange}
            />
          </div>
          {errors.poster && <p className="text-xs text-red-500 mt-1">{errors.poster}</p>}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full sm:w-auto px-8 py-2.5 flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <CheckCircle2 size={18} />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ScheduleForm;

