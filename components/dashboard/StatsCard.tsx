import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface StatsCardProps {
  title: string;
  stats: {
    label: string;
    value: string | number;
  }[];
}

export function StatsCard({ title, stats }: StatsCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.grey[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.grey[400],
  },
}); 