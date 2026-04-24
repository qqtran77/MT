'use client';
import { useEffect, useState } from 'react';

const TIER_COLOR: Record<string, string> = {
  bronze: 'bg-orange-100 text-orange-700',
  silver: 'bg-gray-100 text-gray-700',
  gold: 'bg-yellow-100 text-yellow-700',
  platinum: 'bg-blue-100 text-blue-700',
};

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Nguyễn Văn An', email: 'an@email.com', phone: '0901234567', tier: 'bronze', walletBalance: 250000, loyaltyPoints: 150, totalSpent: 1850000, totalOrders: 8, lastOrderDate: '2024-05-18', birthday: '25/05/1990', address: 'Q.1 HCM' },
  { id: '2', name: 'Trần Thị Bích', email: 'bich@email.com', phone: '0912345678', tier: 'silver', walletBalance: 1200000, loyaltyPoints: 850, totalSpent: 12500000, totalOrders: 34, lastOrderDate: '2024-05-20', birthday: '26/06/1988', address: 'Q.3 HCM' },
  { id: '3', name: 'Lê Hoàng Nam', email: 'nam@email.com', phone: '0923456789', tier: 'gold', walletBalance: 3500000, loyaltyPoints: 2400, totalSpent: 45000000, totalOrders: 98, lastOrderDate: '2024-05-21', birthday: '28/08/1985', address: 'Q.7 HCM' },
  { id: '4', name: 'Phạm Thị Lan', email: 'lan@email.com', phone: '0934567890', tier: 'platinum', walletBalance: 8000000, loyaltyPoints: 6800, totalSpent: 125000000, totalOrders: 215, lastOrderDate: '2024-05-22', birthday: '15/03/1982', address: 'Q.Bình Thạnh HCM' },
  { id: '5', name: 'Hoàng Văn Minh', email: 'minh@email.com', phone: '0945678901', tier: 'bronze', walletBalance: 50000, loyaltyPoints: 80, totalSpent: 780000, totalOrders: 5, lastOrderDate: '2024-04-30', birthday: '10/11/1995', address: 'Q.Tân Bình HCM' },
  { id: '6', name: 'Vũ Thị Thu', email: 'thu@email.com', phone: '0956789012', tier: 'silver', walletBalance: 750000, loyaltyPoints: 620, totalSpent: 9800000, totalOrders: 28, lastOrderDate: '2024-05-19', birthday: '22/07/1991', address: 'Q.Phú Nhuận HCM' },
];

const MOCK_PURCHASES = [
  { date: '2024-05-20', service: 'Khách sạn', desc: 'Phòng Deluxe 2 đêm', amount: 3000000, method: 'Ví điện tử', status: 'completed' },
  { date: '2024-05-15', service: 'Cafe', desc: 'Combo 2 người', amount: 250000, method: 'Tiền mặt', status: 'completed' },
  { date: '2024-05-10', service: 'Rạp phim', desc: '4 vé + bắp ngô', amount: 450000, method: 'Thẻ ngân hàng', status: 'completed' },
  { date: '2024-04-28', service: 'Khách sạn', desc: 'Phòng Suite 1 đêm', amount: 2800000, method: 'Ví điện tử', status: 'completed' },
];

const MOCK_WALLET_TXN = [
  { date: '2024-05-20', type: 'payment', desc: 'TT Phòng Deluxe', amount: -3000000, balance: 250000 },
  { date: '2024-05-18', type: 'topup', desc: 'Nạp tiền', amount: 2000000, balance: 3250000 },
  { date: '2024-05-15', type: 'payment', desc: 'TT Cafe combo', amount: -250000, balance: 1250000 },
  { date: '2024-05-01', type: 'topup', desc: 'Nạp tiền', amount: 1500000, balance: 1500000 },
];

const MOCK_PROMOTIONS = [
  { id: '1', customer: 'Lê Hoàng Nam', discount: '15%', minSpend: 500000, validUntil: '2024-06-30', usedCount: 2, status: 'active', note: 'Khách VIP tháng 5' },
  { id: '2', customer: 'Phạm Thị Lan', discount: '20%', minSpend: 1000000, validUntil: '2024-05-31', usedCount: 0, status: 'active', note: 'Sinh nhật' },
  { id: '3', customer: 'Trần Thị Bích', discount: '10%', minSpend: 200000, validUntil: '2024-05-25', usedCount: 1, status: 'expired', note: '' },
];

const TIER_AUTO = [
  { tier: 'Bronze', discount: '5%', desc: 'Khách hàng mới' },
  { tier: 'Silver', discount: '8%', desc: 'Từ 5M chi tiêu' },
  { tier: 'Gold', discount: '12%', desc: 'Từ 20M chi tiêu' },
  { tier: 'Platinum', discount: '15%', desc: 'Từ 50M chi tiêu' },
];

function fmt(n: number) { return n.toLocaleString('vi-VN') + 'đ'; }

export default function CustomersPage() {
  const [tab, setTab] = useState<'list' | 'detail' | 'wallet' | 'promo'>('list');
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof MOCK_CUSTOMERS[0] | null>(null);

  // Wallet tab state
  const [walletCustomerId, setWalletCustomerId] = useState(MOCK_CUSTOMERS[0].id);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupMethod, setTopupMethod] = useState('Tiền mặt');
  const [topupNote, setTopupNote] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('Rút tiền');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [walletMsg, setWalletMsg] = useState('');
  const [walletTxns, setWalletTxns] = useState<{ date: string; customerName: string; type: string; desc: string; amount: number; balance: number }[]>([]);

  // Promo tab state
  const [promoList, setPromoList] = useState(MOCK_PROMOTIONS);
  const [promoCustomerId, setPromoCustomerId] = useState(MOCK_CUSTOMERS[0].id);
  const [promoDiscount, setPromoDiscount] = useState('');
  const [promoMinSpend, setPromoMinSpend] = useState('');
  const [promoUntil, setPromoUntil] = useState('');
  const [promoNote, setPromoNote] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [voucherMsg, setVoucherMsg] = useState('');

  const filtered = customers.filter(c =>
    (tierFilter === 'all' || c.tier === tierFilter) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.includes(search))
  );

  const walletCustomer = customers.find(c => c.id === walletCustomerId) || customers[0];

  function handleViewDetail(c: typeof MOCK_CUSTOMERS[0]) {
    setSelectedCustomer(c);
    setTab('detail');
  }

  function handleTopup() {
    const amt = parseInt(topupAmount);
    if (!amt || amt <= 0) return;
    const newBalance = walletCustomer.walletBalance + amt;
    setCustomers(prev => prev.map(c => c.id === walletCustomerId ? { ...c, walletBalance: newBalance } : c));
    setWalletTxns(prev => [{
      date: new Date().toISOString().slice(0, 10),
      customerName: walletCustomer.name,
      type: 'topup',
      desc: topupNote || 'Nạp tiền',
      amount: amt,
      balance: newBalance,
    }, ...prev]);
    setWalletMsg(`✅ Đã nạp ${fmt(amt)} vào ví ${walletCustomer.name}. Số dư mới: ${fmt(newBalance)}`);
    setTopupAmount(''); setTopupNote('');
    setTimeout(() => setWalletMsg(''), 4000);
  }

  function handleWithdraw() {
    const amt = parseInt(withdrawAmount);
    if (!amt || amt <= 0 || amt > walletCustomer.walletBalance) return;
    const newBalance = walletCustomer.walletBalance - amt;
    setCustomers(prev => prev.map(c => c.id === walletCustomerId ? { ...c, walletBalance: newBalance } : c));
    setWalletTxns(prev => [{
      date: new Date().toISOString().slice(0, 10),
      customerName: walletCustomer.name,
      type: 'withdraw',
      desc: withdrawReason + (withdrawNote ? ` - ${withdrawNote}` : ''),
      amount: -amt,
      balance: newBalance,
    }, ...prev]);
    setWalletMsg(`✅ Đã xử lý rút ${fmt(amt)} từ ví ${walletCustomer.name}. Số dư còn: ${fmt(newBalance)}`);
    setWithdrawAmount(''); setWithdrawNote('');
    setTimeout(() => setWalletMsg(''), 4000);
  }

  function handleCreatePromo() {
    if (!promoDiscount || !promoUntil) return;
    const c = customers.find(x => x.id === promoCustomerId);
    if (!c) return;
    const newPromo = {
      id: Date.now().toString(),
      customer: c.name,
      discount: promoDiscount.includes('%') ? promoDiscount : promoDiscount + '%',
      minSpend: parseInt(promoMinSpend) || 0,
      validUntil: promoUntil,
      usedCount: 0,
      status: 'active',
      note: promoNote,
    };
    setPromoList(prev => [newPromo, ...prev]);
    setPromoMsg(`✅ Đã tạo khuyến mãi ${newPromo.discount} cho ${c.name}`);
    setPromoDiscount(''); setPromoMinSpend(''); setPromoUntil(''); setPromoNote('');
    setTimeout(() => setPromoMsg(''), 4000);
  }

  const TABS = [
    { key: 'list', label: 'Danh sách' },
    { key: 'detail', label: 'Chi tiết khách' },
    { key: 'wallet', label: 'Nạp/Rút ví' },
    { key: 'promo', label: 'Khuyến mãi' },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1 w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t.key ? 'bg-[#1a3a5c] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Danh sách */}
      {tab === 'list' && (
        <>
          {/* Tier summary chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['bronze', 'silver', 'gold', 'platinum'] as const).map(tier => {
              const count = customers.filter(c => c.tier === tier).length;
              return (
                <button key={tier} onClick={() => setTierFilter(tierFilter === tier ? 'all' : tier)}
                  className={`rounded-xl p-4 text-center border-2 transition-all ${TIER_COLOR[tier]} ${tierFilter === tier ? 'border-current scale-105 shadow-md' : 'border-transparent'}`}>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs mt-1 capitalize">{tier}</p>
                </button>
              );
            })}
          </div>

          {/* Search & filter bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-3 flex-wrap">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm tên, email, SĐT..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="all">Tất cả hạng</option>
              {['bronze', 'silver', 'gold', 'platinum'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
            {tierFilter !== 'all' && (
              <button onClick={() => setTierFilter('all')} className="text-xs text-gray-400 hover:text-gray-600 underline">Bỏ lọc</button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">👤 Danh sách khách hàng ({filtered.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {['Tên khách', 'Email', 'SĐT', 'Hạng', 'Số dư ví', 'Lần mua gần nhất', 'Tổng đơn', 'Điểm', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0
                    ? <tr><td colSpan={9} className="text-center py-12 text-gray-400">Chưa có dữ liệu</td></tr>
                    : filtered.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {c.name[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-800 whitespace-nowrap">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{c.email}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${TIER_COLOR[c.tier]}`}>{c.tier}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-green-700 whitespace-nowrap">{fmt(c.walletBalance)}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{c.lastOrderDate}</td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-700">{c.totalOrders}</td>
                        <td className="px-4 py-3 font-semibold text-amber-600 whitespace-nowrap">{c.loyaltyPoints.toLocaleString()} pts</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleViewDetail(c)}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-100 whitespace-nowrap">
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: Chi tiết khách */}
      {tab === 'detail' && (
        <>
          {!selectedCustomer ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">👤</p>
              <p className="font-semibold">Chưa chọn khách hàng</p>
              <p className="text-sm mt-1">Vào tab <span className="font-semibold text-blue-600">Danh sách</span> và nhấn <span className="font-semibold">"Xem chi tiết"</span></p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Profile card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {selectedCustomer.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${TIER_COLOR[selectedCustomer.tier]}`}>{selectedCustomer.tier}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
                      <span>📞 {selectedCustomer.phone}</span>
                      <span>✉️ {selectedCustomer.email}</span>
                      <span>📍 {selectedCustomer.address}</span>
                      <span>🎂 {selectedCustomer.birthday}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕ Đóng</button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
                  {[
                    { label: 'Tổng chi tiêu', value: fmt(selectedCustomer.totalSpent), color: 'text-[#1a3a5c]' },
                    { label: 'Số đơn hàng', value: selectedCustomer.totalOrders, color: 'text-indigo-600' },
                    { label: 'Điểm tích lũy', value: `${selectedCustomer.loyaltyPoints.toLocaleString()} pts`, color: 'text-amber-600' },
                    { label: 'Số dư ví', value: fmt(selectedCustomer.walletBalance), color: 'text-green-600' },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase history */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">🛍️ Lịch sử mua hàng</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        {['Ngày', 'Dịch vụ', 'Mô tả', 'Số tiền', 'Phương thức TT', 'Trạng thái'].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_PURCHASES.map((p, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{p.date}</td>
                          <td className="px-4 py-3">
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">{p.service}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{p.desc}</td>
                          <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">{fmt(p.amount)}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{p.method}</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Hoàn thành</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Wallet transaction history */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">💳 Lịch sử giao dịch ví</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        {['Ngày', 'Loại', 'Mô tả', 'Số tiền', 'Số dư sau'].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_WALLET_TXN.map((t, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{t.date}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              t.type === 'topup' ? 'bg-green-50 text-green-700' :
                              t.type === 'payment' ? 'bg-red-50 text-red-700' :
                              t.type === 'refund' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {t.type === 'topup' ? 'Nạp tiền' : t.type === 'payment' ? 'Thanh toán' : t.type === 'refund' ? 'Hoàn tiền' : 'Rút tiền'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{t.desc}</td>
                          <td className={`px-4 py-3 font-bold whitespace-nowrap ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {t.amount >= 0 ? '+' : ''}{fmt(t.amount)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{fmt(t.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 3: Nạp/Rút ví */}
      {tab === 'wallet' && (
        <div className="space-y-5">
          {/* Customer selector + balance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-48">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Chọn khách hàng</label>
                <select value={walletCustomerId} onChange={e => setWalletCustomerId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                </select>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">Số dư hiện tại</p>
                <p className="text-2xl font-bold text-green-600">{fmt(walletCustomer.walletBalance)}</p>
                <p className="text-xs text-gray-400 capitalize">{walletCustomer.tier} · {walletCustomer.loyaltyPoints.toLocaleString()} pts</p>
              </div>
            </div>
          </div>

          {walletMsg && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 font-semibold text-sm">{walletMsg}</div>
          )}

          {/* Action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nạp tiền */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 space-y-4">
              <h3 className="font-bold text-gray-800 text-base">💰 Nạp tiền</h3>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Số tiền nạp</label>
                <input type="number" value={topupAmount} onChange={e => setTopupAmount(e.target.value)}
                  placeholder="Nhập số tiền..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[100000, 200000, 500000, 1000000].map(amt => (
                    <button key={amt} onClick={() => setTopupAmount(amt.toString())}
                      className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-green-100">
                      {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Phương thức</label>
                <div className="flex gap-2">
                  {['Tiền mặt', 'Chuyển khoản', 'Thẻ'].map(m => (
                    <button key={m} onClick={() => setTopupMethod(m)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${topupMethod === m ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Ghi chú</label>
                <input value={topupNote} onChange={e => setTopupNote(e.target.value)} placeholder="Ghi chú..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
              <button onClick={handleTopup}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
                💰 Nạp tiền
              </button>
            </div>

            {/* Rút / Hoàn tiền */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5 space-y-4">
              <h3 className="font-bold text-gray-800 text-base">🔄 Rút tiền / Hoàn tiền</h3>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Số tiền <span className="text-red-400">(tối đa: {fmt(walletCustomer.walletBalance)})</span>
                </label>
                <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                  max={walletCustomer.walletBalance}
                  placeholder="Nhập số tiền..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                {withdrawAmount && parseInt(withdrawAmount) > walletCustomer.walletBalance && (
                  <p className="text-red-500 text-xs mt-1">⚠️ Vượt quá số dư hiện tại</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Lý do</label>
                <select value={withdrawReason} onChange={e => setWithdrawReason(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {['Rút tiền', 'Hoàn tiền đặt phòng', 'Hoàn tiền lỗi', 'Khác'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Ghi chú</label>
                <input value={withdrawNote} onChange={e => setWithdrawNote(e.target.value)} placeholder="Ghi chú..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
              </div>
              <button onClick={handleWithdraw}
                disabled={!withdrawAmount || parseInt(withdrawAmount) > walletCustomer.walletBalance}
                className="w-full bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                🔄 Xử lý rút
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Tổng nạp hôm nay', value: fmt(walletTxns.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0)), color: 'text-green-600' },
              { label: 'Tổng rút hôm nay', value: fmt(Math.abs(walletTxns.filter(t => t.type === 'withdraw').reduce((s, t) => s + t.amount, 0))), color: 'text-red-600' },
              { label: 'Số lượng giao dịch', value: walletTxns.length, color: 'text-[#1a3a5c]' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Transaction log */}
          {walletTxns.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">📋 Giao dịch gần đây</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      {['Ngày', 'Khách hàng', 'Loại', 'Mô tả', 'Số tiền', 'Số dư sau'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {walletTxns.slice(0, 10).map((t, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{t.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700">{t.customerName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.type === 'topup' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {t.type === 'topup' ? 'Nạp tiền' : 'Rút tiền'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{t.desc}</td>
                        <td className={`px-4 py-3 font-bold whitespace-nowrap ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {t.amount >= 0 ? '+' : ''}{fmt(t.amount)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{fmt(t.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Khuyến mãi */}
      {tab === 'promo' && (
        <div className="space-y-5">
          {/* Create promo form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4">🎁 Tạo khuyến mãi riêng</h3>
            {promoMsg && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-800 font-semibold text-sm mb-4">{promoMsg}</div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Khách hàng</label>
                <select value={promoCustomerId} onChange={e => setPromoCustomerId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Giảm giá (%)</label>
                <input value={promoDiscount} onChange={e => setPromoDiscount(e.target.value)} placeholder="VD: 10"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Chi tiêu tối thiểu</label>
                <input type="number" value={promoMinSpend} onChange={e => setPromoMinSpend(e.target.value)} placeholder="VD: 500000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Hiệu lực đến</label>
                <input type="date" value={promoUntil} onChange={e => setPromoUntil(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Ghi chú</label>
                <input value={promoNote} onChange={e => setPromoNote(e.target.value)} placeholder="VD: Sinh nhật, Khách VIP..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <button onClick={handleCreatePromo}
              className="mt-4 bg-[#1a3a5c] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#14304d] transition-colors">
              🎁 Tạo khuyến mãi
            </button>
          </div>

          {/* Active promotions list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">📋 Danh sách khuyến mãi ({promoList.length})</h3>
            </div>
            {voucherMsg && (
              <div className="mx-5 mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-blue-800 font-semibold text-sm">{voucherMsg}</div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {['Khách hàng', 'Giảm giá', 'Chi tiêu tối thiểu', 'Hiệu lực đến', 'Đã dùng', 'Trạng thái', 'Ghi chú', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {promoList.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">{p.customer}</td>
                      <td className="px-4 py-3 font-bold text-rose-600">{p.discount}</td>
                      <td className="px-4 py-3 text-gray-600">{fmt(p.minSpend)}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.validUntil}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{p.usedCount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.status === 'active' ? 'Đang hoạt động' : 'Hết hạn'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.note || '—'}</td>
                      <td className="px-4 py-3">
                        {p.status === 'active' && (
                          <button onClick={() => {
                            setVoucherMsg(`✅ Đã gửi voucher ${p.discount} đến ${p.customer}`);
                            setTimeout(() => setVoucherMsg(''), 3000);
                          }}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-100 whitespace-nowrap">
                            Gửi voucher
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tier-based auto promotions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">⚙️ Khuyến mãi tự động theo hạng</h3>
              <p className="text-xs text-gray-400 mt-0.5">Áp dụng tự động cho tất cả khách hàng theo hạng thành viên</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    {['Hạng thành viên', 'Giảm giá', 'Điều kiện'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TIER_AUTO.map(t => (
                    <tr key={t.tier} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TIER_COLOR[t.tier.toLowerCase()]}`}>{t.tier}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-rose-600">{t.discount}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{t.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
