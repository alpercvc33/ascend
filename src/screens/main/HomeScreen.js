// src/screens/main/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData } from '../../store/slices/userSlice';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const [refreshing, setRefreshing] = useState(false);
  const [todayStats, setTodayStats] = useState({
    steps: 0,
    calories: 0,
    water: 0,
    meditation: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      await dispatch(fetchUserData()).unwrap();
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadUserData().finally(() => setRefreshing(false));
  }, []);

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <Image
        source={{ uri: user?.profileImage || 'https://placeholder.com/user' }}
        style={styles.profileImage}
      />
      <View style={styles.welcomeText}>
        <Text style={styles.greeting}>Merhaba, {user?.name?.split(' ')[0]}</Text>
        <Text style={styles.date}>
          {format(new Date(), 'dd MMMM yyyy, EEEE', { locale: tr })}
        </Text>
      </View>
    </View>
  );

  const renderTodayStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Günlük İstatistikler</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todayStats.steps}</Text>
          <Text style={styles.statLabel}>Adım</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todayStats.calories}</Text>
          <Text style={styles.statLabel}>Kalori</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todayStats.water}L</Text>
          <Text style={styles.statLabel}>Su</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todayStats.meditation}dk</Text>
          <Text style={styles.statLabel}>Meditasyon</Text>
        </View>
      </View>
    </View>
  );

  const renderAIInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>AI Önerileri</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity 
          style={styles.insightCard}
          onPress={() => navigation.navigate('Fitness')}
        >
          <Text style={styles.insightTitle}>Fitness Önerisi</Text>
          <Text style={styles.insightText}>
            Bugün için önerilen antrenman: Üst vücut güçlendirme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.insightCard}
          onPress={() => navigation.navigate('Nutrition')}
        >
          <Text style={styles.insightTitle}>Beslenme Önerisi</Text>
          <Text style={styles.insightText}>
            Öğle yemeği için: Protein ağırlıklı, düşük karbonhidratlı menü
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.insightCard}
          onPress={() => navigation.navigate('Mental')}
        >
          <Text style={styles.insightTitle}>Zihinsel Gelişim</Text>
          <Text style={styles.insightText}>
            10 dakikalık odaklanma meditasyonu ile güne başlayın
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderProgressChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>Haftalık İlerleme</Text>
      <LineChart
        data={{
          labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
          datasets: [{
            data: [65, 70, 68, 72, 75, 73, 78]
          }]
        }}
        width={styles.chart.width}
        height={220}
        chartConfig={{
          backgroundColor: '#1A2B3C',
          backgroundGradientFrom: '#1A2B3C',
          backgroundGradientTo: '#2A3B4C',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(242, 208, 107, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#F2D06B'
          }
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderWelcomeSection()}
        {renderTodayStats()}
        {renderAIInsights()}
        {renderProgressChart()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2B3C',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    margin: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 4,
  },
  statsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F2D06B',
  },
  statLabel: {
    fontSize: 14,
    color: '#8899AA',
    marginTop: 5,
  },
  insightsContainer: {
    padding: 15,
  },
  insightCard: {
    backgroundColor: '#2A3B4C',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 250,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F2D06B',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  chartContainer: {
    padding: 15,
  },
  chart: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default HomeScreen;