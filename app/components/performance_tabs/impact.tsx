import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';
import { CarouselDots } from '@/components/performance/CarouselDots';
import OutcomeWheel from '../performance/OutcomeWheel';
import DirectionalXWOBA from '../performance/DirectionalXWOBA';

interface ImpactTabProps {
  data: {
    xwOBA: {
      value: number;
      trend: number;
      description: string;
    };
    xBA: {
      value: number;
      trend: number;
      description: string;
    };
    xSLG: {
      value: number;
      trend: number;
      description: string;
    };
    hitDistribution: {
      singles: number;
      doubles: number;
      homeRuns: number;
      outs: number;
    };
    directionalTendencies: {
      pull: number;
      center: number;
      oppo: number;
    };
    keyInsight: string;
  };
}

export function ImpactTab({ data }: ImpactTabProps) {
  const colors = useColors();
  const [activeChart, setActiveChart] = useState(0);

  const charts = [
    {
      title: 'Hit Distribution',
      description: 'Singles / Doubles / HRs / Outs',
      component: <OutcomeWheel data={data.hitDistribution} />,
    },
    {
      title: 'Directional xwOBA',
      description: 'Production value by field',
      component: <DirectionalXWOBA data={data.directionalTendencies} />,
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
          Expected Stats
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="xwOBA"
            value={data.xwOBA.value.toString()}
            trend={data.xwOBA.trend.toString()}
            description={data.xwOBA.description}
            compact
          />
          <MetricCard
            title="xBA"
            value={data.xBA.value.toString()}
            trend={data.xBA.trend.toString()}
            description={data.xBA.description}
            compact
          />
          <MetricCard
            title="xSLG"
            value={data.xSLG.value.toString()}
            trend={data.xSLG.trend.toString()}
            description={data.xSLG.description}
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

export default ImpactTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metricsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chartSection: {
    flex: 1,
    marginTop: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chartTitle: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 16,
  },
  chartDescription: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
  },
  chartContainer: {
    flex: 1,
  },
  insightContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  insightText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
  },
}); 