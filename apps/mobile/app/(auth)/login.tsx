import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { authApi } from '@/lib/api';
import { saveToken, saveUser } from '@/lib/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin'); return; }
    setLoading(true);
    try {
      const res: any = await authApi.login(email, password);
      await saveToken(res.access_token);
      await saveUser(res.user);
      const role = res.user?.role;
      if (role === 'admin' || role === 'branch_manager' || role === 'accountant') {
        router.replace('/(tabs)/manager');
      } else {
        router.replace('/(tabs)/staff');
      }
    } catch (err: any) {
      Alert.alert('Đăng nhập thất bại', err.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#1a3a5c', justifyContent: 'center', padding: 24 }}>
        <View style={{ marginBottom: 48, alignItems: 'center' }}>
          <Text style={{ color: '#f59e0b', fontSize: 36, fontWeight: '800' }}>🏢</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 12 }}>Chuỗi Kinh Doanh</Text>
          <Text style={{ color: '#93c5fd', fontSize: 14, marginTop: 4 }}>Hệ thống quản lý đa ngành</Text>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, gap: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#1a3a5c', textAlign: 'center' }}>Đăng Nhập</Text>
          
          <View>
            <Text style={{ fontSize: 14, color: '#374151', marginBottom: 6, fontWeight: '500' }}>Email</Text>
            <TextInput
              value={email} onChangeText={setEmail}
              placeholder="your@email.com" autoCapitalize="none" keyboardType="email-address"
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 16 }}
            />
          </View>
          
          <View>
            <Text style={{ fontSize: 14, color: '#374151', marginBottom: 6, fontWeight: '500' }}>Mật khẩu</Text>
            <TextInput
              value={password} onChangeText={setPassword}
              placeholder="••••••••" secureTextEntry
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, fontSize: 16 }}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin} disabled={loading}
            style={{ backgroundColor: '#1a3a5c', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4 }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Đăng Nhập</Text>}
          </TouchableOpacity>
        </View>
        
        <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 24, fontSize: 12 }}>
          Chuỗi Kinh Doanh © 2024 • v1.0.0
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
