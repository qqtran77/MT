'use client';

import { Seat } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Monitor } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

export function SeatMap({ seats, selectedSeats, onSeatToggle }: SeatMapProps) {
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();
  const maxCols = Math.max(...seats.map((s) => s.col));

  const getSeatStatus = (seat: Seat): 'available' | 'occupied' | 'selected' | 'vip' => {
    if (seat.status === 'occupied') return 'occupied';
    if (selectedSeats.includes(seat.id)) return 'selected';
    if (seat.type === 'vip') return 'vip';
    return 'available';
  };

  const getSeatClass = (status: ReturnType<typeof getSeatStatus>) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-400 cursor-not-allowed border-red-500';
      case 'selected':
        return 'bg-blue-500 border-blue-600 text-white scale-110 shadow-lg cursor-pointer';
      case 'vip':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700 cursor-pointer hover:bg-yellow-200';
      default:
        return 'bg-green-100 border-green-400 text-green-700 cursor-pointer hover:bg-green-300 hover:scale-105';
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Screen */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-3/4 max-w-sm h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mb-1" />
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Monitor className="w-4 h-4" />
          <span>Màn Hình</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center gap-2 min-w-max mx-auto">
        {rows.map((row) => {
          const rowSeats = seats.filter((s) => s.row === row).sort((a, b) => a.col - b.col);
          return (
            <div key={row} className="flex items-center gap-2">
              {/* Row label */}
              <span className="w-6 text-center text-xs font-bold text-gray-500">{row}</span>

              {/* Aisle split */}
              <div className="flex gap-1">
                {rowSeats.slice(0, Math.floor(maxCols / 2)).map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat.id}
                      onClick={() => seat.status !== 'occupied' && onSeatToggle(seat.id)}
                      disabled={seat.status === 'occupied'}
                      title={`Ghế ${seat.id} - ${seat.type === 'vip' ? 'VIP' : 'Thường'} - ${seat.price.toLocaleString('vi-VN')}đ`}
                      className={cn(
                        'w-7 h-7 rounded-t-lg border text-xs font-bold transition-all duration-150',
                        getSeatClass(status)
                      )}
                    >
                      {seat.col}
                    </button>
                  );
                })}
              </div>

              {/* Center aisle */}
              <div className="w-6" />

              <div className="flex gap-1">
                {rowSeats.slice(Math.floor(maxCols / 2)).map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat.id}
                      onClick={() => seat.status !== 'occupied' && onSeatToggle(seat.id)}
                      disabled={seat.status === 'occupied'}
                      title={`Ghế ${seat.id} - ${seat.type === 'vip' ? 'VIP' : 'Thường'} - ${seat.price.toLocaleString('vi-VN')}đ`}
                      className={cn(
                        'w-7 h-7 rounded-t-lg border text-xs font-bold transition-all duration-150',
                        getSeatClass(status)
                      )}
                    >
                      {seat.col}
                    </button>
                  );
                })}
              </div>

              <span className="w-6 text-center text-xs font-bold text-gray-500">{row}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-5 mt-8 pt-5 border-t border-gray-200">
        {[
          { color: 'bg-green-100 border-green-400', label: 'Ghế trống' },
          { color: 'bg-yellow-100 border-yellow-400', label: 'Ghế VIP' },
          { color: 'bg-blue-500 border-blue-600', label: 'Đang chọn' },
          { color: 'bg-red-400 border-red-500', label: 'Đã đặt' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-t-md border ${item.color}`} />
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
