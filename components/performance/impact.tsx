import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from './MetricCard';
import { SprayChart } from './SprayChart';

interface ImpactTabProps {
  data: {
    avgExitVelocity: number;
    exitVelocityTrend: string;
    maxExitVelocity: number;
    maxExitVelocityTrend: string;
    xwOBA: number;
    xwOBATrend: string;
    sprayData: {
      x: number;
      y: number;
      ev: number;
      type: 'pull' | 'center' | 'oppo';
    }[];
  };
}

export function ImpactTab({ data }: ImpactTabProps) {
  const colors = useColors();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Impact Metrics
        </Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Avg Exit Velocity"
            value={data.avgExitVelocity.toString()}
            unit="mph"
            description="Average ball exit speed"
            status={data.avgExitVelocity >= 90 ? 'good' : 'warning'}
            trend={data.exitVelocityTrend}
          />
          <MetricCard
            title="Max Exit Velocity"
            value={data.maxExitVelocity.toString()}
            unit="mph"
            description="Highest recorded exit speed"
            status={data.maxExitVelocity >= 100 ? 'good' : 'warning'}
            trend={data.maxExitVelocityTrend}
          />
          <MetricCard
            title="xwOBA"
            value={data.xwOBA.toFixed(3)}
            description="Expected weighted on-base average"
            status={data.xwOBA >= 0.350 ? 'good' : 'warning'}
            trend={data.xwOBATrend}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Hit Locations
        </Text>
        <View style={styles.chartContainer}>
          <SprayChart data={data.sprayData} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  metricsGrid: {
    paddingHorizontal: 16,
  },
  chartContainer: {
    paddingHorizontal: 16,
    height: 300,
  },
}); 