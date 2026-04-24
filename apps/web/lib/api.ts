import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// ============ Types ============
export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  available: boolean;
  images?: string[];
  description?: string;
}

export interface CafeTable {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  zone: string;
  x: number;
  y: number;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  rating: string;
  synopsis?: string;
  poster?: string;
  showtimes: Showtime[];
}

export interface Showtime {
  id: string;
  movieId: string;
  time: string;
  hall: string;
  availableSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  col: number;
  status: 'available' | 'occupied' | 'selected';
  price: number;
  type: 'standard' | 'vip';
}

export interface Booking {
  id: string;
  type: 'hotel' | 'cafe' | 'cinema';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  depositAmount?: number;
  paymentMethod?: string;
  checkIn?: string;
  checkOut?: string;
  resourceId: string;
  resourceName: string;
  createdAt: string;
  referenceCode?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  points: number;
  tier: 'silver' | 'gold' | 'platinum';
  bookings?: Booking[];
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
}

// ============ Auth API ============
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    // Backend trả về { data: { access_token, user } } hoặc { access_token, user }
    const payload = res.data?.data || res.data;
    return { token: payload?.access_token, user: payload?.user };
  },
  register: async (data: any) => {
    const res = await apiClient.post('/auth/register', data);
    const payload = res.data?.data || res.data;
    return { token: payload?.access_token, user: payload?.user };
  },
  getProfile: async (): Promise<Customer> => {
    const res = await apiClient.get('/auth/me');
    return res.data?.data || res.data;
  },
};

// ============ Hotel API ============
export const hotelApi = {
  getAvailableRooms: async (params: {
    checkIn: string;
    checkOut: string;
    capacity?: number;
  }): Promise<Room[]> => {
    try {
      const res = await apiClient.get('/resources', {
        params: { type: 'hotel', ...params },
      });
      return res.data;
    } catch {
      return getMockRooms();
    }
  },
  getRoomById: async (id: string): Promise<Room> => {
    const res = await apiClient.get(`/resources/${id}`);
    return res.data;
  },
};

// ============ Cafe API ============
export const cafeApi = {
  getTables: async (params: { date: string; time: string }): Promise<CafeTable[]> => {
    try {
      const res = await apiClient.get('/resources', {
        params: { type: 'cafe', ...params },
      });
      return res.data;
    } catch {
      return getMockTables();
    }
  },
};

// ============ Cinema API ============
export const cinemaApi = {
  getMovies: async (): Promise<Movie[]> => {
    try {
      const res = await apiClient.get('/resources', { params: { type: 'cinema' } });
      return res.data;
    } catch {
      return getMockMovies();
    }
  },
  getSeats: async (showtimeId: string): Promise<Seat[]> => {
    try {
      const res = await apiClient.get(`/showtimes/${showtimeId}/seats`);
      return res.data;
    } catch {
      return getMockSeats();
    }
  },
};

// ============ Booking API ============
export const bookingApi = {
  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    const res = await apiClient.post('/bookings', data);
    return res.data;
  },
  getBookingById: async (id: string): Promise<Booking> => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data;
  },
  getMyBookings: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings/my');
    return res.data;
  },
  confirmPayment: async (bookingId: string, method: string): Promise<Booking> => {
    const res = await apiClient.post(`/bookings/${bookingId}/payment`, { method });
    return res.data;
  },
};

// ============ Customer API ============
export const customerApi = {
  getProfile: async (): Promise<Customer> => {
    const res = await apiClient.get('/customers/profile');
    return res.data;
  },
  getTransactions: async (): Promise<Transaction[]> => {
    const res = await apiClient.get('/customers/transactions');
    return res.data;
  },
};

// ============ Mock Data ============
export function getMockRooms(): Room[] {
  return [
    {
      id: 'room-1',
      name: 'Phòng Deluxe View Biển',
      type: 'Deluxe',
      capacity: 2,
      pricePerNight: 1500000,
      amenities: ['Wi-Fi', 'TV', 'Điều hòa', 'Mini bar', 'View biển'],
      available: true,
      description: 'Phòng deluxe sang trọng với view biển tuyệt đẹp',
    },
    {
      id: 'room-2',
      name: 'Phòng Superior Garden',
      type: 'Superior',
      capacity: 2,
      pricePerNight: 1200000,
      amenities: ['Wi-Fi', 'TV', 'Điều hòa', 'View vườn'],
      available: true,
      description: 'Phòng superior yên tĩnh nhìn ra vườn xanh',
    },
    {
      id: 'room-3',
      name: 'Suite Gia Đình',
      type: 'Suite',
      capacity: 4,
      pricePerNight: 2800000,
      amenities: ['Wi-Fi', '2 TV', 'Điều hòa', 'Bồn tắm', 'Phòng khách riêng'],
      available: true,
      description: 'Suite rộng rãi lý tưởng cho gia đình',
    },
    {
      id: 'room-4',
      name: 'Phòng Standard Twin',
      type: 'Standard',
      capacity: 2,
      pricePerNight: 900000,
      amenities: ['Wi-Fi', 'TV', 'Điều hòa'],
      available: false,
      description: 'Phòng tiêu chuẩn 2 giường đơn',
    },
    {
      id: 'room-5',
      name: 'Penthouse Hạng Sang',
      type: 'Penthouse',
      capacity: 6,
      pricePerNight: 5500000,
      amenities: ['Wi-Fi', '3 TV', 'Điều hòa', 'Hồ bơi riêng', 'Bếp đầy đủ', 'Butler'],
      available: true,
      description: 'Penthouse đỉnh cao xa xỉ với toàn bộ tiện nghi',
    },
    {
      id: 'room-6',
      name: 'Phòng Executive',
      type: 'Executive',
      capacity: 2,
      pricePerNight: 2100000,
      amenities: ['Wi-Fi', 'TV', 'Điều hòa', 'Phòng làm việc', 'Club lounge'],
      available: true,
      description: 'Phòng executive dành cho doanh nhân',
    },
  ];
}

export function getMockTables(): CafeTable[] {
  const tables: CafeTable[] = [];
  const statuses: Array<'available' | 'occupied' | 'reserved'> = ['available', 'occupied', 'reserved'];
  for (let i = 1; i <= 20; i++) {
    tables.push({
      id: `table-${i}`,
      number: i,
      capacity: i % 4 === 0 ? 6 : i % 3 === 0 ? 4 : 2,
      status: i % 5 === 0 ? 'occupied' : i % 7 === 0 ? 'reserved' : 'available',
      zone: i <= 10 ? 'Tầng 1' : 'Tầng 2',
      x: ((i - 1) % 5) * 110 + 20,
      y: Math.floor((i - 1) / 5) * 90 + 30,
    });
  }
  return tables;
}

export function getMockMovies(): Movie[] {
  return [
    {
      id: 'movie-1',
      title: 'Lật Mặt 7: Một Điều Ước',
      genre: 'Hài, Gia Đình',
      duration: 128,
      rating: 'T13',
      synopsis: 'Bộ phim hài gia đình đặc sắc của đạo diễn Lý Hải',
      showtimes: [
        { id: 'st-1', movieId: 'movie-1', time: '09:00', hall: 'Phòng 1', availableSeats: 80 },
        { id: 'st-2', movieId: 'movie-1', time: '11:30', hall: 'Phòng 2', availableSeats: 45 },
        { id: 'st-3', movieId: 'movie-1', time: '14:00', hall: 'Phòng 1', availableSeats: 12 },
        { id: 'st-4', movieId: 'movie-1', time: '19:30', hall: 'Phòng 3', availableSeats: 90 },
      ],
    },
    {
      id: 'movie-2',
      title: 'Deadpool & Wolverine',
      genre: 'Hành Động, Siêu Anh Hùng',
      duration: 128,
      rating: 'T18',
      synopsis: 'Cuộc gặp gỡ huyền thoại của hai siêu anh hùng Marvel',
      showtimes: [
        { id: 'st-5', movieId: 'movie-2', time: '10:00', hall: 'Phòng 4', availableSeats: 60 },
        { id: 'st-6', movieId: 'movie-2', time: '13:00', hall: 'Phòng 4', availableSeats: 30 },
        { id: 'st-7', movieId: 'movie-2', time: '16:00', hall: 'Phòng 5', availableSeats: 78 },
        { id: 'st-8', movieId: 'movie-2', time: '20:00', hall: 'Phòng 4', availableSeats: 5 },
      ],
    },
    {
      id: 'movie-3',
      title: 'Godzilla x Kong: Đế Chế Mới',
      genre: 'Hành Động, Khoa Học Viễn Tưởng',
      duration: 115,
      rating: 'T13',
      synopsis: 'Hai quái vật huyền thoại đối đầu trong cuộc chiến mới',
      showtimes: [
        { id: 'st-9', movieId: 'movie-3', time: '08:30', hall: 'Phòng 6', availableSeats: 100 },
        { id: 'st-10', movieId: 'movie-3', time: '11:00', hall: 'Phòng 6', availableSeats: 55 },
        { id: 'st-11', movieId: 'movie-3', time: '15:30', hall: 'Phòng 6', availableSeats: 88 },
        { id: 'st-12', movieId: 'movie-3', time: '18:30', hall: 'Phòng 7', availableSeats: 40 },
      ],
    },
  ];
}

export function getMockSeats(): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const cols = 12;

  rows.forEach((row) => {
    for (let col = 1; col <= cols; col++) {
      const isVip = row === 'E' || row === 'F' || row === 'G';
      const hash = (row.charCodeAt(0) + col * 7) % 10;
      seats.push({
        id: `${row}${col}`,
        row,
        col,
        status: hash < 3 ? 'occupied' : 'available',
        price: isVip ? 120000 : 90000,
        type: isVip ? 'vip' : 'standard',
      });
    }
  });

  return seats;
}
