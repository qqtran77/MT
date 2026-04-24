'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { customerApi, bookingApi, Booking, Transaction } from '@/lib/api';
import { TierBadge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import {
  User, Wallet, Star, Hotel, Coffee, Film,
  ArrowUpRight, ArrowDownLeft, Loader2, LogOut,
  Calendar, ChevronRight
} from 'lucide-react';

const mockTransactions: Transaction[] = [
  { id: 't1', type: 'debit', amount: 1500000, description: 'Đặt phòng Deluxe View Biển', createdAt: '2024-07-15T10:30:00' },
  { id: 't2', type: 'credit', amount: 500000, description: 'Hoàn tiền hủy phòng', createdAt: '2024-07-10T14:00:00' },
  { id: 't3', type: 'debit', amount: 90000, description: 'Mua vé phim Lật Mặt 7', createdAt: '2024-07-05T18:20:00' },
  { id: 't4', type: 'credit', amount: 200000, description: 'Nạp tiền vào ví', createdAt: '2024-07-01T09:00:00' },
];

const mockBookings: Booking[] = [
  {
    id: 'b1', type: 'hotel', customerName: 'Test', customerPhone: '0901234567',
    customerEmail: 'test@test.com', status: 'confirmed', totalAmount: 1500000,
    resourceId: 'r1', resourceName: 'Phòng Deluxe View Biển',
    checkIn: '2024-08-01', checkOut: '2024-08-03', createdAt: '2024-07-15T10:30:00',
    referenceCode: 'CKD-ABC12345',
  },
  {
    id: 'b2', type: 'cinema', customerName: 'Test', customerPhone: '0901234567',
    customerEmail: 'test@test.com', status: 'completed', totalAmount: 180000,
    resourceId: 'r2', resourceName: 'Lật Mặt 7 - 14:00 - Phòng 1',
    createdAt: '2024-07-05T18:20:00', referenceCode: 'CKD-DEF67890',
  },
];

const typeIcons = { hotel: Hotel, cafe: Coffee, cinema: Film };

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'wallet' | 'points'>('bookings');

  const { data: transactions, isLoading: txLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      try { return await customerApi.getTransactions(); }
      catch { return mockTransactions; }
    },
    enabled: isAuthenticated,
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      try { return await bookingApi.getMyBookings(); }
      catch { return mockBookings; }
    },
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Đăng nhập để tiếp tục</h1>
          <p className="text-gray-500 mb-8">Xem lịch sử đặt dịch vụ, ví điện tử và điểm tích lũy của bạn</p>
          <div className="flex flex-col gap-3">
            <Link href="/auth/login">
              <Button size="lg" className="w-full">Đăng Nhập</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="w-full">Tạo Tài Khoản Mới</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-hero-gradient text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-extrabold mb-1">{user?.name}</h1>
              <p className="text-blue-200 text-sm mb-3">{user?.email}</p>
              {user?.tier && <TierBadge tier={user.tier} size="md" />}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Số dư ví', value: formatCurrency(user?.walletBalance || 0), icon: Wallet, color: 'text-green-300' },
              { label: 'Điểm tích lũy', value: `${(user?.points || 0).toLocaleString()}đ`, icon: Star, color: 'text-yellow-300' },
              { label: 'Đặt dịch vụ', value: `${bookings?.length || 0}`, icon: Calendar, color: 'text-blue-300' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-xl font-extrabold">{stat.value}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6 w-fit">
          {[
            { id: 'bookings' as const, label: 'Lịch sử đặt dịch vụ', icon: Calendar },
            { id: 'wallet' as const, label: 'Ví điện tử', icon: Wallet },
            { id: 'points' as const, label: 'Điểm & Hạng', icon: Star },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !bookings?.length ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Chưa có đặt dịch vụ nào</p>
                <Link href="/booking" className="mt-4 inline-block">
                  <Button>Đặt Dịch Vụ Ngay</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const Icon = typeIcons[booking.type];
                  return (
                    <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-gray-800 truncate">{booking.resourceName}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{booking.referenceCode}</p>
                            </div>
                            <StatusBadge status={booking.status} />
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            {booking.checkIn && (
                              <span className="text-gray-500">
                                {booking.checkIn} → {booking.checkOut}
                              </span>
                            )}
                            <span className="font-bold text-primary">
                              {formatCurrency(booking.totalAmount)}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">
                            Đặt lúc {formatDateTime(booking.createdAt)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div>
            <div className="bg-hero-gradient rounded-2xl text-white p-6 mb-6">
              <p className="text-blue-200 text-sm mb-1">Số dư ví điện tử</p>
              <p className="text-4xl font-extrabold">{formatCurrency(user?.walletBalance || 0)}</p>
              <div className="flex gap-3 mt-5">
                <Button className="bg-white text-primary hover:bg-gray-100" size="sm">
                  Nạp tiền
                </Button>
                <Button className="bg-white/20 hover:bg-white/30 border border-white/30" size="sm">
                  Rút tiền
                </Button>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 mb-4">Lịch sử giao dịch</h3>
            {txLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {(transactions || []).map((tx, i) => (
                  <div key={tx.id} className={`flex items-center gap-4 p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {tx.type === 'credit'
                        ? <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        : <ArrowUpRight className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{tx.description}</p>
                      <p className="text-xs text-gray-400">{formatDateTime(tx.createdAt)}</p>
                    </div>
                    <p className={`font-bold text-sm shrink-0 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Points Tab */}
        {activeTab === 'points' && (
          <div className="space-y-5">
            {/* Current Tier */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Hạng thành viên của bạn</h3>
                  {user?.tier && <TierBadge tier={user.tier} size="lg" />}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-primary">
                    {(user?.points || 0).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">điểm tích lũy</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Tiến độ lên hạng Vàng</span>
                  <span>{user?.points || 0} / 5000 điểm</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((user?.points || 0) / 5000) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Cần thêm {Math.max(0, 5000 - (user?.points || 0)).toLocaleString()} điểm để lên hạng Vàng
                </p>
              </div>
            </div>

            {/* Tier Benefits */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Quyền lợi theo hạng</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { tier: 'silver', label: 'Bạc', points: '0 - 4.999', benefits: ['Tích 1đ/1.000đ chi tiêu', 'Ưu đãi sinh nhật 5%', 'Hỗ trợ ưu tiên'] },
                  { tier: 'gold', label: 'Vàng', points: '5.000 - 19.999', benefits: ['Tích 1,5đ/1.000đ', 'Ưu đãi sinh nhật 10%', 'Check-in sớm miễn phí', 'Hỗ trợ 24/7'] },
                  { tier: 'platinum', label: 'Bạch Kim', points: '20.000+', benefits: ['Tích 2đ/1.000đ', 'Ưu đãi sinh nhật 20%', 'Upgrade phòng miễn phí', 'Butler riêng', 'Quà tặng hàng tháng'] },
                ].map((t) => (
                  <div key={t.tier} className={`rounded-xl p-4 border-2 ${user?.tier === t.tier ? 'border-primary shadow-md' : 'border-gray-200'}`}>
                    <p className="font-bold text-gray-800 mb-0.5">Hạng {t.label}</p>
                    <p className="text-xs text-gray-500 mb-3">{t.points} điểm</p>
                    <ul className="space-y-1.5">
                      {t.benefits.map((b) => (
                        <li key={b} className="text-xs text-gray-600 flex items-start gap-1.5">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    {user?.tier === t.tier && (
                      <div className="mt-3 bg-primary-50 text-primary text-xs font-semibold px-2 py-1 rounded-lg text-center">
                        Hạng hiện tại
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
