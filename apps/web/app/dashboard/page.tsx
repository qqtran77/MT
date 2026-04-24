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

const REVENUE_14D = [
  { date: '11/5', val: 85000000 },
  { date: '12/5', val: 120000000 },
  { date: '13/5', val: 95000000 },
  { date: '14/5', val: 145000000 },
  { date: '15/5', val: 180000000 },
  { date: '16/5', val: 210000000 },
  { date: '17/5', val: 165000000 },
  { date: '18/5', val: 130000000 },
  { date: '19/5', val: 155000000 },
  { date: '20/5', val: 190000000 },
  { date: '21/5', val: 225000000 },
  { date: '22/5', val: 175000000 },
  { date: '23/5', val: 140000000 },
  { date: '24/5', val: 195000000 },
];

const EXPIRING = [
  { room: 'Phòng 201', guest: 'Nguyễn Văn A', checkOut: '12:00', minutesLeft: 18 },
  { room: 'Phòng 305', guest: 'Trần Văn B', checkOut: '13:30', minutesLeft: 48 },
  { room: 'Phòng 102', guest: 'Lê Thị C', checkOut: '14:00', minutesLeft: 72 },
];

const BIRTHDAYS = [
  { name: 'Nguyễn Văn An', birthday: '25/05', tier: 'gold', phone: '0901234567' },
  { name: 'Trần Thị Bích', birthday: '26/05', tier: 'platinum', phone: '0912345678' },
  { name: 'Lê Hoàng Nam', birthday: '28/05', tier: 'silver', phone: '0923456789' },
];

const MAX_VAL = Math.max(...REVENUE_14D.map((d) => d.val));
const Y_LABELS = [0, 50, 100, 150, 200];

function fmtRevenue(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}T`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${n}`;
}

function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-800 mb-6 text-base">📊 Doanh thu 14 ngày gần nhất</h3>
      <div className="flex gap-4">
        {/* Y-axis */}
        <div className="flex flex-col justify-between items-end pb-7 shrink-0">
          {[...Y_LABELS].reverse().map((lbl) => (
            <span key={lbl} className="text-xs text-gray-400 leading-none">
              {lbl === 0 ? '0' : `${lbl}M`}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 min-w-0">
          {/* Grid lines */}
          <div className="relative" style={{ height: 180 }}>
            {Y_LABELS.map((lbl, i) => (
              <div
                key={lbl}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ bottom: `${(lbl / 200) * 100}%` }}
              />
            ))}
            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-1">
              {REVENUE_14D.map((d) => {
                const pct = Math.round((d.val / (200 * 1e6)) * 100);
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a3a5c] text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                      {d.date}: {d.val.toLocaleString('vi-VN')}đ
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a3a5c]" />
                    </div>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-[#1a3a5c] to-[#2e75b6] cursor-pointer hover:from-[#2e75b6] hover:to-[#5ba3d9] transition-colors"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex gap-1 mt-1">
            {REVENUE_14D.map((d) => (
              <div key={d.date} className="flex-1 text-center text-xs text-gray-400 truncate">
                {d.date}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpiringRooms() {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const getBg = (min: number) => {
    if (min < 30) return 'bg-red-50 border-red-200';
    if (min < 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getTextColor = (min: number) => {
    if (min < 30) return 'text-red-700';
    if (min < 60) return 'text-yellow-700';
    return 'text-blue-700';
  };

  const handleSend = (key: string) => {
    setSentIds((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setSentIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1 min-w-0">
      <h3 className="font-bold text-gray-800 mb-4">⏰ Phòng sắp hết giờ</h3>
      <div className="space-y-3">
        {EXPIRING.map((item) => {
          const key = `${item.room}-${item.guest}`;
          const sent = sentIds.has(key);
          return (
            <div
              key={key}
              className={`rounded-xl border px-4 py-3 flex items-center justify-between gap-3 ${getBg(item.minutesLeft)}`}
            >
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{item.room}</p>
                <p className="text-xs text-gray-500 truncate">{item.guest}</p>
                <p className={`text-xs font-bold mt-0.5 ${getTextColor(item.minutesLeft)}`}>
                  Checkout {item.checkOut} · còn {item.minutesLeft} phút
                </p>
              </div>
              <div className="shrink-0">
                {sent ? (
                  <span className="text-xs text-green-600 font-semibold whitespace-nowrap">✅ Đã gửi SMS</span>
                ) : (
                  <button
                    onClick={() => handleSend(key)}
                    className="text-xs bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#2e75b6] transition-colors whitespace-nowrap font-medium"
                  >
                    Gửi nhắc
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BirthdayPanel() {
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const TIER_BADGE: Record<string, string> = {
    gold: 'bg-yellow-100 text-yellow-700',
    platinum: 'bg-purple-100 text-purple-700',
    silver: 'bg-gray-100 text-gray-600',
  };

  const TIER_LABEL: Record<string, string> = {
    gold: 'Gold',
    platinum: 'Platinum',
    silver: 'Silver',
  };

  const handleSend = (phone: string) => {
    setSentIds((prev) => new Set(prev).add(phone));
    setTimeout(() => {
      setSentIds((prev) => {
        const next = new Set(prev);
        next.delete(phone);
        return next;
      });
    }, 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1 min-w-0">
      <h3 className="font-bold text-gray-800 mb-4">🎂 Sinh nhật khách hàng sắp tới</h3>
      <div className="space-y-3">
        {BIRTHDAYS.map((b) => {
          const initials = b.name
            .split(' ')
            .slice(-2)
            .map((w: string) => w[0])
            .join('')
            .toUpperCase();
          const sent = sentIds.has(b.phone);
          return (
            <div
              key={b.phone}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a3a5c] to-[#2e75b6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-800 text-sm">{b.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TIER_BADGE[b.tier]}`}>
                    {TIER_LABEL[b.tier]}
                  </span>
                </div>
                <p className="text-xs text-gray-400">🎁 {b.birthday}</p>
              </div>
              <div className="shrink-0">
                {sent ? (
                  <span className="text-xs text-green-600 font-semibold whitespace-nowrap">✅ Đã gửi</span>
                ) : (
                  <button
                    onClick={() => handleSend(b.phone)}
                    className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-lg hover:bg-pink-600 transition-colors whitespace-nowrap font-medium"
                  >
                    Gửi chúc mừng
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
      setBookings(Array.isArray(b) ? b.slice(0, 5) : []);
      setInvoices(Array.isArray(inv) ? inv.slice(0, 5) : []);
      setLowStock(Array.isArray(ls) ? ls.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : `${n}`;

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
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`bg-gradient-to-br ${item.color} text-white rounded-xl p-4 flex flex-col gap-2 hover:opacity-90 hover:shadow-md transition-all`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-semibold leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Revenue chart */}
      <RevenueChart />

      {/* Expiry + Birthday side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiringRooms />
        <BirthdayPanel />
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
