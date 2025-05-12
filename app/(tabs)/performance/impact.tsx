import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { SprayChart } from '@/components/performance/SprayChart';
import { CarouselDots } from '@/components/performance/CarouselDots';
import { EVTrendChart } from '@/components/performance/EVTrendChart';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';
import { Redirect } from "expo-router";

interface ImpactTabProps {
  data: {
    avgEV: {
      value: number;
      trend: number;
      description: string;
    };
    maxEV: {
      value: number;
      trend: number;
      description: string;
    };
    xwOBA: {
      value: number;
      trend: number;
      description: string;
    };
    sprayData: {
      x: number;
      y: number;
      type: 'pull' | 'center' | 'oppo';
      ev: number;
      launchAngle: number;
    }[];
    evTrend: {
      date: string;
      avgEV: number;
      maxEV: number;
    }[];
  };
}

export function ImpactTab({ data }: ImpactTabProps) {
  const colors = useColors();
  const [activeChart, setActiveChart] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  const charts = [
    {
      title: 'Spray Chart',
      description: 'EV + Direction',
      component: (
        <SprayChart 
          data={data.sprayData || []}
          showLaunchAngle
          showZones
        />
      ),
    },
    {
      title: 'Exit Velocity Trend',
      description: 'Last 10 sessions',
      component: <EVTrendChart data={data.evTrend || []} />,
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
          Impact Metrics
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Avg Exit Velocity"
            value={data.avgEV.value.toString()}
            trend={data.avgEV.trend.toString()}
            description={data.avgEV.description}
            compact
          />
          <MetricCard
            title="Max Exit Velocity"
            value={data.maxEV.value.toString()}
            trend={data.maxEV.trend.toString()}
            description={data.maxEV.description}
            compact
          />
          <MetricCard
            title="xwOBA"
            value={data.xwOBA.value.toString()}
            trend={data.xwOBA.trend.toString()}
            description={data.xwOBA.description}
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

export default function ImpactPage() {
  return <Redirect href="/performance" />;
} 