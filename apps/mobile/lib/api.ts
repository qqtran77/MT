import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL: API_URL, timeout: 10000 });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((res) => res.data, (err) => Promise.reject(err.response?.data || err));

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
};
export const revenueApi = {
  dashboard: (branchId?: string) => api.get('/revenue/dashboard', { params: { branchId } }),
  chart: (days = 30) => api.get('/revenue/chart', { params: { days } }),
  byBranch: () => api.get('/revenue/by-branch'),
};
export const staffApi = {
  list: (branchId?: string) => api.get('/staff', { params: { branchId } }),
  create: (data: any) => api.post('/staff', data),
};
export const attendanceApi = {
  checkIn: (staffId: string) => api.post(`/attendance/check-in/${staffId}`),
  checkOut: (staffId: string) => api.post(`/attendance/check-out/${staffId}`),
  list: (params?: any) => api.get('/attendance', { params }),
};
export const inventoryApi = {
  list: (branchId?: string) => api.get('/inventory', { params: { branchId } }),
  lowStock: () => api.get('/inventory/low-stock'),
  addMovement: (data: any) => api.post('/inventory/movement', data),
};
export const invoicesApi = {
  list: (params?: any) => api.get('/invoices', { params }),
  stats: (params?: any) => api.get('/invoices/stats', { params }),
  create: (data: any) => api.post('/invoices', data),
};
export const bookingsApi = {
  list: (params?: any) => api.get('/bookings', { params }),
  checkIn: (id: string) => api.post(`/bookings/${id}/check-in`),
  checkOut: (id: string) => api.post(`/bookings/${id}/check-out`),
};
export const posApi = {
  createOrder: (data: any) => api.post('/pos/counter-orders', data),
  pay: (id: string, data: any) => api.post(`/pos/counter-orders/${id}/pay`, data),
  orders: (params?: any) => api.get('/pos/orders', { params }),
};
