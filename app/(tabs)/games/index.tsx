import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy, ChevronRight, Medal, Target } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { GameCard } from '@/components/games/GameCard';
import { LeaderboardItem } from '@/components/games/LeaderboardItem';
import { Ionicons } from '@expo/vector-icons';
import { useColors, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function GamesScreen() {
  const colors = useColors();
  const { isDark } = useTheme();
  
  // Mock games data
  const games = [
    {
      id: '1',
      title: 'Spray Chart Challenge',
      description: 'Hit to specific field zones for points',
      level: 'All Levels',
      time: '10 min',
      image: 'https://images.pexels.com/photos/163451/baseball-field-diamond-baseball-game-163451.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: '2',
      title: 'Conditioned HR Derby',
      description: 'Maximize carry distance within launch angle constraints',
      level: 'Intermediate',
      time: '15 min',
      image: 'https://images.pexels.com/photos/1308713/pexels-photo-1308713.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: '3',
      title: 'Consistency Gauntlet',
      description: 'Sustain tight zone accuracy over multiple swings',
      level: 'Advanced',
      time: '20 min',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];
  
  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Mike T.', score: 287, image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { rank: 2, name: 'Sarah J.', score: 265, image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { rank: 3, name: 'You', score: 249, image: 'https://images.pexels.com/photos/1103833/pexels-photo-1103833.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { rank: 4, name: 'David M.', score: 228, image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { rank: 5, name: 'Emma L.', score: 203, image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    historyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    historyText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 14,
    },
    scrollContainer: {
      flex: 1,
    },
    sectionTitle: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 18,
      color: colors.grey[600],
      marginBottom: 16,
    },
    gamesContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 24,
    },
    leaderboardContainer: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      backgroundColor: colors.white,
      marginBottom: 24,
    },
    leaderboardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    leaderboardTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leaderboardTitle: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 18,
      color: colors.grey[600],
      marginLeft: 8,
    },
    viewAllText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 14,
      color: colors.grey[600],
    },
    leaderboardList: {
      gap: 12,
    },
    achievementsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    achievementCard: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: colors.grey[600],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    achievementIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.secondary.lightGreen,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    achievementTitle: {
      fontFamily: 'Barlow-Bold',
      fontSize: 16,
      color: colors.grey[600],
      marginBottom: 4,
    },
    achievementDescription: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.grey[500],
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.grey[50] }]} edges={['top']}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.header}>
        <Text style={[typography.h1, { color: colors.grey[600] }]}>Games</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="time-outline" size={20} color={colors.grey[600]} />
          <Text style={[styles.historyText, { color: colors.grey[600] }]}>History</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gamesContainer}>
          <Text style={styles.sectionTitle}>Game Challenges</Text>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </View>
        
        <View style={styles.leaderboardContainer}>
          <View style={styles.leaderboardHeader}>
            <View style={styles.leaderboardTitleContainer}>
              <Trophy size={20} color="#FFD700" />
              <Text style={styles.leaderboardTitle}>Leaderboard</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.leaderboardList}>
            {leaderboard.map((player, index) => (
              <LeaderboardItem key={index} player={player} />
            ))}
          </View>
        </View>
        
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIconContainer}>
              <Medal size={24} color="#FFD700" />
            </View>
            <View>
              <Text style={styles.achievementTitle}>Power Hitter</Text>
              <Text style={styles.achievementDescription}>3 hits with 90+ mph exit velocity</Text>
            </View>
          </View>
          
          <View style={styles.achievementCard}>
            <View style={styles.achievementIconContainer}>
              <Target size={24} color="#FFD700" />
            </View>
            <View>
              <Text style={styles.achievementTitle}>Zone Master</Text>
              <Text style={styles.achievementDescription}>Hit 8/9 strike zones in one session</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}