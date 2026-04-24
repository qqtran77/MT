'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  return json?.data ?? json;
}
const PAY_LABEL: Record<string,string> = { cash:'💵 Tiền mặt', card:'💳 Thẻ', transfer:'🏦 Chuyển khoản', momo:'📱 MoMo', vnpay:'📱 VNPay', room_charge:'🛎️ Tính phòng' };

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [period, setPeriod] = useState('today');

  useEffect(() => {
    Promise.all([
      apiFetch(`/invoices`).catch(()=>[]),
      apiFetch(`/invoices/stats?period=${period}`).catch(()=>({})),
    ]).then(([inv, st]) => {
      setInvoices(Array.isArray(inv) ? inv : []);
      setStats(st || {});
    });
  }, [period]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Doanh thu</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{((stats.totalRevenue||0)/1e6).toFixed(2)}M đ</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Số hóa đơn</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.count || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Trung bình/đơn</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{((stats.avgOrder||0)/1e3).toFixed(0)}K đ</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-2">
        {['today','week','month'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${period===p ? 'bg-[#1a3a5c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {p==='today'?'Hôm nay':p==='week'?'7 ngày':'Tháng này'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">🧾 Danh sách hóa đơn ({invoices.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>{['Số HĐ','Nguồn','Mặt hàng','Tiền hàng','Giảm giá','Tổng','Thanh toán','Thời gian'].map(h=><th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.length === 0 ? <tr><td colSpan={8} className="text-center py-12 text-gray-400">Chưa có hóa đơn</td></tr>
                : invoices.map((inv,i) => (
                <tr key={inv._id||i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{inv.invoiceNo}</td>
                  <td className="px-4 py-3"><span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs uppercase">{inv.source}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{inv.items?.length || 0} mặt hàng</td>
                  <td className="px-4 py-3 text-gray-700">{(inv.subtotal||0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-4 py-3 text-red-500">{inv.discount ? `-${inv.discount.toLocaleString('vi-VN')}đ` : '—'}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{(inv.total||0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{PAY_LABEL[inv.paymentMethod] || inv.paymentMethod}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(inv.createdAt).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
