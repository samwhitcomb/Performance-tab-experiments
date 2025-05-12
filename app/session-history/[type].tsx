import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Filter, Calendar } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import { SessionCard } from '@/components/performance/SessionCard';

export default function SessionHistoryScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const isGames = type === 'games';

  // Mock session data
  const sessions = [
    {
      id: '1',
      date: 'Today',
      time: '2:30 PM',
      type: isGames ? 'Game' : 'Practice',
      title: isGames ? 'Spray Chart Challenge' : 'Launch Angle Ladder',
      metrics: {
        swings: 48,
        avgExitVelo: 87,
        avgLaunchAngle: 15,
        barrelPercentage: 32,
      },
    },
    {
      id: '2',
      date: 'Yesterday',
      time: '5:15 PM',
      type: isGames ? 'Game' : 'Practice',
      title: isGames ? 'HR Derby' : 'Power Training',
      metrics: {
        swings: 25,
        avgExitVelo: 89,
        avgLaunchAngle: 17,
        barrelPercentage: 36,
      },
    },
    {
      id: '3',
      date: '2 days ago',
      time: '3:45 PM',
      type: isGames ? 'Game' : 'Practice',
      title: isGames ? 'Consistency Challenge' : 'Zone Control',
      metrics: {
        swings: 35,
        avgExitVelo: 86,
        avgLaunchAngle: 16,
        barrelPercentage: 30,
      },
    },
  ];

  const handleSelectSession = (sessionId: string) => {
    // Make sure the navigation path and parameters are correctly formatted
    router.push({
      pathname: "/session-detail/[id]", 
      params: { id: sessionId, type: type as string }
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `${isGames ? 'Game' : 'Practice'} History`,
          headerShown: true,
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Filter size={20} color={colors.grey[600]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Calendar size={20} color={colors.grey[600]} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              selected={false}
              onSelect={handleSelectSession}
              selectionMode={false}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.grey[100],
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});