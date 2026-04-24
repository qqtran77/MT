# 🏢 Chuỗi Kinh Doanh — Multi-Industry Business Chain Management

Hệ thống quản lý chuỗi kinh doanh đa ngành (khách sạn, cafe, rạp phim) — NestJS + MongoDB + Next.js + Expo React Native.

---

## 📁 Cấu trúc dự án

```
chuoi-kinh-doanh/
├── apps/
│   ├── api/          # NestJS Backend (Port 3001)
│   ├── web/          # Next.js 14 Customer Portal (Port 3000)
│   └── mobile/       # Expo React Native (Staff + Manager App)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js 18+
- MongoDB 7+ (hoặc Docker)
- pnpm 8+

### 1. Clone và cài đặt

```bash
git clone https://github.com/YOUR_USERNAME/chuoi-kinh-doanh.git
cd chuoi-kinh-doanh
```

### 2. Cấu hình môi trường

```bash
cp .env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Chỉnh sửa `apps/api/.env`:
```
MONGODB_URI=mongodb://localhost:27017/chuoi-kinh-doanh
JWT_SECRET=your-secret-key-here
PORT=3001
```

### 3. Chạy với Docker (Khuyến nghị)

```bash
docker-compose up -d
```

Sau khi chạy:
- API: http://localhost:3001
- Web: http://localhost:3000
- Swagger: http://localhost:3001/api/docs

### 4. Chạy local (Development)

**Backend:**
```bash
cd apps/api
npm install
npm run start:dev
```

**Frontend Web:**
```bash
cd apps/web
npm install
npm run dev
```

**Mobile App:**
```bash
cd apps/mobile
npm install
npx expo start
# Quét QR bằng Expo Go app
```

### 5. Seed dữ liệu mẫu

```bash
cd apps/api
node seed.js
```

Tài khoản mặc định:
| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| Admin | admin@ckd.vn | Admin@123 |
| Quản lý | manager@ckd.vn | Manager@123 |
| Nhân viên | staff@ckd.vn | Staff@123 |

---

## 📡 API Endpoints chính

| Module | Endpoint | Mô tả |
|--------|----------|-------|
| Auth | POST /auth/login | Đăng nhập |
| Auth | GET /auth/me | Thông tin người dùng |
| Branches | GET /branches | Danh sách chi nhánh |
| Staff | GET /staff | Danh sách nhân viên |
| Attendance | POST /attendance/check-in/:id | Chấm công vào |
| Attendance | POST /attendance/check-out/:id | Chấm công ra |
| Bookings | POST /bookings | Tạo đặt phòng |
| Bookings | POST /bookings/:id/prepay | Tính tiền trước nhận phòng |
| POS | POST /pos/counter-orders | Order tại quầy |
| POS | POST /pos/counter-orders/:id/pay | Thanh toán |
| Revenue | GET /revenue/dashboard | Dashboard doanh thu |
| Inventory | GET /inventory/low-stock | Cảnh báo tồn kho |

📖 Full API docs: http://localhost:3001/api/docs (Swagger)

---

## 🏗️ Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────┐
│                   CLIENT LAYER                        │
│  ┌─────────────────┐      ┌──────────────────────┐   │
│  │  Next.js 14 Web │      │  Expo Mobile App     │   │
│  │  (Customer)     │      │  Staff + Manager     │   │
│  └────────┬────────┘      └──────────┬───────────┘   │
└───────────┼──────────────────────────┼───────────────┘
            │                          │
            ▼                          ▼
┌──────────────────────────────────────────────────────┐
│               NestJS API (Port 3001)                  │
│  Auth │ Branches │ Staff │ Attendance │ Inventory     │
│  Invoices │ Bookings │ POS │ Revenue │ Customers      │
│              Socket.io WebSocket (POS)                │
└───────────────────────┬──────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
     ┌─────────────┐        ┌──────────────┐
     │  MongoDB 7  │        │  Redis Cache │
     └─────────────┘        └──────────────┘
```

---

## 🔑 Phân quyền

| Role | Quyền |
|------|-------|
| `admin` | Toàn quyền hệ thống |
| `branch_manager` | Quản lý chi nhánh của mình |
| `accountant` | Xem báo cáo, quản lý hóa đơn |
| `staff` | Chấm công, POS bán hàng |

---

## 📱 Mobile App

App được build với Expo SDK 51, hỗ trợ iOS & Android.

**Staff tabs:** Trang chủ → Chấm công → Bán hàng POS → Hồ sơ

**Manager tabs:** Dashboard → Nhân viên → Kho → Đặt phòng → Hồ sơ

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS 10, TypeScript, Mongoose, JWT, Socket.io |
| Database | MongoDB 7, Redis |
| Web Frontend | Next.js 14, Tailwind CSS, React Query, shadcn/ui |
| Mobile | Expo SDK 51, React Native, NativeWind, React Query |
| DevOps | Docker, Docker Compose |

---

## 📋 16 Modules

1. Quản lý đăng nhập & phân quyền (RBAC)
2. Quản lý chi nhánh đa ngành
3. Quản lý nhân sự & hợp đồng
4. Chấm công & ca làm việc
5. Quản lý kho hàng & vật tư
6. Quản lý hóa đơn & thanh toán
7. Quản lý đặt phòng / bàn / vé
8. Doanh thu & báo cáo tài chính
9. POS bán hàng tại quầy (WebSocket)
10. Quản lý khách hàng & loyalty points
11. Quản lý menu / dịch vụ
12. Quản lý phòng & amenities (Khách sạn)
13. Quản lý bàn & floor map (Cafe)
14. **Tính tiền trước nhận phòng** (Full / Deposit / Pre-auth)
15. **Order tại quầy** (Dine-in / Take-away / Room charge)
16. Quản lý suất chiếu & ghế (Rạp phim)
