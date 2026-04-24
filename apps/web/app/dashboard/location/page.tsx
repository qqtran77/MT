'use client';
import { useEffect, useState } from 'react';

const MOCK_BRANCHES = [
  {
    id: '1', name: 'Khách sạn Grand Q.1', type: 'hotel', status: 'active',
    address: '123 Nguyễn Huệ', district: 'Quận 1', city: 'TP.HCM',
    phone: '028-1234-5678', email: 'grand@ckd.vn',
    openTime: '06:00', closeTime: '23:00',
    manager: 'Trần Văn Minh', managerPhone: '0901-234-567',
    openDate: '2020-03-15', totalRooms: 45, rating: 4.8,
    todayGuests: 12, todayBookings: 5, todayRevenue: 8500000,
    weekRevenue: 52000000, weekTransactions: 34, totalActiveStaff: 24,
    hours: [
      { day: 'Thứ 2', open: '06:00', close: '23:00', active: true },
      { day: 'Thứ 3', open: '06:00', close: '23:00', active: true },
      { day: 'Thứ 4', open: '06:00', close: '23:00', active: true },
      { day: 'Thứ 5', open: '06:00', close: '23:00', active: true },
      { day: 'Thứ 6', open: '06:00', close: '23:00', active: true },
      { day: 'Thứ 7', open: '06:00', close: '23:59', active: true },
      { day: 'CN', open: '07:00', close: '22:00', active: true },
    ],
  },
  {
    id: '2', name: 'Cafe CKD Q.3', type: 'cafe', status: 'active',
    address: '88 Võ Văn Tần', district: 'Quận 3', city: 'TP.HCM',
    phone: '028-3456-7890', email: 'cafe.q3@ckd.vn',
    openTime: '07:00', closeTime: '22:00',
    manager: 'Nguyễn Thị Lan', managerPhone: '0903-456-789',
    openDate: '2019-11-20', totalRooms: 20, rating: 4.7,
    todayGuests: 45, todayBookings: 20, todayRevenue: 1850000,
    weekRevenue: 12500000, weekTransactions: 120, totalActiveStaff: 8,
    hours: [
      { day: 'Thứ 2', open: '07:00', close: '22:00', active: true },
      { day: 'Thứ 3', open: '07:00', close: '22:00', active: true },
      { day: 'Thứ 4', open: '07:00', close: '22:00', active: true },
      { day: 'Thứ 5', open: '07:00', close: '22:00', active: true },
      { day: 'Thứ 6', open: '07:00', close: '22:30', active: true },
      { day: 'Thứ 7', open: '07:00', close: '23:00', active: true },
      { day: 'CN', open: '08:00', close: '21:00', active: true },
    ],
  },
  {
    id: '3', name: 'Rạp CKD Q.7', type: 'cinema', status: 'active',
    address: 'Crescent Mall, đường Tôn Dật Tiên', district: 'Quận 7', city: 'TP.HCM',
    phone: '028-5678-9012', email: 'cinema.q7@ckd.vn',
    openTime: '09:00', closeTime: '23:30',
    manager: 'Hoàng Minh Tuấn', managerPhone: '0905-678-901',
    openDate: '2021-09-15', totalRooms: 7, rating: 4.9,
    todayGuests: 280, todayBookings: 65, todayRevenue: 6500000,
    weekRevenue: 45000000, weekTransactions: 420, totalActiveStaff: 15,
    hours: [
      { day: 'Thứ 2', open: '09:00', close: '23:30', active: true },
      { day: 'Thứ 3', open: '09:00', close: '23:30', active: true },
      { day: 'Thứ 4', open: '09:00', close: '23:30', active: true },
      { day: 'Thứ 5', open: '09:00', close: '23:30', active: true },
      { day: 'Thứ 6', open: '09:00', close: '23:59', active: true },
      { day: 'Thứ 7', open: '08:00', close: '23:59', active: true },
      { day: 'CN', open: '08:00', close: '23:30', active: true },
    ],
  },
];

const TYPE_COLOR: Record<string, string> = {
  hotel: 'bg-blue-100 text-blue-700',
  cafe: 'bg-green-100 text-green-700',
  cinema: 'bg-purple-100 text-purple-700',
};
const TYPE_LABEL: Record<string, string> = { hotel: 'Khách sạn', cafe: 'Cafe', cinema: 'Rạp chiếu phim' };
const TYPE_ROOM_LABEL: Record<string, string> = { hotel: 'Số phòng', cafe: 'Số bàn', cinema: 'Số phòng chiếu' };

function fmt(n: number) { return n.toLocaleString('vi-VN'); }

export default function LocationPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const [editingHours, setEditingHours] = useState(false);
  const [branches, setBranches] = useState(MOCK_BRANCHES);

  // Edit form state
  const [editForm, setEditForm] = useState({ address: '', phone: '', email: '', openTime: '', closeTime: '' });
  const [editHours, setEditHours] = useState<typeof MOCK_BRANCHES[0]['hours']>([]);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      const u = JSON.parse(raw);
      setUser(u);
      if (u.role === 'admin') {
        setSelectedId(MOCK_BRANCHES[0].id);
      } else {
        const match = MOCK_BRANCHES.find(b => b.id === String(u.branchId));
        setSelectedId(match ? match.id : MOCK_BRANCHES[0].id);
      }
    } else {
      setSelectedId(MOCK_BRANCHES[0].id);
    }
  }, []);

  const role = user?.role || 'staff';
  const canEdit = role === 'admin' || role === 'branch_manager';

  const availableBranches = role === 'admin' ? MOCK_BRANCHES : MOCK_BRANCHES.filter(b => b.id === selectedId);
  const branch = MOCK_BRANCHES.find(b => b.id === selectedId) || MOCK_BRANCHES[0];

  function startEdit() {
    setEditForm({ address: branch.address, phone: branch.phone, email: branch.email, openTime: branch.openTime, closeTime: branch.closeTime });
    setEditing(true);
    setEditingHours(false);
  }
  function cancelEdit() { setEditing(false); }
  function saveEdit() {
    setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, ...editForm } : b));
    setEditing(false);
  }

  function startEditHours() {
    setEditHours(branch.hours.map(h => ({ ...h })));
    setEditingHours(true);
    setEditing(false);
  }
  function cancelEditHours() { setEditingHours(false); }
  function saveEditHours() {
    setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, hours: editHours } : b));
    setEditingHours(false);
  }

  if (!selectedId) return <div className="text-gray-400 text-center py-20">Đang tải...</div>;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Branch selector (admin only) */}
      {role === 'admin' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600 shrink-0">Chọn chi nhánh:</span>
          <select
            value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setEditing(false); setEditingHours(false); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1 max-w-xs"
          >
            {MOCK_BRANCHES.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Branch info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-800">{branch.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${TYPE_COLOR[branch.type]}`}>
                {TYPE_LABEL[branch.type]}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${branch.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                {branch.status === 'active' ? '● Đang hoạt động' : '● Tạm dừng'}
              </span>
            </div>
            <p className="text-sm text-gray-400">⭐ {branch.rating} · {TYPE_ROOM_LABEL[branch.type]}: {branch.totalRooms}</p>
          </div>
          {canEdit && !editing && (
            <button onClick={startEdit}
              className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#15304f] transition flex items-center gap-1.5">
              ✏️ Chỉnh sửa thông tin
            </button>
          )}
        </div>

        {/* Info grid */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm">
          {[
            { label: 'Địa chỉ', value: branch.address },
            { label: 'Quận/Huyện', value: branch.district },
            { label: 'Thành phố', value: branch.city },
            { label: 'Số điện thoại chi nhánh', value: branch.phone },
            { label: 'Email chi nhánh', value: branch.email },
            { label: 'Giờ mở cửa – đóng cửa', value: `${branch.openTime} – ${branch.closeTime}` },
            { label: 'Quản lý chi nhánh', value: `${branch.manager} · ${branch.managerPhone}` },
            { label: 'Ngày khai trương', value: new Date(branch.openDate).toLocaleDateString('vi-VN') },
            { label: TYPE_ROOM_LABEL[branch.type], value: String(branch.totalRooms) },
          ].map(row => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{row.label}</span>
              <span className="text-gray-800 font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="mx-6 mb-6 rounded-xl bg-gray-100 flex items-center justify-center" style={{ height: 400 }}>
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📍</div>
            <p className="text-sm font-medium">Bản đồ – {branch.address}, {branch.district}, {branch.city}</p>
          </div>
        </div>
      </div>

      {/* Inline edit form */}
      {editing && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 space-y-4">
          <h3 className="font-bold text-gray-800 text-base mb-1">✏️ Chỉnh sửa thông tin chi nhánh</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Địa chỉ</label>
              <input value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Số điện thoại</label>
              <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
              <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Giờ mở cửa</label>
              <input type="time" value={editForm.openTime} onChange={e => setEditForm(f => ({ ...f, openTime: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Giờ đóng cửa</label>
              <input type="time" value={editForm.closeTime} onChange={e => setEditForm(f => ({ ...f, closeTime: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={saveEdit} className="bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#15304f] transition">Lưu thay đổi</button>
            <button onClick={cancelEdit} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Huỷ</button>
          </div>
        </div>
      )}

      {/* Statistics card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">📊 Thống kê hoạt động</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Khách hôm nay', value: branch.todayGuests, color: 'bg-blue-50 text-blue-700', suffix: '' },
            { label: 'Đặt lịch mới', value: branch.todayBookings, color: 'bg-indigo-50 text-indigo-700', suffix: '' },
            { label: 'Doanh thu hôm nay', value: fmt(branch.todayRevenue), color: 'bg-emerald-50 text-emerald-700', suffix: 'đ' },
            { label: 'Doanh thu tuần', value: fmt(branch.weekRevenue), color: 'bg-amber-50 text-amber-700', suffix: 'đ' },
            { label: 'Giao dịch tuần', value: branch.weekTransactions, color: 'bg-orange-50 text-orange-700', suffix: '' },
            { label: 'Nhân viên đang làm', value: branch.totalActiveStaff, color: 'bg-purple-50 text-purple-700', suffix: '' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
              <p className="text-lg font-bold leading-tight">{stat.value}{stat.suffix}</p>
              <p className="text-xs mt-1 opacity-75 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Operating hours card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">🕐 Giờ hoạt động trong tuần</h3>
          {canEdit && !editingHours && (
            <button onClick={startEditHours}
              className="bg-[#1a3a5c] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#15304f] transition">
              Chỉnh sửa giờ
            </button>
          )}
        </div>

        {!editingHours ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {branch.hours.map(h => (
              <div key={h.day} className={`flex items-center justify-between rounded-xl px-4 py-3 ${h.active ? 'bg-gray-50' : 'bg-red-50'}`}>
                <span className="font-semibold text-gray-700 text-sm w-14">{h.day}</span>
                {h.active ? (
                  <span className="text-sm text-gray-600">{h.open} – {h.close}</span>
                ) : (
                  <span className="text-xs text-red-500 font-semibold">Đóng cửa</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {editHours.map((h, i) => (
              <div key={h.day} className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="font-semibold text-gray-700 text-sm w-14 shrink-0">{h.day}</span>
                <label className="flex items-center gap-1.5 text-xs text-gray-500">
                  <input type="checkbox" checked={h.active}
                    onChange={e => setEditHours(prev => prev.map((r, idx) => idx === i ? { ...r, active: e.target.checked } : r))}
                    className="rounded" />
                  Mở cửa
                </label>
                {h.active && (
                  <>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">Từ</label>
                      <input type="time" value={h.open}
                        onChange={e => setEditHours(prev => prev.map((r, idx) => idx === i ? { ...r, open: e.target.value } : r))}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-400">Đến</label>
                      <input type="time" value={h.close}
                        onChange={e => setEditHours(prev => prev.map((r, idx) => idx === i ? { ...r, close: e.target.value } : r))}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                  </>
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={saveEditHours} className="bg-[#1a3a5c] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#15304f] transition">Lưu giờ hoạt động</button>
              <button onClick={cancelEditHours} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Huỷ</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
