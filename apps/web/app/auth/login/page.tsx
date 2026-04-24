'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      // Lưu token (data.data.access_token hoặc data.access_token)
      const token = data?.data?.access_token || data?.access_token;
      const user = data?.data?.user || data?.user;
      if (!token) throw new Error('Không nhận được token');
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-primary">🏢</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-secondary font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-primary-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Đang đăng nhập...' : 'Đăng Nhập'}
          </button>

          {/* Demo accounts */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wide">Tài khoản demo</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: '👑 Admin', email: 'admin@ckd.vn', pass: 'Admin@123' },
                { label: '👔 Quản lý', email: 'manager@ckd.vn', pass: 'Manager@123' },
                { label: '🧑 Nhân viên', email: 'staff@ckd.vn', pass: 'Staff@123' },
              ].map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="text-left text-xs bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-secondary px-3 py-2 rounded-lg transition"
                >
                  <span className="font-semibold">{acc.label}</span>
                  <span className="text-gray-500 ml-2">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
