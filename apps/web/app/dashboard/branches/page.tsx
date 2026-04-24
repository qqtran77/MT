'use client';
import { useEffect, useState } from 'react';

const MOCK_BRANCHES = [
  { id:'1', name:'Khách sạn Grand Q.1', type:'hotel', address:'123 Nguyễn Huệ, Q.1, TP.HCM', manager:'Trần Văn Minh', phone:'028-1234-5678', status:'active', staffCount:24, monthlyRevenue:285000000, openDate:'2020-03-15', rooms:45, rating:4.8 },
  { id:'2', name:'Khách sạn Riverside Q.4', type:'hotel', address:'56 Bến Vân Đồn, Q.4, TP.HCM', manager:'Lê Thị Hoa', phone:'028-2345-6789', status:'active', staffCount:18, monthlyRevenue:198000000, openDate:'2021-06-01', rooms:32, rating:4.6 },
  { id:'3', name:'Cafe CKD Q.3', type:'cafe', address:'88 Võ Văn Tần, Q.3, TP.HCM', manager:'Nguyễn Thị Lan', phone:'028-3456-7890', status:'active', staffCount:8, monthlyRevenue:95000000, openDate:'2019-11-20', rooms:20, rating:4.7 },
  { id:'4', name:'Cafe CKD Q.7', type:'cafe', address:'200 Nguyễn Thị Thập, Q.7, TP.HCM', manager:'Phạm Văn Đức', phone:'028-4567-8901', status:'active', staffCount:6, monthlyRevenue:72000000, openDate:'2022-01-10', rooms:15, rating:4.5 },
  { id:'5', name:'Rạp CKD Q.7', type:'cinema', address:'Crescent Mall, Q.7, TP.HCM', manager:'Hoàng Minh Tuấn', phone:'028-5678-9012', status:'active', staffCount:15, monthlyRevenue:165000000, openDate:'2021-09-15', rooms:7, rating:4.9 },
  { id:'6', name:'Rạp CKD Bình Thạnh', type:'cinema', address:'Vincom Mega Mall, Bình Thạnh, TP.HCM', manager:'Vũ Thị Thu', phone:'028-6789-0123', status:'inactive', staffCount:0, monthlyRevenue:0, openDate:'2023-12-01', rooms:5, rating:0 },
];

const TYPE_LABEL: Record<string, string> = { hotel: 'Khách sạn', cafe: 'Cafe', cinema: 'Rạp chiếu phim' };
const TYPE_ICON: Record<string, string> = { hotel: '🏨', cafe: '☕', cinema: '🎬' };
const TYPE_COLOR: Record<string, string> = {
  hotel: 'bg-blue-100 text-blue-700 border-blue-200',
  cafe: 'bg-green-100 text-green-700 border-green-200',
  cinema: 'bg-purple-100 text-purple-700 border-purple-200',
};
const TYPE_BORDER: Record<string, string> = {
  hotel: 'border-l-blue-500',
  cafe: 'border-l-green-500',
  cinema: 'border-l-purple-500',
};

function fmtRevenue(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

const EMPTY_FORM = { name: '', type: 'hotel', address: '', manager: '', phone: '', status: 'active' };

export default function BranchesPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [branches, setBranches] = useState(MOCK_BRANCHES);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : null;
      setAuthorized(user?.role === 'admin');
    } catch {
      setAuthorized(false);
    }
  }, []);

  if (authorized === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-300 border-t-[#1a3a5c] rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-bold text-gray-700">Không có quyền truy cập</h2>
        <p className="text-gray-400 text-sm">Trang này chỉ dành cho quản trị viên (Admin).</p>
      </div>
    );
  }

  const filtered = branches.filter(b => {
    if (filterType !== 'all' && b.type !== filterType) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    return true;
  });

  const totalStaff = branches.reduce((s, b) => s + b.staffCount, 0);
  const totalRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);
  const activeCount = branches.filter(b => b.status === 'active').length;

  function handleAdd() {
    if (!form.name.trim() || !form.address.trim() || !form.manager.trim()) {
      alert('Vui lòng điền đầy đủ tên, địa chỉ và tên quản lý.');
      return;
    }
    const newBranch = {
      id: String(Date.now()),
      name: form.name,
      type: form.type,
      address: form.address,
      manager: form.manager,
      phone: form.phone,
      status: form.status,
      staffCount: 0,
      monthlyRevenue: 0,
      openDate: new Date().toISOString().slice(0, 10),
      rooms: 0,
      rating: 0,
    };
    setBranches(prev => [newBranch, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  return (
    <div className="space-y-5">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">🏢 Quản lý Chi Nhánh</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition"
        >
          {showForm ? '✕ Đóng' : '+ Thêm Chi Nhánh'}
        </button>
      </div>

      {/* Inline add form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">➕ Thêm chi nhánh mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Tên chi nhánh *</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="VD: Cafe CKD Tân Bình"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Loại hình</label>
              <select
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="hotel">🏨 Khách sạn</option>
                <option value="cafe">☕ Cafe</option>
                <option value="cinema">🎬 Rạp chiếu phim</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Địa chỉ *</label>
              <input
                value={form.address}
                onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                placeholder="VD: 45 Đường ABC, Q.X, TP.HCM"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Tên quản lý *</label>
              <input
                value={form.manager}
                onChange={e => setForm(p => ({ ...p, manager: e.target.value }))}
                placeholder="VD: Nguyễn Văn A"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Số điện thoại</label>
              <input
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="VD: 028-1234-5678"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Trạng thái</label>
              <select
                value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm ngừng</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              💾 Lưu chi nhánh
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <p className="text-2xl font-bold text-[#1a3a5c]">{branches.length}</p>
          <p className="text-xs text-gray-500 mt-1">Tổng chi nhánh</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          <p className="text-xs text-gray-500 mt-1">Đang hoạt động</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
          <p className="text-2xl font-bold text-purple-600">{totalStaff}</p>
          <p className="text-xs text-gray-500 mt-1">Tổng nhân viên</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
          <p className="text-2xl font-bold text-amber-600">{(totalRevenue / 1e6).toFixed(0)}M</p>
          <p className="text-xs text-gray-500 mt-1">Doanh thu/tháng</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-semibold text-gray-600">Lọc theo:</span>
        <div className="flex gap-2">
          {(['all', 'hotel', 'cafe', 'cinema'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === t
                  ? 'bg-[#1a3a5c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'Tất cả loại' : `${TYPE_ICON[t]} ${TYPE_LABEL[t]}`}
            </button>
          ))}
        </div>
        <div className="w-px h-6 bg-gray-200 hidden sm:block" />
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === s
                  ? 'bg-[#1a3a5c] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'Tất cả trạng thái' : s === 'active' ? '● Hoạt động' : '○ Tạm ngừng'}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} chi nhánh</span>
      </div>

      {/* Branch cards grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
          Không tìm thấy chi nhánh phù hợp
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(b => {
            const isExpanded = expandedId === b.id;
            return (
              <div
                key={b.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${TYPE_BORDER[b.type]} overflow-hidden transition-all`}
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl">{TYPE_ICON[b.type]}</span>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight">{b.name}</h3>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${TYPE_COLOR[b.type]}`}>
                      {TYPE_LABEL[b.type]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <span>📍</span><span>{b.address}</span>
                  </p>
                </div>

                {/* Card body */}
                <div className="px-5 pb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 text-xs">Quản lý:</span>
                    <span className="font-semibold text-gray-700 text-xs">{b.manager}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 text-xs">Nhân viên:</span>
                    <span className="font-semibold text-gray-700 text-xs">{b.staffCount} người</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 text-xs">Doanh thu/tháng:</span>
                    <span className="font-bold text-green-600 text-xs">{fmtRevenue(b.monthlyRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 text-xs">Trạng thái:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {b.status === 'active' ? '● Đang hoạt động' : '○ Tạm ngừng'}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Điện thoại:</span>
                        <span className="text-gray-600">{b.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Ngày khai trương:</span>
                        <span className="text-gray-600">{new Date(b.openDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{b.type === 'hotel' ? 'Số phòng:' : b.type === 'cinema' ? 'Số phòng chiếu:' : 'Sức chứa (bàn):'}</span>
                        <span className="text-gray-600">{b.rooms}</span>
                      </div>
                      {b.rating > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Đánh giá:</span>
                          <span className="text-amber-600 font-semibold">⭐ {b.rating}/5</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card actions */}
                <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 bg-[#1a3a5c] text-white text-xs py-1.5 rounded-lg font-semibold hover:bg-[#152e4a] transition">
                    ✏️ Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : b.id)}
                    className="flex-1 bg-gray-100 text-gray-600 text-xs py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    {isExpanded ? '▲ Thu gọn' : '▼ Xem chi tiết'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
