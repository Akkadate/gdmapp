import React from 'react';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

const UserManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
        <button className="btn btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-1" />
          เพิ่มผู้ใช้ใหม่
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center justify-center py-12">
          <UsersIcon className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">จัดการผู้ใช้งานระบบ</h3>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            หน้าจอนี้สำหรับผู้ดูแลระบบเพื่อจัดการผู้ใช้งาน สามารถเพิ่ม แก้ไข และจัดการสิทธิ์การใช้งานได้
          </p>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงหน้าจอนี้ได้</p>
      </div>
    </div>
  );
};

export default UserManagement;
