'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tổng quan', icon: '📊', exact: true },
  { href: '/dashboard/revenue', label: 'Doanh thu', icon: '💰' },
  { href: '/dashboard/bookings', label: 'Đặt phòng', icon: '📅' },
  { href: '/dashboard/staff', label: 'Nhân viên', icon: '👥' },
  { href: '/dashboard/inventory', label: 'Kho hàng', icon: '📦' },
  { href: '/dashboard/invoices', label: 'Hóa đơn', icon: '🧾' },
  { href: '/dashboard/customers', label: 'Khách hàng', icon: '👤' },
  { href: '/dashboard/pos', label: 'Bán hàng POS', icon: '🛒' },
];

const ROLE_LABELS: Record<string, string> = {
  admin: '👑 Admin',
  branch_manager: '👔 Quản lý',
  accountant: '📋 Kế toán',
  staff: '🧑 Nhân viên',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.replace('/auth/login'); return; }
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.replace('/auth/login');
  }

  const isActive = (item: typeof NAV_ITEMS[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 bg-[#1a3a5c] flex flex-col min-h-screen fixed left-0 top-0 z-40`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-[#1a3a5c] font-bold text-sm">CKD</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-white font-bold text-sm leading-tight">Chuỗi Kinh Doanh</p>
              <p className="text-blue-300 text-xs">Management</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-all text-sm font-medium
                ${isActive(item) ? 'bg-amber-400 text-[#1a3a5c]' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}>
              <span className="text-lg shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        {user && (
          <div className="p-3 border-t border-white/10">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                  <span className="text-[#1a3a5c] font-bold text-sm">{(user.name || user.fullName || 'U')[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name || user.fullName}</p>
                  <p className="text-blue-300 text-xs">{ROLE_LABELS[user.role] || user.role}</p>
                </div>
                <button onClick={handleLogout} title="Đăng xuất"
                  className="text-blue-300 hover:text-red-400 transition text-lg">⇥</button>
              </div>
            ) : (
              <button onClick={handleLogout}
                className="w-full flex justify-center text-blue-300 hover:text-red-400 transition text-xl">⇥</button>
            )}
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-60' : 'ml-16'} transition-all duration-300`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700 text-xl">☰</button>
            <h1 className="text-gray-800 font-semibold text-lg">
              {NAV_ITEMS.find(n => isActive(n))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline">← Về trang chủ</Link>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
