import React from 'react';
import OrganizationLayout from '../../layouts/OrganizationLayout';
import OrgDashboard from '../../components/dashboard/OrgDashboard';

const OrgDashboardPage = ({ orgType, basePath }) => {
  return (
    <OrganizationLayout basePath={basePath} orgType={orgType}>
      <OrgDashboard orgType={orgType} basePath={basePath} />
    </OrganizationLayout>
  );
};

export default OrgDashboardPage;

