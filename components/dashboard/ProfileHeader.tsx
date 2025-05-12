import { View, Text, StyleSheet, Image } from 'react-native';
import { User } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface ProfileHeaderProps {
  user: {
    name: string;
    level: string;
    goal: string;
    progress: number;
    image: string;
  };
  achievement: string;
}

export function ProfileHeader({ user, achievement }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={24} color="#FFFFFF" />
            </View>
          )}
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.level}>{user.level}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.goalContainer}>
        <Text style={styles.goalLabel}>Current Goal</Text>
        <Text style={styles.goalText}>{user.goal}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${user.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{user.progress}% Complete</Text>
      </View>
      
      <View style={styles.achievementContainer}>
        <Text style={styles.achievementLabel}>Recent Achievement</Text>
        <Text style={styles.achievementText}>{achievement}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 18,
    color: colors.grey[600],
  },
  level: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[400],
  },
  goalContainer: {
    marginBottom: 16,
  },
  goalLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[400],
    marginBottom: 4,
  },
  goalText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 8,
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.grey[100],
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.grey[400],
    textAlign: 'right',
  },
  achievementContainer: {
    backgroundColor: colors.grey[50],
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  achievementLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.primary,
    marginBottom: 4,
  },
  achievementText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[600],
  },
});