'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
async function apiFetch(path: string, opts?: any) {
  const token = localStorage.getItem('auth_token');
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...opts });
  const json = await res.json();
  return json?.data ?? json;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', position:'', baseSalary:'', branchId:'', employeeCode:'' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await apiFetch('/staff').catch(() => []);
    setStaff(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.fullName || !form.branchId) { alert('Vui lòng điền đầy đủ họ tên và chi nhánh'); return; }
    setSaving(true);
    await apiFetch('/staff', { method: 'POST', body: JSON.stringify({ ...form, baseSalary: Number(form.baseSalary) || 0 }) }).catch(console.error);
    setSaving(false);
    setShowForm(false);
    setForm({ fullName:'', email:'', phone:'', position:'', baseSalary:'', branchId:'', employeeCode:'' });
    load();
  }

  async function toggleActive(id: string, current: boolean) {
    await apiFetch(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !current }) });
    load();
  }

  const filtered = staff.filter(s => !search || s.fullName?.toLowerCase().includes(search.toLowerCase()) || s.employeeCode?.includes(search) || s.position?.includes(search));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center justify-between">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm tên, mã NV, chức vụ..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-300" />
        <button onClick={() => setShowForm(!showForm)}
          className="bg-[#1a3a5c] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition">
          {showForm ? '✕ Đóng' : '+ Thêm nhân viên'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">➕ Thêm nhân viên mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label:'Họ và tên *', key:'fullName', placeholder:'Nguyễn Văn A' },
              { label:'Email', key:'email', placeholder:'nv@ckd.vn' },
              { label:'Số điện thoại', key:'phone', placeholder:'0901234567' },
              { label:'Mã nhân viên', key:'employeeCode', placeholder:'NV001' },
              { label:'Chức vụ', key:'position', placeholder:'Nhân viên phục vụ' },
              { label:'Lương cơ bản (đ)', key:'baseSalary', placeholder:'8000000' },
              { label:'Chi nhánh ID *', key:'branchId', placeholder:'ID chi nhánh từ /dashboard/branches' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">{f.label}</label>
                <input value={(form as any)[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving}
              className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition">
              {saving ? 'Đang lưu...' : '💾 Lưu nhân viên'}
            </button>
            <button onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-200 transition">Huỷ</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-[#1a3a5c]">{staff.length}</p>
          <p className="text-sm text-gray-500 mt-1">Tổng nhân viên</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-green-600">{staff.filter(s => s.isActive !== false).length}</p>
          <p className="text-sm text-gray-500 mt-1">Đang làm việc</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-red-500">{staff.filter(s => s.isActive === false).length}</p>
          <p className="text-sm text-gray-500 mt-1">Đã nghỉ</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">👥 Danh sách nhân viên ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Mã NV','Họ và tên','Chức vụ','Email','SĐT','Lương cơ bản','Trạng thái','Thao tác'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
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
                      <div className="w-8 h-8 bg-[#1a3a5c] text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {s.fullName?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{s.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.position || 'Nhân viên'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{s.phone || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{s.baseSalary ? `${(s.baseSalary/1e6).toFixed(1)}M` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {s.isActive !== false ? '● Đang làm' : '○ Đã nghỉ'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(s._id, s.isActive !== false)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition ${s.isActive !== false ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
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
