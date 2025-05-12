import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

type MetricType = 'exitVelocity' | 'launchAngle' | 'barrelPercentage';

interface PerformanceMetricSelectorProps {
  selectedMetric: MetricType;
  onSelectMetric: (metric: MetricType) => void;
}

export function PerformanceMetricSelector({ 
  selectedMetric, 
  onSelectMetric 
}: PerformanceMetricSelectorProps) {
  
  const metrics = [
    { id: 'exitVelocity' as MetricType, label: 'Exit Velocity' },
    { id: 'launchAngle' as MetricType, label: 'Launch Angle' },
    { id: 'barrelPercentage' as MetricType, label: 'Barrel %' },
  ];

  return (
    <View style={styles.container}>
      {metrics.map((metric) => (
        <TouchableOpacity
          key={metric.id}
          style={[
            styles.metricButton,
            selectedMetric === metric.id && styles.selectedMetric,
          ]}
          onPress={() => onSelectMetric(metric.id)}
        >
          <Text style={[
            styles.metricText,
            selectedMetric === metric.id && styles.selectedMetricText,
          ]}>
            {metric.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metricButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.grey[100],
  },
  selectedMetric: {
    backgroundColor: colors.primary,
  },
  metricText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[500],
  },
  selectedMetricText: {
    color: colors.white,
  },
});