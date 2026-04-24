import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { posApi } from '@/lib/api';

const SAMPLE_PRODUCTS = [
  { id: '1', name: 'Cà phê sữa', price: 35000, category: 'cafe' },
  { id: '2', name: 'Bạc xỉu', price: 30000, category: 'cafe' },
  { id: '3', name: 'Trà sữa', price: 45000, category: 'cafe' },
  { id: '4', name: 'Nước cam', price: 40000, category: 'cafe' },
  { id: '5', name: 'Bánh croissant', price: 25000, category: 'food' },
  { id: '6', name: 'Sandwich', price: 55000, category: 'food' },
];

export default function PosScreen() {
  const [cart, setCart] = useState<any[]>([]);
  const [tableNo, setTableNo] = useState('');
  const [orderType, setOrderType] = useState<'dine_in'|'take_away'>('dine_in');
  const [loading, setLoading] = useState(false);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price } : i);
      return [...prev, { ...product, quantity: 1, total: product.price }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const total = cart.reduce((s, i) => s + i.total, 0);

  async function handlePay(method: string) {
    if (cart.length === 0) { Alert.alert('Lỗi', 'Giỏ hàng trống'); return; }
    setLoading(true);
    try {
      const order = await posApi.createOrder({
        branchId: 'default',
        orderType,
        tableName: tableNo || undefined,
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, unitPrice: i.price, total: i.total })),
      }) as any;
      await posApi.pay(order._id || order.data?._id, { paymentMethod: method });
      Alert.alert('✅ Thanh toán thành công', `Tổng: ${total.toLocaleString('vi-VN')}đ`);
      setCart([]);
      setTableNo('');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo đơn hàng');
    } finally { setLoading(false); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ backgroundColor: '#1a3a5c', padding: 16, paddingTop: 56, flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity onPress={() => setOrderType('dine_in')}
          style={{ flex: 1, backgroundColor: orderType === 'dine_in' ? '#f59e0b' : '#fff2', borderRadius: 8, padding: 8, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>🪑 Tại bàn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrderType('take_away')}
          style={{ flex: 1, backgroundColor: orderType === 'take_away' ? '#f59e0b' : '#fff2', borderRadius: 8, padding: 8, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>🛍️ Mang về</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Products */}
        <ScrollView style={{ flex: 1, padding: 8 }}>
          {orderType === 'dine_in' && (
            <TextInput value={tableNo} onChangeText={setTableNo} placeholder="Số bàn (VD: B01)"
              style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, margin: 4, fontSize: 14, borderWidth: 1, borderColor: '#e2e8f0' }} />
          )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {SAMPLE_PRODUCTS.map((p) => (
              <TouchableOpacity key={p.id} onPress={() => addToCart(p)}
                style={{ width: '48%', margin: '1%', backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 }}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{p.category === 'cafe' ? '☕' : '🍞'}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#1e293b', textAlign: 'center' }}>{p.name}</Text>
                <Text style={{ fontSize: 13, color: '#1a3a5c', fontWeight: '700', marginTop: 2 }}>{(p.price/1000).toFixed(0)}K</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Cart */}
        <View style={{ width: 160, backgroundColor: '#fff', borderLeftWidth: 1, borderLeftColor: '#e2e8f0', padding: 8 }}>
          <Text style={{ fontWeight: '700', color: '#1a3a5c', marginBottom: 8, fontSize: 14 }}>🧾 Giỏ hàng</Text>
          <ScrollView style={{ flex: 1 }}>
            {cart.map((item) => (
              <View key={item.id} style={{ marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, color: '#64748b' }}>x{item.quantity}</Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#1a3a5c' }}>{(item.total/1000).toFixed(0)}K</Text>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Ionicons name="trash-outline" size={14} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={{ borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8, marginTop: 4 }}>
            <Text style={{ fontWeight: '800', color: '#1a3a5c', fontSize: 15, textAlign: 'center' }}>{(total/1000).toFixed(0)}K</Text>
            <TouchableOpacity onPress={() => Alert.alert('Thanh toán', 'Chọn phương thức', [
              { text: '💵 Tiền mặt', onPress: () => handlePay('cash') },
              { text: '💳 Thẻ', onPress: () => handlePay('card') },
              { text: '📱 MoMo', onPress: () => handlePay('momo') },
              { text: 'Huỷ', style: 'cancel' }
            ])}
              style={{ backgroundColor: '#10b981', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Thanh Toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
