'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Hotel, Coffee, Film, ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type ServiceTab = 'hotel' | 'cafe' | 'cinema';

const tabs = [
  { id: 'hotel' as ServiceTab, label: 'Khách Sạn', icon: Hotel, color: 'text-primary' },
  { id: 'cafe' as ServiceTab, label: 'Cafe', icon: Coffee, color: 'text-amber-700' },
  { id: 'cinema' as ServiceTab, label: 'Rạp Phim', icon: Film, color: 'text-purple-700' },
];

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<ServiceTab>('hotel');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-hero-gradient text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-3">Đặt Dịch Vụ</h1>
          <p className="text-blue-200 text-lg">Chọn dịch vụ và thời gian phù hợp với bạn</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold border-b-2 transition-all ${
                    isActive
                      ? `border-primary ${tab.color} bg-primary-50`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'hotel' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Hotel className="w-5 h-5 text-primary" />
                  Tìm Phòng Khách Sạn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  <div>
                    <label className="label">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Ngày nhận phòng
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Ngày trả phòng
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <Users className="w-4 h-4 inline mr-1" />
                      Số khách
                    </label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} khách</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Link
                  href={`/booking/hotel?checkIn=${checkIn}&checkOut=${checkOut}&capacity=${partySize}`}
                >
                  <Button size="lg" className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Kiểm Tra Phòng Trống
                  </Button>
                </Link>
              </div>
            )}

            {activeTab === 'cafe' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-700" />
                  Đặt Bàn Cafe
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  <div>
                    <label className="label">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Ngày đặt bàn
                    </label>
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
                      Giờ đến
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="input-field"
                    />
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
                <Link href={`/booking/cafe?date=${date}&time=${time}&size=${partySize}`}>
                  <Button
                    size="lg"
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Xem Bàn Trống
                  </Button>
                </Link>
              </div>
            )}

            {activeTab === 'cinema' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-700" />
                  Mua Vé Xem Phim
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="label">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Ngày xem phim
                    </label>
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
                      <Users className="w-4 h-4 inline mr-1" />
                      Số vé
                    </label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} vé</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Link href="/booking/cinema">
                  <Button
                    size="lg"
                    className="w-full bg-purple-700 hover:bg-purple-800"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Chọn Phim & Suất Chiếu
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Service Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link key={tab.id} href={`/booking/${tab.id}`}>
                <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-primary hover:shadow-md transition-all group flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className={`w-6 h-6 ${tab.color} group-hover:text-white`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{tab.label}</p>
                    <p className="text-xs text-gray-500">Đặt trực tuyến</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
