'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string, opts?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...opts,
  });
  const json = await res.json();
  return json?.data ?? json;
}

/* ─────────────────────────── MOCK DATA ─────────────────────────── */
const MOCK_MY = [
  { _id:'1', referralCode:'REFADM001', bookingAmount:2800000, commissionRate:0.05, commissionAmount:140000, status:'paid', createdAt:'2024-05-15' },
  { _id:'2', referralCode:'REFADM002', bookingAmount:1500000, commissionRate:0.05, commissionAmount:75000, status:'approved', createdAt:'2024-05-18' },
  { _id:'3', referralCode:'REFADM003', bookingAmount:450000, commissionRate:0.05, commissionAmount:22500, status:'pending', createdAt:'2024-05-20' },
];
const MOCK_STATS = { pending:{count:1,amount:22500}, approved:{count:1,amount:75000}, paid:{count:1,amount:140000} };
const MOCK_CODE = { referralCode:'REFADM001', link:'/booking/hotel?ref=REFADM001' };

const MOCK_LEADERBOARD = [
  { referrerId:'1', name:'Nguyễn Văn An', email:'an@ckd.vn', totalBookings:8, totalAmount:15600000, totalCommission:780000 },
  { referrerId:'2', name:'Trần Thị Bích', email:'bich@ckd.vn', totalBookings:5, totalAmount:9200000, totalCommission:460000 },
  { referrerId:'3', name:'Quản lý', email:'manager@ckd.vn', totalBookings:12, totalAmount:24500000, totalCommission:1225000 },
  { referrerId:'4', name:'Admin', email:'admin@ckd.vn', totalBookings:3, totalAmount:4750000, totalCommission:237500 },
];

const MOCK_ALL = [
  { _id:'1', referralCode:'REFADM001', bookingAmount:2800000, commissionAmount:140000, status:'paid', createdAt:'2024-05-15', referrerName:'Admin' },
  { _id:'2', referralCode:'REFMGR001', bookingAmount:5500000, commissionAmount:275000, status:'paid', createdAt:'2024-05-10', referrerName:'Quản lý' },
  { _id:'3', referralCode:'REFADM002', bookingAmount:1500000, commissionAmount:75000, status:'approved', createdAt:'2024-05-18', referrerName:'Admin' },
  { _id:'4', referralCode:'REFMGR002', bookingAmount:900000, commissionAmount:45000, status:'pending', createdAt:'2024-05-20', referrerName:'Quản lý' },
  { _id:'5', referralCode:'REFADM003', bookingAmount:450000, commissionAmount:22500, status:'pending', createdAt:'2024-05-21', referrerName:'Admin' },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */
const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  paid: 'Đã thanh toán',
  rejected: 'Từ chối',
};
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

/* ═══════════════════════════ TAB 1 – Link của tôi ═══════════════════════════ */
function Tab1MyLink() {
  const [codeData, setCodeData] = useState(MOCK_CODE);
  const [stats, setStats] = useState(MOCK_STATS);
  const [history, setHistory] = useState(MOCK_MY);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch('/commission/my-code').then(d => { if (d?.referralCode) setCodeData(d); }).catch(() => {});
    apiFetch('/commission/stats').then(d => { if (d?.pending) setStats(d); }).catch(() => {});
    apiFetch('/commission/my').then(d => { if (Array.isArray(d) && d.length) setHistory(d); }).catch(() => {});
  }, []);

  const shareLink = `http://localhost:3000/booking/hotel?ref=${codeData.referralCode}`;

  function copyLink() {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Referral code big card */}
      <div className="bg-gradient-to-br from-[#1a3a5c] to-[#2e75b6] rounded-2xl p-6 text-white shadow-lg">
        <p className="text-blue-200 text-sm font-medium mb-2">Mã giới thiệu của bạn</p>
        <p className="text-4xl font-black tracking-widest mb-4">{codeData.referralCode}</p>

        <div className="bg-white/10 rounded-xl p-3 mb-4">
          <p className="text-blue-100 text-xs mb-1">Link chia sẻ</p>
          <p className="text-white text-sm font-mono break-all">{shareLink}</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center mb-5">
          <button
            onClick={copyLink}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              copied
                ? 'bg-green-400 text-white'
                : 'bg-white text-[#1a3a5c] hover:bg-blue-50'
            }`}
          >
            {copied ? '✅ Đã sao chép!' : '📋 Sao chép link'}
          </button>
        </div>

        {/* QR placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center border-2 border-white/30">
            <span className="text-white/70 text-xs font-semibold text-center">QR Code</span>
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium">Hoa hồng giới thiệu</p>
            <p className="text-white font-bold text-lg">5% / đặt phòng</p>
            <p className="text-blue-200 text-xs mt-1">Nhận 5% hoa hồng cho mỗi đặt phòng thành công qua link của bạn</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Chờ duyệt', color: 'border-yellow-300 bg-yellow-50', valueColor: 'text-yellow-700', data: stats.pending },
          { label: 'Đã duyệt', color: 'border-blue-300 bg-blue-50', valueColor: 'text-blue-700', data: stats.approved },
          { label: 'Đã thanh toán', color: 'border-green-300 bg-green-50', valueColor: 'text-green-700', data: stats.paid },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border-2 p-5 ${s.color}`}>
            <p className="text-gray-600 text-sm font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.valueColor}`}>{fmt(s.data.amount)}</p>
            <p className="text-gray-500 text-xs mt-1">{s.data.count} giao dịch</p>
          </div>
        ))}
      </div>

      {/* Commission history table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">📋 Lịch sử hoa hồng của tôi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Ngày', 'Mã booking', 'Số tiền đặt', 'Tỷ lệ', 'Hoa hồng', 'Trạng thái'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Chưa có lịch sử hoa hồng</td></tr>
              ) : history.map((item, i) => (
                <tr key={item._id || i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{item.createdAt?.slice(0,10)}</td>
                  <td className="px-5 py-3 font-mono text-xs font-bold text-[#1a3a5c]">{item.referralCode}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">{fmt(item.bookingAmount)}</td>
                  <td className="px-5 py-3 text-gray-600">{((item.commissionRate || 0.05) * 100).toFixed(0)}%</td>
                  <td className="px-5 py-3 font-bold text-green-700 whitespace-nowrap">{fmt(item.commissionAmount)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[item.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
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

/* ═══════════════════════════ TAB 2 – Bảng xếp hạng ═══════════════════════════ */
function Tab2Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    apiFetch('/commission/leaderboard').then(d => {
      if (Array.isArray(d) && d.length) setLeaderboard(d);
    }).catch(() => {});
  }, []);

  // Sort by commission descending for display
  const sorted = [...leaderboard].sort((a, b) => b.totalCommission - a.totalCommission);

  const MEDALS = ['🥇', '🥈', '🥉'];
  const TOP3_ROW = ['bg-amber-50', 'bg-gray-50', 'bg-orange-50'];

  const PERIODS = [
    { key: 'month', label: 'Tháng này' },
    { key: 'quarter', label: 'Quý này' },
    { key: 'all', label: 'Tất cả' },
  ];

  return (
    <div className="space-y-5">
      {/* Period filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-600">Kỳ:</span>
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              period === p.key
                ? 'bg-[#1a3a5c] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a3a5c]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 highlight cards */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sorted.slice(0, 3).map((person, i) => (
            <div key={person.referrerId} className={`rounded-2xl border-2 p-5 text-center ${
              i === 0 ? 'border-amber-400 bg-amber-50' :
              i === 1 ? 'border-gray-300 bg-gray-50' :
              'border-orange-300 bg-orange-50'
            }`}>
              <div className="text-3xl mb-2">{MEDALS[i]}</div>
              <p className="font-bold text-gray-800">{person.name}</p>
              <p className="text-gray-500 text-xs mb-3">{person.email}</p>
              <p className={`text-xl font-black ${i === 0 ? 'text-amber-600' : i === 1 ? 'text-gray-600' : 'text-orange-600'}`}>
                {fmt(person.totalCommission)}
              </p>
              <p className="text-gray-500 text-xs mt-1">{person.totalBookings} đặt phòng</p>
            </div>
          ))}
        </div>
      )}

      {/* Full table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">🏆 Bảng xếp hạng hoa hồng</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Hạng', 'Tên', 'Email', 'Tổng đặt', 'Tổng doanh thu', 'Hoa hồng', 'Badge'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((person, i) => (
                <tr key={person.referrerId} className={`transition-colors ${i < 3 ? TOP3_ROW[i] : 'hover:bg-gray-50'}`}>
                  <td className="px-5 py-3 text-center">
                    <span className="text-xl">{i < 3 ? MEDALS[i] : `#${i + 1}`}</span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">{person.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{person.email}</td>
                  <td className="px-5 py-3 text-center font-bold text-gray-700">{person.totalBookings}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800 whitespace-nowrap">{fmt(person.totalAmount)}</td>
                  <td className="px-5 py-3 font-bold text-green-700 whitespace-nowrap">{fmt(person.totalCommission)}</td>
                  <td className="px-5 py-3">
                    {i === 0 && <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">Top 1 🌟</span>}
                    {i === 1 && <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">Top 2</span>}
                    {i === 2 && <span className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold">Top 3</span>}
                    {i >= 3 && <span className="bg-blue-50 text-blue-500 px-2.5 py-1 rounded-full text-xs">Top {i + 1}</span>}
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Chưa có dữ liệu</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ TAB 3 – Quản lý chi trả ═══════════════════════════ */
function Tab3Management() {
  const [user, setUser] = useState<any>({});
  const [commissions, setCommissions] = useState(MOCK_ALL);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    apiFetch('/commission?status=pending').then(d => {
      if (Array.isArray(d) && d.length) setCommissions(d);
    }).catch(() => {});
  }, []);

  const role = user?.role || 'staff';
  if (role === 'staff') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h3 className="font-bold text-gray-700 text-lg mb-2">Không có quyền truy cập</h3>
        <p className="text-gray-400 text-sm">Chức năng này chỉ dành cho Quản lý và Admin.</p>
      </div>
    );
  }

  async function updateStatus(id: string, status: string) {
    setLoading(true);
    try {
      await apiFetch(`/commission/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {}
    // Optimistic update
    setCommissions(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    setLoading(false);
  }

  const FILTER_TABS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ duyệt' },
    { key: 'approved', label: 'Đã duyệt' },
    { key: 'paid', label: 'Đã trả' },
  ];

  const filtered = statusFilter === 'all' ? commissions : commissions.filter(c => c.status === statusFilter);

  return (
    <div className="space-y-5">
      {/* Status filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {FILTER_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setStatusFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === t.key
                ? 'bg-white text-[#1a3a5c] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-xs font-normal text-gray-400">
              ({t.key === 'all' ? commissions.length : commissions.filter(c => c.status === t.key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">💳 Quản lý chi trả hoa hồng</h3>
          <span className="text-xs text-gray-400">{filtered.length} bản ghi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Người giới thiệu', 'Mã', 'Ngày', 'Số tiền booking', 'Hoa hồng', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Không có dữ liệu</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c._id || i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{c.referrerName || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#1a3a5c]">{c.referralCode}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.createdAt?.slice(0,10)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{fmt(c.bookingAmount)}</td>
                  <td className="px-4 py-3 font-bold text-green-700 whitespace-nowrap">{fmt(c.commissionAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[c.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[c.status] || c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {c.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(c._id, 'approved')}
                          disabled={loading}
                          className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-60 whitespace-nowrap"
                        >
                          Duyệt
                        </button>
                      )}
                      {c.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(c._id, 'paid')}
                          disabled={loading}
                          className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-green-700 transition disabled:opacity-60 whitespace-nowrap"
                        >
                          Chi trả
                        </button>
                      )}
                      {(c.status === 'pending' || c.status === 'approved') && (
                        <button
                          onClick={() => updateStatus(c._id, 'rejected')}
                          disabled={loading}
                          className="bg-red-50 text-red-600 px-2.5 py-1 rounded text-xs font-semibold hover:bg-red-100 transition disabled:opacity-60 whitespace-nowrap"
                        >
                          Từ chối
                        </button>
                      )}
                      {(c.status === 'paid' || c.status === 'rejected') && (
                        <span className="text-xs text-gray-400 italic">Đã xử lý</span>
                      )}
                    </div>
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

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */
export default function CommissionPage() {
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { label: 'Link của tôi', icon: '🔗' },
    { label: 'Bảng xếp hạng', icon: '🏆' },
    { label: 'Quản lý chi trả', icon: '💳' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">🔗 Hoa hồng giới thiệu</h1>
          <p className="text-gray-500 text-sm mt-0.5">Quản lý chương trình giới thiệu và hoa hồng</p>
        </div>
        <div className="text-sm text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
          Tỷ lệ hoa hồng: <span className="font-bold text-green-600">5%</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === i
                ? 'bg-white text-[#1a3a5c] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 0 && <Tab1MyLink />}
      {activeTab === 1 && <Tab2Leaderboard />}
      {activeTab === 2 && <Tab3Management />}
    </div>
  );
}
