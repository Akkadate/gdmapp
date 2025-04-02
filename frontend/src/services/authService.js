import apiClient from './apiClient';

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user profile' };
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

export const logoutUser = async () => {
  // For client-side logout, we just need to remove the token
  // No API call needed unless you have server-side sessions
  return Promise.resolve();
};
