'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');

      const token = data?.data?.access_token || data?.access_token;
      const user  = data?.data?.user        || data?.user;

      if (!token) throw new Error('Không nhận được token từ server');

      // Lưu vào localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect theo role — dùng window.location để full reload + sync auth state
      const role = user?.role;
      if (role === 'admin' || role === 'branch_manager' || role === 'accountant') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không đúng');
      setLoading(false);
    }
  }

  const DEMO_ACCOUNTS = [
    { label: '👑 Admin',     email: 'admin@ckd.vn',   pass: 'Admin@123',   role: 'admin' },
    { label: '👔 Quản lý',  email: 'manager@ckd.vn', pass: 'Manager@123', role: 'branch_manager' },
    { label: '🧑 Nhân viên', email: 'staff@ckd.vn',   pass: 'Staff@123',   role: 'staff' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a3a5c] to-[#2e75b6] py-12 px-4">
      <div className="max-w-md w-full space-y-6">

        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-[#1a3a5c] font-extrabold text-2xl">CKD</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Đăng nhập</h2>
          <p className="mt-2 text-blue-200 text-sm">
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-amber-300 font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>❌</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2e75b6] focus:border-transparent transition text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2e75b6] focus:border-transparent transition text-gray-800"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1a3a5c] hover:bg-[#152e4a] text-white py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : '🔐 Đăng Nhập'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-widest text-center">
              — Tài khoản demo —
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email} type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="w-full flex items-center justify-between text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#2e75b6] px-4 py-2.5 rounded-xl transition group"
                >
                  <div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-[#1a3a5c]">{acc.label}</span>
                    <span className="text-xs text-gray-400 ml-2">{acc.email}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-200 group-hover:bg-[#1a3a5c] group-hover:text-white px-2 py-0.5 rounded-full transition">
                    {acc.role === 'admin' ? 'Dashboard' : acc.role === 'branch_manager' ? 'Dashboard' : 'Trang chủ'}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              Admin/Quản lý → Dashboard &nbsp;|&nbsp; Nhân viên → Trang chủ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
