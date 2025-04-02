import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, getUserProfile, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated (token exists)
  const isAuthenticated = !!token;

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Token might be invalid, clear it
          logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const { user, token } = await loginUser(credentials);
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
