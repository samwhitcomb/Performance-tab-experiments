import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      {activities.map((activity) => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={styles.activityContent}>
            <Text style={styles.activityType}>{activity.type}</Text>
            <Text style={styles.activityDescription}>{activity.description}</Text>
            <Text style={styles.activityDate}>{activity.date}</Text>
          </View>
        </View>
      ))}
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
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontFamily: 'Barlow-Bold',
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[600],
    marginBottom: 4,
  },
  activityDate: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.grey[400],
  },
}); 