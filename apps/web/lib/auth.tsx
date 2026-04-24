'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { authApi } from './api';

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  role?: string;
  walletBalance: number;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

function mapUser(raw: any): AuthUser {
  return {
    id: raw?._id || raw?.id || '',
    _id: raw?._id || raw?.id || '',
    name: raw?.fullName || raw?.name || 'Người dùng',
    fullName: raw?.fullName || raw?.name || '',
    email: raw?.email || '',
    phone: raw?.phone || '',
    role: raw?.role || 'staff',
    walletBalance: raw?.walletBalance || 0,
    points: raw?.loyaltyPoints || raw?.points || 0,
    tier: raw?.tier || 'bronze',
  };
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) { setIsLoading(false); return; }
      const profile = await authApi.getProfile();
      setUser(mapUser(profile));
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    if (!data.token) throw new Error('Đăng nhập thất bại');
    localStorage.setItem('auth_token', data.token);
    const mapped = mapUser(data.user);
    localStorage.setItem('user', JSON.stringify(mapped));
    setUser(mapped);
  };

  const register = async (formData: any) => {
    const data = await authApi.register(formData);
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      const mapped = mapUser(data.user);
      localStorage.setItem('user', JSON.stringify(mapped));
      setUser(mapped);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
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
