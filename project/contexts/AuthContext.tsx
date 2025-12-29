'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginData, RegisterData, AuthResponse } from '@/types/api';
import apiClient from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<boolean>;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (storedToken && storedRefreshToken) {
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        await fetchUserProfile();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/auth/me');
      // Handle both response structures: response.data.data.user or response.data.data
      const userData = response.data.data?.user || response.data.data;
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Clear auth on any error to prevent loops
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      // Handle both response structures
      const responseData = response.data.data || response.data;
      const { token: newToken, refreshToken: newRefreshToken, user: userData } = responseData;
      
      // Debug logging
      console.log('Login response:', { userData, role: userData?.role });
      
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token: newToken, refreshToken: newRefreshToken, user: newUser } = response.data.data;
      
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(newUser);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      if (!refreshToken) return false;
      
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
      
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setToken(newToken);
      setRefreshToken(newRefreshToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
      return false;
    }
  };

  const isAuthenticated = !!user && !!token;
  
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const userRole = user.role;
    return Array.isArray(role) ? role.includes(userRole) : userRole === role;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      refreshToken,
      login, 
      register, 
      logout, 
      refreshAuthToken,
      isAuthenticated,
      hasRole,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
