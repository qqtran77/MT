'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string, opts?: any) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...opts });
  const json = await res.json();
  return json?.data ?? json;
}

const CATS = ['ingredient', 'beverage', 'amenity', 'equipment', 'other'];

function fmt(n: number) { return n.toLocaleString('vi-VN') + 'đ'; }

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showMovement, setShowMovement] = useState<string | null>(null);
  const [mvForm, setMvForm] = useState({ type: 'in', quantity: '', reason: '' });

  // Role-based permissions
  const [userRole, setUserRole] = useState<string>('staff');
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserRole(parsed.role || 'staff');
      }
    } catch { /* ignore */ }
  }, []);
  const canDelete = userRole === 'admin' || userRole === 'manager';

  // Add product form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', sku: '', category: 'ingredient', unit: '', quantity: '', minQuantity: '', costPrice: '' });
  const [addWarning, setAddWarning] = useState('');
  const [addConfirmSimilar, setAddConfirmSimilar] = useState(false);
  const [addMsg, setAddMsg] = useState('');

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Low-stock order form
  const [orderItem, setOrderItem] = useState<any | null>(null);
  const [orderForm, setOrderForm] = useState({ supplier: '', quantity: '', note: '' });
  const [orderMsg, setOrderMsg] = useState('');

  const load = async () => {
    const [all, low]: any = await Promise.all([
      apiFetch('/inventory').catch(() => []),
      apiFetch('/inventory/low-stock').catch(() => []),
    ]);
    setItems(Array.isArray(all) ? all : []);
    setLowStock(Array.isArray(low) ? low : []);
  };
  useEffect(() => { load(); }, []);

  async function handleMovement(itemId: string) {
    if (!mvForm.quantity) return;
    await apiFetch('/inventory/movement', {
      method: 'POST',
      body: JSON.stringify({ itemId, type: mvForm.type, quantity: Number(mvForm.quantity), reason: mvForm.reason }),
    });
    setShowMovement(null);
    setMvForm({ type: 'in', quantity: '', reason: '' });
    load();
  }

  function handleAddProduct() {
    setAddWarning('');
    setAddConfirmSimilar(false);
    if (!addForm.name || !addForm.sku) return;

    // Duplicate SKU check
    const skuMatch = items.find(i => i.sku && i.sku.toLowerCase() === addForm.sku.toLowerCase());
    if (skuMatch) {
      setAddWarning(`⚠️ SKU này đã tồn tại: ${skuMatch.name}`);
      return;
    }

    // Similar name check (first 5 chars)
    const prefix = addForm.name.trim().slice(0, 5).toLowerCase();
    const nameMatch = items.find(i => i.name && i.name.trim().toLowerCase().startsWith(prefix));
    if (nameMatch && !addConfirmSimilar) {
      setAddWarning(`Có thể trùng với: "${nameMatch.name}". Tiếp tục?`);
      setAddConfirmSimilar(true);
      return;
    }

    const newItem = {
      _id: `local_${Date.now()}`,
      name: addForm.name,
      sku: addForm.sku,
      category: addForm.category,
      unit: addForm.unit,
      quantity: parseInt(addForm.quantity) || 0,
      minQuantity: parseInt(addForm.minQuantity) || 0,
      costPrice: parseInt(addForm.costPrice) || 0,
    };
    setItems(prev => [newItem, ...prev]);
    setAddMsg(`✅ Đã thêm sản phẩm "${addForm.name}"`);
    setAddForm({ name: '', sku: '', category: 'ingredient', unit: '', quantity: '', minQuantity: '', costPrice: '' });
    setAddWarning('');
    setAddConfirmSimilar(false);
    setShowAddForm(false);
    setTimeout(() => setAddMsg(''), 4000);
  }

  function handleDelete(itemId: string) {
    setItems(prev => prev.filter(i => i._id !== itemId));
    setDeleteConfirm(null);
  }

  function handleOrder() {
    if (!orderItem || !orderForm.quantity) return;
    setOrderMsg(`✅ Đã đặt hàng ${orderForm.quantity} ${orderItem.unit} "${orderItem.name}" từ ${orderForm.supplier || 'nhà cung cấp'}`);
    setOrderItem(null);
    setOrderForm({ supplier: '', quantity: '', note: '' });
    setTimeout(() => setOrderMsg(''), 5000);
  }

  const filtered = items.filter(i =>
    (catFilter === 'all' || i.category === catFilter) &&
    (!search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.sku?.includes(search))
  );

  return (
    <div className="space-y-5">
      {/* Low stock alert banner */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <p className="font-bold text-amber-800 text-base">
              {lowStock.length} sản phẩm tồn kho thấp — cần nhập hàng ngay!
            </p>
          </div>
          {orderMsg && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-800 font-semibold text-sm mb-3">{orderMsg}</div>
          )}
          <div className="flex flex-wrap gap-2">
            {lowStock.map((item, x) => (
              <div key={x} className="bg-white border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
                <span className="text-amber-700 font-semibold text-sm">{item.name}</span>
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">{item.quantity} {item.unit}</span>
                <button
                  onClick={() => { setOrderItem(item); setOrderForm({ supplier: '', quantity: '', note: '' }); }}
                  className="bg-amber-600 text-white px-2 py-0.5 rounded-lg text-xs font-semibold hover:bg-amber-700 whitespace-nowrap">
                  Đặt hàng ngay
                </button>
              </div>
            ))}
          </div>

          {/* Order form */}
          {orderItem && (
            <div className="mt-4 bg-white border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-800 text-sm">📦 Đặt hàng: {orderItem.name}</h4>
                <button onClick={() => setOrderItem(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Nhà cung cấp</label>
                  <input value={orderForm.supplier} onChange={e => setOrderForm(p => ({ ...p, supplier: e.target.value }))} placeholder="Tên nhà cung cấp..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Số lượng đặt ({orderItem.unit})</label>
                  <input type="number" value={orderForm.quantity} onChange={e => setOrderForm(p => ({ ...p, quantity: e.target.value }))} placeholder="Số lượng..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Ghi chú</label>
                  <input value={orderForm.note} onChange={e => setOrderForm(p => ({ ...p, note: e.target.value }))} placeholder="Ghi chú..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleOrder} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-700">Xác nhận đặt hàng</button>
                <button onClick={() => setOrderItem(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Huỷ</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search & filter bar + Add button */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm sản phẩm, SKU..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="all">Tất cả loại</option>
          {CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => { setShowAddForm(v => !v); setAddWarning(''); setAddConfirmSimilar(false); }}
          className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 whitespace-nowrap">
          {showAddForm ? '✕ Đóng' : '+ Thêm sản phẩm'}
        </button>
      </div>

      {/* Add product form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">➕ Thêm sản phẩm mới</h3>
          {addMsg && <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-800 font-semibold text-sm mb-3">{addMsg}</div>}
          {addWarning && (
            <div className={`border rounded-xl p-3 text-sm font-semibold mb-3 ${addConfirmSimilar ? 'bg-yellow-50 border-yellow-300 text-yellow-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {addWarning}
              {addConfirmSimilar && (
                <div className="flex gap-2 mt-2">
                  <button onClick={handleAddProduct} className="bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-700">Tiếp tục thêm</button>
                  <button onClick={() => { setAddWarning(''); setAddConfirmSimilar(false); }} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-200">Huỷ</button>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Tên sản phẩm *</label>
              <input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} placeholder="Tên sản phẩm..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">SKU *</label>
              <input value={addForm.sku} onChange={e => setAddForm(p => ({ ...p, sku: e.target.value }))} placeholder="VD: CAFE-001"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Danh mục</label>
              <select value={addForm.category} onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Đơn vị</label>
              <input value={addForm.unit} onChange={e => setAddForm(p => ({ ...p, unit: e.target.value }))} placeholder="VD: kg, lít, hộp"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Tồn hiện tại</label>
              <input type="number" value={addForm.quantity} onChange={e => setAddForm(p => ({ ...p, quantity: e.target.value }))} placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Tồn tối thiểu</label>
              <input type="number" value={addForm.minQuantity} onChange={e => setAddForm(p => ({ ...p, minQuantity: e.target.value }))} placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Giá nhập (đ)</label>
              <input type="number" value={addForm.costPrice} onChange={e => setAddForm(p => ({ ...p, costPrice: e.target.value }))} placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddProduct} className="bg-[#1a3a5c] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#14304d]">Lưu sản phẩm</button>
            <button onClick={() => { setShowAddForm(false); setAddWarning(''); setAddConfirmSimilar(false); }}
              className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200">Huỷ</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-[#1a3a5c]">{items.length}</p><p className="text-xs text-gray-500 mt-1">Tổng SP</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-red-500">{lowStock.length}</p><p className="text-xs text-gray-500 mt-1">Tồn thấp</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-green-600">{items.filter(i => i.quantity > i.minQuantity).length}</p><p className="text-xs text-gray-500 mt-1">Đủ hàng</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-amber-500">{items.filter(i => i.quantity === 0).length}</p><p className="text-xs text-gray-500 mt-1">Hết hàng</p>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteConfirm && (() => {
        const item = items.find(i => i._id === deleteConfirm);
        return item ? (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
              <h3 className="font-bold text-gray-800 text-lg mb-2">Xác nhận xóa</h3>
              <p className="text-gray-600 text-sm mb-5">
                Bạn có chắc muốn xóa sản phẩm <span className="font-bold text-red-600">"{item.name}"</span>? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700">Xóa</button>
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200">Huỷ</button>
              </div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Inventory table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">📦 Danh sách kho ({filtered.length})</h3>
          {!canDelete && <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Quyền nhân viên — không thể xóa</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Tên sản phẩm', 'SKU', 'Danh mục', 'Tồn kho', 'Tối thiểu', 'Đơn vị', 'Giá nhập', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0
                ? <tr><td colSpan={8} className="text-center py-12 text-gray-400">Chưa có dữ liệu</td></tr>
                : filtered.map((item, i) => (
                  <tr key={item._id || i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.sku || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs">{item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold text-lg ${item.quantity <= item.minQuantity ? 'text-red-600' : item.quantity === 0 ? 'text-gray-400' : 'text-green-600'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.minQuantity}</td>
                    <td className="px-4 py-3 text-gray-600">{item.unit}</td>
                    <td className="px-4 py-3 text-gray-700">{item.costPrice ? fmt(item.costPrice) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <button onClick={() => { setShowMovement(item._id); setMvForm({ type: 'in', quantity: '', reason: '' }); }}
                          className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-semibold hover:bg-green-100">+ Nhập</button>
                        <button onClick={() => { setShowMovement(item._id); setMvForm({ type: 'out', quantity: '', reason: '' }); }}
                          className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold hover:bg-red-100">- Xuất</button>
                        {canDelete && (
                          <button onClick={() => setDeleteConfirm(item._id)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-700">Xóa</button>
                        )}
                      </div>

                      {showMovement === item._id && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 min-w-48">
                          <div className="flex gap-2">
                            {['in', 'out', 'adjust'].map(t => (
                              <button key={t} onClick={() => setMvForm(p => ({ ...p, type: t }))}
                                className={`flex-1 py-1 rounded text-xs font-semibold ${mvForm.type === t ? 'bg-[#1a3a5c] text-white' : 'bg-white border text-gray-600'}`}>
                                {t === 'in' ? 'Nhập' : t === 'out' ? 'Xuất' : 'Điều chỉnh'}
                              </button>
                            ))}
                          </div>
                          <input type="number" value={mvForm.quantity} onChange={e => setMvForm(p => ({ ...p, quantity: e.target.value }))} placeholder="Số lượng"
                            className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none" />
                          <input value={mvForm.reason} onChange={e => setMvForm(p => ({ ...p, reason: e.target.value }))} placeholder="Lý do"
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
