'use client';

import { useState } from 'react';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const BRANCHES = [
  'Tất cả',
  'Khách sạn Grand Q.1',
  'Khách sạn Riverside',
  'Cafe CKD Q.3',
  'Cafe CKD Q.7',
  'Rạp CKD Q.7',
];

const BRANCH_TARGETS = [
  { branch: 'Khách sạn Grand Q.1', target: 300, actual: 247 },
  { branch: 'Khách sạn Riverside', target: 220, actual: 198 },
  { branch: 'Cafe CKD Q.3', target: 100, actual: 95 },
  { branch: 'Cafe CKD Q.7', target: 80, actual: 52 },
  { branch: 'Rạp CKD Q.7', target: 180, actual: 165 },
];

const KPI_DATA = [
  { name: 'Nguyễn Văn An', branch: 'Khách sạn Grand Q.1', target: 50, actual: 47, unit: 'đặt phòng', rate: 94, rating: 'Xuất sắc' },
  { name: 'Trần Thị Bích', branch: 'Cafe CKD Q.3', target: 200, actual: 185, unit: 'order', rate: 93, rating: 'Tốt' },
  { name: 'Lê Hoàng Nam', branch: 'Rạp CKD Q.7', target: 300, actual: 210, unit: 'vé', rate: 70, rating: 'Cần cải thiện' },
  { name: 'Phạm Thị Lan', branch: 'Khách sạn Riverside', target: 40, actual: 40, unit: 'đặt phòng', rate: 100, rating: 'Xuất sắc' },
  { name: 'Hoàng Văn Minh', branch: 'Cafe CKD Q.7', target: 150, actual: 88, unit: 'order', rate: 59, rating: 'Cảnh báo' },
];

const STAFF_NAMES = KPI_DATA.map((k) => k.name);

const BONUS_HISTORY = [
  { name: 'Nguyễn Văn An', amount: 500000, reason: 'Doanh số xuất sắc', date: '20/05' },
  { name: 'Trần Thị Bích', amount: 300000, reason: 'Phục vụ tốt', date: '18/05' },
];

const MESSAGE_HISTORY = [
  { type: 'khen', to: 'Phạm Thị Lan', title: 'Khen ngợi tháng 5', time: '20/05 09:00', preview: 'Bạn đã hoàn thành 100% KPI tháng này...' },
  { type: 'nhac', to: 'Lê Hoàng Nam', title: 'Nhắc nhở cải thiện', time: '19/05 14:30', preview: 'Vui lòng chú ý tỷ lệ bán vé tháng này...' },
  { type: 'canh', to: 'Hoàng Văn Minh', title: 'Cảnh báo KPI', time: '18/05 10:00', preview: 'KPI của bạn đang dưới mức yêu cầu...' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RATING_BADGE: Record<string, string> = {
  'Xuất sắc': 'bg-yellow-100 text-yellow-700',
  'Tốt': 'bg-green-100 text-green-700',
  'Cần cải thiện': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  'Cảnh báo': 'bg-red-100 text-red-700',
};

const MSG_TYPE_BADGE: Record<string, string> = {
  canh: 'bg-red-100 text-red-700',
  nhac: 'bg-yellow-100 text-yellow-700',
  khen: 'bg-green-100 text-green-700',
};

const MSG_TYPE_LABEL: Record<string, string> = {
  canh: 'Cảnh báo',
  nhac: 'Nhắc nhở',
  khen: 'Khen ngợi',
};

function progressColor(pct: number) {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-yellow-400';
  return 'bg-red-500';
}

function fmtMoney(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

// ─── Tab 1: Mục tiêu doanh thu ───────────────────────────────────────────────

function TabRevenue() {
  const [month, setMonth] = useState('05');
  const [year, setYear] = useState('2025');
  const [formBranch, setFormBranch] = useState('Khách sạn Grand Q.1');
  const [formType, setFormType] = useState('hotel');
  const [formTarget, setFormTarget] = useState('');
  const [saved, setSaved] = useState(false);

  const warnings = BRANCH_TARGETS.filter((b) => {
    const pct = Math.round((b.actual / b.target) * 100);
    return pct < 70;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setFormTarget('');
  };

  return (
    <div className="space-y-6">
      {/* Month/year picker + set target form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Picker + form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-800">Chọn kỳ & Đặt mục tiêu</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Tháng</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const m = String(i + 1).padStart(2, '0');
                  return <option key={m} value={m}>Tháng {i + 1}</option>;
                })}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Năm</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              >
                {['2024', '2025', '2026'].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Đặt mục tiêu mới</p>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Chi nhánh</label>
              <select
                value={formBranch}
                onChange={(e) => setFormBranch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              >
                {BRANCHES.filter((b) => b !== 'Tất cả').map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              >
                <option value="hotel">Hotel</option>
                <option value="cafe">Cafe</option>
                <option value="cinema">Cinema</option>
                <option value="total">Tổng</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mục tiêu (đồng)</label>
              <input
                type="number"
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value)}
                placeholder="VD: 300000000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1a3a5c] text-white rounded-xl py-2 text-sm font-semibold hover:bg-[#2e75b6] transition-colors"
            >
              {saved ? '✅ Đã lưu mục tiêu' : 'Lưu mục tiêu'}
            </button>
          </form>
        </div>

        {/* Progress cards */}
        <div className="lg:col-span-2 space-y-4">
          {warnings.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <p className="text-sm font-bold text-red-700">Cảnh báo doanh thu</p>
                {warnings.map((w) => {
                  const pct = Math.round((w.actual / w.target) * 100);
                  return (
                    <p key={w.branch} className="text-sm text-red-600">
                      {w.branch} chỉ đạt {pct}% mục tiêu tháng {month}/{year}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {BRANCH_TARGETS.map((bt) => {
            const pct = Math.round((bt.actual / bt.target) * 100);
            return (
              <div key={bt.branch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800 text-sm">{bt.branch}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {pct}%
                    </span>
                    {pct < 70 && <span className="text-base">⚠️</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>Mục tiêu: <strong className="text-gray-700">{bt.target}M</strong></span>
                  <span>Đạt: <strong className="text-gray-700">{bt.actual}M</strong></span>
                  <span>Còn lại: <strong className="text-gray-700">{bt.target - bt.actual}M</strong></span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${progressColor(pct)}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: KPI nhân viên ─────────────────────────────────────────────────────

function TabKPI() {
  const [filterBranch, setFilterBranch] = useState('Tất cả');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const filtered = filterBranch === 'Tất cả'
    ? KPI_DATA
    : KPI_DATA.filter((k) => k.branch === filterBranch);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600 shrink-0">Chi nhánh:</label>
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
        >
          {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Nhân viên</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Chi nhánh</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">KPI mục tiêu</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">KPI thực tế</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Tỷ lệ</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Đánh giá</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((k, idx) => (
                <>
                  <tr
                    key={k.name}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-semibold text-gray-800">{k.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{k.branch}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{k.target} {k.unit}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{k.actual} {k.unit}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-bold ${k.rate >= 80 ? 'text-green-600' : k.rate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {k.rate}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${RATING_BADGE[k.rating]}`}>
                        {k.rating}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        {expandedIdx === idx ? 'Thu gọn ▲' : 'Xem chi tiết ▼'}
                      </button>
                    </td>
                  </tr>
                  {expandedIdx === idx && (
                    <tr key={`${k.name}-detail`} className="bg-blue-50">
                      <td colSpan={7} className="px-5 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white rounded-xl p-4 border border-blue-100">
                            <p className="text-xs text-gray-500 mb-1">KPI thực tế / Mục tiêu</p>
                            <p className="font-bold text-gray-800">{k.actual} / {k.target} {k.unit}</p>
                            <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${progressColor(k.rate)}`}
                                style={{ width: `${Math.min(k.rate, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-blue-100">
                            <p className="text-xs text-gray-500 mb-1">Tỷ lệ hoàn thành</p>
                            <p className={`text-2xl font-bold ${k.rate >= 80 ? 'text-green-600' : k.rate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {k.rate}%
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Đánh giá: {k.rating}</p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-blue-100">
                            <p className="text-xs text-gray-500 mb-1">Chi nhánh</p>
                            <p className="font-semibold text-gray-800 text-sm">{k.branch}</p>
                            <p className="text-xs text-gray-400 mt-1">Tháng 05/2025</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">Không có dữ liệu</p>
        )}
      </div>
    </div>
  );
}

// ─── Tab 3: Thưởng & Cảnh báo ────────────────────────────────────────────────

function TabBonusAlert() {
  // Bonus form state
  const [bonusStaff, setBonusStaff] = useState(STAFF_NAMES[0]);
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusReason, setBonusReason] = useState('');
  const [bonusSent, setBonusSent] = useState(false);
  const [bonusHistory, setBonusHistory] = useState(BONUS_HISTORY);

  // Message form state
  const [msgSelected, setMsgSelected] = useState<string[]>([]);
  const [msgType, setMsgType] = useState('nhac');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [msgHistory, setMsgHistory] = useState(MESSAGE_HISTORY);

  const handleSendBonus = (e: React.FormEvent) => {
    e.preventDefault();
    setBonusHistory((prev) => [
      { name: bonusStaff, amount: Number(bonusAmount), reason: bonusReason, date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) },
      ...prev,
    ]);
    setBonusSent(true);
    setBonusAmount('');
    setBonusReason('');
    setTimeout(() => setBonusSent(false), 2500);
  };

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (msgSelected.length === 0) return;
    setMsgHistory((prev) => [
      {
        type: msgType,
        to: msgSelected.join(', '),
        title: msgTitle,
        time: new Date().toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        preview: msgContent.slice(0, 60) + (msgContent.length > 60 ? '...' : ''),
      },
      ...prev,
    ]);
    setMsgSent(true);
    setMsgSelected([]);
    setMsgTitle('');
    setMsgContent('');
    setTimeout(() => setMsgSent(false), 2500);
  };

  const toggleStaff = (name: string) => {
    setMsgSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Thưởng nóng */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">🏆 Thưởng nóng</h3>
          <form onSubmit={handleSendBonus} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nhân viên</label>
              <select
                value={bonusStaff}
                onChange={(e) => setBonusStaff(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              >
                {STAFF_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Số tiền thưởng (đồng)</label>
              <input
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                placeholder="VD: 500000"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Lý do thưởng</label>
              <input
                type="text"
                value={bonusReason}
                onChange={(e) => setBonusReason(e.target.value)}
                placeholder="VD: Doanh số xuất sắc tháng 5"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-yellow-600 transition-colors"
            >
              {bonusSent ? '✅ Đã gửi thưởng!' : '🏆 Gửi thưởng'}
            </button>
          </form>
        </div>

        {/* Bonus history */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h4 className="font-semibold text-gray-700 text-sm">Lịch sử thưởng</h4>
          </div>
          <div className="divide-y divide-gray-50">
            {bonusHistory.map((b, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.reason} · {b.date}</p>
                </div>
                <span className="font-bold text-yellow-600 text-sm">{fmtMoney(b.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Gửi cảnh báo/tin nhắn */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">📢 Gửi cảnh báo / tin nhắn nhân viên</h3>
          <form onSubmit={handleSendMsg} className="space-y-3">
            {/* Multi-select checkboxes */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Chọn nhân viên nhận</label>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {STAFF_NAMES.map((name) => (
                  <label key={name} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1">
                    <input
                      type="checkbox"
                      checked={msgSelected.includes(name)}
                      onChange={() => toggleStaff(name)}
                      className="accent-[#1a3a5c] w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{name}</span>
                  </label>
                ))}
              </div>
              {msgSelected.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">Đã chọn: {msgSelected.length} người</p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại tin nhắn</label>
              <select
                value={msgType}
                onChange={(e) => setMsgType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
              >
                <option value="canh">Cảnh báo</option>
                <option value="nhac">Nhắc nhở</option>
                <option value="khen">Khen ngợi</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tiêu đề</label>
              <input
                type="text"
                value={msgTitle}
                onChange={(e) => setMsgTitle(e.target.value)}
                placeholder="Tiêu đề tin nhắn..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Nội dung</label>
              <textarea
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
                placeholder="Nội dung tin nhắn..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1a3a5c] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#2e75b6] transition-colors"
            >
              {msgSent ? '✅ Đã gửi!' : '📤 Gửi ngay'}
            </button>
          </form>
        </div>

        {/* Message history */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h4 className="font-semibold text-gray-700 text-sm">Tin nhắn gần đây</h4>
          </div>
          <div className="divide-y divide-gray-50">
            {msgHistory.map((m, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${MSG_TYPE_BADGE[m.type]}`}>
                    {MSG_TYPE_LABEL[m.type]}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{m.to}</span>
                  <span className="text-xs text-gray-300 ml-auto">{m.time}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{m.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{m.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'revenue', label: 'Mục tiêu doanh thu' },
  { key: 'kpi', label: 'KPI nhân viên' },
  { key: 'bonus', label: 'Thưởng & Cảnh báo' },
];

export default function KPIPage() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'kpi' | 'bonus'>('revenue');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a3a5c] to-[#2e75b6] rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">📊 KPI & Mục tiêu doanh thu</h2>
        <p className="text-blue-200 mt-1 text-sm">Quản lý hiệu suất nhân viên và mục tiêu kinh doanh</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 w-full sm:w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#1a3a5c] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'revenue' && <TabRevenue />}
      {activeTab === 'kpi' && <TabKPI />}
      {activeTab === 'bonus' && <TabBonusAlert />}
    </div>
  );
}
