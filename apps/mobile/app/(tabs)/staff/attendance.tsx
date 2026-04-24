import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { attendanceApi } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function AttendanceScreen() {
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  async function handleCheckIn() {
    setLoading(true);
    try {
      const user = await getUser();
      await attendanceApi.checkIn(user._id);
      setLastAction('check-in');
      Alert.alert('✅ Thành công', 'Đã chấm công vào ca!');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể chấm công');
    } finally { setLoading(false); }
  }

  async function handleCheckOut() {
    setLoading(true);
    try {
      const user = await getUser();
      await attendanceApi.checkOut(user._id);
      setLastAction('check-out');
      Alert.alert('✅ Thành công', 'Đã chấm công ra ca!');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể chấm công');
    } finally { setLoading(false); }
  }

  const now = new Date();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ backgroundColor: '#1a3a5c', padding: 24, paddingTop: 60 }}>
        <Text style={{ color: '#93c5fd', fontSize: 14 }}>Chấm công</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 }}>Quản lý ca làm việc</Text>
      </View>

      <View style={{ margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        <Text style={{ fontSize: 48, fontWeight: '800', color: '#1a3a5c' }}>
          {now.getHours().toString().padStart(2,'0')}:{now.getMinutes().toString().padStart(2,'0')}
        </Text>
        <Text style={{ fontSize: 16, color: '#64748b', marginTop: 4 }}>
          {now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <View style={{ margin: 16, gap: 12 }}>
        <TouchableOpacity onPress={handleCheckIn} disabled={loading}
          style={{ backgroundColor: '#10b981', borderRadius: 12, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {loading ? <ActivityIndicator color="#fff" /> : <>
            <Ionicons name="log-in-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Vào Ca (Check-in)</Text>
          </>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCheckOut} disabled={loading}
          style={{ backgroundColor: '#ef4444', borderRadius: 12, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {loading ? <ActivityIndicator color="#fff" /> : <>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Ra Ca (Check-out)</Text>
          </>}
        </TouchableOpacity>
      </View>

      {lastAction && (
        <View style={{ margin: 16, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
          <Text style={{ color: '#166534', fontWeight: '600' }}>✅ Đã {lastAction === 'check-in' ? 'vào ca' : 'ra ca'} lúc {new Date().toLocaleTimeString('vi-VN')}</Text>
        </View>
      )}
    </ScrollView>
  );
}
