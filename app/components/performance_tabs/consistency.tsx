import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';
import { CarouselDots } from '@/components/performance/CarouselDots';
import HeatMap from '../performance/HeatMap';
import BatSpeedTrendChart from '../performance/BatSpeedTrendChart';

interface SwingConsistencyTabProps {
  data: {
    evStandardDeviation: {
      value: number;
      trend: number;
      description: string;
    };
    laStandardDeviation: {
      value: number;
      trend: number;
      description: string;
    };
    batSpeedConsistency: {
      value: number;
      trend: number;
      description: string;
    };
    swingEfficiency: {
      value: number;
      trend: number;
      description: string;
    };
    weakContactPercent: {
      value: number;
      trend: number;
      description: string;
    };
    locationHeatMap: {
      zone: 'inside' | 'outside' | 'high' | 'low';
      avgEV: number;
    }[];
    batSpeedTrend: {
      date: string;
      speed: number;
    }[];
    keyInsight: string;
  };
}

export function ConsistencyTab({ data }: SwingConsistencyTabProps) {
  const colors = useColors();
  const [activeChart, setActiveChart] = useState(0);

  const charts = [
    {
      title: 'Location Heat Map',
      description: 'Average EV by zone',
      component: <HeatMap data={data.locationHeatMap} />,
    },
    {
      title: 'Bat Speed Trend',
      description: 'Last 10 sessions',
      component: <BatSpeedTrendChart data={data.batSpeedTrend} />,
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
      <View style={styles.metricsSection}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Mechanics
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="EV SD"
            value={data.evStandardDeviation.value.toString()}
            trend={data.evStandardDeviation.trend.toString()}
            description="Exit velocity standard deviation"
            compact
          />
          <MetricCard
            title="LA SD"
            value={data.laStandardDeviation.value.toString()}
            trend={data.laStandardDeviation.trend.toString()}
            description="Launch angle standard deviation"
            compact
          />
          <MetricCard
            title="Bat Speed SD"
            value={data.batSpeedConsistency.value.toString()}
            trend={data.batSpeedConsistency.trend.toString()}
            description="Lower is more consistent"
            compact
          />
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.grey[600], marginTop: 8 }]}>
          Efficiency
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Swing Efficiency"
            value={data.swingEfficiency.value.toString()}
            trend={data.swingEfficiency.trend.toString()}
            description="EV ÷ Bat Speed (Ideal: ≥1.2)"
            compact
          />
          <MetricCard
            title="Weak Contact %"
            value={`${data.weakContactPercent.value}%`}
            trend={data.weakContactPercent.trend.toString()}
            description="% of EV < 80 mph"
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

export default ConsistencyTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metricsSection: {
    height: '42%',
  },
  chartSection: {
    height: '45%',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  metricsContainer: {
    padding: 16,
    paddingTop: 0,
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