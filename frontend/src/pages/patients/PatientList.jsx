import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getAllPatients } from '../../services/patientService';
import { UserIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all patients
  const { data: patients, isLoading, error } = useQuery('patients', getAllPatients, {
    refetchOnWindowFocus: false,
  });

  // Filter patients based on search term
  const filteredPatients = patients ? patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.hospitalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.idNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">รายชื่อผู้ป่วย</h1>
        <Link to="/dashboard/patients/new" className="btn btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-1" />
          เพิ่มผู้ป่วยใหม่
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="ค้นหาโดยชื่อ, รหัสผู้ป่วย, หรือเบอร์โทรศัพท์"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Patients List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>เกิดข้อผิดพลาด: {error.message}</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? (
              <p>ไม่พบผู้ป่วยที่ตรงกับการค้นหา</p>
            ) : (
              <p>ยังไม่มีผู้ป่วยในระบบ</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสผู้ป่วย
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-สกุล
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อายุครรภ์
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เบอร์โทรศัพท์
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ระดับความเสี่ยง
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">ดูรายละเอียด</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient.hospitalNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.expectedDeliveryDate ? `EDD: ${new Date(patient.expectedDeliveryDate).toLocaleDateString('th-TH')}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.gestationalAge || '-'} สัปดาห์</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeColor(patient.riskLevel)}`}>
                        {getRiskLevelText(patient.riskLevel)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/dashboard/patients/${patient.id}`} className="text-primary-600 hover:text-primary-900">
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get risk level badge color
const getRiskBadgeColor = (riskLevel) => {
  switch (riskLevel) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get risk level text in Thai
const getRiskLevelText = (riskLevel) => {
  switch (riskLevel) {
    case 'high':
      return 'สูง';
    case 'medium':
      return 'ปานกลาง';
    case 'low':
      return 'ต่ำ';
    default:
      return 'ไม่ระบุ';
  }
};

export default PatientList;
