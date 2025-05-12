import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Clock } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { PracticeCard } from '@/components/practice/PracticeCard';
import { SessionSetupModal } from '@/components/practice/SessionSetupModal';
import { DrillTypeSelector } from '@/components/practice/DrillTypeSelector';
import { DrillGuideModal } from '@/components/practice/DrillGuideModal';
import { colors, typography } from '@/constants/theme';
import { useSession } from '@/contexts/SessionContext';

export default function PracticeScreen() {
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [selectedDrillType, setSelectedDrillType] = useState('skill');
  const [selectedDrill, setSelectedDrill] = useState(null);
  const router = useRouter();
  const { pausedSession, resumeSession } = useSession();
  
  // Log when the pausedSession state changes
  useEffect(() => {
    console.log('Practice - pausedSession state:', pausedSession);
  }, [pausedSession]);

  // Mock drill data
  const skillDrills = [
    {
      id: '1',
      title: 'Launch Angle Ladder',
      description: 'Progress through increasingly challenging launch angle targets',
      focus: 'Trajectory Control',
      time: '15 min',
      type: 'tee',
      drillType: 'LADDER',
      image: 'https://images.pexels.com/photos/5769387/pexels-photo-5769387.jpeg',
      setup: [
        'Position tee at belt height',
        'Place alignment rod parallel to target line',
        'Set up launch angle feedback system',
        'Mark three distances: 10ft, 20ft, 30ft'
      ],
      targets: [
        'Achieve 3 consecutive hits at each angle',
        'Maintain exit velocity above 85 mph',
        'Keep spray angle within ±10 degrees',
        'Progress only after mastering current angle'
      ]
    },
    {
      id: '2',
      title: 'Exit Velocity Builder',
      description: 'Maximize peak exit velocity within a set',
      focus: 'Power',
      time: '20 min',
      type: 'soft-toss',
      drillType: 'DRILL',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
      setup: [
        'Partner positioned 45° angle, 3-4 feet away',
        'Use weighted balls for warm-up sets',
        'Set up velocity measurement device',
        'Mark target field direction'
      ],
      targets: [
        'Achieve 90+ mph exit velocity on 5 swings',
        'Maintain launch angle between 15-25°',
        'Keep at least 80% of hits on target line',
        'Progressive increase in average exit velocity'
      ]
    },
    {
      id: '3',
      title: 'Contact Point Mastery',
      description: 'Perfect your contact point for optimal ball flight',
      focus: 'Technique',
      time: '25 min',
      type: 'tee',
      drillType: 'LADDER',
      image: 'https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg',
      setup: [
        'Set tee at various heights and positions',
        'Use contact point markers',
        'Position video recording device',
        'Set up strike zone grid'
      ],
      targets: [
        'Hit each contact point zone consistently',
        'Maintain proper swing path',
        'Achieve optimal ball spin',
        'Progress through all contact points'
      ]
    },
    {
      id: '4',
      title: 'Zone Control Training',
      description: 'Improve hitting accuracy to all fields',
      focus: 'Precision',
      time: '30 min',
      type: 'soft-toss',
      drillType: 'DRILL',
      image: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg',
      setup: [
        'Mark field zones with cones',
        'Set up directional guides',
        'Position soft-toss feeder',
        'Place target markers'
      ],
      targets: [
        'Hit to designated zones on command',
        'Maintain consistent exit velocity',
        'Achieve proper launch angles',
        'Demonstrate field awareness'
      ]
    }
  ];
  
  const adaptiveDrills = [
    {
      id: '5',
      title: 'Inside Pitch Focus',
      description: 'AI recommended: Work on inside pitches with low launch angle',
      focus: 'Weakness',
      time: '20 min',
      type: 'soft-toss',
      drillType: 'DRILL',
      image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg',
      setup: [
        'Partner positioned at 45° angle inside',
        'Set up inside pitch marker',
        'Position contact point indicator',
        'Mark pull-side target area'
      ],
      targets: [
        'Keep hands inside the ball on all swings',
        'Achieve launch angle under 15°',
        'Maintain exit velocity above 85 mph',
        'Hit 70% of balls to pull side'
      ]
    },
    {
      id: '6',
      title: 'Progressive Power Path',
      description: 'AI-driven power development sequence',
      focus: 'Power',
      time: '25 min',
      type: 'tee',
      drillType: 'LADDER',
      image: 'https://images.pexels.com/photos/8224681/pexels-photo-8224681.jpeg',
      setup: [
        'Set up progressive resistance bands',
        'Position power measurement sensors',
        'Mark progression checkpoints',
        'Configure feedback system'
      ],
      targets: [
        'Complete each power level sequence',
        'Maintain proper mechanics',
        'Achieve target exit velocities',
        'Progress through resistance levels'
      ]
    }
  ];
  
  const drills = selectedDrillType === 'skill' ? skillDrills : adaptiveDrills;

  const handleDrillPress = (drill) => {
    setSelectedDrill(drill);
    setGuideModalVisible(true);
  };

  const handleStartSession = () => {
    setSetupModalVisible(false);
    router.push('/session');
  };

  const handleResumeSession = () => {
    resumeSession();
    router.push('/session');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={typography.h1}>Practice</Text>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => router.push('/session-history/practice')}
        >
          <Clock size={20} color={colors.grey[600]} />
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>
      
      <DrillTypeSelector 
        selectedType={selectedDrillType}
        onSelectType={setSelectedDrillType}
      />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.drillsContainer}>
          {drills.map((drill) => (
            <PracticeCard 
              key={drill.id} 
              drill={drill} 
              onPress={() => handleDrillPress(drill)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={[
            styles.fab,
            pausedSession && styles.resumeFab
          ]}
          onPress={pausedSession ? handleResumeSession : () => setSetupModalVisible(true)}
        >
          <Play size={24} color={colors.white} />
          <Text style={styles.fabText}>
            {pausedSession ? 'Resume Session' : 'Free Practice'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <SessionSetupModal 
        visible={setupModalVisible} 
        onClose={() => setSetupModalVisible(false)}
        onStart={handleStartSession}
      />

      <DrillGuideModal
        visible={guideModalVisible}
        onClose={() => {
          setGuideModalVisible(false);
          handleStartSession();
        }}
        drill={selectedDrill}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.grey[100],
  },
  historyText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[600],
  },
  scrollContainer: {
    flex: 1,
  },
  drillsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
    paddingBottom: 100, // Add padding to account for FAB
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    backgroundColor: colors.status.error,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    shadowColor: colors.status.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
    marginLeft: 12,
  },
  resumeFab: {
    backgroundColor: colors.primary,
  },
});