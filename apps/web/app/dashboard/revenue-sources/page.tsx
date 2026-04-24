'use client';
import { useState, useEffect } from 'react';

/* ─────────────────────────── MOCK DATA ─────────────────────────── */
type SourceType = 'dịch vụ' | 'sản phẩm' | 'phí' | 'hoa hồng' | 'khác';

interface Source {
  id: string;
  name: string;
  type: SourceType;
  icon: string;
  unitPrice: number;
  unit: string;
  monthRevenue: number;
  lastMonthRevenue: number;
  active: boolean;
}

const SOURCES_INIT: Source[] = [
  { id:'1', name:'Phòng khách sạn', type:'dịch vụ', icon:'🏨', unitPrice:1200000, unit:'đêm', monthRevenue:285000000, lastMonthRevenue:260000000, active:true },
  { id:'2', name:'Bàn cafe', type:'dịch vụ', icon:'☕', unitPrice:0, unit:'lượt', monthRevenue:95000000, lastMonthRevenue:88000000, active:true },
  { id:'3', name:'Vé rạp phim', type:'dịch vụ', icon:'🎬', unitPrice:90000, unit:'vé', monthRevenue:165000000, lastMonthRevenue:152000000, active:true },
  { id:'4', name:'Spa & Massage', type:'dịch vụ', icon:'💆', unitPrice:450000, unit:'lượt', monthRevenue:42000000, lastMonthRevenue:35000000, active:true },
  { id:'5', name:'Sự kiện & Hội nghị', type:'dịch vụ', icon:'🎪', unitPrice:5000000, unit:'sự kiện', monthRevenue:28000000, lastMonthRevenue:15000000, active:true },
  { id:'6', name:'Mini bar phòng', type:'sản phẩm', icon:'🥤', unitPrice:45000, unit:'sản phẩm', monthRevenue:18500000, lastMonthRevenue:22000000, active:true },
  { id:'7', name:'Giặt ủi', type:'dịch vụ', icon:'👔', unitPrice:80000, unit:'kg', monthRevenue:12000000, lastMonthRevenue:11000000, active:true },
  { id:'8', name:'Bãi đỗ xe', type:'phí', icon:'🚗', unitPrice:30000, unit:'ngày', monthRevenue:9500000, lastMonthRevenue:8800000, active:true },
  { id:'9', name:'Hoa hồng đại lý', type:'hoa hồng', icon:'🤝', unitPrice:0, unit:'%', monthRevenue:8200000, lastMonthRevenue:6500000, active:true },
  { id:'10', name:'Nhà hàng & F&B', type:'sản phẩm', icon:'🍽️', unitPrice:150000, unit:'suất', monthRevenue:35000000, lastMonthRevenue:28000000, active:true },
  { id:'11', name:'Tour du lịch', type:'dịch vụ', icon:'🗺️', unitPrice:850000, unit:'người', monthRevenue:15000000, lastMonthRevenue:18000000, active:false },
  { id:'12', name:'Cho thuê thiết bị', type:'dịch vụ', icon:'📸', unitPrice:200000, unit:'ngày', monthRevenue:5500000, lastMonthRevenue:4200000, active:true },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */
const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const fmtM = (n: number) => (n / 1_000_000).toFixed(1) + 'M';

const TYPE_BADGE: Record<string, string> = {
  'dịch vụ': 'bg-blue-100 text-blue-700',
  'sản phẩm': 'bg-green-100 text-green-700',
  'phí': 'bg-purple-100 text-purple-700',
  'hoa hồng': 'bg-amber-100 text-amber-700',
  'khác': 'bg-gray-100 text-gray-600',
};

const BRANCHES = ['Tất cả chi nhánh', 'Khách sạn Grand Q.1', 'Khách sạn Riverside', 'Cafe CKD Q.3', 'Cafe CKD Q.7', 'Rạp CKD Q.7'];

/* ─────────────────────────── ADD FORM ─────────────────────────── */
interface AddFormState {
  name: string;
  type: SourceType;
  unit: string;
  unitPrice: number;
  branch: string;
  desc: string;
}

const FORM_INIT: AddFormState = { name: '', type: 'dịch vụ', unit: '', unitPrice: 0, branch: 'Tất cả chi nhánh', desc: '' };

function AddSourceModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: AddFormState) => void }) {
  const [form, setForm] = useState<AddFormState>(FORM_INIT);

  function set(k: keyof AddFormState, v: any) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">➕ Thêm nguồn doanh thu mới</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên nguồn *</label>
            <input
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ví dụ: Dịch vụ giặt ủi"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Loại</label>
              <select
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={form.type}
                onChange={e => set('type', e.target.value as SourceType)}
              >
                {(['dịch vụ', 'sản phẩm', 'phí', 'hoa hồng', 'khác'] as SourceType[]).map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Đơn vị tính</label>
              <input
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="đêm / vé / kg..."
                value={form.unit}
                onChange={e => set('unit', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Đơn giá (đ)</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="0"
              value={form.unitPrice || ''}
              onChange={e => set('unitPrice', +e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Chi nhánh áp dụng</label>
            <select
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.branch}
              onChange={e => set('branch', e.target.value)}
            >
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Mô tả</label>
            <textarea
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={2}
              placeholder="Ghi chú thêm..."
              value={form.desc}
              onChange={e => set('desc', e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-[#1a3a5c] hover:bg-[#15304d] text-white py-2 rounded-xl text-sm font-bold transition shadow-sm">
              Thêm nguồn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────── DONUT CHART ─────────────────────────── */
const DONUT_COLORS = ['#1a3a5c', '#2e75b6', '#5ba3d9', '#f59e0b', '#10b981', '#a78bfa', '#f43f5e'];

function DonutChart({ sources, title }: { sources: Source[]; title: string }) {
  const active = sources.filter(s => s.active);
  const total = active.reduce((s, r) => s + r.monthRevenue, 0) || 1;
  const top5 = [...active].sort((a, b) => b.monthRevenue - a.monthRevenue).slice(0, 5);

  // build conic gradient stops
  let acc = 0;
  const stops = top5.map((s, i) => {
    const pct = (s.monthRevenue / total) * 100;
    const from = acc;
    acc += pct;
    return `${DONUT_COLORS[i]} ${from.toFixed(1)}% ${acc.toFixed(1)}%`;
  });
  // rest
  if (acc < 100) stops.push(`#e5e7eb ${acc.toFixed(1)}% 100%`);
  const gradient = `conic-gradient(${stops.join(', ')})`;

  return (
    <div>
      {title && <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">{title}</h4>}
      <div className="flex items-center gap-6 flex-wrap justify-center">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
          <div
            className="rounded-full"
            style={{ width: 160, height: 160, background: gradient }}
          />
          {/* hole */}
          <div
            className="absolute rounded-full bg-white flex flex-col items-center justify-center"
            style={{ width: 80, height: 80, top: 40, left: 40 }}
          >
            <span className="text-xs font-bold text-gray-700 leading-tight text-center">Tổng</span>
            <span className="text-xs text-gray-500">{fmtM(total)}</span>
          </div>
        </div>
        {/* Legend */}
        <div className="space-y-2">
          {top5.map((s, i) => {
            const pct = ((s.monthRevenue / total) * 100).toFixed(1);
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: DONUT_COLORS[i] }} />
                <span className="text-xs text-gray-700 font-medium">{s.icon} {s.name}</span>
                <span className="text-xs text-gray-500 ml-auto pl-4">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── TAB 1 ─────────────────────────── */
function TabSources() {
  const [sources, setSources] = useState<Source[]>(SOURCES_INIT);
  const [showModal, setShowModal] = useState(false);

  const active = sources.filter(s => s.active);
  const totalMonth = active.reduce((s, r) => s + r.monthRevenue, 0);
  const totalLastMonth = active.reduce((s, r) => s + r.lastMonthRevenue, 0);
  const growthPct = totalLastMonth > 0 ? (((totalMonth - totalLastMonth) / totalLastMonth) * 100).toFixed(1) : '0';
  const topSource = [...active].sort((a, b) => b.monthRevenue - a.monthRevenue)[0];
  const fastestGrowing = [...active]
    .filter(s => s.lastMonthRevenue > 0)
    .sort((a, b) => (b.monthRevenue - b.lastMonthRevenue) / b.lastMonthRevenue - (a.monthRevenue - a.lastMonthRevenue) / a.lastMonthRevenue)[0];

  function toggleActive(id: string) {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  }

  function addSource(form: AddFormState) {
    const icons: Record<SourceType, string> = {
      'dịch vụ': '🔧', 'sản phẩm': '📦', 'phí': '🏷️', 'hoa hồng': '🤝', 'khác': '⭐'
    };
    setSources(prev => [...prev, {
      id: String(Date.now()),
      name: form.name,
      type: form.type,
      icon: icons[form.type],
      unitPrice: form.unitPrice,
      unit: form.unit,
      monthRevenue: 0,
      lastMonthRevenue: 0,
      active: true,
    }]);
  }

  return (
    <div className="space-y-6">
      {showModal && <AddSourceModal onClose={() => setShowModal(false)} onAdd={addSource} />}

      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#15304d] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
        >
          ➕ Thêm nguồn mới
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng doanh thu tháng', value: fmtM(totalMonth) + 'đ', icon: '💰', color: 'border-l-blue-500' },
          {
            label: 'Tăng trưởng',
            value: (+growthPct >= 0 ? '+' : '') + growthPct + '%',
            icon: +growthPct >= 0 ? '📈' : '📉',
            color: +growthPct >= 0 ? 'border-l-green-500' : 'border-l-red-500',
          },
          { label: 'Nguồn cao nhất', value: topSource?.name || '—', icon: '🏆', color: 'border-l-amber-500' },
          { label: 'Tăng mạnh nhất', value: fastestGrowing?.name || '—', icon: '🚀', color: 'border-l-purple-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${s.color} p-4`}>
            <p className="text-xl">{s.icon}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            <p className="font-bold text-gray-800 text-base mt-0.5 truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sources.map(source => {
          const diff = source.monthRevenue - source.lastMonthRevenue;
          const pctChange = source.lastMonthRevenue > 0 ? ((diff / source.lastMonthRevenue) * 100).toFixed(1) : null;
          const totalActive = active.reduce((s, r) => s + r.monthRevenue, 1);
          const share = source.active ? ((source.monthRevenue / totalActive) * 100).toFixed(1) : '0';
          const up = diff >= 0;

          return (
            <div
              key={source.id}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 transition ${!source.active ? 'opacity-60' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{source.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-tight">{source.name}</p>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${TYPE_BADGE[source.type]}`}>
                      {source.type}
                    </span>
                  </div>
                </div>
                {/* Toggle */}
                <button
                  onClick={() => toggleActive(source.id)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${source.active ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${source.active ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>

              {/* Unit price */}
              {source.unitPrice > 0 && (
                <p className="text-gray-500 text-xs">
                  Đơn giá: <span className="font-semibold text-gray-700">{fmt(source.unitPrice)}/{source.unit}</span>
                </p>
              )}

              {/* Revenue */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500">Doanh thu tháng này</p>
                  <p className="text-xl font-bold text-gray-800">{fmtM(source.monthRevenue)}đ</p>
                </div>
                {pctChange !== null && (
                  <div className={`flex items-center gap-1 text-sm font-bold ${up ? 'text-green-600' : 'text-red-500'}`}>
                    <span>{up ? '▲' : '▼'}</span>
                    <span>{Math.abs(+pctChange)}%</span>
                  </div>
                )}
              </div>

              {/* Share bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>% Tổng doanh thu</span>
                  <span className="font-semibold">{share}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(+share, 100)}%`, background: '#1a3a5c' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donut chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-6">🍩 Phân bổ doanh thu theo nguồn</h3>
        <DonutChart sources={sources} title="" />
        <p className="text-xs text-gray-400 text-center mt-4">* Chỉ tính các nguồn đang hoạt động</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── SPARKLINE ─────────────────────────── */
function Sparkline({ up }: { up: boolean }) {
  // simple 6-dot CSS sparkline
  const dots = up
    ? [30, 45, 35, 55, 50, 70]
    : [70, 60, 65, 50, 55, 40];
  const max = Math.max(...dots);
  return (
    <div className="flex items-end gap-0.5 h-6">
      {dots.map((v, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm ${up ? 'bg-green-400' : 'bg-red-400'}`}
          style={{ height: `${(v / max) * 24}px` }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────── TAB 2 ─────────────────────────── */
type Period = 'today' | 'week' | 'month' | 'quarter' | 'custom';

function TabAnalysis() {
  const [period, setPeriod] = useState<Period>('month');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const sources = SOURCES_INIT;
  const total = sources.reduce((s, r) => s + r.monthRevenue, 0);
  const totalLast = sources.reduce((s, r) => s + r.lastMonthRevenue, 0);

  const growing = sources
    .filter(s => s.lastMonthRevenue > 0 && s.monthRevenue > s.lastMonthRevenue)
    .map(s => ({ ...s, growthPct: ((s.monthRevenue - s.lastMonthRevenue) / s.lastMonthRevenue) * 100 }))
    .sort((a, b) => b.growthPct - a.growthPct)
    .slice(0, 4);

  const declining = sources
    .filter(s => s.lastMonthRevenue > 0 && s.monthRevenue < s.lastMonthRevenue)
    .map(s => ({ ...s, declinePct: ((s.lastMonthRevenue - s.monthRevenue) / s.lastMonthRevenue) * 100 }))
    .filter(s => s.declinePct > 10)
    .sort((a, b) => b.declinePct - a.declinePct);

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'today', label: 'Hôm nay' },
    { key: 'week', label: 'Tuần này' },
    { key: 'month', label: 'Tháng này' },
    { key: 'quarter', label: 'Quý này' },
    { key: 'custom', label: 'Tùy chỉnh' },
  ];

  return (
    <div className="space-y-6">
      {/* Period filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${period === p.key ? 'bg-[#1a3a5c] text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {p.label}
            </button>
          ))}
          {period === 'custom' && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <span className="text-gray-400 text-sm">→</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          )}
        </div>
      </div>

      {/* Revenue by source table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">📊 Doanh thu theo nguồn — So sánh tháng</h3>
          <span className="text-xs text-gray-400">Đơn vị: triệu đồng</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Nguồn', 'Tháng trước', 'Tháng này', 'Tăng/Giảm', '% Thay đổi', '% Tổng', 'Xu hướng'].map(h => (
                  <th key={h} className="text-left text-gray-500 font-semibold py-3 px-4 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...sources].sort((a, b) => b.monthRevenue - a.monthRevenue).map((s, i) => {
                const diff = s.monthRevenue - s.lastMonthRevenue;
                const pctChange = s.lastMonthRevenue > 0 ? ((diff / s.lastMonthRevenue) * 100).toFixed(1) : 'N/A';
                const share = total > 0 ? ((s.monthRevenue / total) * 100).toFixed(1) : '0';
                const up = diff >= 0;
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span>{s.icon}</span>
                        <span className="font-semibold text-gray-800">{s.name}</span>
                        {!s.active && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Tắt</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{fmtM(s.lastMonthRevenue)}đ</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{fmtM(s.monthRevenue)}đ</td>
                    <td className={`py-3 px-4 font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
                      {up ? '+' : ''}{fmtM(diff)}đ
                    </td>
                    <td className={`py-3 px-4 font-bold ${up ? 'text-green-600' : 'text-red-500'}`}>
                      {pctChange !== 'N/A' ? (up ? '+' : '') + pctChange + '%' : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#1a3a5c]" style={{ width: `${Math.min(+share, 100)}%` }} />
                        </div>
                        <span className="text-gray-600 text-xs">{share}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Sparkline up={up} />
                    </td>
                  </tr>
                );
              })}
              {/* Total row */}
              <tr className="bg-blue-50 border-t-2 border-blue-100 font-bold">
                <td className="py-3 px-4 text-[#1a3a5c]">Tổng cộng</td>
                <td className="py-3 px-4 text-gray-700">{fmtM(totalLast)}đ</td>
                <td className="py-3 px-4 text-[#1a3a5c] text-base">{fmtM(total)}đ</td>
                <td className={`py-3 px-4 ${total >= totalLast ? 'text-green-600' : 'text-red-500'}`}>
                  {total >= totalLast ? '+' : ''}{fmtM(total - totalLast)}đ
                </td>
                <td className={`py-3 px-4 ${total >= totalLast ? 'text-green-600' : 'text-red-500'}`}>
                  {totalLast > 0 ? ((total >= totalLast ? '+' : '') + (((total - totalLast) / totalLast) * 100).toFixed(1) + '%') : 'N/A'}
                </td>
                <td className="py-3 px-4 text-[#1a3a5c]">100%</td>
                <td className="py-3 px-4"><Sparkline up={total >= totalLast} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Growing sources */}
      {growing.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-800 mb-3">🚀 Nguồn tăng trưởng mạnh nhất</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {growing.map((s, i) => (
              <div key={s.id} className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="font-bold text-green-800 text-sm">{s.name}</p>
                </div>
                <p className="text-green-600 text-2xl font-bold">+{s.growthPct.toFixed(1)}%</p>
                <div className="flex justify-between text-xs text-green-700">
                  <span>Tháng trước: {fmtM(s.lastMonthRevenue)}đ</span>
                </div>
                <div className="flex justify-between text-xs text-green-800 font-semibold">
                  <span>Tháng này: {fmtM(s.monthRevenue)}đ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declining sources */}
      {declining.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-gray-800">⚠️ Nguồn đang sụt giảm</h3>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">{declining.length} nguồn</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {declining.map((s) => (
              <div key={s.id} className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-4">
                <span className="text-3xl">{s.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-red-800">{s.name}</p>
                  <p className="text-red-600 text-sm">
                    Giảm <span className="font-bold">{s.declinePct.toFixed(1)}%</span> so với tháng trước
                  </p>
                  <p className="text-red-500 text-xs mt-1">
                    {fmtM(s.lastMonthRevenue)}đ → {fmtM(s.monthRevenue)}đ
                  </p>
                </div>
                <div className="text-3xl font-bold text-red-500">▼</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-side donut comparison */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-6">🍩 So sánh cơ cấu doanh thu</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {/* This month */}
          <div className="pb-6 lg:pb-0 lg:pr-8">
            <DonutChart sources={SOURCES_INIT} title="Tháng này" />
          </div>
          {/* Last month (simulate with swapped values) */}
          <div className="pt-6 lg:pt-0 lg:pl-8">
            <DonutChart
              sources={SOURCES_INIT.map(s => ({ ...s, monthRevenue: s.lastMonthRevenue, lastMonthRevenue: s.monthRevenue }))}
              title="Tháng trước"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */
const TABS = [
  { key: 'sources', label: '💼 Nguồn doanh thu' },
  { key: 'analysis', label: '📊 Phân tích chi tiết' },
];

export default function RevenueSourcesPage() {
  const [tab, setTab] = useState('sources');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">💼 Quản lý nguồn doanh thu</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi và phân tích toàn bộ các luồng doanh thu của hệ thống</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key
                ? 'bg-[#1a3a5c] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sources' && <TabSources />}
      {tab === 'analysis' && <TabAnalysis />}
    </div>
  );
}
