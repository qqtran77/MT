'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { TierBadge } from '@/components/ui/Badge';
import {
  Menu,
  X,
  Hotel,
  Coffee,
  Film,
  User,
  Wallet,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Trang Chủ' },
  { href: '/booking/hotel', label: 'Khách Sạn', icon: Hotel },
  { href: '/booking/cafe', label: 'Cafe', icon: Coffee },
  { href: '/booking/cinema', label: 'Rạp Phim', icon: Film },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CKD</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-primary font-bold text-base leading-tight">Chuỗi Kinh Doanh</p>
              <p className="text-gray-500 text-xs">Trải nghiệm đẳng cấp</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary hover:bg-primary-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <TierBadge tier={user.tier} size="sm" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Hồ Sơ Của Tôi</span>
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
                      <Wallet className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Ví điện tử</p>
                        <p className="text-sm font-semibold text-primary">
                          {user.walletBalance.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Đăng Xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">Đăng Nhập</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Đăng Ký</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setIsOpen(false)}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-gray-200 flex gap-2">
            {isAuthenticated ? (
              <Link href="/profile" className="flex-1" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">
                  <User className="w-4 h-4" />
                  Hồ Sơ
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Đăng Nhập</Button>
                </Link>
                <Link href="/auth/register" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" size="sm">Đăng Ký</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
