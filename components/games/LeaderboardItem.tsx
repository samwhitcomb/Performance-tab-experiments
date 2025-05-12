import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/theme';

interface LeaderboardItemProps {
  player: {
    rank: number;
    name: string;
    score: number;
    image: string;
  };
}

export function LeaderboardItem({ player }: LeaderboardItemProps) {
  const isCurrentUser = player.name === 'You';
  
  return (
    <View style={[
      styles.container,
      isCurrentUser && styles.currentUserContainer,
    ]}>
      <View style={[
        styles.rankContainer,
        player.rank === 1 && styles.firstRank,
        player.rank === 2 && styles.secondRank,
        player.rank === 3 && styles.thirdRank,
      ]}>
        <Text style={styles.rankText}>{player.rank}</Text>
      </View>
      
      <Image 
        source={{ uri: player.image }} 
        style={styles.avatar}
      />
      
      <Text style={[
        styles.nameText,
        isCurrentUser && styles.currentUserText,
      ]}>
        {player.name}
      </Text>
      
      <Text style={styles.scoreText}>{player.score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  currentUserContainer: {
    backgroundColor: 'rgba(43, 115, 223, 0.1)',
  },
  rankContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.grey[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  firstRank: {
    backgroundColor: '#FFD700', // Gold
  },
  secondRank: {
    backgroundColor: '#C0C0C0', // Silver
  },
  thirdRank: {
    backgroundColor: '#CD7F32', // Bronze
  },
  rankText: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 14,
    color: colors.grey[600],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  nameText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[600],
    flex: 1,
  },
  currentUserText: {
    fontFamily: 'Barlow-Bold',
    color: colors.primary,
  },
  scoreText: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 16,
    color: colors.grey[600],
  },
});