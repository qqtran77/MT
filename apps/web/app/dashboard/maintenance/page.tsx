'use client';

import { useState } from 'react';

type Severity = 'low' | 'medium' | 'high';
type MStatus = 'pending' | 'approved' | 'in_progress' | 'completed';
type DeviceType = 'điều hòa' | 'TV' | 'điện' | 'nước' | 'nội thất' | 'khác';

interface Report {
  id: string;
  location: string;
  device: string;
  deviceType: DeviceType | string;
  severity: Severity;
  desc: string;
  reportedBy: string;
  reportedAt: string;
  technician: string;
  cost: number;
  status: MStatus;
  note: string;
}

const MOCK_REPORTS: Report[] = [
  { id: 'MT001', location: 'Phòng 201', device: 'Điều hòa Daikin 2HP', deviceType: 'điều hòa', severity: 'medium', desc: 'Không làm lạnh, có tiếng kêu', reportedBy: 'Nguyễn Văn An', reportedAt: '2024-05-20 09:30', technician: 'Trần Kỹ Thuật', cost: 450000, status: 'in_progress', note: 'Đã kiểm tra, cần thay gas' },
  { id: 'MT002', location: 'Phòng 305', device: 'TV Samsung 55"', deviceType: 'TV', severity: 'low', desc: 'Mất âm thanh', reportedBy: 'Trần Thị Bích', reportedAt: '2024-05-19 14:00', technician: '', cost: 0, status: 'pending', note: '' },
  { id: 'MT003', location: 'Bàn B05 Cafe', device: 'Ổ điện', deviceType: 'điện', severity: 'high', desc: 'Chập điện, mùi khét', reportedBy: 'Lê Hoàng Nam', reportedAt: '2024-05-18 11:00', technician: 'Nguyễn Điện', cost: 800000, status: 'completed', note: 'Đã thay toàn bộ ổ điện khu B' },
  { id: 'MT004', location: 'Sảnh tầng 1', device: 'Thang máy', deviceType: 'khác', severity: 'high', desc: 'Đóng cửa chậm', reportedBy: 'Admin', reportedAt: '2024-05-17 08:00', technician: 'Công ty Schindler', cost: 2500000, status: 'completed', note: 'Bảo dưỡng định kỳ' },
  { id: 'MT005', location: 'Phòng 102', device: 'Vòi nước', deviceType: 'nước', severity: 'medium', desc: 'Rò rỉ nước', reportedBy: 'Phạm Thị Lan', reportedAt: '2024-05-20 07:00', technician: '', cost: 0, status: 'pending', note: '' },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; bg: string; text: string }> = {
  high: { label: 'Nghiêm trọng', bg: 'bg-red-100', text: 'text-red-700' },
  medium: { label: 'Trung bình', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  low: { label: 'Nhẹ', bg: 'bg-blue-100', text: 'text-blue-700' },
};

const STATUS_CONFIG: Record<MStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Chờ xử lý', bg: 'bg-gray-100', text: 'text-gray-600' },
  approved: { label: 'Đã duyệt', bg: 'bg-blue-100', text: 'text-blue-700' },
  in_progress: { label: 'Đang sửa', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  completed: { label: 'Hoàn thành', bg: 'bg-green-100', text: 'text-green-700' },
};

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'high', label: 'Khẩn cấp' },
  { key: 'in_progress', label: 'Đang xử lý' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'completed', label: 'Hoàn thành' },
];

export default function MaintenancePage() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [tabFilter, setTabFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [updateModal, setUpdateModal] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState({ technician: '', cost: 0, note: '' });
  const [form, setForm] = useState({
    location: '', device: '', deviceType: 'điều hòa' as DeviceType | string,
    severity: 'medium' as Severity, desc: '', reportedBy: '',
  });

  const filtered = reports.filter(r => {
    if (tabFilter === 'all') return true;
    if (tabFilter === 'high') return r.severity === 'high';
    if (tabFilter === 'in_progress') return r.status === 'in_progress';
    if (tabFilter === 'pending') return r.status === 'pending';
    if (tabFilter === 'completed') return r.status === 'completed';
    return true;
  });

  const stats = {
    pending: reports.filter(r => r.status === 'pending').length,
    in_progress: reports.filter(r => r.status === 'in_progress').length,
    completed_today: reports.filter(r => r.status === 'completed').length,
    total_cost: reports.filter(r => r.status === 'completed').reduce((s, r) => s + r.cost, 0),
  };

  function handleSubmit() {
    if (!form.location || !form.device) return;
    const newId = 'MT' + String(reports.length + 1).padStart(3, '0');
    const now = new Date().toLocaleString('vi-VN');
    setReports(prev => [...prev, {
      id: newId, location: form.location, device: form.device,
      deviceType: form.deviceType, severity: form.severity, desc: form.desc,
      reportedBy: form.reportedBy, reportedAt: now, technician: '', cost: 0, status: 'pending', note: '',
    }]);
    setForm({ location: '', device: '', deviceType: 'điều hòa', severity: 'medium', desc: '', reportedBy: '' });
    setShowForm(false);
  }

  function approve(id: string) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  }

  function handleUpdate(id: string) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'in_progress', technician: updateData.technician, cost: updateData.cost, note: updateData.note } : r));
    setUpdateModal(null);
    setUpdateData({ technician: '', cost: 0, note: '' });
  }

  function complete(id: string) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r));
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Chờ xử lý', value: stats.pending, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '⏳' },
          { label: 'Đang sửa', value: stats.in_progress, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: '🔧' },
          { label: 'Hoàn thành hôm nay', value: stats.completed_today, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✅' },
          { label: 'Chi phí tháng này', value: stats.total_cost.toLocaleString('vi-VN') + 'đ', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '💰', isText: true },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">{s.icon}</span>
              <span className={`${s.isText ? 'text-lg' : 'text-3xl'} font-bold ${s.text}`}>{s.value}</span>
            </div>
            <p className={`text-sm font-medium ${s.text}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Button */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map(t => (
            <button key={t.key} onClick={() => setTabFilter(t.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${tabFilter === t.key ? 'bg-[#1a3a5c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center gap-1.5">
          <span>+</span> Báo hỏng mới
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 mb-4 text-base">Báo hỏng thiết bị mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Khu vực / Phòng *</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="VD: Phòng 201, Sảnh tầng 1..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tên thiết bị *</label>
              <input value={form.device} onChange={e => setForm(f => ({ ...f, device: e.target.value }))}
                placeholder="VD: Điều hòa Daikin 2HP"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Loại thiết bị</label>
              <select value={form.deviceType} onChange={e => setForm(f => ({ ...f, deviceType: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                {['điều hòa', 'TV', 'điện', 'nước', 'nội thất', 'khác'].map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mức độ hỏng</label>
              <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value as Severity }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                <option value="low">Nhẹ</option>
                <option value="medium">Trung bình</option>
                <option value="high">Nghiêm trọng</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Người phát hiện</label>
              <input value={form.reportedBy} onChange={e => setForm(f => ({ ...f, reportedBy: e.target.value }))}
                placeholder="Tên nhân viên..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ảnh đính kèm</label>
              <div className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-400 text-center cursor-pointer hover:border-gray-400 transition">
                📷 Chọn ảnh (tính năng sẽ có)
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả chi tiết</label>
              <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={2}
                placeholder="Mô tả cụ thể tình trạng hỏng hóc..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={!form.location || !form.device}
              className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-40">
              Gửi báo cáo
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition">
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="font-bold text-gray-800 text-sm">Danh sách báo hỏng ({filtered.length})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Phòng / Khu vực</th>
                <th className="text-left px-4 py-3">Thiết bị</th>
                <th className="text-center px-4 py-3">Mức độ</th>
                <th className="text-left px-4 py-3">Báo cáo bởi</th>
                <th className="text-left px-4 py-3">Ngày báo</th>
                <th className="text-left px-4 py-3">Kỹ thuật viên</th>
                <th className="text-right px-4 py-3">Chi phí</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-gray-600">{r.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{r.location}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800 font-medium">{r.device}</p>
                    <p className="text-xs text-gray-400">{r.deviceType}</p>
                    {r.desc && <p className="text-xs text-gray-500 italic mt-0.5">{r.desc}</p>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_CONFIG[r.severity].bg} ${SEVERITY_CONFIG[r.severity].text}`}>
                      {SEVERITY_CONFIG[r.severity].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.reportedBy}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.reportedAt}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {r.technician || <span className="text-gray-400 italic text-xs">Chưa phân công</span>}
                    {r.note && <p className="text-xs text-gray-400 mt-0.5">{r.note}</p>}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    {r.cost > 0 ? r.cost.toLocaleString('vi-VN') + 'đ' : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[r.status].bg} ${STATUS_CONFIG[r.status].text}`}>
                      {STATUS_CONFIG[r.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {r.status === 'pending' && (
                        <button onClick={() => approve(r.id)}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 transition font-medium">
                          Duyệt
                        </button>
                      )}
                      {(r.status === 'approved' || r.status === 'in_progress') && (
                        <button onClick={() => { setUpdateModal(r.id); setUpdateData({ technician: r.technician, cost: r.cost, note: r.note }); }}
                          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg hover:bg-yellow-200 transition font-medium">
                          Cập nhật
                        </button>
                      )}
                      {r.status === 'in_progress' && (
                        <button onClick={() => complete(r.id)}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition font-medium">
                          Hoàn thành
                        </button>
                      )}
                    </div>
                    {/* Update Modal */}
                    {updateModal === r.id && (
                      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setUpdateModal(null)}>
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4" onClick={e => e.stopPropagation()}>
                          <h4 className="font-bold text-gray-800">Cập nhật sửa chữa — {r.id}</h4>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Kỹ thuật viên</label>
                            <input value={updateData.technician} onChange={e => setUpdateData(d => ({ ...d, technician: e.target.value }))}
                              placeholder="Tên kỹ thuật viên..."
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Chi phí (đồng)</label>
                            <input type="number" value={updateData.cost} onChange={e => setUpdateData(d => ({ ...d, cost: +e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú kỹ thuật</label>
                            <textarea value={updateData.note} onChange={e => setUpdateData(d => ({ ...d, note: e.target.value }))} rows={2}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => handleUpdate(r.id)}
                              className="flex-1 bg-[#1a3a5c] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition">
                              Lưu cập nhật
                            </button>
                            <button onClick={() => setUpdateModal(null)}
                              className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition">
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Không có báo cáo nào</div>
          )}
        </div>
      </div>
    </div>
  );
}
