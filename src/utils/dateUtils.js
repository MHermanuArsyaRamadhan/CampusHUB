export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  return timeStr;
};

export const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '-';
  if (startDate === endDate) return formatDate(startDate);
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
};

export const getRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const d = new Date(dateStr);
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} hari lalu`;
  return formatDate(dateStr);
};

export const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  const now = new Date();
  now.setHours(0,0,0,0);
  const d = new Date(dateStr);
  d.setHours(0,0,0,0);
  return Math.ceil((d - now) / 86400000);
};

