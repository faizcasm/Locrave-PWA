import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loader } from '../components/common/Loader/Loader';

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loader fullScreen text="Loading..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
