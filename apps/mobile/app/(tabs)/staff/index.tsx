import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '@/lib/auth';
import { invoicesApi, bookingsApi, attendanceApi } from '@/lib/api';

export default function StaffHome() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    const u = await getUser();
    setUser(u);
    try {
      const s = await invoicesApi.stats({ period: 'today' });
      setStats(s);
    } catch {}
  }

  useEffect(() => { loadData(); }, []);

  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const quickActions = [
    { icon: 'time', label: 'Chấm công', route: '/(tabs)/staff/attendance', color: '#3b82f6' },
    { icon: 'cart', label: 'Bán hàng', route: '/(tabs)/staff/pos', color: '#10b981' },
    { icon: 'calendar', label: 'Đặt phòng', route: '/(tabs)/staff/profile', color: '#8b5cf6' },
    { icon: 'person', label: 'Hồ sơ', route: '/(tabs)/staff/profile', color: '#f59e0b' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <View style={{ backgroundColor: '#1a3a5c', padding: 24, paddingTop: 60 }}>
        <Text style={{ color: '#93c5fd', fontSize: 14 }}>Xin chào 👋</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 }}>{user?.fullName || 'Nhân viên'}</Text>
        <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2, color: '#93c5fd' }}>{user?.role === 'staff' ? 'Nhân viên' : user?.role}</Text>
      </View>

      {/* Today Stats */}
      <View style={{ margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 }}>Hôm nay</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1a3a5c' }}>{stats.count || 0}</Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Đơn hàng</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#e2e8f0' }} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#10b981' }}>{(stats.totalRevenue / 1e6 || 0).toFixed(1)}M</Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Doanh thu</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#e2e8f0' }} />
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#f59e0b' }}>{(stats.avgOrder / 1000 || 0).toFixed(0)}K</Text>
            <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>TB/đơn</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ margin: 16, marginTop: 0 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 }}>Thao tác nhanh</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.label} onPress={() => router.push(action.route as any)}
              style={{ width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: action.color + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
