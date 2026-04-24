import { View, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { revenueApi, invoicesApi } from '@/lib/api';
import { getUser } from '@/lib/auth';

const { width } = Dimensions.get('window');

export default function ManagerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    const u = await getUser();
    setUser(u);
    try {
      const [dash, chart] = await Promise.all([
        revenueApi.dashboard(),
        revenueApi.chart(7),
      ]) as any[];
      setDashboard(dash);
      setChartData(chart || []);
    } catch {}
  }

  useEffect(() => { loadData(); }, []);
  const onRefresh = async () => { setRefreshing(true); await loadData(); setRefreshing(false); };

  const chartLabels = chartData.slice(-7).map((d: any) => d.date?.slice(5) || '');
  const chartValues = chartData.slice(-7).map((d: any) => (d.revenue / 1e6) || 0);

  const statCards = [
    { label: 'Hôm nay', value: `${((dashboard.todayRevenue || 0) / 1e6).toFixed(1)}M`, sub: `${dashboard.todayOrders || 0} đơn`, icon: 'today', color: '#3b82f6' },
    { label: 'Tháng này', value: `${((dashboard.monthRevenue || 0) / 1e6).toFixed(0)}M`, sub: `${dashboard.monthOrders || 0} đơn`, icon: 'calendar', color: '#10b981' },
    { label: 'Tháng trước', value: `${((dashboard.lastMonthRevenue || 0) / 1e6).toFixed(0)}M`, sub: 'doanh thu', icon: 'trending-up', color: '#8b5cf6' },
    { label: 'Tăng trưởng', value: `${dashboard.growth || 0}%`, sub: 'so với T.trước', icon: 'stats-chart', color: '#f59e0b' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{ backgroundColor: '#1a3a5c', padding: 24, paddingTop: 60 }}>
        <Text style={{ color: '#93c5fd', fontSize: 14 }}>Dashboard Quản lý</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 }}>Tổng quan kinh doanh</Text>
      </View>

      {/* Stat Cards */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 }}>
        {statCards.map((card) => (
          <View key={card.label} style={{ width: (width - 40) / 2, backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: card.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={card.icon as any} size={18} color={card.color} />
              </View>
              <Text style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{card.label}</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#1e293b' }}>{card.value}</Text>
            <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{card.sub}</Text>
          </View>
        ))}
      </View>

      {/* Revenue Chart */}
      {chartValues.length > 0 && (
        <View style={{ margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 }}>📈 Doanh thu 7 ngày (Triệu đồng)</Text>
          <LineChart
            data={{ labels: chartLabels, datasets: [{ data: chartValues.length ? chartValues : [0] }] }}
            width={width - 64}
            height={160}
            chartConfig={{ backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', decimalPlaces: 1, color: (opacity = 1) => `rgba(26, 58, 92, ${opacity})`, labelColor: () => '#64748b', propsForDots: { r: '4', strokeWidth: '2', stroke: '#1a3a5c' } }}
            bezier
            style={{ borderRadius: 8 }}
          />
        </View>
      )}
    </ScrollView>
  );
}
