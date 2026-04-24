'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Calendar, Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || 'CKD-XXXXXXXX';
  const name = searchParams.get('name') || 'Khách hàng';
  const amount = Number(searchParams.get('amount') || 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Green header */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white py-10 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white/10 rounded-full"
                  style={{
                    width: `${60 + i * 30}px`,
                    height: `${60 + i * 30}px`,
                    top: `${-20 + i * 10}%`,
                    left: `${10 + i * 20}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-extrabold mb-1">Đặt Dịch Vụ Thành Công!</h1>
              <p className="text-green-100">Cảm ơn bạn, {name}!</p>
            </div>
          </div>

          {/* Booking Ref */}
          <div className="px-6 py-5 bg-green-50 border-b border-green-100 text-center">
            <p className="text-sm text-gray-600 mb-1">Mã đặt dịch vụ của bạn</p>
            <p className="text-3xl font-extrabold text-primary tracking-widest">{ref}</p>
            <p className="text-xs text-gray-400 mt-1">Lưu lại mã này để tra cứu đặt dịch vụ</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              {[
                { label: 'Khách hàng', value: name },
                ...(amount > 0 ? [{ label: 'Tổng tiền', value: formatCurrency(amount) }] : []),
                { label: 'Trạng thái', value: 'Đã xác nhận ✓' },
                { label: 'Thời gian', value: new Date().toLocaleString('vi-VN') },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 border border-blue-100">
              <p className="font-semibold mb-1">📧 Xác nhận đã được gửi</p>
              <p className="text-blue-500 text-xs">
                Thông tin chi tiết đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors">
                <Download className="w-4 h-4" />
                Tải về PDF
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/profile">
                <Button variant="outline" className="w-full" leftIcon={<Calendar className="w-4 h-4" />}>
                  Xem Lịch Đặt Dịch Vụ
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full" leftIcon={<Home className="w-4 h-4" />}>
                  Về Trang Chủ
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Points earned */}
        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">⭐</div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Bạn vừa tích lũy điểm!</p>
            <p className="text-xs text-gray-500">
              +{Math.round(amount / 1000)} điểm thành viên từ đơn này
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
