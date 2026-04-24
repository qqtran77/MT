'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { bookingApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  CheckCircle,
  CreditCard,
  Wallet,
  Banknote,
  Hotel,
  Coffee,
  Film,
  Loader2,
  User,
  Phone,
  Mail,
} from 'lucide-react';

const schema = z.object({
  customerName: z.string().min(2, 'Vui lòng nhập tên (ít nhất 2 ký tự)'),
  customerPhone: z
    .string()
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ (10-11 số)'),
  customerEmail: z.string().email('Email không hợp lệ'),
});

type FormData = z.infer<typeof schema>;

type PaymentMethod = 'vnpay' | 'momo' | 'full' | 'deposit' | 'at_checkin';

const serviceIcons = {
  hotel: Hotel,
  cafe: Coffee,
  cinema: Film,
};

function ConfirmPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const resourceId = searchParams.get('resourceId') || '';
  const resourceName = searchParams.get('resourceName') || 'Dịch vụ';
  const type = (searchParams.get('type') || 'hotel') as 'hotel' | 'cafe' | 'cinema';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const amount = Number(searchParams.get('amount') || 0);
  const seats = searchParams.get('seats') || '';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vnpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const depositAmount = Math.round(amount * 0.3);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const booking = await bookingApi.createBooking({
        industry: type,
        type,
        resourceId,
        resourceName,
        guestName: data.customerName,
        guestPhone: data.customerPhone,
        guestEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        totalAmount: amount,
        depositAmount: paymentMethod === 'deposit' ? depositAmount : 0,
        paymentMethod,
        startDate: checkIn || date || new Date().toISOString().split('T')[0],
        endDate: checkOut || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        note: seats ? `Ghế: ${seats}` : undefined,
      } as any);
      const ref = (booking as any)?.bookingNo || (booking as any)?.referenceCode || `CKD-${Date.now().toString(36).toUpperCase()}`;
      router.push(`/booking/success?ref=${ref}&name=${encodeURIComponent(data.customerName)}&amount=${amount}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Đặt dịch vụ thất bại. Vui lòng thử lại.';
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ServiceIcon = serviceIcons[type];

  const paymentOptions: { id: PaymentMethod; label: string; desc: string; icon: React.ElementType }[] = [
    { id: 'vnpay', label: 'VNPay', desc: 'Thanh toán qua cổng VNPay', icon: CreditCard },
    { id: 'momo', label: 'MoMo', desc: 'Ví điện tử MoMo', icon: Wallet },
    { id: 'full', label: 'Thanh toán đủ', desc: `Thanh toán toàn bộ ${formatCurrency(amount)}`, icon: Banknote },
    { id: 'deposit', label: 'Đặt cọc 30%', desc: `Đặt cọc ${formatCurrency(depositAmount)} ngay`, icon: CreditCard },
    ...(type === 'hotel' ? [{ id: 'at_checkin' as PaymentMethod, label: 'Thanh toán tại khách sạn', desc: 'Thanh toán khi nhận phòng', icon: Hotel }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ServiceIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">Xác Nhận Đặt Dịch Vụ</h1>
          <p className="text-gray-500 mt-2">Vui lòng kiểm tra thông tin trước khi xác nhận</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Form */}
          <div className="md:col-span-3 space-y-5">
            {/* Booking Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Chi tiết đặt dịch vụ
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Dịch vụ</dt>
                  <dd className="font-semibold text-gray-800 text-right max-w-[60%]">{resourceName}</dd>
                </div>
                {checkIn && <div className="flex justify-between">
                  <dt className="text-gray-500">Nhận phòng</dt>
                  <dd className="font-semibold">{checkIn}</dd>
                </div>}
                {checkOut && <div className="flex justify-between">
                  <dt className="text-gray-500">Trả phòng</dt>
                  <dd className="font-semibold">{checkOut}</dd>
                </div>}
                {date && <div className="flex justify-between">
                  <dt className="text-gray-500">Ngày</dt>
                  <dd className="font-semibold">{date}</dd>
                </div>}
                {time && <div className="flex justify-between">
                  <dt className="text-gray-500">Giờ</dt>
                  <dd className="font-semibold">{time}</dd>
                </div>}
                {seats && <div className="flex justify-between">
                  <dt className="text-gray-500">Ghế</dt>
                  <dd className="font-semibold">{seats}</dd>
                </div>}
                <div className="flex justify-between border-t pt-3">
                  <dt className="font-bold">Tổng tiền</dt>
                  <dd className="font-extrabold text-primary text-lg">{formatCurrency(amount)}</dd>
                </div>
              </dl>
            </div>

            {/* Customer Info Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="font-bold text-gray-800 mb-2">Thông tin khách hàng</h2>

              <div>
                <label className="label">
                  <User className="w-4 h-4 inline mr-1" />
                  Họ và tên *
                </label>
                <input
                  {...register('customerName')}
                  placeholder="Nguyễn Văn A"
                  className="input-field"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Số điện thoại *
                </label>
                <input
                  {...register('customerPhone')}
                  placeholder="0901234567"
                  type="tel"
                  className="input-field"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  {...register('customerEmail')}
                  placeholder="example@email.com"
                  type="email"
                  className="input-field"
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="label mb-3 block">Phương thức thanh toán</label>
                <div className="space-y-2">
                  {paymentOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === option.id
                            ? 'border-primary bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.id}
                          checked={paymentMethod === option.id}
                          onChange={() => setPaymentMethod(option.id)}
                          className="sr-only"
                        />
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          paymentMethod === option.id ? 'bg-primary text-white' : 'bg-gray-100'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.desc}</p>
                        </div>
                        {paymentMethod === option.id && (
                          <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* VNPay/MoMo UI Note */}
              {(paymentMethod === 'vnpay' || paymentMethod === 'momo') && (
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 border border-blue-200">
                  <p className="font-semibold">Thanh toán qua {paymentMethod === 'vnpay' ? 'VNPay' : 'MoMo'}</p>
                  <p className="text-xs mt-1 text-blue-500">
                    Bạn sẽ được chuyển đến cổng thanh toán {paymentMethod === 'vnpay' ? 'VNPay' : 'MoMo'} sau khi xác nhận.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Dịch Vụ'}
              </Button>
              {submitError && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  ❌ {submitError}
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <ServiceIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 leading-tight">{resourceName}</p>
                    <p className="text-gray-500 text-xs mt-0.5 capitalize">{type}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(amount)}</span>
                </div>

                {paymentMethod === 'deposit' && (
                  <div className="bg-yellow-50 rounded-xl p-3 text-xs text-yellow-700 border border-yellow-200">
                    Đặt cọc ngay: <strong>{formatCurrency(depositAmount)}</strong>
                    <br />
                    Thanh toán còn lại: <strong>{formatCurrency(amount - depositAmount)}</strong>
                  </div>
                )}

                <div className="bg-green-50 rounded-xl p-3 border border-green-200 text-xs text-green-700">
                  <p className="font-semibold mb-1">Cam kết của chúng tôi:</p>
                  <ul className="space-y-0.5 text-green-600">
                    <li>✓ Xác nhận qua email ngay lập tức</li>
                    <li>✓ Hoàn tiền 100% nếu hủy đúng hạn</li>
                    <li>✓ Hỗ trợ 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ConfirmPageContent />
    </Suspense>
  );
}
