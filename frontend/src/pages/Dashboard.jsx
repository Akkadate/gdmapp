import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPatientStatistics } from '../services/patientService';
import { UserIcon, CalendarIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayDate, setTodayDate] = useState('');
  
  // Fetch patient statistics
  const { data: statistics, isLoading } = useQuery('patientStatistics', getPatientStatistics, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // Format today's date in Thai format
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setTodayDate(today.toLocaleDateString('th-TH', options));
  }, []);

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">แผงควบคุม</h1>
        <p className="text-sm text-gray-500 mt-1">{todayDate}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Patient Stats Card */}
        <div className="card bg-white overflow-hidden">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ผู้ป่วยทั้งหมด</p>
              <p className="text-xl font-semibold">
                {isLoading ? '-' : statistics?.activePatients || 0}
              </p>
            </div>
          </div>
        </div>
        
        {/* Appointments Today Card */}
        <div className="card bg-white overflow-hidden">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">การนัดหมายวันนี้</p>
              <p className="text-xl font-semibold">0</p>
            </div>
          </div>
        </div>
        
        {/* High Risk Patients Card */}
        <div className="card bg-white overflow-hidden">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 mr-4">
              <ChartBarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ผู้ป่วยความเสี่ยงสูง</p>
              <p className="text-xl font-semibold">
                {isLoading ? '-' : statistics?.highRiskPatients || 0}
              </p>
            </div>
          </div>
        </div>
        
        {/* New Patients Card */}
        <div className="card bg-white overflow-hidden">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">ผู้ป่วยใหม่ (30 วัน)</p>
              <p className="text-xl font-semibold">
                {isLoading ? '-' : statistics?.newPatients || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Access */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">ทางลัด</h2>
          <div className="space-y-2">
            <Link
              to="/dashboard/patients/new"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
                <span>เพิ่มผู้ป่วยใหม่</span>
              </div>
            </Link>
            <Link
              to="/dashboard/appointments"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary-600" />
                <span>สร้างการนัดหมาย</span>
              </div>
            </Link>
            <Link
              to="/dashboard/glucose"
              className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-primary-600" />
                <span>บันทึกระดับน้ำตาล</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Today's Appointments */}
        <div className="card md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">การนัดหมายวันนี้</h2>
          <div className="overflow-hidden">
            <div className="text-center py-6">
              <p className="text-gray-500">ไม่มีการนัดหมายวันนี้</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
