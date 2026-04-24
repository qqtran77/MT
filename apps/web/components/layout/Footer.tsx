import Link from 'next/link';
import { Hotel, Coffee, Film, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">CKD</span>
              </div>
              <div>
                <p className="font-bold text-lg">Chuỗi Kinh Doanh</p>
                <p className="text-blue-300 text-xs">Trải nghiệm đẳng cấp</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              Hệ thống quản lý và đặt dịch vụ tích hợp hàng đầu Việt Nam, mang đến trải nghiệm đẳng cấp cho mọi khách hàng.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-base mb-4">Dịch Vụ</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/booking/hotel"
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
                >
                  <Hotel className="w-4 h-4" />
                  Khách Sạn
                </Link>
              </li>
              <li>
                <Link
                  href="/booking/cafe"
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
                >
                  <Coffee className="w-4 h-4" />
                  Quán Cafe
                </Link>
              </li>
              <li>
                <Link
                  href="/booking/cinema"
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
                >
                  <Film className="w-4 h-4" />
                  Rạp Phim
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Chương Trình Thành Viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Đặt Dịch Vụ
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Tài Khoản Của Tôi
                </Link>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Chính Sách Bảo Mật
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Điều Khoản Sử Dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-base mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-blue-200 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2 text-blue-200 text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:1800xxxx" className="hover:text-white transition-colors">
                  1800 xxxx (Miễn phí)
                </a>
              </li>
              <li className="flex items-center gap-2 text-blue-200 text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:info@chuoikd.vn" className="hover:text-white transition-colors">
                  info@chuoikd.vn
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <p className="text-xs text-blue-200">Giờ hỗ trợ:</p>
              <p className="text-sm font-medium">7:00 - 22:00 (Thứ 2 - CN)</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-300 text-sm">
            © {new Date().getFullYear()} Chuỗi Kinh Doanh. Bản quyền thuộc về Chuỗi Kinh Doanh Việt Nam.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://via.placeholder.com/60x30/ffffff/1a3a5c?text=VNPay" alt="VNPay" className="h-7 rounded opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://via.placeholder.com/60x30/ffffff/1a3a5c?text=MoMo" alt="MoMo" className="h-7 rounded opacity-70 hover:opacity-100 transition-opacity" />
            <img src="https://via.placeholder.com/60x30/ffffff/1a3a5c?text=Visa" alt="Visa" className="h-7 rounded opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
}
