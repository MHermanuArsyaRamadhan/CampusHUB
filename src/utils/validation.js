export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateNIM = (nim) => {
  return nim && nim.trim().length >= 5;
};

export const validateScheduleForm = (data) => {
  const errors = {};
  if (!data.title || !data.title.trim()) errors.title = 'Nama kegiatan wajib diisi.';
  if (!data.category) errors.category = 'Kategori wajib dipilih.';
  if (!data.startDate) errors.startDate = 'Tanggal mulai wajib diisi.';
  if (!data.endDate) errors.endDate = 'Tanggal selesai wajib diisi.';
  if (!data.startTime) errors.startTime = 'Jam mulai wajib diisi.';
  if (!data.endTime) errors.endTime = 'Jam selesai wajib diisi.';
  if (!data.location || !data.location.trim()) errors.location = 'Lokasi wajib diisi.';
  if (data.startDate && data.endDate) {
    const start = new Date(`${data.startDate}T${data.startTime || '00:00'}`);
    const end = new Date(`${data.endDate}T${data.endTime || '00:00'}`);
    if (end <= start) errors.endDate = 'Tanggal/jam selesai harus setelah tanggal/jam mulai.';
  }
  return errors;
};

