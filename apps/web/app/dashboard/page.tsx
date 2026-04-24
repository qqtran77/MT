'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiFetch(path: string) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  return json?.data ?? json;
}

function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [dash, setDash] = useState<any>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/revenue/dashboard').catch(() => ({})),
      apiFetch('/bookings?limit=5').catch(() => []),
      apiFetch('/invoices?limit=5').catch(() => []),
      apiFetch('/inventory/low-stock').catch(() => []),
    ]).then(([d, b, inv, ls]) => {
      setDash(d || {});
      setBookings(Array.isArray(b) ? b.slice(0,5) : []);
      setInvoices(Array.isArray(inv) ? inv.slice(0,5) : []);
      setLowStock(Array.isArray(ls) ? ls.slice(0,5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(0)}K` : `${n}`;

  const STATUS_COLOR: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    checked_in: 'bg-green-100 text-green-700',
    checked_out: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
    paid: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#1a3a5c] to-[#2e75b6] rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Tổng quan hệ thống 🏢</h2>
        <p className="text-blue-200 mt-1 text-sm">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💵" label="Doanh thu hôm nay" value={`${fmt(dash.todayRevenue || 0)}đ`} sub={`${dash.todayOrders || 0} đơn hàng`} color="bg-green-50" />
        <StatCard icon="📈" label="Doanh thu tháng" value={`${fmt(dash.monthRevenue || 0)}đ`} sub={`${dash.monthOrders || 0} đơn`} color="bg-blue-50" />
        <StatCard icon="📊" label="Tăng trưởng" value={`${dash.growth || 0}%`} sub="so với tháng trước" color="bg-purple-50" />
        <StatCard icon="⚠️" label="Kho cần nhập" value={lowStock.length} sub="sản phẩm tồn thấp" color="bg-amber-50" />
      </div>

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/dashboard/revenue', icon: '💰', label: 'Báo cáo doanh thu', color: 'from-green-500 to-emerald-600' },
          { href: '/dashboard/bookings', icon: '📅', label: 'Quản lý đặt phòng', color: 'from-blue-500 to-blue-700' },
          { href: '/dashboard/staff', icon: '👥', label: 'Quản lý nhân viên', color: 'from-violet-500 to-purple-700' },
          { href: '/dashboard/inventory', icon: '📦', label: 'Quản lý kho', color: 'from-orange-500 to-amber-600' },
          { href: '/dashboard/invoices', icon: '🧾', label: 'Hóa đơn & Thanh toán', color: 'from-sky-500 to-cyan-600' },
          { href: '/dashboard/customers', icon: '👤', label: 'Khách hàng', color: 'from-rose-500 to-pink-600' },
          { href: '/dashboard/pos', icon: '🛒', label: 'Bán hàng POS', color: 'from-teal-500 to-green-600' },
          { href: '/booking', icon: '🏨', label: 'Tạo đặt phòng mới', color: 'from-indigo-500 to-blue-600' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className={`bg-gradient-to-br ${item.color} text-white rounded-xl p-4 flex flex-col gap-2 hover:opacity-90 hover:shadow-md transition-all`}>
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-semibold leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">📅 Đặt phòng gần đây</h3>
            <Link href="/dashboard/bookings" className="text-sm text-blue-600 hover:underline">Xem tất cả →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <p className="text-center text-gray-400 py-8">Đang tải...</p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Chưa có dữ liệu</p>
            ) : bookings.map((b, i) => (
              <div key={b._id || i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{b.guestName || 'Khách lẻ'}</p>
                  <p className="text-xs text-gray-400">{b.bookingNo} • {b.industry?.toUpperCase()} • {b.resourceName || 'N/A'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLOR[b.status] || 'bg-gray-100 text-gray-600'}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">🧾 Hóa đơn gần đây</h3>
            <Link href="/dashboard/invoices" className="text-sm text-blue-600 hover:underline">Xem tất cả →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              <p className="text-center text-gray-400 py-8">Đang tải...</p>
            ) : invoices.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Chưa có dữ liệu</p>
            ) : invoices.map((inv, i) => (
              <div key={inv._id || i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{inv.invoiceNo}</p>
                  <p className="text-xs text-gray-400">{inv.source?.toUpperCase()} • {inv.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-sm">{(inv.total || 0).toLocaleString('vi-VN')}đ</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[inv.status] || 'bg-gray-100 text-gray-600'}`}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-amber-800 mb-3">⚠️ Cảnh báo tồn kho thấp ({lowStock.length} sản phẩm)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map((item, i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category} • Min: {item.minQuantity} {item.unit}</p>
                </div>
                <span className="font-bold text-red-600">{item.quantity} {item.unit}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/inventory" className="mt-3 inline-block text-sm text-amber-700 font-semibold hover:underline">
            Quản lý kho →
          </Link>
        </div>
      )}
    </div>
  );
}
