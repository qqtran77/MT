'use client';

import { useState } from 'react';

type DiscountType = 'percent' | 'fixed' | 'gift';
type PromoStatus = 'active' | 'upcoming' | 'expired' | 'paused';

interface Promotion {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  status: PromoStatus;
  startDate: string;
  endDate: string;
  appliesTo: string[];
  branch: string;
  description: string;
}

const MOCK_PROMOS: Promotion[] = [
  { id:'1', code:'SUMMER30', name:'Hè Rực Rỡ', type:'percent', value:30, minOrder:500000, maxDiscount:200000, usageLimit:500, usageCount:234, status:'active', startDate:'2024-06-01', endDate:'2024-08-31', appliesTo:['hotel','cafe'], branch:'Tất cả', description:'Giảm 30% tối đa 200k mùa hè' },
  { id:'2', code:'NEWUSER50', name:'Chào Thành Viên', type:'percent', value:50, minOrder:200000, maxDiscount:100000, usageLimit:1, usageCount:89, status:'active', startDate:'2024-01-01', endDate:'2024-12-31', appliesTo:['hotel','cafe','cinema'], branch:'Tất cả', description:'50% cho khách hàng mới, chỉ dùng 1 lần' },
  { id:'3', code:'CINEMA100K', name:'Xem Phim Ưu Đãi', type:'fixed', value:100000, minOrder:300000, usageLimit:200, usageCount:156, status:'active', startDate:'2024-05-01', endDate:'2024-07-31', appliesTo:['cinema'], branch:'Rạp CKD Q.7', description:'Giảm thẳng 100k cho đơn rạp phim' },
  { id:'4', code:'LUXURY20', name:'Hạng Sang Ưu Đãi', type:'percent', value:20, minOrder:2000000, usageLimit:100, usageCount:45, status:'active', startDate:'2024-04-01', endDate:'2024-12-31', appliesTo:['hotel'], branch:'Khách sạn Grand Q.1', description:'20% cho đặt phòng hạng Deluxe trở lên' },
  { id:'5', code:'COFFEEFREE', name:'Tặng Ly Cafe', type:'gift', value:0, minOrder:150000, usageLimit:300, usageCount:300, status:'expired', startDate:'2024-03-01', endDate:'2024-04-30', appliesTo:['cafe'], branch:'Cafe CKD Q.3', description:'Tặng 1 ly Americano khi order từ 150k' },
  { id:'6', code:'BACK2SCHOOL', name:'Tựu Trường Vui Vẻ', type:'percent', value:15, minOrder:0, usageLimit:1000, usageCount:0, status:'upcoming', startDate:'2024-09-01', endDate:'2024-09-30', appliesTo:['cinema','cafe'], branch:'Tất cả', description:'Giảm 15% dành cho học sinh sinh viên' },
  { id:'7', code:'GOLD10', name:'Ưu Đãi Hội Viên Vàng', type:'percent', value:10, minOrder:0, usageLimit:9999, usageCount:512, status:'active', startDate:'2024-01-01', endDate:'2024-12-31', appliesTo:['hotel','cafe','cinema'], branch:'Tất cả', description:'10% mọi dịch vụ cho hội viên hạng Vàng' },
];

const TYPE_CONFIG: Record<DiscountType, {label:string;color:string}> = {
  percent: { label:'% Giảm', color:'bg-blue-100 text-blue-700' },
  fixed: { label:'Giảm cố định', color:'bg-purple-100 text-purple-700' },
  gift: { label:'Tặng quà', color:'bg-pink-100 text-pink-700' },
};

const STATUS_CONFIG: Record<PromoStatus, {label:string;color:string;dot:string}> = {
  active: { label:'Đang chạy', color:'bg-green-100 text-green-700', dot:'bg-green-500' },
  upcoming: { label:'Sắp diễn ra', color:'bg-blue-100 text-blue-700', dot:'bg-blue-500' },
  expired: { label:'Hết hạn', color:'bg-gray-100 text-gray-500', dot:'bg-gray-400' },
  paused: { label:'Tạm dừng', color:'bg-yellow-100 text-yellow-700', dot:'bg-yellow-500' },
};

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>(MOCK_PROMOS);
  const [statusFilter, setStatusFilter] = useState<PromoStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);
  const [copied, setCopied] = useState('');
  const [form, setForm] = useState({
    code:'', name:'', type:'percent' as DiscountType, value:0, minOrder:0,
    maxDiscount:0, usageLimit:100, startDate:'', endDate:'',
    description:'', branch:'Tất cả',
  });

  const filtered = promos.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.code.toLowerCase().includes(search.toLowerCase()) && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    active: promos.filter(p=>p.status==='active').length,
    upcoming: promos.filter(p=>p.status==='upcoming').length,
    expired: promos.filter(p=>p.status==='expired').length,
    totalUsage: promos.reduce((s,p)=>s+p.usageCount, 0),
  };

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(()=>{});
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  }

  function toggleStatus(id: string) {
    setPromos(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, status: p.status === 'active' ? 'paused' : 'active' };
    }));
  }

  function handleSubmit() {
    const promo: Promotion = {
      id: editPromo?.id || Date.now().toString(),
      code: form.code.toUpperCase(),
      name: form.name, type: form.type, value: form.value,
      minOrder: form.minOrder, maxDiscount: form.maxDiscount || undefined,
      usageLimit: form.usageLimit, usageCount: editPromo?.usageCount || 0,
      status: 'upcoming', startDate: form.startDate, endDate: form.endDate,
      appliesTo: ['hotel','cafe','cinema'], branch: form.branch,
      description: form.description,
    };
    if (editPromo) setPromos(prev => prev.map(p => p.id === editPromo.id ? promo : p));
    else setPromos(prev => [...prev, promo]);
    setShowForm(false); setEditPromo(null);
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Đang chạy', value:stats.active, icon:'🟢', color:'text-green-600' },
          { label:'Sắp diễn ra', value:stats.upcoming, icon:'🔵', color:'text-blue-600' },
          { label:'Hết hạn', value:stats.expired, icon:'⚪', color:'text-gray-500' },
          { label:'Tổng lượt dùng', value:stats.totalUsage, icon:'📊', color:'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{s.icon}</span>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Add */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          {(['all','active','upcoming','expired','paused'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${statusFilter===s?'bg-[#1a3a5c] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s==='all' ? 'Tất cả' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm mã / tên..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44" />
          <button onClick={() => { setShowForm(!showForm); setEditPromo(null); }}
            className="bg-[#1a3a5c] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition">
            + Tạo khuyến mãi
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">{editPromo ? '✏️ Chỉnh sửa khuyến mãi' : '➕ Tạo chương trình khuyến mãi'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mã KM *</label>
              <input value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" placeholder="VD: SUMMER30" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tên chương trình *</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Hè Rực Rỡ" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Loại giảm giá</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value as DiscountType})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="percent">% Phần trăm</option>
                <option value="fixed">Giảm cố định (đ)</option>
                <option value="gift">Tặng quà</option>
              </select>
            </div>
            {form.type !== 'gift' && <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{form.type==='percent'?'Phần trăm giảm (%)':'Số tiền giảm (đ)'}</label>
              <input type="number" value={form.value} onChange={e=>setForm({...form,value:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Đơn tối thiểu (đ)</label>
              <input type="number" value={form.minOrder} onChange={e=>setForm({...form,minOrder:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {form.type==='percent' && <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Giảm tối đa (đ)</label>
              <input type="number" value={form.maxDiscount} onChange={e=>setForm({...form,maxDiscount:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Giới hạn lượt dùng</label>
              <input type="number" value={form.usageLimit} onChange={e=>setForm({...form,usageLimit:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày bắt đầu</label>
              <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày kết thúc</label>
              <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Chi nhánh áp dụng</label>
              <select value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Tất cả</option>
                <option>Khách sạn Grand Q.1</option>
                <option>Cafe CKD Q.3</option>
                <option>Rạp CKD Q.7</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả</label>
              <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={!form.code || !form.name}
              className="bg-[#1a3a5c] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition disabled:opacity-40">
              {editPromo ? '💾 Cập nhật' : '➕ Tạo khuyến mãi'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition">Hủy</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
              <th className="text-left px-4 py-3">Mã KM</th>
              <th className="text-left px-4 py-3">Tên chương trình</th>
              <th className="text-center px-4 py-3">Loại</th>
              <th className="text-center px-4 py-3">Giá trị</th>
              <th className="text-center px-4 py-3">Lượt dùng</th>
              <th className="text-left px-4 py-3">Thời hạn</th>
              <th className="text-left px-4 py-3">Chi nhánh</th>
              <th className="text-center px-4 py-3">Trạng thái</th>
              <th className="text-center px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(promo => (
              <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <button onClick={() => copyCode(promo.code)}
                    className="font-mono font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition flex items-center gap-1">
                    {promo.code}
                    <span className="text-xs">{copied === promo.code ? '✓' : '📋'}</span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-800">{promo.name}</p>
                  <p className="text-xs text-gray-400">{promo.description}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_CONFIG[promo.type].color}`}>
                    {TYPE_CONFIG[promo.type].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-bold text-gray-800">
                  {promo.type === 'percent' ? `${promo.value}%` : promo.type === 'fixed' ? `${promo.value.toLocaleString('vi-VN')}đ` : 'Quà tặng'}
                  {promo.minOrder > 0 && <p className="text-xs text-gray-400 font-normal">Min: {promo.minOrder.toLocaleString('vi-VN')}đ</p>}
                </td>
                <td className="px-4 py-3 text-center">
                  <p className="font-semibold text-gray-800">{promo.usageCount}/{promo.usageLimit}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{width:`${Math.min(100, promo.usageCount/promo.usageLimit*100)}%`}} />
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  <p>{promo.startDate}</p>
                  <p>→ {promo.endDate}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{promo.branch}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleStatus(promo.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[promo.status].color} flex items-center gap-1 mx-auto`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[promo.status].dot}`} />
                    {STATUS_CONFIG[promo.status].label}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => { setEditPromo(promo); setForm({...promo, maxDiscount: promo.maxDiscount||0}); setShowForm(true); }}
                      className="text-blue-600 hover:text-blue-800 text-sm" title="Sửa">✏️</button>
                    <button onClick={() => setPromos(prev => prev.filter(p=>p.id!==promo.id))}
                      className="text-red-500 hover:text-red-700 text-sm" title="Xóa">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-10 text-gray-400">Không có khuyến mãi nào</div>}
      </div>
    </div>
  );
}
