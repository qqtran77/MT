'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { cinemaApi, Movie, Seat, Showtime } from '@/lib/api';
import { SeatMap } from '@/components/booking/SeatMap';
import { Button } from '@/components/ui/Button';
import { Film, Clock, Users, ShoppingCart, Loader2, ChevronRight, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const snackCombos = [
  { id: 'c1', name: 'Combo 1 người', items: 'Bắp vừa + Nước ngọt', price: 85000 },
  { id: 'c2', name: 'Combo đôi', items: '2 Bắp lớn + 2 Nước ngọt', price: 155000 },
  { id: 'c3', name: 'Combo gia đình', items: '1 Bắp XXL + 4 Nước + Gà chiên', price: 280000 },
  { id: 'c4', name: 'Bắp ngọt muối', items: 'Size M', price: 45000 },
];

type Step = 'movie' | 'showtime' | 'seats' | 'summary';

export default function CinemaBookingPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('movie');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedCombos, setSelectedCombos] = useState<Record<string, number>>({});

  const { data: movies, isLoading: moviesLoading } = useQuery<Movie[]>({
    queryKey: ['movies'],
    queryFn: cinemaApi.getMovies,
  });

  const { data: seats, isLoading: seatsLoading } = useQuery<Seat[]>({
    queryKey: ['seats', selectedShowtime?.id],
    queryFn: () => cinemaApi.getSeats(selectedShowtime!.id),
    enabled: !!selectedShowtime && step === 'seats',
  });

  const seatPrice = (seats || [])
    .filter((s) => selectedSeats.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  const comboPrice = Object.entries(selectedCombos).reduce((sum, [id, qty]) => {
    const combo = snackCombos.find((c) => c.id === id);
    return sum + (combo?.price || 0) * qty;
  }, 0);

  const totalPrice = seatPrice + comboPrice;

  function toggleSeat(seatId: string) {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  }

  function adjustCombo(comboId: string, delta: number) {
    setSelectedCombos((prev) => {
      const current = prev[comboId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [comboId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [comboId]: next };
    });
  }

  function handleConfirm() {
    if (!selectedMovie || !selectedShowtime) return;
    const params = new URLSearchParams({
      resourceId: selectedShowtime.id,
      resourceName: `${selectedMovie.title} - ${selectedShowtime.time} - ${selectedShowtime.hall}`,
      type: 'cinema',
      amount: String(totalPrice),
      seats: selectedSeats.join(','),
    });
    router.push(`/booking/${selectedShowtime.id}/confirm?${params.toString()}`);
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'movie', label: 'Chọn phim' },
    { key: 'showtime', label: 'Suất chiếu' },
    { key: 'seats', label: 'Chọn ghế' },
    { key: 'summary', label: 'Thanh toán' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8" />
            <h1 className="text-3xl font-extrabold">Mua Vé Xem Phim</h1>
          </div>
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full transition-all ${
                    step === s.key
                      ? 'bg-white text-purple-800'
                      : steps.indexOf({ key: step, label: '' } as any) > i
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-700 text-purple-300'
                  }`}
                >
                  <span>{i + 1}.</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-purple-400" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Step 1: Movie Selection */}
        {step === 'movie' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Đang chiếu tại rạp</h2>
            {moviesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(movies || []).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => { setSelectedMovie(movie); setStep('showtime'); }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="h-52 bg-gradient-to-br from-purple-900 to-purple-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4">
                        <Film className="w-12 h-12 text-white/50 mb-2" />
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                          <span className="text-white text-xs font-bold">{movie.rating}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-yellow-400 rounded-full px-2 py-0.5">
                        <Star className="w-3 h-3 text-yellow-900 fill-yellow-900" />
                        <span className="text-xs font-bold text-yellow-900">8.5</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">{movie.genre}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {movie.duration} phút
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {movie.showtimes.length} suất chiếu
                        </span>
                      </div>
                      {movie.synopsis && (
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">{movie.synopsis}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Showtime Selection */}
        {step === 'showtime' && selectedMovie && (
          <div>
            <button
              onClick={() => setStep('movie')}
              className="text-gray-500 hover:text-gray-700 text-sm mb-4 flex items-center gap-1"
            >
              ← Chọn phim khác
            </button>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-28 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Film className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedMovie.title}</h2>
                  <p className="text-gray-500 text-sm mt-1">{selectedMovie.genre}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold text-xs">
                      {selectedMovie.rating}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedMovie.duration} phút
                    </span>
                  </div>
                  {selectedMovie.synopsis && (
                    <p className="text-gray-400 text-sm mt-2 max-w-lg">{selectedMovie.synopsis}</p>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4">Chọn suất chiếu</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedMovie.showtimes.map((showtime) => (
                <button
                  key={showtime.id}
                  onClick={() => { setSelectedShowtime(showtime); setStep('seats'); }}
                  className={`bg-white rounded-xl p-4 border-2 text-left hover:border-purple-500 hover:shadow-md transition-all ${
                    selectedShowtime?.id === showtime.id
                      ? 'border-purple-500 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <p className="text-2xl font-extrabold text-purple-700">{showtime.time}</p>
                  <p className="text-sm text-gray-600 mt-1">{showtime.hall}</p>
                  <p className={`text-xs mt-2 font-medium ${
                    showtime.availableSeats < 20 ? 'text-red-500' : 'text-green-600'
                  }`}>
                    {showtime.availableSeats < 20
                      ? `Còn ${showtime.availableSeats} ghế`
                      : `${showtime.availableSeats} ghế trống`}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Seat Selection */}
        {step === 'seats' && selectedShowtime && (
          <div>
            <button
              onClick={() => setStep('showtime')}
              className="text-gray-500 hover:text-gray-700 text-sm mb-4 flex items-center gap-1"
            >
              ← Chọn suất khác
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-800">
                    {selectedMovie?.title} - {selectedShowtime.time} - {selectedShowtime.hall}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {selectedSeats.length} ghế đã chọn
                  </span>
                </div>
                {seatsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <SeatMap
                    seats={seats || []}
                    selectedSeats={selectedSeats}
                    onSeatToggle={toggleSeat}
                  />
                )}
              </div>

              <div className="space-y-4">
                {/* Snack Combos */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                    Combo bắp nước
                  </h3>
                  <div className="space-y-3">
                    {snackCombos.map((combo) => (
                      <div key={combo.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-700 truncate">{combo.name}</p>
                          <p className="text-xs text-gray-400 truncate">{combo.items}</p>
                          <p className="text-sm font-bold text-purple-600 mt-0.5">
                            {formatCurrency(combo.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => adjustCombo(combo.id, -1)}
                            className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-bold text-sm">
                            {selectedCombos[combo.id] || 0}
                          </span>
                          <button
                            onClick={() => adjustCombo(combo.id, 1)}
                            className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800 mb-4">Tổng cộng</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vé ({selectedSeats.length} ghế)</span>
                      <span className="font-medium">{formatCurrency(seatPrice)}</span>
                    </div>
                    {comboPrice > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Combo bắp nước</span>
                        <span className="font-medium">{formatCurrency(comboPrice)}</span>
                      </div>
                    )}
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng</span>
                      <span className="text-purple-700">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep('summary')}
                    disabled={selectedSeats.length === 0}
                    className="w-full mt-4 bg-purple-700 hover:bg-purple-800"
                    size="lg"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 'summary' && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setStep('seats')}
              className="text-gray-500 hover:text-gray-700 text-sm mb-4 flex items-center gap-1"
            >
              ← Chỉnh sửa ghế
            </button>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Xác nhận đặt vé</h2>
              <div className="space-y-4 text-sm">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="font-bold text-purple-800 text-base mb-2">{selectedMovie?.title}</p>
                  <div className="grid grid-cols-2 gap-2 text-gray-600">
                    <div>Suất chiếu: <span className="font-semibold">{selectedShowtime?.time}</span></div>
                    <div>Phòng: <span className="font-semibold">{selectedShowtime?.hall}</span></div>
                    <div className="col-span-2">Ghế: <span className="font-semibold">{selectedSeats.join(', ')}</span></div>
                  </div>
                </div>
                {Object.entries(selectedCombos).length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-bold text-gray-700 mb-2">Combo đã chọn:</p>
                    {Object.entries(selectedCombos).map(([id, qty]) => {
                      const combo = snackCombos.find((c) => c.id === id);
                      return combo ? (
                        <div key={id} className="flex justify-between text-sm">
                          <span>{combo.name} x{qty}</span>
                          <span className="font-semibold">{formatCurrency(combo.price * qty)}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Tổng thanh toán:</span>
                    <span className="text-purple-700">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleConfirm}
                className="w-full mt-6 bg-purple-700 hover:bg-purple-800"
                size="lg"
              >
                Đặt Vé & Thanh Toán
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
