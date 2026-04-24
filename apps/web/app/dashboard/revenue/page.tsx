'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  return json?.data ?? json;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const REVENUE_30D = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const isWeekend = [0, 6].includes(new Date(2024, 4, day).getDay());
  const base = isWeekend ? 28_000_000 : 20_000_000;
  const variation = (Math.sin(i * 0.7) * 0.3 + 1) * base;
  return {
    date: `${String(day).padStart(2, '0')}/5`,
    val: Math.round(variation / 100_000) * 100_000,
  };
});

const SOURCES = [
  { icon: '🏨', label: 'Khách sạn', val: 285_000_000, pct: 39.7 },
  { icon: '☕', label: 'Cafe', val: 167_000_000, pct: 23.2 },
  { icon: '🎬', label: 'Rạp phim', val: 165_000_000, pct: 23.0 },
  { icon: '🍽️', label: 'F&B', val: 48_000_000, pct: 6.7 },
  { icon: '💆', label: 'Spa', val: 42_000_000, pct: 5.8 },
  { icon: '🎪', label: 'Sự kiện', val: 28_000_000, pct: 3.9 },
  { icon: '🤝', label: 'HH đại lý', val: 8_200_000, pct: 1.1 },
];

const BRANCHES = [
  { id: 'CN01', name: 'Khách sạn Grand Q.1', type: '🏨', revenue: 285_000_000, target: 300_000_000, growth: 12, orders: 285 },
  { id: 'CN02', name: 'Khách sạn Riverside', type: '🏨', revenue: 198_000_000, target: 220_000_000, growth: 8, orders: 198 },
  { id: 'CN03', name: 'Cafe CKD Q.3', type: '☕', revenue: 95_000_000, target: 100_000_000, growth: 5, orders: 740 },
  { id: 'CN04', name: 'Cafe CKD Q.7', type: '☕', revenue: 72_000_000, target: 80_000_000, growth: 2, orders: 500 },
  { id: 'CN05', name: 'Rạp CKD Q.7', type: '🎬', revenue: 165_000_000, target: 180_000_000, growth: 18, orders: 1833 },
];

const BRANCH_7D: Record<string, number[]> = {
  CN01: [38, 42, 35, 46, 52, 68, 71].map(v => v * 1_000_000),
  CN02: [24, 28, 22, 30, 35, 48, 51].map(v => v * 1_000_000),
  CN03: [12, 14, 11, 15, 16, 22, 23].map(v => v * 1_000_000),
  CN04: [9, 10, 8, 11, 12, 16, 17].map(v => v * 1_000_000),
  CN05: [20, 22, 18, 25, 28, 36, 38].map(v => v * 1_000_000),
};

const TOP_STAFF: Record<string, { name: string; revenue: number }[]> = {
  CN01: [
    { name: 'Nguyễn Thị Lan', revenue: 42_000_000 },
    { name: 'Trần Văn Hùng', revenue: 38_500_000 },
    { name: 'Lê Thị Mai', revenue: 31_200_000 },
  ],
  CN02: [
    { name: 'Phạm Quốc Bảo', revenue: 35_000_000 },
    { name: 'Hoàng Thị Yến', revenue: 29_000_000 },
    { name: 'Đỗ Văn Tú', revenue: 24_500_000 },
  ],
  CN03: [
    { name: 'Vũ Thị Hoa', revenue: 18_000_000 },
    { name: 'Đinh Văn Nam', revenue: 15_500_000 },
    { name: 'Bùi Thị Thuý', revenue: 12_000_000 },
  ],
  CN04: [
    { name: 'Trịnh Văn Đức', revenue: 14_000_000 },
    { name: 'Ngô Thị Thanh', revenue: 11_000_000 },
    { name: 'Cao Văn Phong', revenue: 9_200_000 },
  ],
  CN05: [
    { name: 'Lý Thị Kim', revenue: 28_000_000 },
    { name: 'Trương Văn Sơn', revenue: 22_000_000 },
    { name: 'Phan Thị Ngọc', revenue: 18_500_000 },
  ],
};

const BRANCH_SERVICES: Record<string, { label: string; val: number }[]> = {
  CN01: [
    { label: 'Phòng đêm', val: 180_000_000 },
    { label: 'F&B', val: 48_000_000 },
    { label: 'Spa & Dịch vụ', val: 35_000_000 },
    { label: 'Sự kiện', val: 22_000_000 },
  ],
  CN02: [
    { label: 'Phòng đêm', val: 130_000_000 },
    { label: 'F&B', val: 38_000_000 },
    { label: 'Hội nghị', val: 30_000_000 },
  ],
  CN03: [
    { label: 'Đồ uống', val: 65_000_000 },
    { label: 'Thức ăn', val: 22_000_000 },
    { label: 'Không gian làm việc', val: 8_000_000 },
  ],
  CN04: [
    { label: 'Đồ uống', val: 48_000_000 },
    { label: 'Thức ăn', val: 18_000_000 },
    { label: 'Sự kiện nhỏ', val: 6_000_000 },
  ],
  CN05: [
    { label: 'Vé xem phim', val: 110_000_000 },
    { label: 'Bắp & Nước', val: 38_000_000 },
    { label: 'Phòng VIP', val: 17_000_000 },
  ],
};

const REVENUE_SOURCES = [
  { label: '🏨 Khách sạn', amount: 485000000, color: 'bg-blue-500', pct: 58 },
  { label: '☕ Cafe', amount: 167000000, color: 'bg-green-500', pct: 20 },
  { label: '🎬 Rạp phim', amount: 183000000, color: 'bg-purple-500', pct: 22 },
];

const CUSTOMERS = [
  'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Văn Cường', 'Phạm Thị Dung',
  'Hoàng Văn Em', 'Đỗ Thị Phương', 'Vũ Văn Giang', 'Đinh Thị Hà',
  'Bùi Văn Inh', 'Trịnh Thị Kim', 'Ngô Văn Lâm', 'Cao Thị Mai',
  'Lý Văn Nam', 'Trương Thị Oanh', 'Phan Văn Phú', 'Mai Thị Quỳnh',
  'Dương Văn Rộng', 'Lưu Thị Sen', 'Kiều Văn Tâm', 'Đặng Thị Uyên',
];

const ORDERS = [
  { date: '24/04/2024', code: 'HD001', customer: CUSTOMERS[0], service: 'Phòng Deluxe', branch: 'Khách sạn Grand Q.1', amount: 1_200_000, payment: 'Chuyển khoản', commission: null, status: 'completed' },
  { date: '24/04/2024', code: 'HD002', customer: CUSTOMERS[1], service: 'Vé rạp VIP', branch: 'Rạp CKD Q.7', amount: 180_000, payment: 'Ví điện tử', commission: null, status: 'completed' },
  { date: '24/04/2024', code: 'HD003', customer: CUSTOMERS[2], service: 'Đặt bàn cafe', branch: 'Cafe CKD Q.3', amount: 320_000, payment: 'Tiền mặt', commission: null, status: 'completed' },
  { date: '23/04/2024', code: 'HD004', customer: CUSTOMERS[3], service: 'Phòng Suite', branch: 'Khách sạn Grand Q.1', amount: 3_500_000, payment: 'Thẻ ngân hàng', commission: '7% • Qua giới thiệu', status: 'completed' },
  { date: '23/04/2024', code: 'HD005', customer: CUSTOMERS[4], service: 'Vé rạp thường', branch: 'Rạp CKD Q.7', amount: 90_000, payment: 'Ví điện tử', commission: null, status: 'completed' },
  { date: '23/04/2024', code: 'HD006', customer: CUSTOMERS[5], service: 'Đặt bàn cafe', branch: 'Cafe CKD Q.7', amount: 210_000, payment: 'Tiền mặt', commission: null, status: 'pending' },
  { date: '22/04/2024', code: 'HD007', customer: CUSTOMERS[6], service: 'Phòng Superior', branch: 'Khách sạn Riverside', amount: 950_000, payment: 'Chuyển khoản', commission: '5% • Qua giới thiệu', status: 'completed' },
  { date: '22/04/2024', code: 'HD008', customer: CUSTOMERS[7], service: 'Vé rạp IMAX', branch: 'Rạp CKD Q.7', amount: 220_000, payment: 'Thẻ ngân hàng', commission: null, status: 'completed' },
  { date: '22/04/2024', code: 'HD009', customer: CUSTOMERS[8], service: 'Set chiều cafe', branch: 'Cafe CKD Q.3', amount: 450_000, payment: 'Ví điện tử', commission: null, status: 'completed' },
  { date: '21/04/2024', code: 'HD010', customer: CUSTOMERS[9], service: 'Phòng Deluxe', branch: 'Khách sạn Grand Q.1', amount: 1_200_000, payment: 'Tiền mặt', commission: null, status: 'completed' },
  { date: '21/04/2024', code: 'HD011', customer: CUSTOMERS[10], service: 'Vé rạp thường', branch: 'Rạp CKD Q.7', amount: 90_000, payment: 'Ví điện tử', commission: null, status: 'cancelled' },
  { date: '21/04/2024', code: 'HD012', customer: CUSTOMERS[11], service: 'Đặt bàn cafe', branch: 'Cafe CKD Q.7', amount: 180_000, payment: 'Tiền mặt', commission: null, status: 'completed' },
  { date: '20/04/2024', code: 'HD013', customer: CUSTOMERS[12], service: 'Phòng Suite', branch: 'Khách sạn Riverside', amount: 2_800_000, payment: 'Thẻ ngân hàng', commission: '8% • Qua giới thiệu', status: 'completed' },
  { date: '20/04/2024', code: 'HD014', customer: CUSTOMERS[13], service: 'Vé rạp VIP', branch: 'Rạp CKD Q.7', amount: 180_000, payment: 'Chuyển khoản', commission: null, status: 'completed' },
  { date: '20/04/2024', code: 'HD015', customer: CUSTOMERS[14], service: 'Combo đồ uống', branch: 'Cafe CKD Q.3', amount: 280_000, payment: 'Ví điện tử', commission: null, status: 'pending' },
  { date: '19/04/2024', code: 'HD016', customer: CUSTOMERS[15], service: 'Phòng Standard', branch: 'Khách sạn Grand Q.1', amount: 800_000, payment: 'Tiền mặt', commission: null, status: 'completed' },
  { date: '19/04/2024', code: 'HD017', customer: CUSTOMERS[16], service: 'Vé rạp 3D', branch: 'Rạp CKD Q.7', amount: 120_000, payment: 'Thẻ ngân hàng', commission: null, status: 'completed' },
  { date: '18/04/2024', code: 'HD018', customer: CUSTOMERS[17], service: 'Đặt bàn cao cấp', branch: 'Cafe CKD Q.3', amount: 680_000, payment: 'Chuyển khoản', commission: '6% • Qua giới thiệu', status: 'completed' },
  { date: '18/04/2024', code: 'HD019', customer: CUSTOMERS[18], service: 'Phòng Deluxe', branch: 'Khách sạn Riverside', amount: 1_100_000, payment: 'Ví điện tử', commission: null, status: 'cancelled' },
  { date: '17/04/2024', code: 'HD020', customer: CUSTOMERS[19], service: 'Vé rạp thường', branch: 'Rạp CKD Q.7', amount: 90_000, payment: 'Tiền mặt', commission: null, status: 'completed' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}
function fmtM(n: number) {
  return (n / 1_000_000).toFixed(1) + 'M';
}

const STATUS_LABEL: Record<string, string> = {
  completed: 'Hoàn thành',
  pending: 'Chờ xử lý',
  cancelled: 'Đã huỷ',
};
const STATUS_COLOR: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function Tab1() {
  const [period, setPeriod] = useState('30d');
  const [tooltip, setTooltip] = useState<{ x: number; text: string } | null>(null);
  const [apiStats, setApiStats] = useState<any>(null);
  const [chartData, setChartData] = useState(REVENUE_30D);
  const [revSources, setRevSources] = useState(REVENUE_SOURCES);

  useEffect(() => {
    apiFetch('/revenue/dashboard').then(d => {
      if (d && (d.todayRevenue || d.monthRevenue)) setApiStats(d);
    }).catch(() => {});
    apiFetch('/revenue/chart?days=14').then(d => {
      if (Array.isArray(d) && d.length) setChartData(d.map((item: any) => ({ date: item.date || item._id, val: item.revenue || item.val || 0 })));
    }).catch(() => {});
    apiFetch('/revenue/by-branch').then(d => {
      if (Array.isArray(d) && d.length) {
        const hotel = d.filter((b: any) => b.type === 'hotel' || b.industry === 'hotel').reduce((s: number, b: any) => s + (b.revenue || 0), 0);
        const cafe = d.filter((b: any) => b.type === 'cafe' || b.industry === 'cafe').reduce((s: number, b: any) => s + (b.revenue || 0), 0);
        const cinema = d.filter((b: any) => b.type === 'cinema' || b.industry === 'cinema').reduce((s: number, b: any) => s + (b.revenue || 0), 0);
        const total = hotel + cafe + cinema;
        if (total > 0) setRevSources([
          { label: '🏨 Khách sạn', amount: hotel, color: 'bg-blue-500', pct: Math.round((hotel / total) * 100) },
          { label: '☕ Cafe', amount: cafe, color: 'bg-green-500', pct: Math.round((cafe / total) * 100) },
          { label: '🎬 Rạp phim', amount: cinema, color: 'bg-purple-500', pct: Math.round((cinema / total) * 100) },
        ]);
      }
    }).catch(() => {});
  }, []);

  const maxVal = Math.max(...chartData.map(d => d.val), 1);

  // Use API stats if available, fall back to mock display values
  const todayRevDisplay = apiStats?.todayRevenue > 0 ? `${apiStats.todayRevenue.toLocaleString('vi-VN')}đ` : '12,850,000đ';
  const monthRevDisplay = apiStats?.monthRevenue > 0 ? `${apiStats.monthRevenue.toLocaleString('vi-VN')}đ` : '718,500,000đ';

  const PERIODS = [
    { key: 'today', label: 'Hôm nay' },
    { key: '7d', label: '7 ngày' },
    { key: '30d', label: '30 ngày' },
    { key: 'month', label: 'Tháng này' },
    { key: 'quarter', label: 'Quý này' },
  ];

  const STATS = [
    { icon: '💵', label: 'Doanh thu hôm nay', value: todayRevDisplay, sub: '+8% vs hôm qua', subColor: 'text-green-600' },
    { icon: '📅', label: 'Doanh thu tháng', value: monthRevDisplay, sub: '+15.3% vs tháng trước', subColor: 'text-green-600' },
    { icon: '🏨', label: 'Khách sạn', value: '285,000,000đ', sub: '39.7% tổng doanh thu', subColor: 'text-blue-500' },
    { icon: '☕', label: 'Cafe', value: '167,000,000đ', sub: '23.2% tổng doanh thu', subColor: 'text-amber-500' },
    { icon: '🎬', label: 'Rạp phim', value: '165,000,000đ', sub: '23% tổng doanh thu', subColor: 'text-purple-500' },
    { icon: '✨', label: 'Dịch vụ khác', value: '101,500,000đ', sub: '14.1% tổng doanh thu', subColor: 'text-pink-500' },
  ];

  const ORDER_SUMMARY = [
    { type: 'Phòng khách sạn', orders: 285, avg: 1_000_000, total: 285_000_000 },
    { type: 'Đặt bàn cafe', orders: 1240, avg: 134_700, total: 167_000_000 },
    { type: 'Vé rạp phim', orders: 1833, avg: 90_000, total: 165_000_000 },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2 flex-wrap">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{s.icon}</span>
              <span className="text-gray-500 text-sm">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-gray-800">{s.value}</p>
            <p className={`text-xs mt-1 font-medium ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-5">📈 Doanh thu theo ngày</h3>
        <div className="relative">
          <div className="flex items-end gap-[3px] h-44" onMouseLeave={() => setTooltip(null)}>
            {chartData.map((d, i) => {
              const pct = (d.val / maxVal) * 100;
              return (
                <div
                  key={i}
                  className="relative flex-1 flex flex-col items-center group cursor-pointer"
                  onMouseEnter={() => {
                    setTooltip({ x: i, text: `${d.date}\n${fmt(d.val)}` });
                  }}
                >
                  {tooltip?.x === i && (
                    <div className="absolute bottom-full mb-2 z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none left-1/2 -translate-x-1/2">
                      <div className="font-semibold">{d.date}</div>
                      <div>{fmt(d.val)}</div>
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${Math.max(pct * 1.44, 4)}px`,
                      background: 'linear-gradient(to top, #1a3a5c, #2e75b6)',
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* X-axis labels */}
          <div className="flex mt-2" style={{ gap: '3px' }}>
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                {(i === 0 || i === Math.floor(chartData.length / 2) || i === chartData.length - 1) ? (
                  <span className="text-[10px] text-gray-400">{String(d.date).slice(-5)}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Sources section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-5">📊 Nguồn doanh thu</h3>
        <div className="space-y-4">
          {revSources.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-gray-700">{s.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-800">{fmtM(s.amount)}</span>
                  <span className="text-xs text-gray-400 w-8 text-right">{s.pct}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full ${s.color} transition-all duration-700`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Source */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-5">📊 Doanh thu theo nguồn</h3>
        <div className="space-y-3">
          {SOURCES.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 text-center">{s.icon}</span>
              <span className="w-28 text-sm text-gray-700 font-medium">{s.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${s.pct * 2}%`,
                    background: 'linear-gradient(to right, #1a3a5c, #2e75b6)',
                  }}
                />
              </div>
              <span className="w-20 text-right text-sm font-bold text-gray-800">{fmtM(s.val)}</span>
              <span className="w-14 text-right text-xs text-gray-400">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Summary Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">🧾 Tổng hợp đơn hàng</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-6 py-3">Loại dịch vụ</th>
                <th className="text-right px-6 py-3">Số đơn</th>
                <th className="text-right px-6 py-3">Doanh thu TB</th>
                <th className="text-right px-6 py-3">Tổng doanh thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ORDER_SUMMARY.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{r.type}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{r.orders.toLocaleString('vi-VN')}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{fmt(r.avg)}</td>
                  <td className="px-6 py-4 text-right font-bold text-[#1a3a5c]">{fmtM(r.total)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-6 py-3 text-gray-800">Tổng cộng</td>
                <td className="px-6 py-3 text-right text-gray-800">3,358</td>
                <td className="px-6 py-3 text-right text-gray-500 font-normal">—</td>
                <td className="px-6 py-3 text-right text-[#1a3a5c]">617M</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Tab2() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [filterBranch, setFilterBranch] = useState('all');

  const maxBranchRev = Math.max(...BRANCHES.map(b => b.revenue));
  const filtered = filterBranch === 'all' ? BRANCHES : BRANCHES.filter(b => b.id === filterBranch);

  const detail = selectedBranch ? BRANCHES.find(b => b.id === selectedBranch) : null;
  const detail7d = selectedBranch ? BRANCH_7D[selectedBranch] : [];
  const detailServices = selectedBranch ? BRANCH_SERVICES[selectedBranch] : [];
  const detailStaff = selectedBranch ? TOP_STAFF[selectedBranch] : [];

  const achievementColor = (pct: number) => {
    if (pct >= 90) return 'bg-green-500';
    if (pct >= 70) return 'bg-yellow-400';
    return 'bg-red-500';
  };
  const achievementBadge = (pct: number) => {
    if (pct >= 90) return 'bg-green-100 text-green-700';
    if (pct >= 70) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const DAYS_7 = ['18/4', '19/4', '20/4', '21/4', '22/4', '23/4', '24/4'];

  return (
    <div className="space-y-6">
      {/* Branch filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Chi nhánh:</label>
        <select
          value={filterBranch}
          onChange={e => setFilterBranch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30"
        >
          <option value="all">Tất cả chi nhánh</option>
          {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Comparison mini-chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-5">📊 So sánh doanh thu các chi nhánh</h3>
        <div className="space-y-3">
          {BRANCHES.map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-5 text-center text-sm">{b.type}</span>
              <span className="w-40 text-sm text-gray-700 font-medium truncate">{b.name}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full flex items-center"
                  style={{
                    width: `${(b.revenue / maxBranchRev) * 100}%`,
                    background: 'linear-gradient(to right, #1a3a5c, #2e75b6)',
                  }}
                />
              </div>
              <span className="w-16 text-right text-sm font-bold text-gray-800">{fmtM(b.revenue)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Branch table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">🏢 Bảng doanh thu chi nhánh — Tháng 4/2024</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-5 py-3">Chi nhánh</th>
                <th className="text-right px-5 py-3">Doanh thu</th>
                <th className="text-right px-5 py-3">Mục tiêu</th>
                <th className="text-center px-5 py-3">Đạt</th>
                <th className="text-right px-5 py-3">Tăng trưởng</th>
                <th className="text-right px-5 py-3">Đơn hàng</th>
                <th className="text-center px-5 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((b, i) => {
                const pct = Math.round((b.revenue / b.target) * 100);
                return (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span>{b.type}</span>
                        <span className="font-semibold text-gray-800">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-gray-800">{fmtM(b.revenue)}</td>
                    <td className="px-5 py-4 text-right text-gray-500">{fmtM(b.target)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${achievementBadge(pct)}`}>{pct}%</span>
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${achievementColor(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`font-semibold text-sm ${b.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {b.growth > 0 ? '+' : ''}{b.growth}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-600">{b.orders.toLocaleString('vi-VN')}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedBranch(selectedBranch === b.id ? null : b.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#1a3a5c] text-white hover:bg-[#14304e] transition-colors font-medium"
                      >
                        {selectedBranch === b.id ? 'Đóng' : 'Xem'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch detail panel */}
      {detail && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#1a3a5c]/20 p-6 space-y-5">
          <h3 className="font-bold text-[#1a3a5c] text-lg">
            {detail.type} Chi tiết: {detail.name}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 7-day mini chart */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Doanh thu 7 ngày gần đây</p>
              <div className="flex items-end gap-1 h-24">
                {detail7d.map((v, i) => {
                  const max7 = Math.max(...detail7d);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm"
                        style={{
                          height: `${Math.max((v / max7) * 80, 4)}px`,
                          background: 'linear-gradient(to top, #1a3a5c, #2e75b6)',
                        }}
                        title={`${DAYS_7[i]}: ${fmtM(v)}`}
                      />
                      <span className="text-[9px] text-gray-400">{DAYS_7[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Services breakdown */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Phân tích theo dịch vụ</p>
              <div className="space-y-2">
                {detailServices.map((s, i) => {
                  const maxS = Math.max(...detailServices.map(x => x.val));
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-700">{s.label}</span>
                        <span className="font-bold text-gray-800">{fmtM(s.val)}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-[#2e75b6]"
                          style={{ width: `${(s.val / maxS) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top staff */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Top 3 nhân viên theo doanh thu</p>
              <div className="space-y-2">
                {detailStaff.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'}`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-700">{s.name}</span>
                    <span className="text-sm font-bold text-[#1a3a5c]">{fmtM(s.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tab3() {
  const [search, setSearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = ORDERS.filter(o => {
    const matchSearch = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.code.includes(search);
    const matchService = serviceFilter === 'all' || (
      serviceFilter === 'hotel' ? o.branch.includes('Khách sạn') :
      serviceFilter === 'cafe' ? o.branch.includes('Cafe') :
      serviceFilter === 'cinema' ? o.branch.includes('Rạp') : true
    );
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchService && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Tìm khách hàng / mã đơn..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30"
          />
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30"
          >
            <option value="all">Tất cả dịch vụ</option>
            <option value="hotel">🏨 Khách sạn</option>
            <option value="cafe">☕ Cafe</option>
            <option value="cinema">🎬 Rạp phim</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Chờ xử lý</option>
            <option value="cancelled">Đã huỷ</option>
          </select>
          <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-1.5">
            📊 Xuất Excel
          </button>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">📋 Danh sách đơn hàng</h3>
          <span className="text-sm text-gray-400">Hiển thị {filtered.length}/156 đơn hàng</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="text-left px-4 py-3">Ngày</th>
                <th className="text-left px-4 py-3">Mã đơn</th>
                <th className="text-left px-4 py-3">Khách hàng</th>
                <th className="text-left px-4 py-3">Dịch vụ</th>
                <th className="text-left px-4 py-3">Chi nhánh</th>
                <th className="text-right px-4 py-3">Số tiền</th>
                <th className="text-left px-4 py-3">PT Thanh toán</th>
                <th className="text-left px-4 py-3">HH đại lý</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#1a3a5c]">{o.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{o.customer}</td>
                  <td className="px-4 py-3 text-gray-600">{o.service}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{o.branch}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-800 whitespace-nowrap">{fmt(o.amount)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{o.payment}</td>
                  <td className="px-4 py-3 text-xs text-orange-600 font-medium">{o.commission || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                    Không tìm thấy đơn hàng phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Trang 1 / 8 • Tổng 156 đơn hàng</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-40"
              disabled={page === 1}
            >
              ← Trước
            </button>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${page === n ? 'bg-[#1a3a5c] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {n}
              </button>
            ))}
            <span className="px-2 py-1.5 text-gray-400 text-sm">...</span>
            <button className="w-8 h-8 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">8</button>
            <button
              onClick={() => setPage(p => Math.min(8, p + 1))}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            >
              Tiếp →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { label: 'Tổng quan', icon: '📊' },
    { label: 'Theo chi nhánh', icon: '🏢' },
    { label: 'Chi tiết đơn hàng', icon: '📋' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">💰 Quản lý Doanh thu</h1>
          <p className="text-gray-500 text-sm mt-0.5">Theo dõi và phân tích doanh thu toàn hệ thống</p>
        </div>
        <div className="text-sm text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
          Cập nhật: 24/04/2024 • 08:30
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
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

      {/* Tab content */}
      {activeTab === 0 && <Tab1 />}
      {activeTab === 1 && <Tab2 />}
      {activeTab === 2 && <Tab3 />}
    </div>
  );
}
