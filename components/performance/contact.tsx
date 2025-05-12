import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColors } from '@/constants/theme';
import { MetricCard } from './MetricCard';
import { SweetSpotTrend } from './SweetSpotTrend';

interface ContactTabProps {
  data: {
    sweetSpotPercentage: number;
    sweetSpotTrend: string;
    barrelPercentage: number;
    barrelTrend: string;
    hardHitPercentage: number;
    hardHitTrend: string;
    sweetSpotHistory: {
      date: string;
      percentage: number;
    }[];
  };
}

export function ContactTab({ data }: ContactTabProps) {
  const colors = useColors();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Contact Quality
        </Text>
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Sweet Spot %"
            value={data.sweetSpotPercentage.toString()}
            unit="%"
            description="Balls hit at optimal launch angle"
            status={data.sweetSpotPercentage >= 30 ? 'good' : 'warning'}
            trend={data.sweetSpotTrend}
          />
          <MetricCard
            title="Barrel %"
            value={data.barrelPercentage.toString()}
            unit="%"
            description="Hard-hit balls with optimal launch angle"
            status={data.barrelPercentage >= 10 ? 'good' : 'warning'}
            trend={data.barrelTrend}
          />
          <MetricCard
            title="Hard Hit %"
            value={data.hardHitPercentage.toString()}
            unit="%"
            description="Balls hit 95+ mph"
            status={data.hardHitPercentage >= 40 ? 'good' : 'warning'}
            trend={data.hardHitTrend}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.grey[600] }]}>
          Sweet Spot Trend
        </Text>
        <SweetSpotTrend data={data.sweetSpotHistory} />
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
}); 