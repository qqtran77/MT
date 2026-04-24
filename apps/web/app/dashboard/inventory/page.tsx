'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string, opts?: any) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...opts });
  const json = await res.json();
  return json?.data ?? json;
}

const CATS = ['ingredient','beverage','amenity','equipment','other'];

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showMovement, setShowMovement] = useState<string|null>(null);
  const [mvForm, setMvForm] = useState({ type:'in', quantity:'', reason:'' });

  const load = async () => {
    const [all, low]: any = await Promise.all([apiFetch('/inventory').catch(()=>[]), apiFetch('/inventory/low-stock').catch(()=>[])]);
    setItems(Array.isArray(all) ? all : []); setLowStock(Array.isArray(low) ? low : []);
  };
  useEffect(() => { load(); }, []);

  async function handleMovement(itemId: string) {
    if (!mvForm.quantity) return;
    await apiFetch('/inventory/movement', { method:'POST', body: JSON.stringify({ itemId, type: mvForm.type, quantity: Number(mvForm.quantity), reason: mvForm.reason }) });
    setShowMovement(null); setMvForm({ type:'in', quantity:'', reason:'' }); load();
  }

  const filtered = items.filter(i =>
    (catFilter === 'all' || i.category === catFilter) &&
    (!search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.sku?.includes(search))
  );

  return (
    <div className="space-y-5">
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="font-bold text-amber-800 mb-2">⚠️ {lowStock.length} sản phẩm tồn kho thấp cần nhập hàng</p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((i,x) => <span key={x} className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-semibold">{i.name}: {i.quantity} {i.unit}</span>)}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Tìm sản phẩm, SKU..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"/>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="all">Tất cả loại</option>
          {CATS.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-[#1a3a5c]">{items.length}</p><p className="text-xs text-gray-500 mt-1">Tổng SP</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-red-500">{lowStock.length}</p><p className="text-xs text-gray-500 mt-1">Tồn thấp</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-green-600">{items.filter(i=>i.quantity>i.minQuantity).length}</p><p className="text-xs text-gray-500 mt-1">Đủ hàng</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-amber-500">{items.filter(i=>i.quantity===0).length}</p><p className="text-xs text-gray-500 mt-1">Hết hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">📦 Danh sách kho ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>{['Tên sản phẩm','SKU','Danh mục','Tồn kho','Tối thiểu','Đơn vị','Giá nhập','Thao tác'].map(h=><th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-12 text-gray-400">Chưa có dữ liệu</td></tr>
                : filtered.map((item,i) => (
                <tr key={item._id||i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.sku||'—'}</td>
                  <td className="px-4 py-3"><span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs">{item.category}</span></td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-lg ${item.quantity<=item.minQuantity ? 'text-red-600' : item.quantity===0 ? 'text-gray-400' : 'text-green-600'}`}>{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.minQuantity}</td>
                  <td className="px-4 py-3 text-gray-600">{item.unit}</td>
                  <td className="px-4 py-3 text-gray-700">{item.costPrice ? `${item.costPrice.toLocaleString('vi-VN')}đ` : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setShowMovement(item._id); setMvForm({type:'in',quantity:'',reason:''}); }}
                        className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold hover:bg-green-100">+ Nhập</button>
                      <button onClick={() => { setShowMovement(item._id); setMvForm({type:'out',quantity:'',reason:''}); }}
                        className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold hover:bg-red-100">- Xuất</button>
                    </div>
                    {showMovement === item._id && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 min-w-48">
                        <div className="flex gap-2">
                          {['in','out','adjust'].map(t => (
                            <button key={t} onClick={() => setMvForm(p=>({...p,type:t}))}
                              className={`flex-1 py-1 rounded text-xs font-semibold ${mvForm.type===t ? 'bg-[#1a3a5c] text-white':'bg-white border text-gray-600'}`}>{t==='in'?'Nhập':t==='out'?'Xuất':'Điều chỉnh'}</button>
                          ))}
                        </div>
                        <input type="number" value={mvForm.quantity} onChange={e=>setMvForm(p=>({...p,quantity:e.target.value}))} placeholder="Số lượng"
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none" />
                        <input value={mvForm.reason} onChange={e=>setMvForm(p=>({...p,reason:e.target.value}))} placeholder="Lý do"
                          className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none" />
                        <div className="flex gap-1">
                          <button onClick={() => handleMovement(item._id)} className="flex-1 bg-[#1a3a5c] text-white py-1 rounded text-xs font-semibold">Lưu</button>
                          <button onClick={() => setShowMovement(null)} className="flex-1 bg-gray-200 text-gray-600 py-1 rounded text-xs">Huỷ</button>
                        </div>
                      </div>
                    )}
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
