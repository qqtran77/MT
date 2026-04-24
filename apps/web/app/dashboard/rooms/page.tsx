'use client';

import { useState } from 'react';

type ResourceType = 'hotel' | 'cafe' | 'cinema';
type RoomStatus = 'available' | 'occupied' | 'maintenance';

interface Room {
  id: string;
  name: string;
  type: ResourceType;
  subType: string;
  capacity: number;
  pricePerUnit: number;
  unit: string;
  status: RoomStatus;
  floor?: string;
  amenities: string[];
  description: string;
  branch: string;
}

const MOCK_ROOMS: Room[] = [
  { id: '1', name: 'Phòng 101', type: 'hotel', subType: 'Standard', capacity: 2, pricePerUnit: 900000, unit: 'đêm', status: 'available', floor: 'Tầng 1', amenities: ['Wi-Fi', 'TV', 'Điều hòa'], description: 'Phòng tiêu chuẩn 2 giường đơn', branch: 'Khách sạn Grand Q.1' },
  { id: '2', name: 'Phòng 201', type: 'hotel', subType: 'Deluxe', capacity: 2, pricePerUnit: 1500000, unit: 'đêm', status: 'occupied', floor: 'Tầng 2', amenities: ['Wi-Fi', 'TV', 'Điều hòa', 'View biển'], description: 'Phòng deluxe view biển', branch: 'Khách sạn Grand Q.1' },
  { id: '3', name: 'Phòng 301', type: 'hotel', subType: 'Suite', capacity: 4, pricePerUnit: 2800000, unit: 'đêm', status: 'available', floor: 'Tầng 3', amenities: ['Wi-Fi', '2 TV', 'Bồn tắm', 'Phòng khách'], description: 'Suite gia đình rộng rãi', branch: 'Khách sạn Grand Q.1' },
  { id: '4', name: 'Penthouse', type: 'hotel', subType: 'Penthouse', capacity: 6, pricePerUnit: 5500000, unit: 'đêm', status: 'maintenance', floor: 'Tầng 10', amenities: ['Wi-Fi', '3 TV', 'Hồ bơi riêng', 'Bếp đầy đủ'], description: 'Penthouse hạng sang', branch: 'Khách sạn Grand Q.1' },
  { id: '5', name: 'Bàn A01', type: 'cafe', subType: 'Tầng 1', capacity: 2, pricePerUnit: 0, unit: 'bàn', status: 'available', amenities: ['Ổ điện', 'View đường'], description: 'Bàn đôi tầng 1', branch: 'Cafe CKD Q.3' },
  { id: '6', name: 'Bàn B05', type: 'cafe', subType: 'Tầng 2', capacity: 4, pricePerUnit: 0, unit: 'bàn', status: 'occupied', amenities: ['Ổ điện', 'Ban công'], description: 'Bàn 4 người ban công', branch: 'Cafe CKD Q.3' },
  { id: '7', name: 'Phòng Chiếu 1', type: 'cinema', subType: 'Standard', capacity: 80, pricePerUnit: 90000, unit: 'ghế', status: 'available', amenities: ['4K', 'Dolby'], description: 'Phòng chiếu tiêu chuẩn', branch: 'Rạp CKD Q.7' },
  { id: '8', name: 'Phòng VIP', type: 'cinema', subType: 'VIP', capacity: 40, pricePerUnit: 150000, unit: 'ghế', status: 'available', amenities: ['4K', 'Dolby Atmos', 'Ghế recline'], description: 'Phòng chiếu VIP', branch: 'Rạp CKD Q.7' },
];

const TYPE_LABELS: Record<ResourceType, string> = { hotel: '🏨 Khách sạn', cafe: '☕ Cafe', cinema: '🎬 Rạp phim' };
const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string }> = {
  available: { label: 'Trống', color: 'bg-green-100 text-green-700' },
  occupied: { label: 'Đang dùng', color: 'bg-red-100 text-red-700' },
  maintenance: { label: 'Bảo trì', color: 'bg-yellow-100 text-yellow-700' },
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [filter, setFilter] = useState<ResourceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [form, setForm] = useState({
    name: '', type: 'hotel' as ResourceType, subType: '', capacity: 2,
    pricePerUnit: 0, unit: 'đêm', status: 'available' as RoomStatus,
    floor: '', amenities: '', description: '', branch: 'Khách sạn Grand Q.1',
  });

  const filtered = rooms.filter(r => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.branch.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = { all: rooms.length, ...Object.fromEntries(['hotel','cafe','cinema'].map(t => [t, rooms.filter(r=>r.type===t).length])) };
  const statusCounts = { available: rooms.filter(r=>r.status==='available').length, occupied: rooms.filter(r=>r.status==='occupied').length, maintenance: rooms.filter(r=>r.status==='maintenance').length };

  function handleSubmit() {
    const newRoom: Room = {
      id: editRoom?.id || Date.now().toString(),
      name: form.name,
      type: form.type,
      subType: form.subType,
      capacity: form.capacity,
      pricePerUnit: form.pricePerUnit,
      unit: form.unit,
      status: form.status,
      floor: form.floor,
      amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
      description: form.description,
      branch: form.branch,
    };
    if (editRoom) {
      setRooms(prev => prev.map(r => r.id === editRoom.id ? newRoom : r));
    } else {
      setRooms(prev => [...prev, newRoom]);
    }
    setShowForm(false);
    setEditRoom(null);
    setForm({ name: '', type: 'hotel', subType: '', capacity: 2, pricePerUnit: 0, unit: 'đêm', status: 'available', floor: '', amenities: '', description: '', branch: 'Khách sạn Grand Q.1' });
  }

  function handleEdit(room: Room) {
    setEditRoom(room);
    setForm({ ...room, amenities: room.amenities.join(', '), floor: room.floor || '' });
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (confirm('Xóa tài nguyên này?')) setRooms(prev => prev.filter(r => r.id !== id));
  }

  function toggleStatus(id: string) {
    setRooms(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next: RoomStatus = r.status === 'available' ? 'maintenance' : 'available';
      return { ...r, status: next };
    }));
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Tổng', value: rooms.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: '🏨 KS', value: counts.hotel, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
          { label: '☕ Cafe', value: counts.cafe, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: '🎬 Rạp', value: counts.cinema, color: 'bg-purple-50 text-purple-700 border-purple-200' },
          { label: '✅ Trống', value: statusCounts.available, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: '🔧 Bảo trì', value: statusCounts.maintenance, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Add */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all','hotel','cafe','cinema'] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter===t ? 'bg-[#1a3a5c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t==='all' ? 'Tất cả' : TYPE_LABELS[t]}
            </button>
          ))}
          <span className="text-gray-300">|</span>
          {(['all','available','occupied','maintenance'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${statusFilter===s ? 'bg-[#1a3a5c] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s==='all' ? 'Mọi trạng thái' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm tên phòng..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-44" />
          <button onClick={() => { setShowForm(!showForm); setEditRoom(null); }}
            className="bg-[#1a3a5c] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition">
            + Thêm mới
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-base">{editRoom ? '✏️ Chỉnh sửa tài nguyên' : '➕ Thêm phòng / tài nguyên mới'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tên phòng *</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Phòng 101" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Loại hình *</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value as ResourceType})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="hotel">Khách sạn</option>
                <option value="cafe">Cafe</option>
                <option value="cinema">Rạp phim</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Hạng phòng</label>
              <input value={form.subType} onChange={e=>setForm({...form,subType:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Deluxe, Standard..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sức chứa</label>
              <input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Giá (đ)</label>
              <input type="number" value={form.pricePerUnit} onChange={e=>setForm({...form,pricePerUnit:+e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Đơn vị tính</label>
              <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="đêm">đêm</option>
                <option value="giờ">giờ</option>
                <option value="bàn">bàn</option>
                <option value="ghế">ghế</option>
                <option value="lần">lần</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tầng / Vị trí</label>
              <input value={form.floor} onChange={e=>setForm({...form,floor:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Tầng 2" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value as RoomStatus})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="available">Trống</option>
                <option value="occupied">Đang dùng</option>
                <option value="maintenance">Bảo trì</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Chi nhánh</label>
              <select value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Khách sạn Grand Q.1</option>
                <option>Cafe CKD Q.3</option>
                <option>Rạp CKD Q.7</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tiện nghi (cách nhau bởi dấu phẩy)</label>
              <input value={form.amenities} onChange={e=>setForm({...form,amenities:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Wi-Fi, TV, Điều hòa, ..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả</label>
              <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} disabled={!form.name}
              className="bg-[#1a3a5c] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#152e4a] transition disabled:opacity-40">
              {editRoom ? '💾 Cập nhật' : '➕ Thêm phòng'}
            </button>
            <button onClick={() => { setShowForm(false); setEditRoom(null); }}
              className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition">
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-gray-700 text-sm">Danh sách tài nguyên ({filtered.length})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                <th className="text-left px-4 py-3">Tên phòng</th>
                <th className="text-left px-4 py-3">Loại</th>
                <th className="text-left px-4 py-3">Hạng</th>
                <th className="text-center px-4 py-3">Sức chứa</th>
                <th className="text-right px-4 py-3">Giá</th>
                <th className="text-left px-4 py-3">Tiện nghi</th>
                <th className="text-center px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Chi nhánh</th>
                <th className="text-center px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(room => (
                <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {room.name}
                    {room.floor && <span className="text-xs text-gray-400 ml-1">({room.floor})</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{TYPE_LABELS[room.type]}</td>
                  <td className="px-4 py-3 text-gray-600">{room.subType}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{room.capacity} người</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-700">
                    {room.pricePerUnit > 0 ? `${room.pricePerUnit.toLocaleString('vi-VN')}đ/${room.unit}` : 'Miễn phí'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0,3).map(a => (
                        <span key={a} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{a}</span>
                      ))}
                      {room.amenities.length > 3 && <span className="text-xs text-gray-400">+{room.amenities.length-3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleStatus(room.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[room.status].color} hover:opacity-80 transition`}>
                      {STATUS_CONFIG[room.status].label}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{room.branch}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(room)} className="text-blue-600 hover:text-blue-800 text-sm" title="Chỉnh sửa">✏️</button>
                      <button onClick={() => handleDelete(room.id)} className="text-red-500 hover:text-red-700 text-sm" title="Xóa">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">Không tìm thấy tài nguyên nào</div>
          )}
        </div>
      </div>
    </div>
  );
}
