import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChartBarIcon, PlusIcon } from '@heroicons/react/24/outline';

const GlucoseReadings = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  // Placeholder component - this would be implemented with actual data in a real app
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ระดับน้ำตาลในเลือด</h1>
        <button className="btn btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-1" />
          บันทึกค่าน้ำตาลใหม่
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center justify-center py-12">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อมูลระดับน้ำตาล</h3>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            ขณะนี้ยังไม่มีข้อมูลระดับน้ำตาล กรุณาบันทึกค่าน้ำตาลเพื่อเริ่มการติดตาม
          </p>
          <button className="btn btn-primary">
            บันทึกค่าน้ำตาลครั้งแรก
          </button>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>หน้าจอนี้จะแสดงข้อมูลการตรวจระดับน้ำตาลในเลือด</p>
        <p>และกราฟแสดงแนวโน้มระดับน้ำตาลเมื่อมีข้อมูล</p>
      </div>
    </div>
  );
};

export default GlucoseReadings;
