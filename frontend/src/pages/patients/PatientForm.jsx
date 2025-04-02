import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getPatientById, createPatient, updatePatient } from '../../services/patientService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  
  // Fetch patient data if in edit mode
  const { data: patient, isLoading: isLoadingPatient } = useQuery(
    ['patient', id],
    () => getPatientById(id),
    {
      enabled: isEditMode,
      refetchOnWindowFocus: false,
    }
  );

  // Mutations for creating/updating patients
  const createMutation = useMutation(createPatient, {
    onSuccess: () => {
      queryClient.invalidateQueries('patients');
      navigate('/dashboard/patients');
    },
  });

  const updateMutation = useMutation(
    (data) => updatePatient(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['patient', id]);
        queryClient.invalidateQueries('patients');
        navigate(`/dashboard/patients/${id}`);
      },
    }
  );

  // Define the validation schema
  const validationSchema = Yup.object({
    hospitalNumber: Yup.string().required('กรุณาระบุรหัสผู้ป่วย'),
    firstName: Yup.string().required('กรุณาระบุชื่อ'),
    lastName: Yup.string().required('กรุณาระบุนามสกุล'),
    idNumber: Yup.string()
      .matches(/^[0-9]{13}$/, 'เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก')
      .required('กรุณาระบุเลขประจำตัวประชาชน'),
    dateOfBirth: Yup.date().required('กรุณาระบุวันเดือนปีเกิด'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{9,10}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง')
      .required('กรุณาระบุเบอร์โทรศัพท์'),
    email: Yup.string().email('อีเมลไม่ถูกต้อง'),
    height: Yup.number()
      .min(100, 'ส่วนสูงต้องมากกว่า 100 ซม.')
      .max(250, 'ส่วนสูงต้องน้อยกว่า 250 ซม.'),
    prePregnancyWeight: Yup.number()
      .min(30, 'น้ำหนักต้องมากกว่า 30 กก.')
      .max(200, 'น้ำหนักต้องน้อยกว่า 200 กก.'),
    currentWeight: Yup.number()
      .min(30, 'น้ำหนักต้องมากกว่า 30 กก.')
      .max(200, 'น้ำหนักต้องน้อยกว่า 200 กก.'),
    gestationalAge: Yup.number()
      .min(0, 'อายุครรภ์ต้องไม่น้อยกว่า 0 สัปดาห์')
      .max(45, 'อายุครรภ์ต้องไม่เกิน 45 สัปดาห์'),
    expectedDeliveryDate: Yup.date(),
  });

  // Initial form values
  const initialValues = {
    hospitalNumber: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    gestationalAge: '',
    expectedDeliveryDate: '',
    height: '',
    prePregnancyWeight: '',
    currentWeight: '',
    priorGDM: false,
    familyHistoryDiabetes: false,
    notes: '',
    riskLevel: 'medium',
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    // Calculate BMI if height and weight are provided
    if (values.height && values.currentWeight) {
      const heightInMeters = values.height / 100;
      values.bmi = (values.currentWeight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    if (isEditMode) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
    
    setSubmitting(false);
  };

  // Show loading state if in edit mode and still loading patient data
  if (isEditMode && isLoadingPatient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Prepare form values if in edit mode and patient data is loaded
  const formValues = isEditMode && patient ? {
    ...initialValues,
    ...patient,
    dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
    expectedDeliveryDate: patient.expectedDeliveryDate ? new Date(patient.expectedDeliveryDate).toISOString().split('T')[0] : '',
  } : initialValues;

  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(isEditMode ? `/dashboard/patients/${id}` : '/dashboard/patients')}
          className="p-2 rounded-full hover:bg-gray-100 mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'แก้ไขข้อมูลผู้ป่วย' : 'เพิ่มผู้ป่วยใหม่'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg font-semibold">ข้อมูลส่วนตัว</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hospital Number */}
                <div>
                  <label htmlFor="hospitalNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสผู้ป่วย <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="hospitalNumber"
                    id="hospitalNumber"
                    className="input"
                  />
                  <ErrorMessage name="hospitalNumber" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="input"
                  />
                  <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="input"
                  />
                  <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* ID Number */}
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    เลขประจำตัวประชาชน <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="idNumber"
                    id="idNumber"
                    className="input"
                  />
                  <ErrorMessage name="idNumber" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    วันเดือนปีเกิด <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className="input"
                  />
                  <ErrorMessage name="dateOfBirth" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="input"
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="input"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่
                </label>
                <Field
                  as="textarea"
                  name="address"
                  id="address"
                  rows={3}
                  className="input"
                />
                <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4 mt-8">
                <h2 className="text-lg font-semibold">ข้อมูลการตั้งครรภ์</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gestational Age */}
                <div>
                  <label htmlFor="gestationalAge" className="block text-sm font-medium text-gray-700 mb-1">
                    อายุครรภ์ (สัปดาห์)
                  </label>
                  <Field
                    type="number"
                    name="gestationalAge"
                    id="gestationalAge"
                    className="input"
                  />
                  <ErrorMessage name="gestationalAge" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Expected Delivery Date */}
                <div>
                  <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    กำหนดคลอด (โดยประมาณ)
                  </label>
                  <Field
                    type="date"
                    name="expectedDeliveryDate"
                    id="expectedDeliveryDate"
                    className="input"
                  />
                  <ErrorMessage name="expectedDeliveryDate" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Height */}
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    ส่วนสูง (ซม.)
                  </label>
                  <Field
                    type="number"
                    name="height"
                    id="height"
                    className="input"
                  />
                  <ErrorMessage name="height" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Pre-Pregnancy Weight */}
                <div>
                  <label htmlFor="prePregnancyWeight" className="block text-sm font-medium text-gray-700 mb-1">
                    น้ำหนักก่อนตั้งครรภ์ (กก.)
                  </label>
                  <Field
                    type="number"
                    name="prePregnancyWeight"
                    id="prePregnancyWeight"
                    step="0.1"
                    className="input"
                  />
                  <ErrorMessage name="prePregnancyWeight" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Current Weight */}
                <div>
                  <label htmlFor="currentWeight" className="block text-sm font-medium text-gray-700 mb-1">
                    น้ำหนักปัจจุบัน (กก.)
                  </label>
                  <Field
                    type="number"
                    name="currentWeight"
                    id="currentWeight"
                    step="0.1"
                    className="input"
                  />
                  <ErrorMessage name="currentWeight" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Risk Level */}
                <div>
                  <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    ระดับความเสี่ยง
                  </label>
                  <Field
                    as="select"
                    name="riskLevel"
                    id="riskLevel"
                    className="input"
                  >
                    <option value="low">ต่ำ</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="high">สูง</option>
                  </Field>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="priorGDM"
                    id="priorGDM"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="priorGDM" className="ml-2 block text-sm text-gray-700">
                    เคยเป็นเบาหวานขณะตั้งครรภ์มาก่อน
                  </label>
                </div>
                
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="familyHistoryDiabetes"
                    id="familyHistoryDiabetes"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="familyHistoryDiabetes" className="ml-2 block text-sm text-gray-700">
                    มีประวัติเบาหวานในครอบครัว
                  </label>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4 mt-8">
                <h2 className="text-lg font-semibold">ข้อมูลการติดต่อฉุกเฉิน</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Emergency Contact */}
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    บุคคลที่ติดต่อได้
                  </label>
                  <Field
                    type="text"
                    name="emergencyContact"
                    id="emergencyContact"
                    className="input"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์ฉุกเฉิน
                  </label>
                  <Field
                    type="text"
                    name="emergencyContactPhone"
                    id="emergencyContactPhone"
                    className="input"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  บันทึกเพิ่มเติม
                </label>
                <Field
                  as="textarea"
                  name="notes"
                  id="notes"
                  rows={3}
                  className="input"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-5">
                <button
                  type="button"
                  onClick={() => navigate(isEditMode ? `/dashboard/patients/${id}` : '/dashboard/patients')}
                  className="btn btn-outline"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || createMutation.isLoading || updateMutation.isLoading}
                  className="btn btn-primary"
                >
                  {(isSubmitting || createMutation.isLoading || updateMutation.isLoading) ? 'กำลังบันทึก...' : isEditMode ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PatientForm;