'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { authApi } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  points: number;
  tier: 'silver' | 'gold' | 'platinum';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      const profile = await authApi.getProfile();
      setUser(profile as AuthUser);
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (formData: { name: string; email: string; phone: string; password: string }) => {
    const data = await authApi.register(formData);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth() {
  const auth = useAuth();
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  return auth;
}
