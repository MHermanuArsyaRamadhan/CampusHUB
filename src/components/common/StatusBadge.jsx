import React from 'react';
import { SCHEDULE_STATUS } from '../../data/seedData';

const statusConfig = {
  [SCHEDULE_STATUS.PENDING]: { label: 'Menunggu', className: 'badge-pending' },
  [SCHEDULE_STATUS.APPROVED]: { label: 'Disetujui', className: 'badge-approved' },
  [SCHEDULE_STATUS.REJECTED]: { label: 'Ditolak', className: 'badge-rejected' },
  [SCHEDULE_STATUS.REVISION_REQUIRED]: { label: 'Perlu Revisi', className: 'badge-revision' },
  [SCHEDULE_STATUS.CANCELLED]: { label: 'Dibatalkan', className: 'badge-cancelled' },
  [SCHEDULE_STATUS.COMPLETED]: { label: 'Selesai', className: 'badge-completed' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, className: 'badge-cancelled' };
  return <span className={config.className}>{config.label}</span>;
};

export default StatusBadge;

