import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, ChevronRight, ArrowUpRight, Settings, Smartphone, Zap } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ProfileHeader } from '@/components/dashboard/ProfileHeader';
import { QuickStatsCard } from '@/components/dashboard/QuickStatsCard';
import { PracticeRecommendation } from '@/components/dashboard/PracticeRecommendation';
import { HotZoneMap } from '@/components/shared/HotZoneMap';
import { DeviceManagementModal } from '@/components/device/DeviceManagementModal';
import { useColors, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useSession } from 'contexts/SessionContext';

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isDark } = useTheme();
  const { pausedSession, resumeSession } = useSession();
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  
  // Log when the pausedSession state changes
  useEffect(() => {
    console.log('Dashboard - pausedSession state:', pausedSession);
  }, [pausedSession]);
  
  // Mock user data
  const user = {
    name: 'Alex Rodriguez',
    level: 'Advanced',
    goal: 'Increase EV by 5 mph',
    progress: 75,
    image: 'https://images.pexels.com/photos/1103833/pexels-photo-1103833.jpeg?auto=compress&cs=tinysrgb&w=300'
  };
  
  // Mock stats data
  const quickStats = [
    { label: 'Avg Exit Velo', value: '87', unit: 'mph' },
    { label: 'Avg Launch Angle', value: '15', unit: '°' },
    { label: 'Consistency', value: '84', unit: '%' },
  ];
  
  const recentAchievement = 'Hit 70% in ideal launch window this week!';
  
  // Recommended practice plans
  const recommendedPlans = [
    {
      title: '20 min Power Builder',
      description: 'Focus on maximizing exit velocity with consistent launch angles',
      intensity: 'High',
      timeEstimate: '20 min',
    },
    {
      title: 'Zone Mastery Drill',
      description: 'Improve contact in your cold zones with precision training',
      intensity: 'Medium',
      timeEstimate: '15 min',
    }
  ];

  const handleStartSession = () => {
    router.push('/session');
  };

  const handleContinueSession = () => {
    resumeSession(); // Tell context we're resuming
    router.push('/session');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    iconButton: {
      padding: 8,
      borderRadius: 8,
    },
    statsContainer: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    recommendedContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: 'Barlow-SemiBold',
      fontSize: 18,
      color: colors.grey[600],
    },
    viewAllText: {
      fontFamily: 'Barlow-Medium',
      fontSize: 14,
      color: colors.primary,
    },
    recommendationsWrapper: {
      gap: 16,
    },
    zoneContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
    },
    startSessionContainer: {
      marginTop: 32,
      marginBottom: 24,
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    startSessionButton: {
      flexDirection: 'row',
      backgroundColor: colors.status.error,
      borderRadius: 30,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 280,
      shadowColor: colors.status.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    startSessionText: {
      fontFamily: 'Barlow-Bold',
      fontSize: 18,
      color: colors.white,
      marginLeft: 12,
    },
    startSessionSubtext: {
      fontFamily: 'Barlow-Regular',
      fontSize: 14,
      color: colors.grey[400],
      marginTop: 8,
    },
  });

  // Add new styles for the continue session button
  const updatedStyles = StyleSheet.create({
    ...styles,
    continueSessionButton: {
      flexDirection: 'row',
      backgroundColor: colors.secondary.indigo,
      borderRadius: 30,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 280,
      shadowColor: colors.secondary.indigo,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    continueSessionText: {
      fontFamily: 'Barlow-Bold',
      fontSize: 18,
      color: colors.white,
      marginLeft: 12,
    },
  });

  return (
    <SafeAreaView style={[updatedStyles.container, { backgroundColor: colors.grey[50] }]} edges={['top']}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={updatedStyles.header}>
        <Text style={[typography.h1, { color: colors.grey[600] }]}>Dashboard</Text>
        <View style={updatedStyles.headerButtons}>
          <TouchableOpacity 
            style={[updatedStyles.iconButton, { backgroundColor: colors.grey[100] }]}
            onPress={() => setDeviceModalVisible(true)}
          >
            <Smartphone size={24} color={colors.grey[600]} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[updatedStyles.iconButton, { backgroundColor: colors.grey[100] }]}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color={colors.grey[600]} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader user={user} achievement={recentAchievement} />
        
        <View style={updatedStyles.statsContainer}>
          <Text style={[updatedStyles.sectionTitle, { color: colors.grey[600] }]}>Quick Stats</Text>
          <QuickStatsCard stats={quickStats} />
        </View>
        
        <View style={updatedStyles.recommendedContainer}>
          <View style={updatedStyles.sectionHeader}>
            <Text style={[updatedStyles.sectionTitle, { color: colors.grey[600] }]}>Recommended Practice</Text>
            <TouchableOpacity>
              <Text style={[updatedStyles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={updatedStyles.recommendationsWrapper}>
            {recommendedPlans.map((plan, index) => (
              <PracticeRecommendation key={index} plan={plan} />
            ))}
          </View>
        </View>
        
        <View style={updatedStyles.zoneContainer}>
          <View style={updatedStyles.sectionHeader}>
            <Text style={[updatedStyles.sectionTitle, { color: colors.grey[600] }]}>Hot/Cold Zones</Text>
            <TouchableOpacity onPress={() => router.push('/performance')}>
              <Text style={[updatedStyles.viewAllText, { color: colors.primary }]}>
                Full Analysis <ArrowUpRight size={14} color={colors.primary} />
              </Text>
            </TouchableOpacity>
          </View>
          
          <HotZoneMap />
        </View>
        
        <View style={updatedStyles.startSessionContainer}>
          {pausedSession ? (
            <React.Fragment>
              <TouchableOpacity 
                style={updatedStyles.continueSessionButton}
                onPress={handleContinueSession}
              >
                <Zap size={24} color={colors.white} />
                <Text style={updatedStyles.continueSessionText}>Continue Session</Text>
              </TouchableOpacity>
              <Text style={updatedStyles.startSessionSubtext}>Resume your paused session</Text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TouchableOpacity 
                style={updatedStyles.startSessionButton}
                onPress={handleStartSession}
              >
                <Play size={24} color={colors.white} />
                <Text style={updatedStyles.startSessionText}>Start Session</Text>
              </TouchableOpacity>
              <Text style={updatedStyles.startSessionSubtext}>Tee or Soft Toss</Text>
            </React.Fragment>
          )}
        </View>
      </ScrollView>

      <DeviceManagementModal 
        visible={deviceModalVisible}
        onClose={() => setDeviceModalVisible(false)}
      />
    </SafeAreaView>
  );
}