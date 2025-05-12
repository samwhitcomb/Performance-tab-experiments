import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/theme';

interface BenchmarkComparisonProps {
  metric: {
    label: string;
    value: number;
    unit: string;
    nationalAvg: number;
    ageGroupAvg: number;
  };
}

export function BenchmarkComparison({ metric }: BenchmarkComparisonProps) {
  const colors = useColors();

  const getPerformanceLevel = (value: number, benchmark: number) => {
    const percentage = (value / benchmark) * 100;
    if (percentage >= 120) return { text: 'Elite', color: colors.status.success };
    if (percentage >= 100) return { text: 'Above Average', color: colors.secondary.green };
    if (percentage >= 80) return { text: 'Average', color: colors.secondary.indigo };
    return { text: 'Developing', color: colors.status.warning };
  };

  const nationalComparison = getPerformanceLevel(metric.value, metric.nationalAvg);
  const ageGroupComparison = getPerformanceLevel(metric.value, metric.ageGroupAvg);

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>{metric.label}</Text>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.grey[600] }]}>
          {metric.value}
          <Text style={[styles.unit, { color: colors.grey[400] }]}>{metric.unit}</Text>
        </Text>
      </View>

      <View style={styles.comparisons}>
        <View style={styles.comparisonRow}>
          <Text style={[styles.comparisonLabel, { color: colors.grey[400] }]}>vs National Avg</Text>
          <View style={styles.comparisonValue}>
            <Text style={[styles.benchmark, { color: colors.grey[600] }]}>
              {metric.nationalAvg}{metric.unit}
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: nationalComparison.color + '20' }]}>
              <Text style={[styles.levelText, { color: nationalComparison.color }]}>
                {nationalComparison.text}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.comparisonRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.comparisonLabel, { color: colors.grey[400] }]}>vs Age Group</Text>
          <View style={styles.comparisonValue}>
            <Text style={[styles.benchmark, { color: colors.grey[600] }]}>
              {metric.ageGroupAvg}{metric.unit}
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: ageGroupComparison.color + '20' }]}>
              <Text style={[styles.levelText, { color: ageGroupComparison.color }]}>
                {ageGroupComparison.text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  value: {
    fontFamily: 'Barlow-Bold',
    fontSize: 36,
  },
  unit: {
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    marginLeft: 4,
  },
  comparisons: {
    borderRadius: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  comparisonLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
  },
  comparisonValue: {
    alignItems: 'flex-end',
  },
  benchmark: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
  },
});