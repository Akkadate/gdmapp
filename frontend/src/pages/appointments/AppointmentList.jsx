import React from 'react';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

const AppointmentList = () => {
  // Placeholder component - this would be implemented with actual data in a real app
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">การนัดหมาย</h1>
        <button className="btn btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-1" />
          สร้างการนัดหมายใหม่
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center justify-center py-12">
          <CalendarIcon className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อมูลการนัดหมาย</h3>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            ขณะนี้ยังไม่มีข้อมูลการนัดหมาย กรุณาสร้างการนัดหมายใหม่เพื่อเริ่มการติดตาม
          </p>
          <button className="btn btn-primary">
            สร้างการนัดหมายใหม่
          </button>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>หน้าจอนี้จะแสดงข้อมูลการนัดหมายทั้งหมดในระบบ</p>
        <p>สามารถกรองและค้นหาการนัดหมายได้ตามวันที่ แพทย์ หรือผู้ป่วย</p>
      </div>
    </div>
  );
};

export default AppointmentList;
