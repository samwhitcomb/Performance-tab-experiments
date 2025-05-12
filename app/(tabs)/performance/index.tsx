import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Calendar, BarChart, Sliders, Target, Zap, TrendingUp } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { CarouselDots } from '@/components/performance/CarouselDots';
import { ContactTab } from '../../components/performance_tabs/contact';
import { ConsistencyTab } from '../../components/performance_tabs/consistency';
import { ImpactTab } from '../../components/performance_tabs/impact';
import { ProgressTab } from '../../components/performance_tabs/progress';

type TimeFilter = 'week' | 'month' | 'year' | 'all';

// Define types for the zone and spray chart
type ZoneType = 'inside' | 'outside' | 'high' | 'low';
type SprayType = 'pull' | 'center' | 'oppo';

// Mock data - replace with real data from your backend
const mockData = {
  consistency: {
    evStandardDeviation: {
      value: 4.2,
      trend: -0.8,
      description: 'Lower is more consistent'
    },
    laStandardDeviation: {
      value: 5.8,
      trend: -1.2,
      description: 'Launch angle consistency'
    },
    batSpeedConsistency: {
      value: 2.4,
      trend: -0.3,
      description: 'Lower is more consistent'
    },
    swingEfficiency: {
      value: 1.18,
      trend: 0.04,
      description: 'EV ÷ Bat Speed (Ideal: ≥1.2)'
    },
    weakContactPercent: {
      value: 12.5,
      trend: -2.1,
      description: '% of EV < 80 mph'
    },
    locationHeatMap: [
      { zone: 'inside' as ZoneType, avgEV: 85.2 },
      { zone: 'outside' as ZoneType, avgEV: 82.1 },
      { zone: 'high' as ZoneType, avgEV: 88.7 },
      { zone: 'low' as ZoneType, avgEV: 79.8 }
    ],
    batSpeedTrend: [
      { date: '2024-01-01', speed: 68.2 },
      { date: '2024-01-02', speed: 67.8 },
      { date: '2024-01-03', speed: 69.1 },
      { date: '2024-01-04', speed: 70.3 }
    ],
    keyInsight: "Your inside-tee swings are erratic (EV SD = 6.2 mph). Try the 'Inside-Tee Repeat' drill."
  },
  contact: {
    avgEV: {
      value: 87.5,
      trend: 1.2,
      description: 'Average exit velocity'
    },
    peakEV: {
      value: 98.2,
      trend: 2.5,
      description: 'Peak exit velocity'
    },
    hardHitPercent: {
      value: 45.8,
      trend: 3.2,
      description: 'Percentage of balls ≥90 mph'
    },
    barrelPercent: {
      value: 12.5,
      trend: 1.8,
      description: 'EV ≥ 98 mph + LA 10°–30°'
    },
    sweetSpotPercent: {
      value: 35.2,
      trend: 2.1,
      description: 'Launch angle 10°–30°'
    },
    groundBallFlyBall: {
      gb: 42,
      fb: 28,
      trend: -3,
      description: 'Ground ball vs fly ball %'
    },
    ropesStreak: 6,
    bombCounter: 12,
    evLaunchAngleData: [
      { launchAngle: 10, ev: 95.2, xwOBA: 0.450, teeHeight: 'mid' },
      { launchAngle: 15, ev: 92.8, xwOBA: 0.520, teeHeight: 'mid' },
      { launchAngle: 5, ev: 89.4, xwOBA: 0.280, tossLocation: 'low' },
      { launchAngle: 20, ev: 90.5, xwOBA: 0.580, tossLocation: 'high' },
      { launchAngle: -5, ev: 85.2, xwOBA: 0.230, tossLocation: 'low' }
    ],
    sprayData: [
      { x: 0.3, y: 0.4, type: 'pull' as SprayType, ev: 92.1, launchAngle: 12 },
      { x: 0.6, y: 0.5, type: 'center' as SprayType, ev: 89.4, launchAngle: 18 },
      { x: 0.7, y: 0.3, type: 'oppo' as SprayType, ev: 86.7, launchAngle: 15 }
    ],
    keyInsight: "Your EV drops 12 mph on low-toss pitches → Focus on staying through the ball!"
  },
  impact: {
    xwOBA: {
      value: 0.385,
      trend: 0.015,
      description: 'Expected weighted on-base average'
    },
    xBA: {
      value: 0.295,
      trend: 0.012,
      description: 'Expected batting average'
    },
    xSLG: {
      value: 0.512,
      trend: 0.028,
      description: 'Expected slugging percentage'
    },
    hitDistribution: {
      singles: 15,
      doubles: 8,
      homeRuns: 4,
      outs: 25
    },
    directionalTendencies: {
      pull: 52,
      center: 28,
      oppo: 20
    },
    keyInsight: "You're a dead-pull hitter (.520 xwOBA pull side) – pitchers will shift!"
  },
  progress: {
    ev: {
      value: 89.5,
      trend: 1.2,
      personalBest: 93.2,
      range: { min: 82, max: 93.2 },
      description: 'Exit velocity'
    },
    hardHitPercent: {
      value: 45.8,
      trend: 3.2,
      personalBest: 48.2,
      range: { min: 38, max: 48.2 },
      description: 'Hard hit percentage'
    },
    barrelPercent: {
      value: 12.5,
      trend: 1.8,
      personalBest: 14.2,
      range: { min: 8, max: 14.2 },
      description: 'Barrel percentage'
    },
    sweetSpotPercent: {
      value: 35.2,
      trend: 2.1,
      personalBest: 38.5,
      range: { min: 22, max: 38.5 },
      description: 'Sweet spot percentage'
    },
    trendData: [
      { date: '2024-01-01', ev: 86.5, hardHitPercent: 42.2, barrelPercent: 10.2, sweetSpotPercent: 32.1 },
      { date: '2024-01-02', ev: 87.2, hardHitPercent: 43.8, barrelPercent: 11.0, sweetSpotPercent: 33.5 },
      { date: '2024-01-03', ev: 88.8, hardHitPercent: 44.5, barrelPercent: 11.8, sweetSpotPercent: 34.2 },
      { date: '2024-01-04', ev: 89.5, hardHitPercent: 45.8, barrelPercent: 12.5, sweetSpotPercent: 35.2 }
    ],
    skillRadar: {
      power: 75,
      control: 68,
      spray: 52
    },
    keyInsight: "Your Sweet Spot% improved from 22% → 34% this month!"
  }
};

export default function PerformanceScreen() {
  const colors = useColors();
  const { isDark } = useTheme();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState(0);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  const tabs = [
    <ContactTab key="contact" data={mockData.contact} />,
    <ConsistencyTab key="consistency" data={mockData.consistency} />,
    <ImpactTab key="impact" data={mockData.impact} />,
    <ProgressTab key="progress" data={mockData.progress} />
  ];

  const tabConfig = [
    { name: 'Contact Qual.', icon: Target },
    { name: 'Consistency', icon: Sliders },
    { name: 'Sim. Outcomes', icon: Zap },
    { name: 'Progress', icon: TrendingUp }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.grey[50] }]} edges={['top']}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.grey[600] }]}>Performance</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.grey[100] }]}
            onPress={() => setFilterVisible(true)}
          >
            <Filter size={20} color={colors.grey[600]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.grey[100] }]}>
            <Calendar size={20} color={colors.grey[600]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {tabConfig.map((tab, index) => {
          const isActive = activeTab === index;
          
          return (
            <TouchableOpacity 
              key={index}
              style={[
                styles.tab, 
                isActive ? styles.activeTab : styles.inactiveTab,
                { backgroundColor: isActive ? colors.primary : colors.grey[100] }
              ]}
              onPress={() => setActiveTab(index)}
            >
              <Text style={[
                styles.tabText,
                { color: isActive ? colors.white : colors.grey[600] }
              ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.content}>
        {tabs[activeTab]}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Barlow-Bold',
    fontSize: 32,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    height: 40,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inactiveTab: {},
  tabText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
});