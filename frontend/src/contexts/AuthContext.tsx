/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { AuthContext, type AuthContextType, type User } from './AuthContextTypes';
import { API_CONFIG, getAuthHeaders } from '../config/api';



export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
            headers: getAuthHeaders()
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            throw new Error('Auth check failed');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('accessToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token, user: userData } = data;
        
        localStorage.setItem('accessToken', access_token);
        setToken(access_token);
        setUser(userData);
        
        toast.success('Login exitoso');
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el login');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Error en el login');
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        toast.success('Registro exitoso');
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }
    } catch (error: any) {
      console.error('Register failed:', error);
      toast.error(error.message || 'Error en el registro');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
    toast.success('Sesión cerrada');
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};