'use client';

import { useState } from 'react';

interface ServicePackage {
  id: string;
  name: string;
  type: 'hotel' | 'cafe' | 'cinema' | 'combo';
  description: string;
  originalPrice: number;
  salePrice: number;
  duration: string;
  includes: string[];
  status: 'active' | 'inactive' | 'expired';
  usageCount: number;
  branch: string;
  validUntil: string;
}

const MOCK_PACKAGES: ServicePackage[] = [
  { id: '1', name: 'Gói Nghỉ Dưỡng Cuối Tuần', type: 'hotel', description: '2 đêm phòng Deluxe + bữa sáng', originalPrice: 3200000, salePrice: 2500000, duration: '2 đêm', includes: ['Phòng Deluxe 2 đêm', 'Bữa sáng 2 người', 'Đón tiễn sân bay', 'Spa 60 phút'], status: 'active', usageCount: 42, branch: 'Khách sạn Grand Q.1', validUntil: '2024-12-31' },
  { id: '2', name: 'Gói Trăng Mật', type: 'hotel', description: '3 đêm Suite + ăn tối + hoa', originalPrice: 8500000, salePrice: 6800000, duration: '3 đêm', includes: ['Suite 3 đêm', 'Bữa tối lãng mạn', 'Hoa trang trí', 'Bánh ngọt', 'Xe đưa đón'], status: 'active', usageCount: 18, branch: 'Khách sạn Grand Q.1', validUntil: '2024-12-31' },
  { id: '3', name: 'Combo Cafe + Phim', type: 'combo', description: 'Đồ uống + vé xem phim', originalPrice: 250000, salePrice: 199000, duration: '1 ngày', includes: ['2 ly đồ uống bất kỳ', '2 vé xem phim Standard', 'Bỏng ngô vừa'], status: 'active', usageCount: 156, branch: 'Cafe CKD Q.3', validUntil: '2024-06-30' },
  { id: '4', name: 'Gói Cafe Tháng', type: 'cafe', description: '30 ly đồ uống trong 30 ngày', originalPrice: 1200000, salePrice: 890000, duration: '30 ngày', includes: ['30 ly đồ uống tùy chọn', 'Ưu tiên đặt bàn', 'Giảm 10% thực đơn'], status: 'active', usageCount: 33, branch: 'Cafe CKD Q.3', validUntil: '2024-12-31' },
  { id: '5', name: 'Gói Gia Đình Rạp', type: 'cinema', description: '4 vé + 2 bỏng ngô lớn', originalPrice: 580000, salePrice: 450000, duration: '1 lần', includes: ['4 vé xem phim Standard', '2 bỏng ngô lớn', '4 nước ngọt'], status: 'active', usageCount: 89, branch: 'Rạp CKD Q.7', validUntil: '2024-12-31' },
  { id: '6', name: 'Gói VIP Rạp Năm', type: 'cinema', description: 'Xem phim không giới hạn 1 năm', originalPrice: 5000000, salePrice: 3600000, duration: '1 năm', includes: ['Vé xem phim không giới hạn', 'Ghế VIP ưu tiên', 'Giảm 20% bắp nước', 'Thẻ thành viên VIP'], status: 'inactive', usageCount: 7, branch: 'Rạp CKD Q.7', validUntil: '2024-03-01' },
];

const TYPE_LABELS = { hotel: '🏨 Khách sạn', cafe: '☕ Cafe', cinema: '🎬 Rạp phim', combo: '🎁 Combo' };
const STATUS_CONFIG = {
  active: { label: 'Đang bán', color: 'bg-green-100 text-green-700' },
  inactive: { label: 'Tạm dừng', color: 'bg-gray-100 text-gray-600' },
  expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-600' },
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>(MOCK_PACKAGES);
  const [filter, setFilter] = useState<'all' | 'hotel' | 'cafe' | 'cinema' | 'combo'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editPkg, setEditPkg] = useState<ServicePackage | null>(null);
  const [form, setForm] = useState({ name: '', type: 'hotel' as any, description: '', originalPrice: 0, salePrice: 0, duration: '', includes: '', validUntil: '', branch: 'Khách sạn Grand Q.1' });

  const filtered = packages.filter(p => filter === 'all' || p.type === filter);
  const totalRevenue = packages.reduce((sum, p) => sum + p.salePrice * p.usageCount, 0);

  function handleSubmit() {
    const pkg: ServicePackage = {
      id: editPkg?.id || Date.now().toString(),
      name: form.name, type: form.type, description: form.description,
      originalPrice: form.originalPrice, salePrice: form.salePrice,
      duration: form.duration,
      includes: form.includes.split('\n').map(s=>s.trim()).filter(Boolean),
      status: 'active', usageCount: editPkg?.usageCount || 0,
      branch: form.branch, validUntil: form.validUntil,
    };
    if (editPkg) setPackages(prev => prev.map(p => p.id === editPkg.id ? pkg : p));
    else setPackages(prev => [...prev, pkg]);
    setShowForm(false); setEditPkg(null);
  }

  function toggleStatus(id: string) {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-gray-800">{packages.length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Tổng số gói</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-green-600">{packages.filter(p=>p.status==='active').length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Đang bán</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-600">{packages.reduce((s,p)=>s+p.usageCount,0)}</p>
          <p className="text-sm text-gray-500 mt-0.5">Lượt đã bán</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xl font-bold text-purple-600">{totalRevenue.toLocaleString('vi-VN')}đ</p>
          <p className="text-sm text-gray-500 mt-0.5">Doanh thu gói</p>
        </div>
      </div>

      {/* Filter + Add */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(['all','hotel','cafe','cinema','combo'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter===t?'bg-[#1a3a5c] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t==='all' ? 'Tất cả' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditPkg(null); }}
          className="bg-[#1a3a5c] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition">
          + Tạo gói mới
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{editPkg ? '✏️ Chỉnh sửa gói' : '➕ Tạo gói dịch vụ mới'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Tên gói *', field: 'name', placeholder: 'VD: Gói Nghỉ Dưỡng...' },
              { label: 'Thời hạn sử dụng', field: 'duration', placeholder: 'VD: 2 đêm, 30 ngày' },
              { label: 'Hạn dùng đến', field: 'validUntil', placeholder: '', type: 'date' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                <input type={f.type||'text'} value={(form as any)[f.field]}
                  onChange={e=>setForm({...form,[f.field]:e.target.value})}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Loại hình</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="hotel">Khách sạn</option>
                <option value="cafe">Cafe</option>
                <option value="cinema">Rạp phim</option>
                <option value="combo">Combo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Giá gốc (đ)</label>
              <input type="number" value={form.originalPrice} onChange={e=>setForm({...form,originalPrice:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Giá bán (đ)</label>
              <input type="number" value={form.salePrice} onChange={e=>setForm({...form,salePrice:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Chi nhánh</label>
              <select value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Khách sạn Grand Q.1</option>
                <option>Cafe CKD Q.3</option>
                <option>Rạp CKD Q.7</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả ngắn</label>
              <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Bao gồm (mỗi dòng 1 mục)</label>
              <textarea value={form.includes} onChange={e=>setForm({...form,includes:e.target.value})} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phòng Deluxe 2 đêm&#10;Bữa sáng 2 người&#10;Đón tiễn sân bay" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={!form.name}
              className="bg-[#1a3a5c] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition disabled:opacity-40">
              {editPkg ? '💾 Cập nhật' : '➕ Tạo gói'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition">Hủy</button>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(pkg => {
          const discount = Math.round((1 - pkg.salePrice / pkg.originalPrice) * 100);
          return (
            <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{TYPE_LABELS[pkg.type]}</span>
                  <h3 className="font-bold text-gray-800 mt-1.5 text-sm leading-snug">{pkg.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>
                </div>
                <button onClick={() => toggleStatus(pkg.id)}
                  className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ml-2 ${STATUS_CONFIG[pkg.status].color}`}>
                  {STATUS_CONFIG[pkg.status].label}
                </button>
              </div>
              <ul className="space-y-1 mb-3">
                {pkg.includes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-green-500">✓</span> {inc}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-base font-bold text-blue-700">{pkg.salePrice.toLocaleString('vi-VN')}đ</span>
                  <span className="text-xs text-gray-400 line-through ml-2">{pkg.originalPrice.toLocaleString('vi-VN')}đ</span>
                  {discount > 0 && <span className="text-xs font-bold text-red-500 ml-1">-{discount}%</span>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Đã bán: <span className="font-semibold text-gray-700">{pkg.usageCount}</span></p>
                  <p className="text-xs text-gray-400">{pkg.duration}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditPkg(pkg); setForm({...pkg, includes: pkg.includes.join('\n')}); setShowForm(true); }}
                  className="flex-1 text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded-lg transition font-medium">
                  ✏️ Chỉnh sửa
                </button>
                <button onClick={() => setPackages(prev => prev.filter(p=>p.id!==pkg.id))}
                  className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1.5 rounded-lg transition font-medium">
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
