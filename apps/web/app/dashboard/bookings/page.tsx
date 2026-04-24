'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string, opts?: any) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...opts });
  const json = await res.json();
  return json?.data ?? json;
}

const STATUS = { pending:'Chờ xác nhận', confirmed:'Đã xác nhận', checked_in:'Đã nhận phòng', checked_out:'Đã trả phòng', cancelled:'Đã huỷ' };
const STATUS_COLOR: Record<string,string> = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-700', checked_in:'bg-green-100 text-green-700', checked_out:'bg-gray-100 text-gray-600', cancelled:'bg-red-100 text-red-600' };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [userBranchId, setUserBranchId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('staff');

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      setUserRole(u.role || 'staff');
      setUserBranchId(u.branchId ? String(u.branchId) : null);
    }
  }, []);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('status', filter);
    if (userRole !== 'admin' && userBranchId) params.set('branchId', userBranchId);
    const q = params.toString() ? `?${params.toString()}` : '';
    const data = await apiFetch(`/bookings${q}`).catch(() => []);
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter, userBranchId, userRole]);

  async function doAction(id: string, action: string) {
    await apiFetch(`/bookings/${id}/${action}`, { method: 'POST' });
    load();
  }

  const filtered = bookings.filter(b =>
    !search || b.guestName?.toLowerCase().includes(search.toLowerCase()) || b.bookingNo?.includes(search) || b.guestPhone?.includes(search)
  );

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm tên, mã, SĐT..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === s ? 'bg-[#1a3a5c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s === 'all' ? 'Tất cả' : STATUS[s as keyof typeof STATUS]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {Object.entries(STATUS).map(([k, v]) => {
          const count = bookings.filter(b => b.status === k).length;
          return (
            <div key={k} className={`rounded-xl p-3 text-center ${STATUS_COLOR[k]}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs mt-0.5">{v}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">📅 Danh sách đặt phòng ({filtered.length})</h3>
          <Link href="/booking/hotel"
            className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#15304f] transition flex items-center gap-1.5">
            + Tạo đặt phòng mới
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Mã đặt phòng','Khách hàng','Loại','Phòng/Bàn','Ngày','Tổng tiền','Trạng thái','Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Đang tải...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Không có dữ liệu</td></tr>
              ) : filtered.map((b, i) => (
                <tr key={b._id || i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{b.bookingNo}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{b.guestName || 'Khách lẻ'}</p>
                    <p className="text-xs text-gray-400">{b.guestPhone}</p>
                  </td>
                  <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold uppercase">{b.industry}</span></td>
                  <td className="px-4 py-3 text-gray-600">{b.resourceName || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{new Date(b.startDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{(b.totalAmount||0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS[b.status as keyof typeof STATUS] || b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {b.status === 'pending' && <button onClick={() => doAction(b._id,'check-in')} className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Xác nhận</button>}
                      {b.status === 'confirmed' && <button onClick={() => doAction(b._id,'check-in')} className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Check-in</button>}
                      {b.status === 'checked_in' && <button onClick={() => doAction(b._id,'check-out')} className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700">Check-out</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
