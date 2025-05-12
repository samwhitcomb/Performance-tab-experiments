import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from '@/components/performance/MetricCard';
import { SweetSpotTrend } from './SweetSpotTrend';
import { SwipeableChartView } from '@/components/performance/SwipeableChartView';

interface ConsistencyTabProps {
  data: {
    sweetSpot: {
      value: number;
      trend: number;
      description: string;
    };
    barrel: {
      value: number;
      trend: number;
      description: string;
    };
    hardHit: {
      value: number;
      trend: number;
      description: string;
    };
    sweetSpotTrend: {
      date: string;
      percentage: number;
    }[];
  };
}

export function ConsistencyTab({ data }: ConsistencyTabProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.metricsSection}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Contact Quality
        </Text>
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Sweet Spot %"
            value={data.sweetSpot.value.toString()}
            trend={data.sweetSpot.trend.toString()}
            description={data.sweetSpot.description}
            compact
          />
          <MetricCard
            title="Barrel %"
            value={data.barrel.value.toString()}
            trend={data.barrel.trend.toString()}
            description={data.barrel.description}
            compact
          />
          <MetricCard
            title="Hard Hit %"
            value={data.hardHit.value.toString()}
            trend={data.hardHit.trend.toString()}
            description={data.hardHit.description}
            compact
          />
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Sweet Spot Trend
        </Text>
        <SwipeableChartView>
          <SweetSpotTrend data={data.sweetSpotTrend || []} />
        </SwipeableChartView>
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
}); 