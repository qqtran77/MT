'use client';
import { useEffect, useState } from 'react';

// ─── API helpers ──────────────────────────────────────────────────────────────
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

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_STAFF = [
  { _id: '1', employeeCode: 'NV001', fullName: 'Nguyễn Văn An', employeeType: 'full-time', position: 'Trưởng ca', baseSalary: 8000000, branchId: 'CN01', isActive: true, email: 'an@mt.vn', phone: '0901000001', startDate: '2023-01-15' },
  { _id: '2', employeeCode: 'NV002', fullName: 'Trần Thị Bích', employeeType: 'full-time', position: 'Nhân viên phục vụ', baseSalary: 8000000, branchId: 'CN01', isActive: true, email: 'bich@mt.vn', phone: '0901000002', startDate: '2023-03-10' },
  { _id: '3', employeeCode: 'NV003', fullName: 'Lê Hoàng Nam', employeeType: 'part-time', position: 'Nhân viên pha chế', baseSalary: 4500000, branchId: 'CN01', isActive: true, email: 'nam@mt.vn', phone: '0901000003', startDate: '2023-06-01' },
  { _id: '4', employeeCode: 'NV004', fullName: 'Phạm Thị Lan', employeeType: 'part-time', position: 'Nhân viên phục vụ', baseSalary: 4500000, branchId: 'CN02', isActive: true, email: 'lan@mt.vn', phone: '0901000004', startDate: '2023-08-20' },
  { _id: '5', employeeCode: 'NV005', fullName: 'Hoàng Văn Minh', employeeType: 'full-time', position: 'Quản lý', baseSalary: 12000000, branchId: 'CN02', isActive: false, email: 'minh@mt.vn', phone: '0901000005', startDate: '2022-11-01' },
];

const MOCK_ATTENDANCE = [
  { staffId: '1', name: 'Nguyễn Văn An', type: 'full-time', standardDays: 26, actualDays: 24, absentDays: 2, lateCount: 1, otHours: 8 },
  { staffId: '2', name: 'Trần Thị Bích', type: 'full-time', standardDays: 26, actualDays: 26, absentDays: 0, lateCount: 0, otHours: 12 },
  { staffId: '3', name: 'Lê Hoàng Nam', type: 'part-time', standardDays: 13, actualDays: 12, absentDays: 1, lateCount: 2, otHours: 0 },
  { staffId: '4', name: 'Phạm Thị Lan', type: 'part-time', standardDays: 13, actualDays: 13, absentDays: 0, lateCount: 0, otHours: 4 },
  { staffId: '5', name: 'Hoàng Văn Minh', type: 'full-time', standardDays: 26, actualDays: 25, absentDays: 1, lateCount: 3, otHours: 6 },
];

const TIPS_MOCK: Record<string, number> = { '1': 650000, '2': 420000, '3': 200000, '4': 780000, '5': 310000 };
const BONUS_MOCK: Record<string, number> = { '1': 500000, '2': 0, '3': 0, '4': 200000, '5': 300000 };
const DEDUCT_MOCK: Record<string, number> = { '1': 0, '2': 0, '3': 100000, '4': 0, '5': 200000 };

function buildSalaryRows(attendance: typeof MOCK_ATTENDANCE) {
  return attendance.map(a => {
    const base = a.type === 'full-time' ? 8000000 : 4500000;
    const actual = Math.round(base * (a.actualDays / a.standardDays));
    return {
      staffId: a.staffId,
      name: a.name,
      type: a.type,
      baseSalary: base,
      actualDays: a.actualDays,
      standardDays: a.standardDays,
      actualSalary: actual,
      tips: TIPS_MOCK[a.staffId] ?? 0,
      bonus: BONUS_MOCK[a.staffId] ?? 0,
      deduct: DEDUCT_MOCK[a.staffId] ?? 0,
      total: actual + (TIPS_MOCK[a.staffId] ?? 0) + (BONUS_MOCK[a.staffId] ?? 0) - (DEDUCT_MOCK[a.staffId] ?? 0),
      paid: false,
    };
  });
}

const MOCK_EQUIPMENT = [
  { id: '1', room: 'Phòng 201', device: 'Điều hòa', severity: 'medium', desc: 'Không mát', status: 'pending', reportedAt: '2024-05-20 09:30', reportedBy: 'Nguyễn Văn An' },
  { id: '2', room: 'Phòng 305', device: 'TV', severity: 'low', desc: 'Mất tiếng', status: 'in_progress', reportedAt: '2024-05-19 14:00', reportedBy: 'Trần Thị Bích' },
  { id: '3', room: 'Bàn B05', device: 'Ổ điện', severity: 'high', desc: 'Chập điện', status: 'completed', reportedAt: '2024-05-18 11:00', reportedBy: 'Lê Hoàng Nam' },
];

const MOCK_CLEANING = [
  { id: '1', room: 'Phòng 101', type: 'full', note: 'Khách vừa check-out', status: 'pending', requestedAt: '2024-05-20 10:00' },
  { id: '2', room: 'Bàn A03', type: 'quick', note: '', status: 'completed', requestedAt: '2024-05-20 09:00' },
  { id: '3', room: 'Phòng 205', type: 'after_guest', note: 'Dọn kỹ', status: 'in_progress', requestedAt: '2024-05-20 08:30' },
];

const MOCK_GUESTS = [
  { room: 'Phòng 201', guest: 'Nguyễn Văn A', checkOut: '12:00', minutesLeft: 25, notified: false },
  { room: 'Phòng 305', guest: 'Trần Văn B', checkOut: '14:00', minutesLeft: 45, notified: true },
  { room: 'Phòng 102', guest: 'Lê Thị C', checkOut: '11:30', minutesLeft: 10, notified: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const fmtM = (n: number) => (n / 1e6).toFixed(1) + 'M';

const currentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

type Tab = 'staff' | 'attendance' | 'salary' | 'report';

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StaffPage() {
  const [tab, setTab] = useState<Tab>('staff');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'staff', label: 'Danh sách NV' },
    { key: 'attendance', label: 'Chấm công tháng' },
    { key: 'salary', label: 'Lương & Tips' },
    { key: 'report', label: 'Báo cáo NV' },
  ];

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-[#1a3a5c] text-white shadow' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'staff' && <Tab1Staff />}
      {tab === 'attendance' && <Tab2Attendance />}
      {tab === 'salary' && <Tab3Salary />}
      {tab === 'report' && <Tab4Report />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 – Danh sách NV
// ═══════════════════════════════════════════════════════════════════════════════
function Tab1Staff() {
  const [staff, setStaff] = useState<any[]>(MOCK_STAFF);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', employeeCode: '', position: '',
    employeeType: 'full-time', baseSalary: '', branchId: '', startDate: '',
  });

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const branchParam = user.role !== 'admin' && user.branchId ? `?branchId=${user.branchId}` : '';

  useEffect(() => {
    apiFetch(`/staff${branchParam}`).then(d => { if (Array.isArray(d) && d.length) setStaff(d); }).catch(() => {});
  }, []);

  const reload = () => apiFetch(`/staff${branchParam}`).then(d => { if (Array.isArray(d) && d.length) setStaff(d); }).catch(() => {});

  async function handleSave() {
    if (!form.fullName) { alert('Vui lòng nhập họ tên'); return; }
    setSaving(true);
    try {
      await apiFetch('/staff', { method: 'POST', body: JSON.stringify({ ...form, baseSalary: Number(form.baseSalary) || 0 }) });
      await reload();
    } catch {
      // optimistic add to local
      setStaff(prev => [...prev, { _id: String(Date.now()), ...form, baseSalary: Number(form.baseSalary) || 0, isActive: true }]);
    }
    setSaving(false);
    setShowForm(false);
    setForm({ fullName: '', email: '', phone: '', employeeCode: '', position: '', employeeType: 'full-time', baseSalary: '', branchId: '', startDate: '' });
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      await apiFetch(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !current }) });
      await reload();
    } catch {
      setStaff(prev => prev.map(s => s._id === id ? { ...s, isActive: !current } : s));
    }
  }

  const filtered = staff.filter(s =>
    !search ||
    s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
    s.position?.toLowerCase().includes(search.toLowerCase())
  );

  const ftCount = staff.filter(s => s.employeeType === 'full-time').length;
  const ptCount = staff.filter(s => s.employeeType === 'part-time').length;
  const activeToday = staff.filter(s => s.isActive !== false).length;

  return (
    <div className="space-y-5">
      {/* Search + Add */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center justify-between">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm tên, mã NV, chức vụ..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition"
        >
          {showForm ? 'Đóng' : '+ Thêm NV'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Tổng NV', value: staff.length, color: 'text-[#1a3a5c]' },
          { label: 'Full-time', value: ftCount, color: 'text-blue-600' },
          { label: 'Part-time', value: ptCount, color: 'text-yellow-600' },
          { label: 'Đang làm hôm nay', value: activeToday, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Thêm nhân viên mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Họ và tên *', key: 'fullName', placeholder: 'Nguyễn Văn A' },
              { label: 'Email', key: 'email', placeholder: 'nv@mt.vn', type: 'email' },
              { label: 'Số điện thoại', key: 'phone', placeholder: '0901234567' },
              { label: 'Mã nhân viên', key: 'employeeCode', placeholder: 'NV006' },
              { label: 'Chức vụ', key: 'position', placeholder: 'Nhân viên phục vụ' },
              { label: 'Lương cơ bản (đ)', key: 'baseSalary', placeholder: '8000000', type: 'number' },
              { label: 'Chi nhánh', key: 'branchId', placeholder: 'CN01' },
              { label: 'Ngày bắt đầu', key: 'startDate', type: 'date' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Loại nhân viên</label>
              <select
                value={form.employeeType}
                onChange={e => setForm(p => ({ ...p, employeeType: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} disabled={saving}
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition">
              {saving ? 'Đang lưu...' : 'Lưu nhân viên'}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-200 transition">Huỷ</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Danh sách nhân viên ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Mã NV', 'Họ tên', 'Loại', 'Chức vụ', 'Lương CB', 'Chi nhánh', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">Chưa có nhân viên nào</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s._id || i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-purple-700">{s.employeeCode || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#1a3a5c] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {s.fullName?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800 whitespace-nowrap">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                      s.employeeType === 'full-time' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {s.employeeType === 'full-time' ? 'Full-time' : 'Part-time'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.position || 'Nhân viên'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{s.baseSalary ? fmtM(s.baseSalary) : '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.branchId || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      s.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {s.isActive !== false ? 'Đang làm' : 'Đã nghỉ'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(s._id, s.isActive !== false)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition whitespace-nowrap ${
                        s.isActive !== false ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {s.isActive !== false ? 'Cho nghỉ' : 'Kích hoạt'}
                    </button>
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

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 – Chấm công tháng
// ═══════════════════════════════════════════════════════════════════════════════
function Tab2Attendance() {
  const [month, setMonth] = useState(currentMonth());
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [clockForm, setClockForm] = useState({ date: '', checkIn: '', checkOut: '', note: '' });

  useEffect(() => {
    apiFetch(`/attendance?month=${month}`)
      .then(d => { if (Array.isArray(d) && d.length) setAttendance(d); })
      .catch(() => {});
  }, [month]);

  function handleClock(staffId: string) {
    if (!clockForm.date || !clockForm.checkIn) { alert('Vui lòng chọn ngày và giờ vào'); return; }
    // optimistic update
    setAttendance(prev => prev.map(a =>
      a.staffId === staffId ? { ...a, actualDays: a.actualDays + 1 } : a
    ));
    setOpenRow(null);
    setClockForm({ date: '', checkIn: '', checkOut: '', note: '' });
  }

  const totalWorking = attendance.filter(a => a.actualDays > 0).length;
  const totalDays = attendance.reduce((s, a) => s + a.actualDays, 0);
  const totalOT = attendance.reduce((s, a) => s + a.otHours, 0);

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600">Tháng:</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tổng NV đi làm hôm nay', value: totalWorking, color: 'text-[#1a3a5c]' },
          { label: 'Tổng ngày công tháng', value: totalDays, color: 'text-green-600' },
          { label: 'Tổng giờ OT', value: totalOT + 'h', color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Bảng chấm công — Tháng {month}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Họ tên', 'Loại NV', 'Ngày công chuẩn', 'Ngày công thực tế', 'Ngày nghỉ', 'Đi trễ', 'OT (giờ)', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendance.map(a => (
                <>
                  <tr key={a.staffId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{a.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        a.type === 'full-time' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{a.type}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{a.standardDays}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${a.actualDays < a.standardDays ? 'text-red-500' : 'text-green-600'}`}>{a.actualDays}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={a.absentDays > 0 ? 'text-red-500 font-semibold' : 'text-gray-500'}>{a.absentDays}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={a.lateCount > 0 ? 'text-orange-500 font-semibold' : 'text-gray-500'}>{a.lateCount}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={a.otHours > 0 ? 'text-purple-600 font-semibold' : 'text-gray-500'}>{a.otHours}h</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setOpenRow(openRow === a.staffId ? null : a.staffId); setClockForm({ date: '', checkIn: '', checkOut: '', note: '' }); }}
                        className="bg-[#1a3a5c] text-white px-3 py-1 rounded text-xs font-semibold hover:bg-[#152e4a] transition whitespace-nowrap"
                      >
                        Chấm công
                      </button>
                    </td>
                  </tr>
                  {openRow === a.staffId && (
                    <tr key={a.staffId + '-form'}>
                      <td colSpan={8} className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                        <div className="flex flex-wrap gap-3 items-end">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Ngày</label>
                            <input type="date" value={clockForm.date} onChange={e => setClockForm(p => ({ ...p, date: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Giờ vào</label>
                            <input type="time" value={clockForm.checkIn} onChange={e => setClockForm(p => ({ ...p, checkIn: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Giờ ra</label>
                            <input type="time" value={clockForm.checkOut} onChange={e => setClockForm(p => ({ ...p, checkOut: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Ghi chú</label>
                            <input placeholder="Ghi chú..." value={clockForm.note} onChange={e => setClockForm(p => ({ ...p, note: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-48" />
                          </div>
                          <button onClick={() => handleClock(a.staffId)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
                            Lưu
                          </button>
                          <button onClick={() => setOpenRow(null)}
                            className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition">
                            Huỷ
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 – Lương & Tips
// ═══════════════════════════════════════════════════════════════════════════════
function Tab3Salary() {
  const [month, setMonth] = useState(currentMonth());
  const [rows, setRows] = useState(() => buildSalaryRows(MOCK_ATTENDANCE));
  const [openTips, setOpenTips] = useState<string | null>(null);
  const [openBonus, setOpenBonus] = useState<string | null>(null);
  const [tipsForm, setTipsForm] = useState({ amount: '', note: '' });
  const [bonusForm, setBonusForm] = useState({ amount: '', reason: '' });

  function markPaid(staffId: string) {
    setRows(prev => prev.map(r => r.staffId === staffId ? { ...r, paid: true } : r));
  }

  function addTips(staffId: string) {
    const amt = Number(tipsForm.amount);
    if (!amt) { alert('Nhập số tiền'); return; }
    setRows(prev => prev.map(r => r.staffId === staffId
      ? { ...r, tips: r.tips + amt, total: r.total + amt }
      : r
    ));
    setOpenTips(null);
    setTipsForm({ amount: '', note: '' });
  }

  function addBonus(staffId: string) {
    const amt = Number(bonusForm.amount);
    if (!amt) { alert('Nhập số tiền'); return; }
    setRows(prev => prev.map(r => r.staffId === staffId
      ? { ...r, bonus: r.bonus + amt, total: r.total + amt }
      : r
    ));
    setOpenBonus(null);
    setBonusForm({ amount: '', reason: '' });
  }

  const totalSalary = rows.reduce((s, r) => s + r.actualSalary, 0);
  const totalTips = rows.reduce((s, r) => s + r.tips, 0);
  const totalBonus = rows.reduce((s, r) => s + r.bonus, 0);

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-center">
        <label className="text-sm font-semibold text-gray-600">Tháng:</label>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tổng lương tháng', value: fmtM(totalSalary), color: 'text-[#1a3a5c]' },
          { label: 'Tổng tips', value: fmtM(totalTips), color: 'text-green-600' },
          { label: 'Tổng thưởng nóng', value: fmtM(totalBonus), color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Bảng lương — Tháng {month}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Họ tên', 'Lương CB', 'Ngày công', 'Lương thực', 'Tips', 'Thưởng nóng', 'Khấu trừ', 'Tổng', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="text-left px-3 py-3 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map(r => (
                <>
                  <tr key={r.staffId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 font-semibold text-gray-800 whitespace-nowrap">{r.name}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{fmtM(r.baseSalary)}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{r.actualDays}/{r.standardDays}</td>
                    <td className="px-3 py-3 font-semibold text-gray-800 whitespace-nowrap">{fmtM(r.actualSalary)}</td>
                    <td className="px-3 py-3 text-green-600 whitespace-nowrap">{fmt(r.tips)}</td>
                    <td className="px-3 py-3 text-orange-500 whitespace-nowrap">{fmt(r.bonus)}</td>
                    <td className="px-3 py-3 text-red-500 whitespace-nowrap">{r.deduct > 0 ? `-${fmt(r.deduct)}` : '—'}</td>
                    <td className="px-3 py-3 font-bold text-[#1a3a5c] whitespace-nowrap">{fmtM(r.total)}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        r.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {r.paid ? 'Đã trả' : 'Chưa trả'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {!r.paid && (
                          <button onClick={() => markPaid(r.staffId)}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-700 transition whitespace-nowrap">
                            Trả lương
                          </button>
                        )}
                        <button onClick={() => { setOpenTips(openTips === r.staffId ? null : r.staffId); setOpenBonus(null); setTipsForm({ amount: '', note: '' }); }}
                          className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold hover:bg-blue-100 transition whitespace-nowrap">
                          + Tips
                        </button>
                        <button onClick={() => { setOpenBonus(openBonus === r.staffId ? null : r.staffId); setOpenTips(null); setBonusForm({ amount: '', reason: '' }); }}
                          className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-semibold hover:bg-orange-100 transition whitespace-nowrap">
                          + Thưởng
                        </button>
                      </div>
                    </td>
                  </tr>
                  {openTips === r.staffId && (
                    <tr key={r.staffId + '-tips'}>
                      <td colSpan={10} className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                        <div className="flex flex-wrap gap-3 items-end">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Số tiền tips (đ)</label>
                            <input type="number" placeholder="200000" value={tipsForm.amount} onChange={e => setTipsForm(p => ({ ...p, amount: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-36" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Ghi chú</label>
                            <input placeholder="Ghi chú..." value={tipsForm.note} onChange={e => setTipsForm(p => ({ ...p, note: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-48" />
                          </div>
                          <button onClick={() => addTips(r.staffId)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Thêm tips</button>
                          <button onClick={() => setOpenTips(null)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition">Huỷ</button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {openBonus === r.staffId && (
                    <tr key={r.staffId + '-bonus'}>
                      <td colSpan={10} className="px-6 py-3 bg-orange-50 border-t border-orange-100">
                        <div className="flex flex-wrap gap-3 items-end">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Số tiền thưởng (đ)</label>
                            <input type="number" placeholder="500000" value={bonusForm.amount} onChange={e => setBonusForm(p => ({ ...p, amount: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-36" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Lý do</label>
                            <input placeholder="Lý do thưởng..." value={bonusForm.reason} onChange={e => setBonusForm(p => ({ ...p, reason: e.target.value }))}
                              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-48" />
                          </div>
                          <button onClick={() => addBonus(r.staffId)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition">Thêm thưởng</button>
                          <button onClick={() => setOpenBonus(null)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition">Huỷ</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4 – Báo cáo NV
// ═══════════════════════════════════════════════════════════════════════════════
function Tab4Report() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EquipmentSection />
        <CleaningSection />
      </div>
      <GuestAlertSection />
    </div>
  );
}

// ── Equipment Reports ──────────────────────────────────────────────────────────
function EquipmentSection() {
  const [reports, setReports] = useState(MOCK_EQUIPMENT);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ room: '', device: '', severity: 'low', desc: '', photo: '' });

  function addReport() {
    if (!form.room || !form.device) { alert('Vui lòng nhập phòng và tên thiết bị'); return; }
    setReports(prev => [...prev, {
      id: String(Date.now()), ...form, status: 'pending',
      reportedAt: new Date().toLocaleString('vi-VN'), reportedBy: 'Bạn',
    }]);
    setShowForm(false);
    setForm({ room: '', device: '', severity: 'low', desc: '', photo: '' });
  }

  const severityLabel: Record<string, string> = { low: 'Nhẹ', medium: 'Trung bình', high: 'Nghiêm trọng' };
  const severityColor: Record<string, string> = { low: 'bg-yellow-100 text-yellow-700', medium: 'bg-orange-100 text-orange-700', high: 'bg-red-100 text-red-700' };
  const statusLabel: Record<string, string> = { pending: 'Chờ xử lý', in_progress: 'Đang sửa', completed: 'Hoàn thành' };
  const statusColor: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Báo cáo thiết bị hư hỏng</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#152e4a] transition">
          {showForm ? 'Đóng' : '+ Báo cáo'}
        </button>
      </div>

      {showForm && (
        <div className="p-5 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Phòng / Khu vực</label>
              <input placeholder="Phòng 201, Bàn A03..." value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Tên thiết bị</label>
              <input placeholder="Điều hòa, TV..." value={form.device} onChange={e => setForm(p => ({ ...p, device: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Mức độ</label>
              <select value={form.severity} onChange={e => setForm(p => ({ ...p, severity: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="low">Nhẹ</option>
                <option value="medium">Trung bình</option>
                <option value="high">Nghiêm trọng</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Ảnh</label>
              <input type="file" accept="image/*"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Mô tả</label>
            <textarea placeholder="Mô tả chi tiết..." value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
              rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={addReport} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">Gửi báo cáo</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition">Huỷ</button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {reports.map(r => (
          <div key={r.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 text-sm">{r.room}</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-gray-700 text-sm">{r.device}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${severityColor[r.severity]}`}>{severityLabel[r.severity]}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.reportedAt} · {r.reportedBy}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${statusColor[r.status]}`}>
                {statusLabel[r.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Cleaning Requests ──────────────────────────────────────────────────────────
function CleaningSection() {
  const [requests, setRequests] = useState(MOCK_CLEANING);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ room: '', type: 'full', note: '' });

  function addRequest() {
    if (!form.room) { alert('Vui lòng chọn phòng/bàn'); return; }
    setRequests(prev => [...prev, {
      id: String(Date.now()), ...form, status: 'pending',
      requestedAt: new Date().toLocaleString('vi-VN'),
    }]);
    setShowForm(false);
    setForm({ room: '', type: 'full', note: '' });
  }

  const typeLabel: Record<string, string> = { full: 'Toàn bộ', quick: 'Nhanh', after_guest: 'Sau khách' };
  const statusLabel: Record<string, string> = { pending: 'Chờ', in_progress: 'Đang dọn', completed: 'Xong' };
  const statusColor: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Yêu cầu dọn vệ sinh</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#152e4a] transition">
          {showForm ? 'Đóng' : '+ Yêu cầu'}
        </button>
      </div>

      {showForm && (
        <div className="p-5 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Phòng / Bàn</label>
              <input placeholder="Phòng 101, Bàn A03..." value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Loại dọn</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="full">Toàn bộ</option>
                <option value="quick">Nhanh</option>
                <option value="after_guest">Sau khách</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-600 block mb-1">Ghi chú</label>
            <input placeholder="Ghi chú..." value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="flex gap-2">
            <button onClick={addRequest} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Gửi yêu cầu</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition">Huỷ</button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {requests.map(r => (
          <div key={r.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 text-sm">{r.room}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600`}>{typeLabel[r.type]}</span>
                </div>
                {r.note && <p className="text-xs text-gray-500 mt-0.5">{r.note}</p>}
                <p className="text-xs text-gray-400 mt-0.5">{r.requestedAt}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${statusColor[r.status]}`}>
                {statusLabel[r.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Guest Alerts ───────────────────────────────────────────────────────────────
function GuestAlertSection() {
  const [guests, setGuests] = useState(
    [...MOCK_GUESTS].sort((a, b) => a.minutesLeft - b.minutesLeft)
  );

  function notify(room: string) {
    setGuests(prev => prev.map(g => g.room === room ? { ...g, notified: true } : g));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">Cảnh báo hết giờ khách</h3>
        <p className="text-xs text-gray-400 mt-0.5">Sắp xếp theo thời gian còn lại tăng dần</p>
      </div>
      <div className="divide-y divide-gray-50">
        {guests.map(g => {
          const isRed = g.minutesLeft < 30;
          const isYellow = g.minutesLeft >= 30 && g.minutesLeft <= 60;
          const alertColor = isRed ? 'bg-red-50 border-l-4 border-red-400' : isYellow ? 'bg-yellow-50 border-l-4 border-yellow-400' : '';
          return (
            <div key={g.room} className={`px-5 py-3 flex items-center justify-between gap-4 transition-colors hover:bg-gray-50 ${alertColor}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800 text-sm">{g.room}</span>
                  <span className="text-gray-500 text-sm">—</span>
                  <span className="text-gray-700 text-sm">{g.guest}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">Check-out: {g.checkOut}</span>
                  <span className={`text-xs font-bold ${isRed ? 'text-red-600' : isYellow ? 'text-yellow-600' : 'text-gray-500'}`}>
                    Còn {g.minutesLeft} phút
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {g.notified ? (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">Đã nhắc</span>
                ) : (
                  <button onClick={() => notify(g.room)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold text-white transition whitespace-nowrap ${
                      isRed ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}>
                    Gửi nhắc
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
