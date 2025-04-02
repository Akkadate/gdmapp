import apiClient from './apiClient';

export const getAllPatients = async () => {
  try {
    const response = await apiClient.get('/patients');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get patients' };
  }
};

export const getPatientById = async (id) => {
  try {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get patient details' };
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await apiClient.post('/patients', patientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create patient' };
  }
};

export const updatePatient = async (id, patientData) => {
  try {
    const response = await apiClient.put(`/patients/${id}`, patientData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update patient' };
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete patient' };
  }
};

export const getPatientStatistics = async () => {
  try {
    const response = await apiClient.get('/patients/statistics');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get patient statistics' };
  }
};
