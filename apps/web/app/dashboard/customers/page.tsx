'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  return json?.data ?? json;
}

const TIER_COLOR: Record<string,string> = { bronze:'bg-orange-100 text-orange-700', silver:'bg-gray-100 text-gray-700', gold:'bg-yellow-100 text-yellow-700', platinum:'bg-blue-100 text-blue-700' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    const data = await apiFetch(`/customers${search ? `?search=${search}` : ''}`).catch(() => []);
    setCustomers(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['bronze','silver','gold','platinum'] as const).map(tier => {
          const count = customers.filter(c=>c.tier===tier).length;
          return <div key={tier} className={`rounded-xl p-4 text-center ${TIER_COLOR[tier]}`}>
            <p className="text-2xl font-bold">{count}</p><p className="text-xs mt-1 capitalize">{tier}</p>
          </div>;
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} placeholder="🔍 Tìm tên, email, SĐT..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"/>
        <button onClick={load} className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold">Tìm</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">👤 Danh sách khách hàng ({customers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>{['Tên khách','Email','SĐT','Hạng','Điểm tích lũy','Tổng chi tiêu'].map(h=><th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400">Chưa có dữ liệu</td></tr>
                : customers.map((c,i)=>(
                <tr key={c._id||i} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">{c.fullName?.[0]?.toUpperCase()}</div>
                      <span className="font-semibold text-gray-800">{c.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.email||'—'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone||'—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${TIER_COLOR[c.tier]||'bg-gray-100 text-gray-600'}`}>{c.tier}</span></td>
                  <td className="px-4 py-3 font-semibold text-amber-600">{(c.loyaltyPoints||0).toLocaleString()} pts</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{((c.totalSpent||0)/1e6).toFixed(1)}M đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
