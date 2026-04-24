import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Chuỗi Kinh Doanh - Trải Nghiệm Đẳng Cấp',
    template: '%s | Chuỗi Kinh Doanh',
  },
  description:
    'Hệ thống đặt phòng khách sạn, bàn cafe và vé xem phim hàng đầu Việt Nam. Trải nghiệm dịch vụ đẳng cấp cùng Chuỗi Kinh Doanh.',
  keywords: ['khách sạn', 'cafe', 'rạp phim', 'đặt phòng', 'Việt Nam'],
  authors: [{ name: 'Chuỗi Kinh Doanh' }],
  openGraph: {
    title: 'Chuỗi Kinh Doanh',
    description: 'Trải Nghiệm Dịch Vụ Đẳng Cấp',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
