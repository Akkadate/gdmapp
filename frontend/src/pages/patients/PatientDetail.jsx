import React from 'react';
import { useQuery } from 'react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPatientById } from '../../services/patientService';
import { 
  UserIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  PencilIcon, 
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch patient data
  const { data: patient, isLoading, error } = useQuery(['patient', id], () => getPatientById(id), {
    refetchOnWindowFocus: false,
  });

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">เกิดข้อผิดพลาด: {error.message}</p>
        <button 
          onClick={() => navigate('/dashboard/patients')}
          className="mt-2 btn btn-outline"
        >
          กลับไปหน้ารายชื่อผู้ป่วย
        </button>
      </div>
    );
  }

  // If patient not found
  if (!patient) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">ไม่พบข้อมูลผู้ป่วย</p>
        <button 
          onClick={() => navigate('/dashboard/patients')}
          className="mt-2 btn btn-outline"
        >
          กลับไปหน้ารายชื่อผู้ป่วย
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/dashboard/patients')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">ข้อมูลผู้ป่วย</h1>
        </div>
        <div className="flex space-x-2">
          <Link 
            to={`/dashboard/patients/${id}/edit`}
            className="btn btn-outline flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            แก้ไขข้อมูล
          </Link>
        </div>
      </div>

      {/* Patient Overview Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-gray-500" />
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold">
              {patient.firstName} {patient.lastName}
            </h2>
            <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">รหัสผู้ป่วย:</span> {patient.hospitalNumber}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">เลขประจำตัวประชาชน:</span> {patient.idNumber}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">อายุ:</span> {patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : '-'} ปี
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4 mr-1" />
                {patient.phoneNumber}
              </div>
              {patient.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  {patient.email}
                </div>
              )}
              {patient.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <HomeIcon className="h-4 w-4 mr-1" />
                  {patient.address}
                </div>
              )}
            </div>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
              patient.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
              patient.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              ความเสี่ยง: {
                patient.riskLevel === 'high' ? 'สูง' :
                patient.riskLevel === 'medium' ? 'ปานกลาง' :
                'ต่ำ'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Pregnancy Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">ข้อมูลการตั้งครรภ์</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">อายุครรภ์</p>
              <p className="font-medium">{patient.gestationalAge || '-'} สัปดาห์</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">กำหนดคลอด</p>
              <p className="font-medium">
                {patient.expectedDeliveryDate 
                  ? new Date(patient.expectedDeliveryDate).toLocaleDateString('th-TH') 
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">น้ำหนักก่อนตั้งครรภ์</p>
              <p className="font-medium">{patient.prePregnancyWeight || '-'} กก.</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">น้ำหนักปัจจุบัน</p>
              <p className="font-medium">{patient.currentWeight || '-'} กก.</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ส่วนสูง</p>
              <p className="font-medium">{patient.height || '-'} ซม.</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">BMI</p>
              <p className="font-medium">{patient.bmi || '-'}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">ปัจจัยเสี่ยง</p>
            <div className="mt-1 flex space-x-2">
              {patient.priorGDM && (
                <span className="px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-medium">
                  เคยเป็นเบาหวานขณะตั้งครรภ์
                </span>
              )}
              {patient.familyHistoryDiabetes && (
                <span className="px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-medium">
                  ประวัติเบาหวานในครอบครัว
                </span>
              )}
              {!patient.priorGDM && !patient.familyHistoryDiabetes && (
                <span className="text-gray-500 text-sm">ไม่มีปัจจัยเสี่ยงเพิ่มเติม</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">ข้อมูลการติดต่อฉุกเฉิน</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">บุคคลที่ติดต่อได้</p>
              <p className="font-medium">{patient.emergencyContact || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">เบอร์โทรศัพท์ฉุกเฉิน</p>
              <p className="font-medium">{patient.emergencyContactPhone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">แพทย์ผู้ดูแล</p>
              <p className="font-medium">
                {patient.primaryDoctor ? patient.primaryDoctor.fullName : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Glucose Readings and Appointments Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Glucose Readings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">ระดับน้ำตาลล่าสุด</h3>
            <Link 
              to={`/dashboard/glucose?patientId=${patient.id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ดูทั้งหมด
            </Link>
          </div>
          
          {patient.glucoseReadings && patient.glucoseReadings.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {patient.glucoseReadings.map((reading) => (
                <div key={reading.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">
                        {reading.readingType === 'fasting' ? 'ก่อนอาหารเช้า (งดอาหาร)' :
                         reading.readingType === 'before_meal' ? 'ก่อนอาหาร' :
                         reading.readingType === 'after_meal' ? 'หลังอาหาร 2 ชม.' :
                         reading.readingType === 'before_bed' ? 'ก่อนนอน' : 'ไม่ระบุเวลา'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(reading.readingDateTime).toLocaleString('th-TH')}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${reading.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                      {reading.glucoseLevel} mg/dL
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              ไม่พบข้อมูลระดับน้ำตาล
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">การนัดหมายที่กำลังจะมาถึง</h3>
            <Link 
              to={`/dashboard/appointments?patientId=${patient.id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ดูทั้งหมด
            </Link>
          </div>
          
          {patient.appointments && patient.appointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {patient.appointments.map((appointment) => (
                <div key={appointment.id} className="py-3">
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-blue-50">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        {appointment.appointmentType === 'regular_checkup' ? 'ตรวจตามนัด' :
                         appointment.appointmentType === 'glucose_monitoring' ? 'ติดตามระดับน้ำตาล' :
                         appointment.appointmentType === 'ultrasound' ? 'อัลตราซาวด์' :
                         appointment.appointmentType === 'consultation' ? 'ปรึกษาแพทย์' : 'นัดหมายฉุกเฉิน'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.appointmentDate).toLocaleDateString('th-TH')} เวลา {appointment.appointmentTime.substring(0, 5)} น.
                      </p>
                      {appointment.doctor && (
                        <p className="text-sm text-gray-500">
                          แพทย์: {appointment.doctor.fullName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              ไม่มีการนัดหมายที่กำลังจะมาถึง
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;