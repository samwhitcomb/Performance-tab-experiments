import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface QuickStatsCardProps {
  stats: {
    label: string;
    value: string;
    unit: string;
  }[];
}

export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View 
          key={index} 
          style={[
            styles.statItem,
            index < stats.length - 1 && styles.statItemBorder
          ]}
        >
          <View style={styles.valueContainer}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statUnit}>{stat.unit}</Text>
          </View>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.grey[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: colors.grey[100],
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.grey[600],
  },
  statUnit: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[400],
    marginLeft: 2,
  },
  statLabel: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    color: colors.grey[400],
    textAlign: 'center',
  },
});