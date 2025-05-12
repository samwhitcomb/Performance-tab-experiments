import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/theme';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  description: string;
  compact?: boolean;
}

export function MetricCard({ title, value, trend, description, compact = false }: MetricCardProps) {
  const colors = useColors();
  const isPositive = parseFloat(trend) > 0;

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.white },
      compact && styles.compactContainer
    ]}>
      <Text style={[
        styles.title,
        { color: colors.grey[600] },
        compact && styles.compactTitle
      ]}>
        {title}
      </Text>
      <View style={styles.valueContainer}>
        <Text style={[
          styles.value,
          { color: colors.grey[600] },
          compact && styles.compactValue
        ]}>
          {value}
        </Text>
        <View style={styles.trendContainer}>
          {isPositive ? (
            <TrendingUp size={16} color={colors.secondary.green} />
          ) : (
            <TrendingDown size={16} color={colors.status.error} />
          )}
          <Text style={[
            styles.trend,
            { color: isPositive ? colors.secondary.green : colors.status.error },
            compact && styles.compactTrend
          ]}>
            {Math.abs(parseFloat(trend))}%
          </Text>
        </View>
      </View>
      {!compact && (
        <Text style={[styles.description, { color: colors.grey[400] }]}>
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
  },
  compactContainer: {
    padding: 8,
  },
  title: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
  },
  compactValue: {
    fontSize: 18,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trend: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
  },
  compactTrend: {
    fontSize: 12,
  },
  description: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    marginTop: 8,
  },
}); 