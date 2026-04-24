'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string, opts?: any) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...opts });
  const json = await res.json();
  return json?.data ?? json;
}
const STATUS_COLOR: Record<string,string> = { open:'bg-blue-100 text-blue-700', serving:'bg-yellow-100 text-yellow-700', paid:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-600' };
const PAY_LABEL: Record<string,string> = { cash:'💵 Tiền mặt', card:'💳 Thẻ', transfer:'🏦 Chuyển khoản', momo:'📱 MoMo', vnpay:'📱 VNPay', room_charge:'🛎️ Tính phòng' };

export default function PosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    const q = filter !== 'all' ? `?status=${filter}` : '';
    const data = await apiFetch(`/pos/orders${q}`).catch(() => []);
    setOrders(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, [filter]);

  async function handlePay(id: string) {
    const method = prompt('Phương thức thanh toán (cash/card/momo/vnpay):') || 'cash';
    await apiFetch(`/pos/counter-orders/${id}/pay`, { method:'POST', body: JSON.stringify({ paymentMethod: method }) });
    load();
  }

  const total = orders.filter(o=>o.status==='paid').reduce((s,o)=>s+o.total,0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[{label:'Đơn đang mở',val:orders.filter(o=>o.status==='open').length,color:'text-blue-600'},
          {label:'Đang phục vụ',val:orders.filter(o=>o.status==='serving').length,color:'text-yellow-600'},
          {label:'Đã thanh toán',val:orders.filter(o=>o.status==='paid').length,color:'text-green-600'},
          {label:'Doanh thu',val:`${(total/1e6).toFixed(1)}M`,color:'text-[#1a3a5c]'}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-2">
        {['all','open','serving','paid','cancelled'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter===s?'bg-[#1a3a5c] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s==='all'?'Tất cả':s==='open'?'Đang mở':s==='serving'?'Đang phục vụ':s==='paid'?'Đã thanh toán':'Đã huỷ'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">🛒 Đơn hàng POS ({orders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>{['Mã đơn','Loại','Bàn/Phòng','Mặt hàng','Tổng tiền','Thanh toán','Trạng thái','Thời gian','Thao tác'].map(h=><th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length===0 ? <tr><td colSpan={9} className="text-center py-12 text-gray-400">Chưa có đơn hàng</td></tr>
                : orders.map((o,i)=>(
                <tr key={o._id||i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700">{o.orderNo}</td>
                  <td className="px-4 py-3"><span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-xs">{o.orderType}</span></td>
                  <td className="px-4 py-3 text-gray-600">{o.tableName || o.roomId || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{o.items?.length||0} mặt hàng</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{(o.total||0).toLocaleString('vi-VN')}đ</td>
                  <td className="px-4 py-3 text-xs">{PAY_LABEL[o.paymentMethod]||o.paymentMethod||'—'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(o.createdAt).toLocaleTimeString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    {o.status==='open'&&<button onClick={()=>handlePay(o._id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700">Thanh toán</button>}
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
