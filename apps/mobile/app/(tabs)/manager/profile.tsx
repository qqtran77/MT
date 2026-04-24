import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUser, removeToken } from '@/lib/auth';

export default function ManagerProfile() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => { getUser().then(setUser); }, []);

  async function handleLogout() {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: async () => { await removeToken(); router.replace('/(auth)/login'); } }
    ]);
  }

  const roleLabel: Record<string, string> = { admin: 'Admin hệ thống', branch_manager: 'Quản lý chi nhánh', accountant: 'Kế toán' };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ backgroundColor: '#1a3a5c', padding: 24, paddingTop: 60, alignItems: 'center' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 36 }}>👔</Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{user?.fullName || 'Quản lý'}</Text>
        <Text style={{ color: '#93c5fd', fontSize: 14, marginTop: 4 }}>{user?.email}</Text>
        <View style={{ backgroundColor: '#f59e0b', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8 }}>
          <Text style={{ color: '#1a3a5c', fontSize: 12, fontWeight: '700' }}>{roleLabel[user?.role] || user?.role}</Text>
        </View>
      </View>

      <View style={{ margin: 16, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        {[
          { icon: 'business-outline', label: 'Thông tin chi nhánh', onPress: () => {} },
          { icon: 'stats-chart-outline', label: 'Báo cáo chi tiết', onPress: () => {} },
          { icon: 'settings-outline', label: 'Cài đặt hệ thống', onPress: () => {} },
          { icon: 'help-circle-outline', label: 'Hỗ trợ kỹ thuật', onPress: () => {} },
        ].map((item, i) => (
          <TouchableOpacity key={item.label} onPress={item.onPress}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < 3 ? 1 : 0, borderBottomColor: '#f1f5f9' }}>
            <Ionicons name={item.icon as any} size={20} color="#64748b" />
            <Text style={{ flex: 1, marginLeft: 12, fontSize: 15, color: '#374151' }}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={handleLogout}
        style={{ margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#fecaca' }}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: '600' }}>Đăng Xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
