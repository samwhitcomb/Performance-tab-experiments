import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X, Pause, Play } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import { SessionMetrics } from '@/components/session/SessionMetrics';
import { EndSessionModal } from '@/components/session/EndSessionModal';
import { OrientationPrompt } from '@/components/session/OrientationPrompt';
import { useSession } from 'contexts/SessionContext';

export default function SessionScreen() {
  const [isPaused, setIsPaused] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [isOrientationPromptVisible, setIsOrientationPromptVisible] = useState(true);
  const router = useRouter();
  const { pauseSession, endSession } = useSession();
  
  // Log when the session screen is shown
  useEffect(() => {
    console.log('Session screen mounted');
    return () => console.log('Session screen unmounted');
  }, []);

  // Mock session data that would normally come from sensors/API
  const sessionData = {
    duration: 15, // minutes
    swings: 25,
    avgExitVelo: 87.5,
    topExitVelo: 98.2,
  };

  const handleEndSession = (shouldEnd: boolean) => {
    setShowEndModal(false);
    
    if (shouldEnd) {
      // End the session completely
      endSession();
      router.back();
    } else {
      // Pause/minimize the session
      console.log('Minimizing session...');
      pauseSession(sessionData);
      router.back();
    }
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  if (isOrientationPromptVisible) {
    return (
      <OrientationPrompt onContinue={() => setIsOrientationPromptVisible(false)} />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowEndModal(true)}
          >
            <X size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handlePauseToggle}
          >
            {isPaused ? (
              <Play size={24} color={colors.white} />
            ) : (
              <Pause size={24} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.centerContent}>
          <Text style={styles.statusText}>
            {isPaused ? 'Session Paused' : 'Session in Progress'}
          </Text>
        </View>
        
        <SessionMetrics />
      </View>

      <EndSessionModal 
        visible={showEndModal}
        onClose={() => setShowEndModal(false)}
        onEnd={handleEndSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    ...typography.h2,
    color: colors.white,
    textAlign: 'center',
  },
});