'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  roles: string[]; // which roles can see this
}

const NAV_GROUPS = [
  {
    label: 'TỔNG QUAN',
    items: [
      { href: '/dashboard', label: 'Tổng quan', icon: '📊', exact: true, roles: ['admin', 'branch_manager', 'accountant', 'staff'] },
      { href: '/dashboard/bookings', label: 'Đặt lịch', icon: '📅', roles: ['admin', 'branch_manager', 'staff'] },
      { href: '/dashboard/pos', label: 'Bán hàng POS', icon: '🛒', roles: ['admin', 'branch_manager', 'staff'] },
      { href: '/dashboard/kpi', label: 'KPI & Mục tiêu', icon: '🎯', roles: ['admin', 'branch_manager'] },
    ],
  },
  {
    label: 'VẬN HÀNH',
    items: [
      { href: '/dashboard/rooms', label: 'Phòng & Tài nguyên', icon: '🏨', roles: ['admin', 'branch_manager', 'staff'] },
      { href: '/dashboard/housekeeping', label: 'Dọn vệ sinh', icon: '🧹', roles: ['admin', 'branch_manager', 'staff'] },
      { href: '/dashboard/maintenance', label: 'Bảo trì sửa chữa', icon: '🔧', roles: ['admin', 'branch_manager', 'staff'] },
      { href: '/dashboard/inventory', label: 'Kho hàng', icon: '🗃️', roles: ['admin', 'branch_manager', 'staff'] },
    ],
  },
  {
    label: 'DỊCH VỤ',
    items: [
      { href: '/dashboard/packages', label: 'Gói dịch vụ', icon: '📦', roles: ['admin', 'branch_manager'] },
      { href: '/dashboard/promotions', label: 'Khuyến mãi', icon: '🎁', roles: ['admin', 'branch_manager'] },
    ],
  },
  {
    label: 'NHÂN SỰ',
    items: [
      { href: '/dashboard/staff', label: 'Nhân viên', icon: '👥', roles: ['admin', 'branch_manager'] },
      { href: '/dashboard/branches', label: 'Chi nhánh', icon: '🏢', roles: ['admin'] },
    ],
  },
  {
    label: 'KHÁCH HÀNG',
    items: [
      { href: '/dashboard/customers', label: 'Khách hàng', icon: '👤', roles: ['admin', 'branch_manager', 'accountant'] },
      { href: '/dashboard/debts', label: 'Công nợ', icon: '💳', roles: ['admin', 'accountant'] },
    ],
  },
  {
    label: 'TÀI CHÍNH',
    items: [
      { href: '/dashboard/revenue', label: 'Doanh thu', icon: '💰', roles: ['admin', 'branch_manager', 'accountant'] },
      { href: '/dashboard/invoices', label: 'Hóa đơn', icon: '🧾', roles: ['admin', 'accountant'] },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { href: '/dashboard/social', label: 'Mạng xã hội', icon: '📱', roles: ['admin', 'branch_manager'] },
    ],
  },
];

const ROLE_LABELS: Record<string, string> = {
  admin: '👑 Admin',
  branch_manager: '👔 Quản lý chi nhánh',
  accountant: '📋 Kế toán',
  staff: '🧑 Nhân viên',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'text-amber-400',
  branch_manager: 'text-blue-300',
  accountant: 'text-green-300',
  staff: 'text-gray-300',
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

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const userRole = user?.role || 'staff';

  const visibleGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(userRole)),
  })).filter(group => group.items.length > 0);

  const currentLabel = NAV_GROUPS.flatMap(g => g.items).find(n => isActive(n))?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-[#1a3a5c] flex flex-col min-h-screen fixed left-0 top-0 z-40 shadow-xl`}>
        {/* Logo + toggle */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-[#1a3a5c] font-bold text-sm">CKD</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Chuỗi Kinh Doanh</p>
              <p className="text-blue-300 text-xs">Management System</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-blue-300 hover:text-white transition shrink-0 text-lg"
            title={sidebarOpen ? 'Thu gọn' : 'Mở rộng'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          {visibleGroups.map(group => (
            <div key={group.label} className="mb-2">
              {sidebarOpen && (
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5">
                  {group.label}
                </p>
              )}
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg mb-0.5 transition-all text-sm font-medium
                    ${isActive(item)
                      ? 'bg-amber-400 text-[#1a3a5c] shadow-md'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <span className="text-base shrink-0 w-5 text-center">{item.icon}</span>
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User info */}
        {user && (
          <div className="p-3 border-t border-white/10 bg-[#152e4a]">
            {sidebarOpen ? (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                  <span className="text-[#1a3a5c] font-bold text-sm">
                    {(user.name || user.fullName || 'U')[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name || user.fullName}</p>
                  <p className={`text-xs font-medium ${ROLE_COLORS[userRole] || 'text-blue-300'}`}>
                    {ROLE_LABELS[userRole] || userRole}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="text-blue-300 hover:text-red-400 transition text-xl shrink-0"
                >
                  ⇥
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                  <span className="text-[#1a3a5c] font-bold text-xs">
                    {(user.name || 'U')[0]?.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-blue-300 hover:text-red-400 transition text-lg"
                  title="Đăng xuất"
                >
                  ⇥
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-gray-800 font-bold text-lg">{currentLabel}</h1>
            {user && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                userRole === 'admin' ? 'bg-amber-100 text-amber-700' :
                userRole === 'branch_manager' ? 'bg-blue-100 text-blue-700' :
                userRole === 'accountant' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {ROLE_LABELS[userRole]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <Link href="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              ← Trang chủ
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 min-h-0">{children}</main>
      </div>
    </div>
  );
}
