import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { staffApi } from '@/lib/api';

export default function ManagerStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try { const data: any = await staffApi.list(); setStaff(Array.isArray(data) ? data : data?.data || []); } catch {}
  }
  useEffect(() => { loadData(); }, []);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ backgroundColor: '#1a3a5c', padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View>
          <Text style={{ color: '#93c5fd', fontSize: 14 }}>Quản lý nhân sự</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 }}>Danh sách nhân viên</Text>
        </View>
        <View style={{ backgroundColor: '#f59e0b', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: '#1a3a5c', fontWeight: '700' }}>{staff.length} NV</Text>
        </View>
      </View>

      <View style={{ margin: 16, gap: 10 }}>
        {staff.length === 0 ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 40 }}>👥</Text>
            <Text style={{ color: '#64748b', marginTop: 8 }}>Chưa có dữ liệu nhân viên</Text>
          </View>
        ) : staff.map((s, i) => (
          <View key={s._id || i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#1a3a5c20', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b' }}>{s.fullName}</Text>
              <Text style={{ fontSize: 13, color: '#64748b' }}>{s.position || 'Nhân viên'} • {s.employeeCode}</Text>
            </View>
            <View style={{ backgroundColor: s.isActive !== false ? '#dcfce7' : '#fee2e2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: s.isActive !== false ? '#166534' : '#991b1b' }}>{s.isActive !== false ? 'Đang làm' : 'Nghỉ'}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
