import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/global.types';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};
