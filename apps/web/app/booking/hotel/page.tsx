'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { hotelApi, Room } from '@/lib/api';
import { RoomCard } from '@/components/booking/RoomCard';
import { Button } from '@/components/ui/Button';
import { Hotel, SlidersHorizontal, Loader2 } from 'lucide-react';

function HotelPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [capacity, setCapacity] = useState(Number(searchParams.get('capacity')) || 2);
  const [filterType, setFilterType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [showFilters, setShowFilters] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const { data: rooms, isLoading, error, refetch } = useQuery<Room[]>({
    queryKey: ['rooms', checkIn, checkOut, capacity],
    queryFn: () => hotelApi.getAvailableRooms({ checkIn, checkOut, capacity }),
    enabled: true,
  });

  const filteredRooms = (rooms || []).filter((room) => {
    const typeMatch = filterType === 'all' || room.type === filterType;
    const priceMatch = room.pricePerNight <= maxPrice;
    return typeMatch && priceMatch;
  });

  const roomTypes = ['all', ...Array.from(new Set((rooms || []).map((r) => r.type)))];

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  function handleBook(room: Room) {
    const params = new URLSearchParams({
      resourceId: room.id,
      resourceName: room.name,
      type: 'hotel',
      checkIn,
      checkOut,
      amount: String(room.pricePerNight * nights),
    });
    router.push(`/booking/${room.id}/confirm?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-hero-gradient text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Hotel className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold">Đặt Phòng Khách Sạn</h1>
          </div>
          <p className="text-blue-200">Chọn phòng phù hợp cho kỳ nghỉ hoàn hảo của bạn</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Nhận phòng</label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Trả phòng</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Số khách</label>
              <select
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="input-field"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} khách</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={() => refetch()} className="flex-1" isLoading={isLoading}>
                Tìm Phòng
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Loại phòng</label>
                  <div className="flex flex-wrap gap-2">
                    {roomTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          filterType === type
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        {type === 'all' ? 'Tất cả' : type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">
                    Giá tối đa: {maxPrice.toLocaleString('vi-VN')}đ/đêm
                  </label>
                  <input
                    type="range"
                    min={500000}
                    max={10000000}
                    step={100000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>500K</span>
                    <span>10M</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {checkIn && checkOut && (
          <div className="text-sm text-gray-500 mb-4">
            {nights} đêm ({checkIn} → {checkOut}) •{' '}
            <span className="font-semibold text-gray-700">{filteredRooms.length} phòng</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-500">Đang tìm phòng...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">Không thể tải dữ liệu. Đang hiển thị dữ liệu mẫu.</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20">
            <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy phòng phù hợp</p>
            <p className="text-gray-400 text-sm mt-2">Hãy thử thay đổi bộ lọc</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={handleBook} nights={nights} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HotelBookingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <HotelPageContent />
    </Suspense>
  );
}
