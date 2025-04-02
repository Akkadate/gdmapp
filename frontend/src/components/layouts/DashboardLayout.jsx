import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import icons from heroicons
import {
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'ผู้ป่วย', href: '/dashboard/patients', icon: UserIcon },
    { name: 'การนัดหมาย', href: '/dashboard/appointments', icon: CalendarIcon },
    { name: 'ปฏิทิน', href: '/dashboard/calendar', icon: CalendarIcon },
    { name: 'ระดับน้ำตาล', href: '/dashboard/glucose', icon: ChartBarIcon },
  ];

  // Add user management for admin users
  if (user?.role === 'admin') {
    navigation.push({ name: 'จัดการผู้ใช้', href: '/dashboard/users', icon: UsersIcon });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0">
              <div 
                className="absolute inset-0 bg-gray-600 opacity-75" 
                onClick={() => setSidebarOpen(false)}
              />
            </div>
            
            <div className="relative flex flex-col flex-1 w-full max-w-xs bg-white">
              <div className="absolute top-0 right-0 p-1">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-xl font-bold text-primary-600">GDM System</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                          ? 'text-white bg-primary-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`mr-4 h-6 w-6 ${
                          location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                            ? 'text-white'
                            : 'text-gray-500 group-hover:text-gray-600'
                        }`}
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700">{user?.fullName}</p>
                      <p className="text-sm font-medium text-gray-500">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-1 h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-primary-600">GDM System</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                        ? 'text-white bg-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                          ? 'text-white'
                          : 'text-gray-500 group-hover:text-gray-600'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user?.fullName}</p>
                    <p className="text-xs font-medium text-gray-500">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-auto flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="pr-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
