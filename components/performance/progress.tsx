import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from './MetricCard';
import { EVLaunchAngleChart } from './EVLaunchAngleChart';

interface ProgressTabProps {
  data: {
    sweetSpotProgress: number;
    sweetSpotProgressTrend: string;
    exitVelocityProgress: number;
    exitVelocityProgressTrend: string;
    barrelProgress: number;
    barrelProgressTrend: string;
    evLaunchAngleData: {
      ev: number;
      launchAngle: number;
      xwOBA: number;
    }[];
  };
}

export function ProgressTab({ data }: ProgressTabProps) {
  const colors = useColors();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Progress Metrics
        </Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Sweet Spot Progress"
            value={data.sweetSpotProgress.toString()}
            unit="%"
            description="Improvement in sweet spot contact"
            status={data.sweetSpotProgress >= 5 ? 'good' : 'warning'}
            trend={data.sweetSpotProgressTrend}
          />
          <MetricCard
            title="Exit Velocity Progress"
            value={data.exitVelocityProgress.toString()}
            unit="mph"
            description="Improvement in exit velocity"
            status={data.exitVelocityProgress >= 2 ? 'good' : 'warning'}
            trend={data.exitVelocityProgressTrend}
          />
          <MetricCard
            title="Barrel Progress"
            value={data.barrelProgress.toString()}
            unit="%"
            description="Improvement in barrel rate"
            status={data.barrelProgress >= 3 ? 'good' : 'warning'}
            trend={data.barrelProgressTrend}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          EV vs Launch Angle
        </Text>
        <View style={styles.chartContainer}>
          <EVLaunchAngleChart data={data.evLaunchAngleData} />
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