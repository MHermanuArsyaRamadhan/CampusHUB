import React from 'react';
import { ORG_COLORS, ORG_TYPES } from '../../data/seedData';

const typeLabels = {
  [ORG_TYPES.UKM]: 'UKM',
  [ORG_TYPES.LAB]: 'LAB',
  [ORG_TYPES.EVENT]: 'EVENT',
};

const OrgTypeBadge = ({ type, size = 'sm' }) => {
  const color = ORG_COLORS[type] || '#6B7280';
  const label = typeLabels[type] || type;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white`}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
};

export default OrgTypeBadge;

