import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { CarouselDots } from '@/components/performance/CarouselDots';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';

interface ProgressTabProps {
  data: {
    ev: {
      value: number;
      trend: number;
      personalBest: number;
      range: { min: number; max: number };
      description: string;
    };
    hardHitPercent: {
      value: number;
      trend: number;
      personalBest: number;
      range: { min: number; max: number };
      description: string;
    };
    barrelPercent: {
      value: number;
      trend: number;
      personalBest: number;
      range: { min: number; max: number };
      description: string;
    };
    sweetSpotPercent: {
      value: number;
      trend: number;
      personalBest: number;
      range: { min: number; max: number };
      description: string;
    };
    trendData: {
      date: string;
      ev: number;
      hardHitPercent: number;
      barrelPercent: number;
      sweetSpotPercent: number;
    }[];
    skillRadar: {
      power: number;
      control: number;
      spray: number;
    };
    keyInsight: string;
  };
}

type TimeFilter = '7days' | '30days' | '90days';
type CompareFilter = 'self' | 'ageAvg' | 'levelAvg';

export function ProgressTab({ data }: ProgressTabProps) {
  const colors = useColors();
  const [activeChart, setActiveChart] = useState(0);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30days');
  const [compareFilter, setCompareFilter] = useState<CompareFilter>('self');

  // Placeholder components for the charts
  const TrendCharts = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <Text style={{ fontFamily: 'Barlow-SemiBold', color: colors.grey[600] }}>
        Mini Trend Graphs
      </Text>
      <Text style={{ fontFamily: 'Barlow-Regular', color: colors.grey[400] }}>
        EV, HH%, Barrel%
      </Text>
    </View>
  );

  const SkillRadar = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    }}>
      <Text style={{ fontFamily: 'Barlow-SemiBold', color: colors.grey[600] }}>
        Skill Radar
      </Text>
      <Text style={{ fontFamily: 'Barlow-Regular', color: colors.grey[400] }}>
        Power: {data.skillRadar.power}, Control: {data.skillRadar.control}, Spray: {data.skillRadar.spray}
      </Text>
    </View>
  );

  const charts = [
    {
      title: 'Performance Trends',
      description: 'Key metrics over time',
      component: <TrendCharts />,
    },
    {
      title: 'Skill Radar',
      description: 'Power, Control, Spray',
      component: <SkillRadar />,
    },
  ];

  const handleSwipeLeft = () => {
    if (activeChart < charts.length - 1) {
      setActiveChart(activeChart + 1);
    }
  };

  const handleSwipeRight = () => {
    if (activeChart > 0) {
      setActiveChart(activeChart - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === '7days' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setTimeFilter('7days')}
          >
            <Text
              style={[
                styles.filterText,
                timeFilter === '7days' && { color: colors.white },
              ]}
            >
              7 Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === '30days' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setTimeFilter('30days')}
          >
            <Text
              style={[
                styles.filterText,
                timeFilter === '30days' && { color: colors.white },
              ]}
            >
              30 Days
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              timeFilter === '90days' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setTimeFilter('90days')}
          >
            <Text
              style={[
                styles.filterText,
                timeFilter === '90days' && { color: colors.white },
              ]}
            >
              90 Days
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              compareFilter === 'self' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setCompareFilter('self')}
          >
            <Text
              style={[
                styles.filterText,
                compareFilter === 'self' && { color: colors.white },
              ]}
            >
              You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              compareFilter === 'ageAvg' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setCompareFilter('ageAvg')}
          >
            <Text
              style={[
                styles.filterText,
                compareFilter === 'ageAvg' && { color: colors.white },
              ]}
            >
              Age Avg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              compareFilter === 'levelAvg' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setCompareFilter('levelAvg')}
          >
            <Text
              style={[
                styles.filterText,
                compareFilter === 'levelAvg' && { color: colors.white },
              ]}
            >
              Level Avg
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.metricsSection}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Trended Metrics
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Exit Velocity"
            value={data.ev.value.toString() + " mph"}
            trend={data.ev.trend.toString()}
            description={`Best: ${data.ev.personalBest} | Range: ${data.ev.range.min}-${data.ev.range.max}`}
            compact
          />
          <MetricCard
            title="Hard-Hit %"
            value={data.hardHitPercent.value.toString() + "%"}
            trend={data.hardHitPercent.trend.toString()}
            description={`Best: ${data.hardHitPercent.personalBest}% | Avg: ${Math.round((data.hardHitPercent.range.min + data.hardHitPercent.range.max) / 2)}%`}
            compact
          />
        </View>
        
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Barrel %"
            value={data.barrelPercent.value.toString() + "%"}
            trend={data.barrelPercent.trend.toString()}
            description={`Best: ${data.barrelPercent.personalBest}% | Avg: ${Math.round((data.barrelPercent.range.min + data.barrelPercent.range.max) / 2)}%`}
            compact
          />
          <MetricCard
            title="Sweet Spot %"
            value={data.sweetSpotPercent.value.toString() + "%"}
            trend={data.sweetSpotPercent.trend.toString()}
            description={`Best: ${data.sweetSpotPercent.personalBest}% | Avg: ${Math.round((data.sweetSpotPercent.range.min + data.sweetSpotPercent.range.max) / 2)}%`}
            compact
          />
        </View>
      </View>

      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={[styles.chartTitle, { color: colors.grey[600] }]}>
              {charts[activeChart].title}
            </Text>
            <Text style={[styles.chartDescription, { color: colors.grey[400] }]}>
              {charts[activeChart].description}
            </Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <SwipeableChartView
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          >
            {charts[activeChart].component}
          </SwipeableChartView>
        </View>
        <CarouselDots
          count={charts.length}
          activeIndex={activeChart}
          onDotPress={setActiveChart}
        />
      </View>
      
      <View style={styles.insightContainer}>
        <Text style={[styles.insightText, { color: colors.grey[600] }]}>
          Key Insight: {data.keyInsight}
        </Text>
      </View>
    </View>
  );
}

export default ProgressTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: '#666',
  },
  metricsSection: {
    height: '30%',
  },
  chartSection: {
    height: '35%',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  metricsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
  },
  chartDescription: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContainer: {
    padding: 16,
    marginTop: 8,
  },
  insightText: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 