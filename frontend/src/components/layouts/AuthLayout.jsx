import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            ระบบจัดการผู้ป่วยเบาหวานขณะตั้งครรภ์
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Gestational Diabetes Management System
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
