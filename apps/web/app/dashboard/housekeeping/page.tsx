'use client';

import { useState } from 'react';

type RoomType = 'hotel' | 'cafe' | 'cinema';
type CleanStatus = 'needs_cleaning' | 'cleaning' | 'clean' | 'ready';
type Priority = 'urgent' | 'normal';

interface RoomItem {
  id: string;
  name: string;
  type: RoomType;
  status: CleanStatus;
  priority: Priority;
  lastCleaned: string;
  assignedTo: string;
  note: string;
}

interface ScheduleItem {
  room: string;
  cleanType: string;
  staff: string;
  startTime: string;
  duration: string;
  status: 'in_progress' | 'pending' | 'done';
}

const MOCK_ROOMS: RoomItem[] = [
  { id: '1', name: 'Phòng 101', type: 'hotel', status: 'needs_cleaning', priority: 'urgent', lastCleaned: 'Hôm qua 14:00', assignedTo: 'Nguyễn Thị Mai', note: 'Khách vừa check-out' },
  { id: '2', name: 'Phòng 201', type: 'hotel', status: 'cleaning', priority: 'normal', lastCleaned: 'Hôm nay 07:00', assignedTo: 'Trần Thị Bình', note: '' },
  { id: '3', name: 'Phòng 305', type: 'hotel', status: 'clean', priority: 'normal', lastCleaned: 'Hôm nay 09:30', assignedTo: 'Lê Thị Hoa', note: '' },
  { id: '4', name: 'Phòng 102', type: 'hotel', status: 'ready', priority: 'normal', lastCleaned: 'Hôm nay 10:00', assignedTo: '', note: '' },
  { id: '5', name: 'Phòng 203', type: 'hotel', status: 'needs_cleaning', priority: 'urgent', lastCleaned: 'Hôm qua 16:00', assignedTo: '', note: 'Khách trả phòng sớm' },
  { id: '6', name: 'Phòng 301', type: 'hotel', status: 'ready', priority: 'normal', lastCleaned: 'Hôm nay 08:30', assignedTo: '', note: '' },
  { id: '7', name: 'Bàn A01', type: 'cafe', status: 'needs_cleaning', priority: 'urgent', lastCleaned: '11:30', assignedTo: '', note: 'Khách vừa rời' },
  { id: '8', name: 'Bàn A03', type: 'cafe', status: 'clean', priority: 'normal', lastCleaned: '12:00', assignedTo: 'Phạm Văn Đức', note: '' },
  { id: '9', name: 'Bàn B05', type: 'cafe', status: 'cleaning', priority: 'normal', lastCleaned: '11:00', assignedTo: 'Hoàng Thị Thu', note: '' },
  { id: '10', name: 'Phòng Chiếu 1', type: 'cinema', status: 'needs_cleaning', priority: 'normal', lastCleaned: 'Hôm qua 22:00', assignedTo: '', note: 'Sau suất chiếu tối' },
  { id: '11', name: 'Phòng Chiếu 2', type: 'cinema', status: 'ready', priority: 'normal', lastCleaned: 'Hôm nay 08:00', assignedTo: '', note: '' },
];

const MOCK_SCHEDULE: ScheduleItem[] = [
  { room: 'Phòng 101', cleanType: 'full', staff: 'Nguyễn Thị Mai', startTime: '13:00', duration: '45 phút', status: 'in_progress' },
  { room: 'Bàn A01', cleanType: 'quick', staff: 'Phạm Văn Đức', startTime: '13:30', duration: '15 phút', status: 'pending' },
  { room: 'Phòng Chiếu 1', cleanType: 'full', staff: '', startTime: '14:00', duration: '60 phút', status: 'pending' },
];

const STAFF_LIST = ['Nguyễn Thị Mai', 'Trần Thị Bình', 'Lê Thị Hoa', 'Phạm Văn Đức', 'Hoàng Thị Thu'];

const STATUS_CONFIG: Record<CleanStatus, { label: string; bg: string; text: string; dot: string }> = {
  needs_cleaning: { label: 'Cần dọn', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  cleaning: { label: 'Đang dọn', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  clean: { label: 'Đã dọn', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  ready: { label: 'Sẵn sàng', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

const TYPE_ICON: Record<RoomType, string> = { hotel: '🏨', cafe: '☕', cinema: '🎬' };
const TYPE_LABEL: Record<RoomType, string> = { hotel: 'Phòng khách sạn', cafe: 'Bàn cafe', cinema: 'Phòng chiếu' };
const CLEAN_TYPE_LABEL: Record<string, string> = { full: 'Toàn bộ', quick: 'Nhanh', after_guest: 'Sau khách' };
const SCHEDULE_STATUS: Record<string, { label: string; color: string }> = {
  in_progress: { label: 'Đang thực hiện', color: 'bg-yellow-100 text-yellow-700' },
  pending: { label: 'Chờ thực hiện', color: 'bg-gray-100 text-gray-600' },
  done: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
};

export default function HousekeepingPage() {
  const [rooms, setRooms] = useState<RoomItem[]>(MOCK_ROOMS);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE);
  const [typeFilter, setTypeFilter] = useState<RoomType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CleanStatus | 'all'>('all');
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [assignForm, setAssignForm] = useState({ staff: '', cleanType: 'full', startTime: '13:00', note: '' });

  const filtered = rooms.filter(r => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    needs: rooms.filter(r => r.status === 'needs_cleaning').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    cleanedToday: rooms.filter(r => r.status === 'clean').length,
    ready: rooms.filter(r => r.status === 'ready').length,
  };

  function markCleaned(id: string) {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: 'clean', lastCleaned: 'Hôm nay ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) } : r));
  }

  function handleAssign(roomId: string) {
    if (!assignForm.staff) return;
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'cleaning', assignedTo: assignForm.staff } : r));
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setSchedule(prev => [...prev, {
        room: room.name,
        cleanType: assignForm.cleanType,
        staff: assignForm.staff,
        startTime: assignForm.startTime,
        duration: assignForm.cleanType === 'quick' ? '15 phút' : assignForm.cleanType === 'full' ? '45 phút' : '30 phút',
        status: 'pending',
      }]);
    }
    setAssignModal(null);
    setAssignForm({ staff: '', cleanType: 'full', startTime: '13:00', note: '' });
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cần dọn ngay', value: stats.needs, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: '🧹' },
          { label: 'Đang dọn', value: stats.cleaning, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: '🔄' },
          { label: 'Đã dọn hôm nay', value: stats.cleanedToday, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '✅' },
          { label: 'Phòng sạch sẵn sàng', value: stats.ready, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '🌟' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-3xl font-bold ${s.text}`}>{s.value}</span>
            </div>
            <p className={`text-sm font-medium ${s.text}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {(['all', 'hotel', 'cafe', 'cinema'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${typeFilter === t ? 'bg-[#1a3a5c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t === 'all' ? 'Tất cả' : `${TYPE_ICON[t]} ${TYPE_LABEL[t]}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center">Lọc trạng thái:</span>
          {(['needs_cleaning', 'cleaning', 'clean', 'ready'] as CleanStatus[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(prev => prev === s ? 'all' : s)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${statusFilter === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} border-transparent` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`}></span>
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(room => (
          <div key={room.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{TYPE_ICON[room.type]}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{room.name}</p>
                  <p className="text-xs text-gray-400">{TYPE_LABEL[room.type]}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[room.status].bg} ${STATUS_CONFIG[room.status].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[room.status].dot}`}></span>
                  {STATUS_CONFIG[room.status].label}
                </span>
                {room.priority === 'urgent' && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">Khẩn cấp</span>
                )}
              </div>
            </div>

            <div className="text-xs space-y-1 text-gray-500">
              <p>Dọn lần cuối: <span className="text-gray-700 font-medium">{room.lastCleaned}</span></p>
              {room.assignedTo && <p>Nhân viên: <span className="text-gray-700 font-medium">{room.assignedTo}</span></p>}
              {room.note && <p className="text-orange-600 font-medium">{room.note}</p>}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {room.status === 'needs_cleaning' && (
                <button onClick={() => { setAssignModal(room.id); setAssignForm({ staff: room.assignedTo || '', cleanType: 'full', startTime: '13:00', note: '' }); }}
                  className="flex-1 text-xs font-semibold bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg hover:bg-[#152e4a] transition">
                  Phân công dọn
                </button>
              )}
              {room.status === 'cleaning' && (
                <button onClick={() => markCleaned(room.id)}
                  className="flex-1 text-xs font-semibold bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">
                  Đánh dấu đã dọn
                </button>
              )}
              <button className="text-xs font-semibold border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                Kiểm tra
              </button>
            </div>

            {/* Assign Modal (inline per card) */}
            {assignModal === room.id && (
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <p className="text-xs font-bold text-gray-700">Phân công nhân viên dọn</p>
                <div>
                  <label className="text-xs text-gray-500">Nhân viên</label>
                  <select value={assignForm.staff} onChange={e => setAssignForm(f => ({ ...f, staff: e.target.value }))}
                    className="w-full mt-0.5 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="">-- Chọn nhân viên --</option>
                    {STAFF_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Loại dọn</label>
                    <select value={assignForm.cleanType} onChange={e => setAssignForm(f => ({ ...f, cleanType: e.target.value }))}
                      className="w-full mt-0.5 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option value="full">Toàn bộ</option>
                      <option value="quick">Nhanh</option>
                      <option value="after_guest">Sau khách</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Giờ bắt đầu</label>
                    <input type="time" value={assignForm.startTime} onChange={e => setAssignForm(f => ({ ...f, startTime: e.target.value }))}
                      className="w-full mt-0.5 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Ghi chú</label>
                  <input value={assignForm.note} onChange={e => setAssignForm(f => ({ ...f, note: e.target.value }))} placeholder="Lưu ý thêm..."
                    className="w-full mt-0.5 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAssign(room.id)} disabled={!assignForm.staff}
                    className="flex-1 text-xs font-semibold bg-[#1a3a5c] text-white py-1.5 rounded-lg disabled:opacity-40 hover:bg-[#152e4a] transition">
                    Xác nhận
                  </button>
                  <button onClick={() => setAssignModal(null)}
                    className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">Lịch dọn phòng hôm nay</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                <th className="text-left px-4 py-3">Phòng / Bàn</th>
                <th className="text-left px-4 py-3">Loại dọn</th>
                <th className="text-left px-4 py-3">Nhân viên</th>
                <th className="text-left px-4 py-3">Bắt đầu</th>
                <th className="text-left px-4 py-3">Thời gian dự kiến</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-center px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedule.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.room}</td>
                  <td className="px-4 py-3 text-gray-600">{CLEAN_TYPE_LABEL[item.cleanType] || item.cleanType}</td>
                  <td className="px-4 py-3 text-gray-700">{item.staff || <span className="text-red-500 italic text-xs">Chưa phân công</span>}</td>
                  <td className="px-4 py-3 text-gray-700">{item.startTime}</td>
                  <td className="px-4 py-3 text-gray-600">{item.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SCHEDULE_STATUS[item.status].color}`}>
                      {SCHEDULE_STATUS[item.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {item.status !== 'done' && (
                        <button onClick={() => setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, status: 'done' } : s))}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition font-medium">
                          Hoàn thành
                        </button>
                      )}
                      <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200 transition font-medium">
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {schedule.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">Chưa có lịch dọn nào</div>
          )}
        </div>
      </div>
    </div>
  );
}
