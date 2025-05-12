import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { SprayChart } from '@/components/performance/SprayChart';
import { CarouselDots } from '@/components/performance/CarouselDots';
import { ContactTrendChart } from './ContactTrendChart';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';

interface ContactTabProps {
  data: {
    contactRate: {
      value: number;
      trend: number;
      description: string;
    };
    whiffRate: {
      value: number;
      trend: number;
      description: string;
    };
    strikeoutRate: {
      value: number;
      trend: number;
      description: string;
    };
    contactTrend: {
      date: string;
      rate: number;
    }[];
    sprayData: {
      x: number;
      y: number;
      type: 'pull' | 'center' | 'oppo';
      ev: number;
      launchAngle: number;
    }[];
  };
}

export function ContactTab({ data }: ContactTabProps) {
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
      title: 'Sweet Spot Trend',
      description: 'Last 10 sessions',
      component: <ContactTrendChart data={data.contactTrend || []} />,
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
          Contact Metrics
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Contact Rate"
            value={data.contactRate.value.toString()}
            trend={data.contactRate.trend.toString()}
            description={data.contactRate.description}
            compact
          />
          <MetricCard
            title="Whiff Rate"
            value={data.whiffRate.value.toString()}
            trend={data.whiffRate.trend.toString()}
            description={data.whiffRate.description}
            compact
          />
          <MetricCard
            title="Strikeout Rate"
            value={data.strikeoutRate.value.toString()}
            trend={data.strikeoutRate.trend.toString()}
            description={data.strikeoutRate.description}
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

export default ContactTab;

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