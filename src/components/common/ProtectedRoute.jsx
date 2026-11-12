import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their correct dashboard
    const paths = {
      SUPER_ADMIN: '/admin',
      UKM_ADMIN: '/ukm',
      LAB_ADMIN: '/lab',
      EVENT_ADMIN: '/event',
      STUDENT: '/student',
    };
    return <Navigate to={paths[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;

