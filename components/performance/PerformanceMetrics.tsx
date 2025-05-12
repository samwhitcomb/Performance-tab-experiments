import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useColors } from '@/constants/theme';
import { TrendingUp, Target, Crosshair, Ruler } from 'lucide-react-native';

type TimeFilter = 'week' | 'month' | 'year' | 'all';
type MetricType = 'exitVelocity' | 'launchAngle' | 'barrelPercentage' | 'distance';

interface MetricData {
  current: number;
  max: number;
  average: number;
  unit: string;
}

interface PerformanceMetricsProps {
  exitVelocity: MetricData;
  launchAngle: MetricData;
  barrelPercentage: MetricData;
  distance: MetricData;
  timeFilter: TimeFilter;
  selectedMetric: MetricType;
  onFilterChange: (filter: TimeFilter) => void;
  onMetricChange: (metric: MetricType) => void;
}

export function PerformanceMetrics({
  exitVelocity,
  launchAngle,
  barrelPercentage,
  distance,
  timeFilter,
  selectedMetric,
  onFilterChange,
  onMetricChange,
}: PerformanceMetricsProps) {
  const colors = useColors();

  const metrics = [
    { type: 'exitVelocity', title: 'Exit Velocity', data: exitVelocity, icon: <TrendingUp size={20} color={colors.primary} /> },
    { type: 'launchAngle', title: 'Launch Angle', data: launchAngle, icon: <Target size={20} color={colors.primary} /> },
    { type: 'barrelPercentage', title: 'Barrel %', data: barrelPercentage, icon: <Crosshair size={20} color={colors.primary} /> },
    { type: 'distance', title: 'Distance', data: distance, icon: <Ruler size={20} color={colors.primary} /> },
  ] as const;

  const MetricCard = ({ data }: { data: MetricData }) => (
    <View style={[styles.metricValues, { backgroundColor: colors.white }]}>
      <View style={styles.metricValue}>
        <Text style={[styles.valueLabel, { color: colors.grey[400] }]}>Current</Text>
        <Text style={[styles.value, { color: colors.primary }]}>
          {data.current}
          <Text style={[styles.unit, { color: colors.grey[400] }]}>{data.unit}</Text>
        </Text>
      </View>

      <View style={styles.metricValue}>
        <Text style={[styles.valueLabel, { color: colors.grey[400] }]}>Max</Text>
        <Text style={[styles.value, { color: colors.status.success }]}>
          {data.max}
          <Text style={[styles.unit, { color: colors.grey[400] }]}>{data.unit}</Text>
        </Text>
      </View>

      <View style={styles.metricValue}>
        <Text style={[styles.valueLabel, { color: colors.grey[400] }]}>Average</Text>
        <Text style={[styles.value, { color: colors.secondary.indigo }]}>
          {data.average}
          <Text style={[styles.unit, { color: colors.grey[400] }]}>{data.unit}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContainer}
      >
        {metrics.map((metric) => (
          <TouchableOpacity
            key={metric.type}
            style={[
              styles.tab,
              selectedMetric === metric.type && styles.selectedTab,
              { backgroundColor: selectedMetric === metric.type ? colors.primary : colors.grey[100] }
            ]}
            onPress={() => onMetricChange(metric.type)}
          >
            {metric.icon}
            <Text
              style={[
                styles.tabText,
                { color: selectedMetric === metric.type ? colors.white : colors.grey[600] }
              ]}
            >
              {metric.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.filters}>
        {(['week', 'month', 'year', 'all'] as TimeFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              timeFilter === filter && { backgroundColor: colors.primary }
            ]}
            onPress={() => onFilterChange(filter)}
          >
            <Text
              style={[
                styles.filterText,
                timeFilter === filter ? { color: colors.white } : { color: colors.grey[500] }
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <MetricCard data={metrics.find(m => m.type === selectedMetric)!.data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabScroll: {
    marginBottom: 16,
  },
  tabContainer: {
    paddingRight: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    gap: 8,
  },
  selectedTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  filterText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
  },
  metricValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricValue: {
    alignItems: 'center',
  },
  valueLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
  },
  unit: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    marginLeft: 2,
  },
});