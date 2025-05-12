import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { EVLaunchAngleChart } from './EVLaunchAngleChart';
import { CarouselDots } from '@/components/performance/CarouselDots';
import { ProgressTrendChart } from './ProgressTrendChart';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';

interface ProgressTabProps {
  data: {
    sweetSpotProgress: {
      value: number;
      trend: number;
      description: string;
    };
    evProgress: {
      value: number;
      trend: number;
      description: string;
    };
    barrelProgress: {
      value: number;
      trend: number;
      description: string;
    };
    evLaunchAngleData: {
      launchAngle: number;
      ev: number;
      xwOBA: number;
    }[];
    progressTrend: {
      date: string;
      sweetSpot: number;
      barrel: number;
    }[];
  };
}

export function ProgressTab({ data }: ProgressTabProps) {
  const colors = useColors();
  const [activeChart, setActiveChart] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const charts = [
    {
      title: 'EV vs Launch Angle',
      description: 'Hit quality visualization',
      component: <EVLaunchAngleChart data={data.evLaunchAngleData || []} />,
    },
    {
      title: 'Progress Trend',
      description: 'Last 10 sessions',
      component: <ProgressTrendChart data={data.progressTrend || []} />,
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
          Progress Metrics
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Sweet Spot Progress"
            value={data.sweetSpotProgress.value.toString()}
            trend={data.sweetSpotProgress.trend.toString()}
            description={data.sweetSpotProgress.description}
            compact
          />
          <MetricCard
            title="Exit Velocity Progress"
            value={data.evProgress.value.toString()}
            trend={data.evProgress.trend.toString()}
            description={data.evProgress.description}
            compact
          />
          <MetricCard
            title="Barrel Progress"
            value={data.barrelProgress.value.toString()}
            trend={data.barrelProgress.trend.toString()}
            description={data.barrelProgress.description}
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
    </View>
  );
}

export default ProgressTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metricsSection: {
    height: '30%',
  },
  chartSection: {
    height: '50%',
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
}); 