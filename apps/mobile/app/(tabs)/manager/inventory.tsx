import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { inventoryApi } from '@/lib/api';

export default function ManagerInventory() {
  const [items, setItems] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      const [all, low]: any = await Promise.all([inventoryApi.list(), inventoryApi.lowStock()]);
      setItems(Array.isArray(all) ? all : all?.data || []);
      setLowStock(Array.isArray(low) ? low : low?.data || []);
    } catch {}
  }
  useEffect(() => { loadData(); }, []);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ backgroundColor: '#1a3a5c', padding: 24, paddingTop: 60 }}>
        <Text style={{ color: '#93c5fd', fontSize: 14 }}>Kho hàng</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 }}>Quản lý tồn kho</Text>
      </View>

      {lowStock.length > 0 && (
        <View style={{ margin: 16, backgroundColor: '#fef3c7', borderRadius: 12, padding: 14, borderLeftWidth: 4, borderLeftColor: '#f59e0b' }}>
          <Text style={{ color: '#92400e', fontWeight: '700', marginBottom: 6 }}>⚠️ Cảnh báo tồn kho thấp ({lowStock.length} sản phẩm)</Text>
          {lowStock.slice(0,3).map((item: any, i: number) => (
            <Text key={i} style={{ color: '#78350f', fontSize: 13 }}>• {item.name}: còn {item.quantity} {item.unit}</Text>
          ))}
        </View>
      )}

      <View style={{ margin: 16, gap: 8 }}>
        {items.length === 0 ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 40 }}>📦</Text>
            <Text style={{ color: '#64748b', marginTop: 8 }}>Chưa có dữ liệu kho</Text>
          </View>
        ) : items.map((item, i) => (
          <View key={item._id || i} style={{ backgroundColor: '#fff', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.category} • SKU: {item.sku || 'N/A'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: item.quantity <= item.minQuantity ? '#ef4444' : '#1a3a5c' }}>
                {item.quantity}
              </Text>
              <Text style={{ fontSize: 11, color: '#94a3b8' }}>{item.unit}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
