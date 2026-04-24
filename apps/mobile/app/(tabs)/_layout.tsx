import { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getToken, getUser } from '@/lib/auth';
import { View, ActivityIndicator } from 'react-native';

export default function TabsLayout() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) { router.replace('/(auth)/login'); return; }
      const user = await getUser();
      setRole(user?.role || 'staff');
      setLoading(false);
    })();
  }, []);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#1a3a5c" /></View>;

  const isManager = role === 'admin' || role === 'branch_manager' || role === 'accountant';

  if (isManager) {
    return (
      <Tabs screenOptions={{ tabBarActiveTintColor: '#1a3a5c', tabBarInactiveTintColor: '#9ca3af', headerShown: false }}>
        <Tabs.Screen name="manager/index" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} /> }} />
        <Tabs.Screen name="manager/staff" options={{ title: 'Nhân viên', tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} /> }} />
        <Tabs.Screen name="manager/inventory" options={{ title: 'Kho', tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} /> }} />
        <Tabs.Screen name="manager/bookings" options={{ title: 'Đặt phòng', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} /> }} />
        <Tabs.Screen name="manager/profile" options={{ title: 'Tôi', tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
        <Tabs.Screen name="staff/index" options={{ href: null }} />
        <Tabs.Screen name="staff/attendance" options={{ href: null }} />
        <Tabs.Screen name="staff/pos" options={{ href: null }} />
        <Tabs.Screen name="staff/profile" options={{ href: null }} />
      </Tabs>
    );
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#1a3a5c', tabBarInactiveTintColor: '#9ca3af', headerShown: false }}>
      <Tabs.Screen name="staff/index" options={{ title: 'Trang chủ', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
      <Tabs.Screen name="staff/attendance" options={{ title: 'Chấm công', tabBarIcon: ({ color, size }) => <Ionicons name="time" color={color} size={size} /> }} />
      <Tabs.Screen name="staff/pos" options={{ title: 'Bán hàng', tabBarIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} /> }} />
      <Tabs.Screen name="staff/profile" options={{ title: 'Tôi', tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> }} />
      <Tabs.Screen name="manager/index" options={{ href: null }} />
      <Tabs.Screen name="manager/staff" options={{ href: null }} />
      <Tabs.Screen name="manager/inventory" options={{ href: null }} />
      <Tabs.Screen name="manager/bookings" options={{ href: null }} />
      <Tabs.Screen name="manager/profile" options={{ href: null }} />
    </Tabs>
  );
}
