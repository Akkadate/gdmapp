import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientDetail from './pages/patients/PatientDetail';
import PatientForm from './pages/patients/PatientForm';
import AppointmentList from './pages/appointments/AppointmentList';
import AppointmentCalendar from './pages/appointments/AppointmentCalendar';
import GlucoseReadings from './pages/glucose/GlucoseReadings';
import UserManagement from './pages/admin/UserManagement';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading or redirect while checking auth status
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        
        {/* Patient Routes */}
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="patients/:id/edit" element={<PatientForm />} />
        
        {/* Appointment Routes */}
        <Route path="appointments" element={<AppointmentList />} />
        <Route path="calendar" element={<AppointmentCalendar />} />
        
        {/* Glucose Routes */}
        <Route path="glucose" element={<GlucoseReadings />} />
        
        {/* Admin Routes */}
        <Route 
          path="users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
