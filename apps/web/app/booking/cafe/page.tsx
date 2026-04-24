'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { cafeApi, CafeTable } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Coffee, Clock, Users, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const timeSlots = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

function CafePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(searchParams.get('date') || today);
  const [time, setTime] = useState(searchParams.get('time') || '09:00');
  const [partySize, setPartySize] = useState(Number(searchParams.get('size')) || 2);
  const [selectedTable, setSelectedTable] = useState<CafeTable | null>(null);
  const [activeZone, setActiveZone] = useState<string>('all');

  const { data: tables, isLoading, refetch } = useQuery<CafeTable[]>({
    queryKey: ['cafe-tables', date, time],
    queryFn: () => cafeApi.getTables({ date, time }),
    enabled: true,
  });

  const zones = ['all', ...Array.from(new Set((tables || []).map((t) => t.zone)))];

  const filteredTables = (tables || []).filter((t) => {
    const zoneMatch = activeZone === 'all' || t.zone === activeZone;
    const sizeMatch = t.capacity >= partySize;
    return zoneMatch && sizeMatch;
  });

  function handleConfirm() {
    if (!selectedTable) return;
    const params = new URLSearchParams({
      resourceId: selectedTable.id,
      resourceName: `Bàn số ${selectedTable.number} - ${selectedTable.zone}`,
      type: 'cafe',
      date,
      time,
      amount: '0',
    });
    router.push(`/booking/${selectedTable.id}/confirm?${params.toString()}`);
  }

  const getTableColor = (table: CafeTable) => {
    if (table.id === selectedTable?.id) return 'bg-blue-500 border-blue-600 text-white shadow-lg scale-105';
    if (table.status === 'occupied') return 'bg-red-100 border-red-300 text-red-500 cursor-not-allowed';
    if (table.status === 'reserved') return 'bg-yellow-100 border-yellow-300 text-yellow-600 cursor-not-allowed';
    if (table.capacity < partySize) return 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed';
    return 'bg-green-100 border-green-300 text-green-700 cursor-pointer hover:bg-green-200 hover:scale-105';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Coffee className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold">Đặt Bàn Cafe</h1>
          </div>
          <p className="text-amber-200">Chọn bàn và thời gian ghé thăm</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Controls */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Ngày đến</label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">
                <Clock className="w-4 h-4 inline mr-1" />
                Khung giờ
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                <Users className="w-4 h-4 inline mr-1" />
                Số người
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="input-field"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} người</option>
                ))}
              </select>
            </div>
          </div>

          {/* Zone filter */}
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeZone === zone
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700'
                }`}
              >
                {zone === 'all' ? 'Tất cả khu vực' : zone}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Floor Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Sơ đồ bàn</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              </div>
            ) : (
              <>
                {/* Floor map visualization */}
                <div className="relative bg-amber-50 rounded-xl border-2 border-dashed border-amber-200 p-4 min-h-64 overflow-hidden">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 text-amber-400 text-xs font-medium">
                    Cửa vào
                  </div>
                  <div
                    className="relative"
                    style={{ height: '320px' }}
                  >
                    {filteredTables.map((table) => (
                      <button
                        key={table.id}
                        onClick={() => {
                          if (table.status === 'available' && table.capacity >= partySize) {
                            setSelectedTable(selectedTable?.id === table.id ? null : table);
                          }
                        }}
                        disabled={table.status !== 'available' || table.capacity < partySize}
                        style={{
                          position: 'absolute',
                          left: `${(table.x / 620) * 100}%`,
                          top: `${(table.y / 420) * 100}%`,
                        }}
                        className={cn(
                          'w-16 h-14 rounded-xl border-2 text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center',
                          getTableColor(table)
                        )}
                        title={`Bàn ${table.number} - ${table.capacity} người - ${
                          table.status === 'occupied'
                            ? 'Đang sử dụng'
                            : table.status === 'reserved'
                            ? 'Đã đặt'
                            : 'Trống'
                        }`}
                      >
                        <span className="text-base">{table.number}</span>
                        <span className="text-[10px] opacity-80">{table.capacity}👤</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {[
                    { color: 'bg-green-100 border-green-300', label: 'Còn trống' },
                    { color: 'bg-yellow-100 border-yellow-300', label: 'Đã đặt' },
                    { color: 'bg-red-100 border-red-300', label: 'Đang dùng' },
                    { color: 'bg-blue-500 border-blue-600', label: 'Đang chọn' },
                    { color: 'bg-gray-100 border-gray-200', label: 'Không đủ chỗ' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={`w-4 h-4 rounded border-2 ${item.color}`} />
                      <span className="text-xs text-gray-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Booking Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Thông tin đặt bàn</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày:</span>
                  <span className="font-medium">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Giờ:</span>
                  <span className="font-medium">{time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số người:</span>
                  <span className="font-medium">{partySize}</span>
                </div>
                {selectedTable && (
                  <>
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Bàn số {selectedTable.number}</p>
                        <p className="text-xs text-green-500">{selectedTable.zone} • {selectedTable.capacity} người</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedTable && (
              <Button
                onClick={handleConfirm}
                className="w-full bg-amber-600 hover:bg-amber-700"
                size="lg"
              >
                Xác Nhận Đặt Bàn
              </Button>
            )}

            <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 border border-amber-200">
              <p className="font-semibold mb-1">Lưu ý:</p>
              <ul className="space-y-1 text-xs text-amber-600">
                <li>• Đặt bàn miễn phí, không cần đặt cọc</li>
                <li>• Vui lòng đến đúng giờ đã đặt</li>
                <li>• Hủy bàn trước 1 giờ để không mất điểm</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CafeBookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>}>
      <CafePageContent />
    </Suspense>
  );
}
