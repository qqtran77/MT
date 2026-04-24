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

export default function RevenuePage() {
  const [dash, setDash] = useState<any>({});
  const [chart, setChart] = useState<any[]>([]);
  const [byBranch, setByBranch] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch('/revenue/dashboard').catch(() => ({})),
      apiFetch('/revenue/chart?days=14').catch(() => []),
      apiFetch('/revenue/by-branch').catch(() => []),
      apiFetch('/revenue/top-products?limit=5').catch(() => []),
    ]).then(([d, c, b, p]) => {
      setDash(d || {}); setChart(Array.isArray(c) ? c : []);
      setByBranch(Array.isArray(b) ? b : []); setTopProducts(Array.isArray(p) ? p : []);
    });
  }, []);

  const maxRevenue = Math.max(...chart.map(d => d.revenue || 0), 1);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hôm nay', value: dash.todayRevenue || 0, orders: dash.todayOrders, color: 'border-l-green-500' },
          { label: 'Tháng này', value: dash.monthRevenue || 0, orders: dash.monthOrders, color: 'border-l-blue-500' },
          { label: 'Tháng trước', value: dash.lastMonthRevenue || 0, orders: null, color: 'border-l-purple-500' },
          { label: 'Tăng trưởng', value: null, growth: dash.growth, color: 'border-l-amber-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-l-4 ${s.color}`}>
            <p className="text-gray-500 text-sm">{s.label}</p>
            {s.value !== null && s.value !== undefined ? (
              <p className="text-xl font-bold text-gray-800 mt-1">{(s.value/1e6).toFixed(2)}M đ</p>
            ) : (
              <p className="text-xl font-bold text-gray-800 mt-1">{s.growth || 0}%</p>
            )}
            {s.orders !== undefined && s.orders !== null && <p className="text-xs text-gray-400 mt-1">{s.orders} đơn hàng</p>}
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">📈 Doanh thu 14 ngày gần đây</h3>
        <div className="flex items-end gap-1 h-40">
          {chart.length === 0 ? (
            <p className="text-gray-400 text-sm w-full text-center pt-16">Chưa có dữ liệu</p>
          ) : chart.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div
                  className="bg-[#2e75b6] hover:bg-[#1a3a5c] rounded-t-sm transition-all cursor-pointer"
                  style={{ height: `${Math.max((d.revenue / maxRevenue) * 120, 4)}px` }}
                  title={`${new Date(d.date).toLocaleDateString('vi-VN')}: ${(d.revenue/1e6).toFixed(1)}M`}
                />
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">{d.date?.slice(5)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Branch */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">🏢 Doanh thu theo chi nhánh</h3>
          </div>
          <div className="divide-y divide-gray-50 p-4 space-y-3">
            {byBranch.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
              : byBranch.map((b, i) => {
              const max = byBranch[0]?.revenue || 1;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700">{b.branchName || b._id || 'Chi nhánh'}</span>
                    <span className="font-bold text-gray-800">{((b.revenue||0)/1e6).toFixed(1)}M đ</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className="bg-[#2e75b6] h-2 rounded-full transition-all" style={{ width: `${(b.revenue/max)*100}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{b.orders || 0} đơn • {b.industry || ''}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">🏆 Sản phẩm bán chạy</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {topProducts.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">Chưa có dữ liệu</p>
              : topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">#{i+1}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p._id}</p>
                    <p className="text-xs text-gray-400">SL: {p.totalQty}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-800">{((p.totalRevenue||0)/1e6).toFixed(1)}M đ</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
