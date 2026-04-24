import Link from 'next/link';
import { Hotel, Coffee, Film, ArrowRight, Star, Users, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient text-white min-h-[85vh] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium">Hơn 50.000 khách hàng tin tưởng</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Trải Nghiệm
              <br />
              <span className="text-accent">Dịch Vụ</span>
              <br />
              Đẳng Cấp
            </h1>

            <p className="text-xl md:text-2xl text-blue-200 mb-10 leading-relaxed max-w-2xl">
              Đặt phòng khách sạn, bàn cafe, vé xem phim chỉ trong vài bước.
              Tích điểm thành viên và nhận ưu đãi hấp dẫn mỗi ngày.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/booking">
                <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Đặt Dịch Vụ Ngay
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 border-0"
                >
                  Đăng Ký Miễn Phí
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
              {[
                { label: 'Khách sạn & Khu nghỉ dưỡng', value: '50+' },
                { label: 'Quán cafe toàn quốc', value: '200+' },
                { label: 'Rạp chiếu phim', value: '30+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-accent">{stat.value}</p>
                  <p className="text-blue-300 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Dịch Vụ Của Chúng Tôi</h2>
            <p className="section-subtitle">Khám phá đa dạng dịch vụ cao cấp trong một hệ sinh thái</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hotel Card */}
            <div className="group card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-primary to-primary-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/400/200?random=1')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Hotel className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Khách Sạn</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  Hơn 50 khách sạn và khu nghỉ dưỡng cao cấp trên toàn quốc. Phòng được trang bị đầy đủ tiện nghi, view đẹp, dịch vụ chuyên nghiệp.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Giá từ</p>
                    <p className="text-lg font-bold text-primary">900.000đ<span className="text-sm font-normal text-gray-500">/đêm</span></p>
                  </div>
                  <Link href="/booking/hotel">
                    <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Đặt Ngay
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Cafe Card */}
            <div className="group card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-amber-600 to-amber-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/400/200?random=2')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Coffee className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quán Cafe</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  200+ quán cafe phong cách, không gian ấm cúng. Đặt bàn trước để đảm bảo chỗ ngồi ưng ý trong các dịp đặc biệt.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Miễn phí</p>
                    <p className="text-lg font-bold text-amber-700">Đặt bàn<span className="text-sm font-normal text-gray-500"> trước</span></p>
                  </div>
                  <Link href="/booking/cafe">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Đặt Bàn
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Cinema Card */}
            <div className="group card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="h-48 bg-gradient-to-br from-purple-700 to-purple-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/400/200?random=3')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Film className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Rạp Phim</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                  30+ rạp chiếu phim hiện đại, công nghệ IMAX và Dolby Atmos. Chọn phim, chọn ghế, thanh toán online cực tiện.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Vé từ</p>
                    <p className="text-lg font-bold text-purple-700">90.000đ<span className="text-sm font-normal text-gray-500">/vé</span></p>
                  </div>
                  <Link href="/booking/cinema">
                    <Button size="sm" className="bg-purple-700 hover:bg-purple-800" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Mua Vé
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="section-subtitle">Cam kết mang đến trải nghiệm tốt nhất cho bạn</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: 'Chất Lượng Đảm Bảo',
                desc: 'Tất cả dịch vụ được kiểm duyệt nghiêm ngặt, đảm bảo chất lượng cao nhất.',
                color: 'text-yellow-500 bg-yellow-50',
              },
              {
                icon: Clock,
                title: 'Đặt Dịch Vụ 24/7',
                desc: 'Hệ thống hoạt động liên tục, đặt dịch vụ bất cứ lúc nào bạn muốn.',
                color: 'text-blue-500 bg-blue-50',
              },
              {
                icon: Shield,
                title: 'Thanh Toán An Toàn',
                desc: 'Tích hợp cổng thanh toán VNPay, MoMo, bảo mật thông tin tuyệt đối.',
                color: 'text-green-500 bg-green-50',
              },
              {
                icon: Users,
                title: 'Tích Điểm Thành Viên',
                desc: 'Tích lũy điểm mỗi giao dịch, đổi quà hấp dẫn và lên hạng thành viên.',
                color: 'text-purple-500 bg-purple-50',
              },
            ].map((item) => (
              <div key={item.title} className="text-center group">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA Section */}
      <section className="py-20 bg-hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6">
                Về Chuỗi Kinh Doanh
              </h2>
              <p className="text-blue-200 text-lg leading-relaxed mb-6">
                Chuỗi Kinh Doanh là hệ thống quản lý dịch vụ đa ngành hàng đầu Việt Nam, kết hợp khách sạn, cafe và rạp phim trong một nền tảng thống nhất.
              </p>
              <p className="text-blue-200 leading-relaxed mb-8">
                Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến trải nghiệm liền mạch và đẳng cấp cho mỗi khách hàng. Tham gia chương trình thành viên để nhận ưu đãi độc quyền.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-accent text-primary hover:bg-amber-400 font-bold"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Tham Gia Ngay
                  </Button>
                </Link>
                <Link href="/booking">
                  <Button
                    size="lg"
                    className="bg-white/10 hover:bg-white/20 border border-white/30"
                  >
                    Khám Phá Dịch Vụ
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Khách hàng hài lòng', value: '98%', sub: 'đánh giá 5 sao' },
                { label: 'Giao dịch thành công', value: '500K+', sub: 'mỗi năm' },
                { label: 'Chi nhánh toàn quốc', value: '63', sub: 'tỉnh thành' },
                { label: 'Nhân viên phục vụ', value: '5.000+', sub: 'chuyên nghiệp' },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                  <p className="text-3xl font-extrabold text-accent">{item.value}</p>
                  <p className="text-white font-semibold text-sm mt-1">{item.label}</p>
                  <p className="text-blue-300 text-xs mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
