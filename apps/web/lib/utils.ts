import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'CKD-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getTierLabel(tier: 'bronze' | 'silver' | 'gold' | 'platinum'): string {
  const labels: Record<string, string> = {
    bronze: 'Đồng',
    silver: 'Bạc',
    gold: 'Vàng',
    platinum: 'Bạch Kim',
  };
  return labels[tier] ?? tier;
}

export function getTierColor(tier: 'bronze' | 'silver' | 'gold' | 'platinum'): string {
  const colors: Record<string, string> = {
    bronze: 'bg-orange-100 text-orange-700',
    silver: 'bg-gray-200 text-gray-700',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-blue-100 text-blue-800',
  };
  return colors[tier] ?? 'bg-gray-100 text-gray-600';
}
