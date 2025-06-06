import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка статуса аутентификации при монтировании
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to get user profile:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', response.token);
      return { success: true };
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('token', response.token);
      return { success: true };
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    token: localStorage.getItem('token'),
    updateProfile: (updatedUser) => {
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 