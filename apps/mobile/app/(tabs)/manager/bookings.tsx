import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { bookingsApi } from '@/lib/api';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xác nhận', color: '#92400e', bg: '#fef3c7' },
  confirmed: { label: 'Đã xác nhận', color: '#1d4ed8', bg: '#dbeafe' },
  checked_in: { label: 'Đã nhận phòng', color: '#166534', bg: '#dcfce7' },
  checked_out: { label: 'Đã trả phòng', color: '#374151', bg: '#f3f4f6' },
  cancelled: { label: 'Đã huỷ', color: '#991b1b', bg: '#fee2e2' },
};

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  async function loadData() {
    try {
      const data: any = await bookingsApi.list(filter !== 'all' ? { status: filter } : {});
      setBookings(Array.isArray(data) ? data : data?.data || []);
    } catch {}
  }
  useEffect(() => { loadData(); }, [filter]);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  async function handleCheckIn(id: string) {
    try { await bookingsApi.checkIn(id); Alert.alert('✅', 'Đã check-in thành công'); loadData(); } catch (e: any) { Alert.alert('Lỗi', e.message); }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ backgroundColor: '#1a3a5c', padding: 24, paddingTop: 60 }}>
        <Text style={{ color: '#93c5fd', fontSize: 14 }}>Quản lý đặt phòng</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 }}>Danh sách đặt phòng</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ margin: 12 }}>
        {['all', 'pending', 'confirmed', 'checked_in', 'checked_out'].map((s) => (
          <TouchableOpacity key={s} onPress={() => setFilter(s)}
            style={{ backgroundColor: filter === s ? '#1a3a5c' : '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' }}>
            <Text style={{ color: filter === s ? '#fff' : '#64748b', fontSize: 13, fontWeight: '600' }}>
              {s === 'all' ? 'Tất cả' : STATUS_MAP[s]?.label || s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ margin: 12, gap: 10 }}>
        {bookings.map((b, i) => {
          const st = STATUS_MAP[b.status] || STATUS_MAP.pending;
          return (
            <View key={b._id || i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontWeight: '700', color: '#1a3a5c' }}>{b.bookingNo}</Text>
                <View style={{ backgroundColor: st.bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: st.color }}>{st.label}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: '#374151' }}>{b.guestName || b.customerId?.fullName || 'Khách lẻ'}</Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {b.industry?.toUpperCase()} • {b.resourceName || 'N/A'} • {new Date(b.startDate).toLocaleDateString('vi-VN')}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', color: '#1a3a5c' }}>{(b.totalAmount || 0).toLocaleString('vi-VN')}đ</Text>
                {b.status === 'confirmed' && (
                  <TouchableOpacity onPress={() => handleCheckIn(b._id)}
                    style={{ backgroundColor: '#10b981', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Check-in</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        {bookings.length === 0 && (
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 40 }}>📅</Text>
            <Text style={{ color: '#64748b', marginTop: 8 }}>Không có đặt phòng nào</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
