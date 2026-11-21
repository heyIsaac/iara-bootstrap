'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType } from './types';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from './api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      const storedEmail = localStorage.getItem('user_email');

      if (storedToken) {
        setToken(storedToken);
        setUserEmail(storedEmail);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin({ email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_email', email);
    }
    setToken(response.token);
    setUserEmail(email);
  };

  const register = async (email: string, password: string) => {
    const response = await apiRegister({ email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_email', email);
    }
    setToken(response.token);
    setUserEmail(email);
  };

  const logout = () => {
    apiLogout();
    setToken(null);
    setUserEmail(null);
  };

  const value: AuthContextType = {
    isAuthenticated: !!token,
    token,
    userEmail,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
