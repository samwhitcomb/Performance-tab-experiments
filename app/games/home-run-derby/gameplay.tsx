import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, TouchableWithoutFeedback, ScrollView, useWindowDimensions, FlatList, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, ChevronRight, Target, Zap, TrendingUp, RefreshCw, Wifi, Medal, BarChart2, ArrowLeft, AlertCircle, ArrowRight } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import { useDevice } from '@/contexts/DeviceContext';
import { useGame } from '@/contexts/GameContext';
import { OrientationPrompt } from '@/components/session/OrientationPrompt';
import { DeviceManagementModal } from '@/components/device/DeviceManagementModal';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

// Type for shot data
interface ShotData {
  id: string;
  distance: number;
  exitVelocity: number;
  launchAngle: number;
  launchDirection: number;
  batSpeed: number;
  score: number;
  isHomeRun: boolean;
  timeStamp: number;
}

// UI states for the game
type GameUIState = 'pre-swing' | 'swing-detected' | 'post-metric' | 'player-change';

export default function HomeRunDerbyGameplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isConnected } = useDevice();
  const { addGameToHistory, storeItems } = useGame();
  
  // Window dimensions for landscape detection
  const { width, height } = useWindowDimensions();
  const isScreenLandscape = width > height;
  
  // Orientation state
  const [isOrientationPromptVisible, setIsOrientationPromptVisible] = useState(true);
  
  // Full metrics view toggle
  const [showFullMetrics, setShowFullMetrics] = useState(false);
  
  // Metrics tray state
  const [showMetricsTray, setShowMetricsTray] = useState(false);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const metricsTrayAnim = useRef(new Animated.Value(0)).current;
  
  // Device modal visibility
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  
  // Results screen state
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const [statView, setStatView] = useState<'hrs' | 'distance' | 'accuracy'>('hrs');
  
  // Shot history timeline state
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  
  // Add state for delayed home run announcement
  const [showHomeRunAnnouncement, setShowHomeRunAnnouncement] = useState(false);
  
  // Add state for delayed shot verdict
  const [showShotVerdict, setShowShotVerdict] = useState(false);
  
  // UI Controls and animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const metricsPopAnim = useRef(new Animated.Value(0)).current;
  const readyPulseAnim = useRef(new Animated.Value(1)).current;
  const [controlsVisible, setControlsVisible] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);
  const [gameUIState, setGameUIState] = useState<GameUIState>('pre-swing');
  const playerChangeTimeoutRef = useRef<number | null>(null);
  
  // Add animation value for shot history
  const shotHistoryFadeAnim = useRef(new Animated.Value(0)).current;
  const [shotHistoryVisible, setShotHistoryVisible] = useState(false);
  
  // Add sound references - placed with other state declarations
  const [backgroundSound, setBackgroundSound] = useState<Audio.Sound | null>(null);
  const [cheeringSound, setCheeringSound] = useState<Audio.Sound | null>(null);
  
  // Game settings from params or use defaults
  const sessionType = (params.sessionType as string) || 'tee';
  const location = (params.location as string) || 'indoor';
  const stadium = (params.stadium as string) || 'classic';
  const weather = (params.weather as string) || 'Sunny';
  const timeOfDay = (params.timeOfDay as string) || 'Day';
  const stadiumSize = (params.stadiumSize as string) || 'ADULT';
  const players = params.players 
    ? JSON.parse(params.players as string) 
    : [{ name: 'You', id: '1' }];
  
  // Get stadium info
  const stadiumInfo = storeItems.find(item => item.type === 'stadium' && item.id === stadium);
  
  // Game state
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [ballCount, setBallCount] = useState(0);
  const [maxBalls] = useState(10); // 10 balls per player
  const [playerScores, setPlayerScores] = useState<Record<string, ShotData[]>>(
    players.reduce((acc: Record<string, ShotData[]>, player: { id: string }) => {
      acc[player.id] = [];
      return acc;
    }, {})
  );
  const [latestShot, setLatestShot] = useState<ShotData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [gameStartTime] = useState<Date>(new Date());
  
  const currentPlayer = players[currentPlayerIndex];
  
  // Calculate current player stats
  const currentPlayerShots = playerScores[currentPlayer.id] || [];
  const homeRunCount = currentPlayerShots.filter(shot => shot.isHomeRun).length;
  const totalScore = currentPlayerShots.reduce((sum, shot) => sum + shot.score, 0);
  const longestHR = currentPlayerShots.filter(shot => shot.isHomeRun).reduce((max, shot) => Math.max(max, shot.distance), 0);
  const bestEV = currentPlayerShots.reduce((max, shot) => Math.max(max, shot.exitVelocity), 0);
  
  // Add refs for distance counter animation
  const distanceCountRef = useRef(new Animated.Value(0)).current;
  const [displayDistance, setDisplayDistance] = useState(0);
  
  // Load sounds on component mount - MOVED TO BE WITH OTHER USEEFFECTS
  useEffect(() => {
    const loadSounds = async () => {
      try {
        console.log('Loading sounds...');
        
        // Set audio mode for the app
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false
        });
        
        // Load background crowd sound
        const { sound: bgSound } = await Audio.Sound.createAsync(
          require('@/assets/Sounds/Background crowd.mov'),
          { isLooping: true, volume: 0.5 }
        );
        setBackgroundSound(bgSound);
        
        // Load cheering sound
        const { sound: cheerSound } = await Audio.Sound.createAsync(
          require('@/assets/Sounds/Excited Cheerings.mov'),
          { isLooping: false, volume: 1.0 }
        );
        setCheeringSound(cheerSound);
        
        console.log('Sounds loaded successfully');
        
        // Start playing background sound
        await bgSound.playAsync();
      } catch (error) {
        console.error('Error loading sounds:', error);
      }
    };
    
    loadSounds();
    
    // Cleanup function for when component unmounts
    return () => {
      const cleanup = async () => {
        if (backgroundSound) {
          await backgroundSound.stopAsync();
          await backgroundSound.unloadAsync();
        }
        if (cheeringSound) {
          await cheeringSound.stopAsync();
          await cheeringSound.unloadAsync();
        }
      };
      
      cleanup();
    };
  }, []);
  
  // Play cheering sound when a home run is detected - MOVED TO BE WITH OTHER USEEFFECTS
  useEffect(() => {
    const playHomeRunCheer = async () => {
      if (showHomeRunAnnouncement && latestShot?.isHomeRun && cheeringSound) {
        try {
          // Stop and rewind the sound first
          await cheeringSound.stopAsync();
          await cheeringSound.setPositionAsync(0);
          // Play the cheering sound
          await cheeringSound.playAsync();
        } catch (error) {
          console.error('Error playing cheering sound:', error);
        }
      }
    };
    
    playHomeRunCheer();
  }, [showHomeRunAnnouncement, latestShot?.isHomeRun, cheeringSound]);
  
  // Stop sounds before showing results - MOVED TO BE WITH OTHER USEEFFECTS
  useEffect(() => {
    if (!backgroundSound) return; // Add guard to avoid conditional hook execution
    
    if (showResults) {
      const stopBackgroundSound = async () => {
        try {
          await backgroundSound.stopAsync();
        } catch (error) {
          console.error('Error stopping background sound:', error);
        }
      };
      
      stopBackgroundSound();
    } else {
      // Restart sound if going back to gameplay
      const restartBackgroundSound = async () => {
        try {
          await backgroundSound.playAsync();
        } catch (error) {
          console.error('Error restarting background sound:', error);
        }
      };
      
      restartBackgroundSound();
    }
  }, [showResults, backgroundSound]);
  
  // Start ready animation on component mount
  useEffect(() => {
    startReadyAnimation();
  }, []);
  
  // Listen to distance counter animation and update displayed value
  useEffect(() => {
    const listener = distanceCountRef.addListener(({ value }) => {
      setDisplayDistance(Math.floor(value));
    });
    
    return () => {
      distanceCountRef.removeListener(listener);
    };
  }, []);
  
  // Clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current !== null) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (playerChangeTimeoutRef.current !== null) {
        clearTimeout(playerChangeTimeoutRef.current);
      }
    };
  }, []);
  
  // Start pulsing animation for "Ready for swing" text
  const startReadyAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(readyPulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(readyPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();
  };
  
  // Show/hide controls when screen is touched
  const handleScreenTouch = (event: { nativeEvent: { locationX: number; locationY: number } }) => {
    // Don't handle the touch if it's within the shot history container
    const { locationX, locationY } = event.nativeEvent;
    const shotHistoryRect = {
      left: 20,
      top: 20,
      right: 20 + 220, // left + width
      bottom: 20 + 350, // top + height
    };
    
    // Check if touch is within shot history bounds
    if (
      locationX >= shotHistoryRect.left && 
      locationX <= shotHistoryRect.right && 
      locationY >= shotHistoryRect.top && 
      locationY <= shotHistoryRect.bottom
    ) {
      return; // Touch is within shot history, don't handle it
    }
    
    // Handle touch normally
    if (!controlsVisible) {
      showControls();
    } else {
      resetControlsTimer();
    }
  };
  
  // Show controls with fade in animation
  const showControls = () => {
    setControlsVisible(true);
    setShotHistoryVisible(true);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    Animated.timing(shotHistoryFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    resetControlsTimer();
  };
  
  // Hide controls with fade out animation
  const hideControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setControlsVisible(false);
    });
    
    Animated.timing(shotHistoryFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setShotHistoryVisible(false);
    });
  };
  
  // Reset the controls timer
  const resetControlsTimer = () => {
    if (controlsTimeoutRef.current !== null) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      hideControls();
    }, 5000) as unknown as number;
  };
  
  // Animate metrics display with counting effect
  const animateMetricsDisplay = () => {
    // Reset to starting position for shot verdict animation
    metricsPopAnim.setValue(0);
    
    // Reset distance counter to 0
    distanceCountRef.setValue(0);
    setDisplayDistance(0);
    
    // Reset announcements
    setShowHomeRunAnnouncement(false);
    setShowShotVerdict(false);
    
    // Animate pop-in for the shot verdict, not the metrics
    Animated.timing(metricsPopAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Start counting up the distance
      if (latestShot) {
        // Animate distance counting up
        Animated.timing(distanceCountRef, {
          toValue: latestShot.distance,
          duration: 1500, // Slower for dramatic effect
          useNativeDriver: false, // Can't use native driver for non-layout/transform props
        }).start(() => {
          // Show home run announcement after distance counter completes
          if (latestShot.isHomeRun) {
            setShowHomeRunAnnouncement(true);
          }
          
          // Show shot verdict after distance counter completes
          setShowShotVerdict(true);
        });
        
        // Show shot verdict near the end of the distance countup (after 80% of the animation)
        setTimeout(() => {
          setShowShotVerdict(true);
        }, 1200); // 1200ms = 80% of 1500ms animation duration
      }
      
      // Schedule fade-out for shot verdict only after 3 seconds
      setTimeout(() => {
        Animated.timing(metricsPopAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // Set to post-metric state, then return to pre-swing state after a short delay
          setGameUIState('post-metric');
          setShowHomeRunAnnouncement(false);
          setShowShotVerdict(false);
          setTimeout(() => {
            setGameUIState('pre-swing');
          }, 500); // Brief delay before allowing next swing
        });
      }, 3000);
    });
  };
  
  // Process a new shot (would normally come from device data)
  const processNewShot = () => {
    // Switch to swing detected state
    setGameUIState('swing-detected');
    
    // Simulate getting data from the launch monitor
    const newShot: ShotData = {
      id: `${Date.now()}`,
      distance: Math.floor(Math.random() * 400) + 100, // 100-500 feet
      exitVelocity: Math.floor(Math.random() * 30) + 70, // 70-100 mph
      launchAngle: Math.floor(Math.random() * 40) - 5, // -5 to 35 degrees
      launchDirection: Math.floor(Math.random() * 60) - 30, // -30 to 30 degrees
      batSpeed: Math.floor(Math.random() * 20) + 60, // 60-80 mph
      score: Math.floor(Math.random() * 100), // 0-100 points
      isHomeRun: Math.random() > 0.7, // 30% chance of home run
      timeStamp: Date.now()
    };
    
    // Update state with new shot
    setLatestShot(newShot);
    setBallCount(prevCount => prevCount + 1);
    
    // Add shot to player's score
    setPlayerScores(prevScores => ({
      ...prevScores,
      [currentPlayer.id]: [...(prevScores[currentPlayer.id] || []), newShot]
    }));
    
    // Animate metrics display
    animateMetricsDisplay();
    
    // Check if player's turn is over
    if (ballCount + 1 >= maxBalls) {
      // Show player change card
      setTimeout(() => {
        setGameUIState('player-change');
        
        // Wait for user action or auto-advance after 5 seconds
        playerChangeTimeoutRef.current = setTimeout(() => {
          handleNextPlayer();
        }, 5000) as unknown as number;
      }, 3500); // Delay to show the shot result
    }
  };
  
  // Handle advancing to next player
  const handleNextPlayer = () => {
    // Clear the timeout if it exists
    if (playerChangeTimeoutRef.current !== null) {
      clearTimeout(playerChangeTimeoutRef.current);
      playerChangeTimeoutRef.current = null;
    }
    
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prevIndex => prevIndex + 1);
      setBallCount(0);
      setLatestShot(null);
      setGameUIState('pre-swing');
    } else {
      setShowResults(true);
      setExpandedPlayerId(null);
    }
  };
  
  // Exit the game and go back to games list
  const exitGame = () => {
    console.log('Navigating to games tab...');
    
    // Stop sounds
    const stopSounds = async () => {
      if (backgroundSound) {
        await backgroundSound.stopAsync();
      }
      if (cheeringSound) {
        await cheeringSound.stopAsync();
      }
    };
    
    stopSounds();
    
    // If game has results, save to history
    if (showResults) {
      saveGameToHistory();
    }
    
    // Use a more explicit navigation approach with replacement
    router.replace('/(tabs)/games');
  };
  
  // Save game data to history
  const saveGameToHistory = () => {
    // Get player stats for history
    const playerStats = [...players].map(player => {
      const shots = playerScores[player.id] || [];
      const homeRuns = shots.filter(shot => shot.isHomeRun);
      const hrCount = homeRuns.length;
      const totalScore = shots.reduce((sum, shot) => sum + shot.score, 0);
      
      return {
        id: player.id,
        name: player.name,
        score: totalScore,
        homeRuns: hrCount
      };
    });
    
    // Sort players by score to determine winner
    const sortedPlayers = [...playerStats].sort((a, b) => {
      const aHomeRuns = a.homeRuns;
      const bHomeRuns = b.homeRuns;
      
      if (aHomeRuns === bHomeRuns) {
        return b.score - a.score;
      }
      
      return bHomeRuns - aHomeRuns;
    });
    
    // Get all shots and calculate advanced stats
    const allShots = Object.values(playerScores).flat();
    const exitVelocities = allShots.map(shot => shot.exitVelocity);
    const launchAngles = allShots.map(shot => shot.launchAngle);
    const distances = allShots.map(shot => shot.distance);
    
    const avgExitVelocity = exitVelocities.length 
      ? Math.round(exitVelocities.reduce((sum, v) => sum + v, 0) / exitVelocities.length) 
      : 0;
    const avgLaunchAngle = launchAngles.length 
      ? Math.round(launchAngles.reduce((sum, a) => sum + a, 0) / launchAngles.length) 
      : 0;
    const maxDistance = distances.length 
      ? Math.max(...distances) 
      : 0;
    
    const totalHomeRuns = allShots.filter(shot => shot.isHomeRun).length;
    const totalScore = allShots.reduce((sum, shot) => sum + shot.score, 0);
    const maxExitVelocity = exitVelocities.length ? Math.max(...exitVelocities) : 0;
    
    // Calculate game duration in minutes
    const gameEndTime = new Date();
    const durationMs = gameEndTime.getTime() - gameStartTime.getTime();
    const durationMinutes = Math.ceil(durationMs / (1000 * 60));
    
    // Create game history entry
    const gameHistoryEntry = {
      id: `derby-${Date.now()}`,
      gameType: 'Home Run Derby',
      date: new Date().toISOString(),
      winner: sortedPlayers[0].name,
      totalScore,
      totalHomeRuns,
      maxExitVelocity,
      duration: durationMinutes,
      players: playerStats,
      stadium: {
        id: stadium,
        name: stadiumInfo?.name || 'Default Stadium',
        image: stadiumInfo?.image
      },
      stats: {
        avgExitVelocity,
        avgLaunchAngle,
        maxDistance
      }
    };
    
    // Add to game history
    addGameToHistory(gameHistoryEntry);
    console.log('Game saved to history:', gameHistoryEntry);
  };
  
  // Restart the game
  const restartGame = () => {
    // Save the current game to history before restarting
    if (showResults) {
      saveGameToHistory();
    }
    
    setCurrentPlayerIndex(0);
    setBallCount(0);
    setPlayerScores(
      players.reduce((acc: Record<string, ShotData[]>, player: { id: string }) => {
        acc[player.id] = [];
        return acc;
      }, {})
    );
    setLatestShot(null);
    setShowResults(false);
    // Reset the expanded player ID and stat view
    setExpandedPlayerId(null);
    setStatView('hrs');
    
    // Restart background sound if it was stopped
    const restartBackgroundSound = async () => {
      if (backgroundSound) {
        try {
          await backgroundSound.playAsync();
        } catch (error) {
          console.error('Error restarting background sound:', error);
        }
      }
    };
    
    restartBackgroundSound();
  };
  
  // Toggle metrics display
  const toggleMetricsView = () => {
    // Toggle the metrics tray state
    const newState = !showMetricsTray;
    setShowMetricsTray(newState);
    
    // Animate the tray sliding in or out
    Animated.timing(metricsTrayAnim, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // If showing the tray and we have a latest shot, select it by default
    if (newState && latestShot && !selectedShotId) {
      setSelectedShotId(latestShot.id);
    }
  };
  
  // Toggle device modal
  const toggleDeviceModal = () => {
    setDeviceModalVisible(!deviceModalVisible);
  };
  
  // Check if device is in landscape mode
  const isLandscape = () => {
    return isScreenLandscape;
  };
  
  // Show orientation prompt if not in landscape
  if (isOrientationPromptVisible) {
    return (
      <OrientationPrompt onContinue={() => setIsOrientationPromptVisible(false)} />
    );
  }
  
  // Render full metrics overlay
  const renderFullMetricsView = () => {
    return (
      <View style={styles.fullMetricsContainer}>
        <View style={styles.fullMetricsHeader}>
          <TouchableOpacity onPress={toggleMetricsView}>
            <ArrowLeft size={24} color={colors.grey[600]} />
          </TouchableOpacity>
          <Text style={styles.fullMetricsTitle}>Shot Metrics</Text>
          <View style={{width: 24}} />
        </View>
        
        <View style={styles.fullMetricsContent}>
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Target size={20} color={colors.grey[600]} />
              <Text style={styles.metricCardTitle}>Distance</Text>
            </View>
            <Text style={styles.metricCardValue}>{latestShot?.distance || '–'} <Text style={styles.metricCardUnit}>ft</Text></Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Zap size={20} color={colors.grey[600]} />
              <Text style={styles.metricCardTitle}>Exit Velocity</Text>
            </View>
            <Text style={styles.metricCardValue}>{latestShot?.exitVelocity || '–'} <Text style={styles.metricCardUnit}>mph</Text></Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <TrendingUp size={20} color={colors.grey[600]} />
              <Text style={styles.metricCardTitle}>Launch Angle</Text>
            </View>
            <Text style={styles.metricCardValue}>{latestShot?.launchAngle || '–'} <Text style={styles.metricCardUnit}>°</Text></Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <RefreshCw size={20} color={colors.grey[600]} />
              <Text style={styles.metricCardTitle}>Direction</Text>
            </View>
            <Text style={styles.metricCardValue}>{latestShot?.launchDirection || '–'} <Text style={styles.metricCardUnit}>°</Text></Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Zap size={20} color={colors.grey[600]} />
              <Text style={styles.metricCardTitle}>Bat Speed</Text>
            </View>
            <Text style={styles.metricCardValue}>{latestShot?.batSpeed || '–'} <Text style={styles.metricCardUnit}>mph</Text></Text>
          </View>
          
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Medal size={20} color={colors.grey[600]} />
              <Text style={styles.metricCardTitle}>Shot Score</Text>
            </View>
            <Text style={styles.metricCardValue}>{latestShot?.score || '–'}</Text>
          </View>
        </View>
      </View>
    );
  };
  
  // Render Player Change Card
  const renderPlayerChangeCard = () => {
    return (
      <View style={styles.playerChangeContainer}>
        <View style={styles.playerChangeCard}>
          <Text style={styles.playerChangeHeader}>🎉 {currentPlayer.name} FINISHED</Text>
          <View style={styles.playerChangeStats}>
            <Text style={styles.playerChangeStat}>HOME RUNS: {homeRunCount}</Text>
            <Text style={styles.playerChangeStat}>LONGEST HR: {longestHR > 0 ? `${longestHR} FT` : 'N/A'}</Text>
            <Text style={styles.playerChangeStat}>BEST EV: {bestEV > 0 ? `${bestEV} MPH` : 'N/A'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.nextPlayerButton}
            onPress={handleNextPlayer}
          >
            <Text style={styles.nextPlayerButtonText}>NEXT PLAYER</Text>
            <ArrowRight size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Function to handle shot selection from history
  const handleShotSelect = (shotId: string) => {
    console.log("Shot selected:", shotId); // Debugging log
    setSelectedShotId(shotId);
    
    // Open metrics tray if not already open
    if (!showMetricsTray) {
      setShowMetricsTray(true);
      Animated.timing(metricsTrayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  // Render Shot History Timeline
  const renderShotHistory = () => {
    const visibleShots = currentPlayerShots.slice().reverse(); // Newest shots first
    
    return (
      <Animated.View 
        style={[
          styles.shotHistoryContainer,
          { opacity: shotHistoryFadeAnim }
        ]}
      >
        <View style={styles.shotHistoryHeader}>
          <Text style={styles.shotHistoryTitle}>SHOT HISTORY</Text>
        </View>
        
        {visibleShots.length === 0 ? (
          <View style={styles.emptyShotHistory}>
            <Text style={styles.emptyShotHistoryText}>No shots yet</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.shotHistoryList}
            contentContainerStyle={styles.shotHistoryContent}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            bounces={true}
            directionalLockEnabled={true}
            persistentScrollbar={true}
            scrollEventThrottle={16}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
          >
            {visibleShots.map((item, index) => {
              // Calculate opacity based on index (more recent shots are more visible)
              const opacity = showFullTimeline ? 1 : Math.max(0.3, 1 - (index * 0.2));
              const isSelected = selectedShotId === item.id;
              
              return (
                <TouchableOpacity 
                  key={item.id}
                  style={[
                    styles.shotHistoryItem, 
                    { opacity }, 
                    item.isHomeRun && styles.homeRunShotItem,
                    isSelected && styles.selectedShotItem
                  ]}
                  onPress={() => {
                    console.log("Shot selected:", item.id);
                    setSelectedShotId(item.id);
                    
                    // Open metrics tray if not already open
                    if (!showMetricsTray) {
                      setShowMetricsTray(true);
                      
                      Animated.timing(metricsTrayAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                      }).start();
                    }
                  }}
                >
                  <View style={styles.shotNumberBadge}>
                    <Text style={styles.shotNumberText}>
                      {currentPlayerShots.length - index}
                    </Text>
                  </View>
                  <View style={styles.shotHistoryDetails}>
                    <Text style={styles.shotDistanceText}>
                      {item.distance} ft
                    </Text>
                    <Text style={styles.shotTypeText}>
                      {item.isHomeRun ? 'HOME RUN' : getOutcomeText(item)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </Animated.View>
    );
  };
  
  // Render persistent home run counter
  const renderHomeRunCounter = () => {
    return (
      <View style={styles.homeRunCounterContainer}>
        <Ionicons name="baseball" size={24} color={colors.status.warning} />
        <Text style={styles.homeRunCounterText}>{homeRunCount}</Text>
      </View>
    );
  };
  
  // Render the current player indicator for the top right
  const renderCurrentPlayerIndicator = () => {
    return (
      <View style={styles.currentPlayerIndicator}>
        <Text style={styles.currentPlayerText}>
          {currentPlayerIndex + 1}/{players.length}: {currentPlayer.name}
        </Text>
      </View>
    );
  };
  
  // Render the gameplay HUD
  const renderGameplayHUD = () => {
    // Metric opacity based on animation
    const metricOpacity = metricsPopAnim;
    
    return (
      <TouchableWithoutFeedback onPress={handleScreenTouch}>
        <View style={styles.container}>
          {/* Background Image */}
          <Image 
            source={
              stadiumInfo?.image
                ? { uri: stadiumInfo.image }
                : require('@/assets/images/Game_Screen.jpg')
            }
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          
          {/* Stadium name overlay (optional) - REMOVED */}
          
          <View style={styles.content}>
            {/* Floating player info (always visible) - CENTER TOP ONLY */}
            <View style={styles.playerInfoHeader}>
              <Text style={styles.playerNameText}>{currentPlayer.name}</Text>
              <Text style={styles.swingsLeftText}>SWINGS LEFT: {maxBalls - ballCount} / {maxBalls}</Text>
            </View>
            
            {/* Current Player Indicator - TOP RIGHT - REMOVED */}
            {/* {renderCurrentPlayerIndicator()} */}
            
            {/* Shot History Timeline - only show when controls are visible */}
            {shotHistoryVisible && renderShotHistory()}
            
            {/* Ready for swing indicator (pre-swing state) */}
            {gameUIState === 'pre-swing' && (
              <Animated.View style={[styles.readyIndicator, { opacity: readyPulseAnim }]}>
                <RefreshCw size={24} color={colors.white} />
                <Text style={styles.readyText}>Ready for swing...</Text>
              </Animated.View>
            )}
            
            {/* Center area with home run notification */}
            <View style={styles.centerContentContainer}>
              {showHomeRunAnnouncement && latestShot?.isHomeRun && (
                <View style={styles.homeRunOverlay}>
                  <Text style={styles.homeRunText}>HOME RUN!</Text>
                </View>
              )}
            </View>
            
            {/* Simplified Metrics - Distance Counter Bottom Left - Always visible */}
            <View style={styles.distanceCounter}>
              <Text style={styles.distanceLabel}>DISTANCE</Text>
              <View style={styles.distanceValueContainer}>
                <Text style={styles.distanceValue}>{gameUIState === 'swing-detected' ? displayDistance : (latestShot?.distance || 0)}</Text>
                <Text style={styles.distanceUnit}>ft</Text>
              </View>
            </View>
            
            {/* Simplified Metrics - Bat Speed Bottom Right - Always visible */}
            <View style={styles.batSpeedCounter}>
              <Text style={styles.batSpeedLabel}>BAT SPEED</Text>
              <View style={styles.batSpeedValueContainer}>
                <Text style={styles.batSpeedValue}>{latestShot?.batSpeed || 0}</Text>
                <Text style={styles.batSpeedUnit}>mph</Text>
              </View>
            </View>
            
            {/* Shot type verdict - Now much larger and delayed */}
            {gameUIState === 'swing-detected' && showShotVerdict && (
              <Animated.View 
                style={[
                  styles.shotVerdict,
                  { 
                    opacity: metricOpacity,
                    backgroundColor: latestShot?.isHomeRun 
                      ? 'rgba(46, 204, 113, 0.8)' 
                      : 'rgba(231, 76, 60, 0.8)' 
                  }
                ]}
              >
                <Text style={styles.shotVerdictText}>
                  {latestShot?.isHomeRun 
                    ? 'HOME RUN' 
                    : getOutcomeText(latestShot)
                  }
                </Text>
              </Animated.View>
            )}
            
            {/* Persistent Home Run Counter - moved it up a bit to avoid overlap */}
            {renderHomeRunCounter()}
            
            {/* Fade-in controls - ALL ON RIGHT SIDE */}
            <Animated.View style={[styles.controlsContainer, { opacity: fadeAnim }]}>
              {/* Exit button */}
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={exitGame}
              >
                <X size={20} color={colors.white} />
              </TouchableOpacity>
              
              {/* Metrics button */}
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleMetricsView}
              >
                <BarChart2 size={24} color={colors.white} />
              </TouchableOpacity>
              
              {/* Device button */}
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={toggleDeviceModal}
              >
                <Wifi size={24} color={isConnected ? colors.status.success : colors.status.error} />
              </TouchableOpacity>
            </Animated.View>
            
            {/* Swing button - show in pre-swing and post-metric states */}
            {(gameUIState === 'pre-swing' || gameUIState === 'post-metric') && (
              <TouchableOpacity 
                style={styles.swingButton}
                onPress={processNewShot}
                disabled={ballCount >= maxBalls}
              >
                <Text style={styles.swingButtonText}>
                  {ballCount >= maxBalls ? 'FINISHED' : 'SWING'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Full metrics overlay */}
          {showFullMetrics && renderFullMetricsView()}
          
          {/* Metrics sliding tray */}
          {renderMetricsTray()}
          
          {/* Player change card */}
          {gameUIState === 'player-change' && renderPlayerChangeCard()}
          
          {/* Device management modal */}
          <DeviceManagementModal 
            visible={deviceModalVisible}
            onClose={toggleDeviceModal}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  // Get color background for metric based on value
  const getMetricColor = (value: number, metricType: string): string => {
    // Define color ranges based on metric type
    switch(metricType) {
      case 'exitVelocity':
        if (value >= 90) return 'rgba(46, 204, 113, 0.8)'; // green
        if (value >= 75) return 'rgba(241, 196, 15, 0.8)'; // yellow
        return 'rgba(231, 76, 60, 0.8)'; // red
        
      case 'launchAngle':
        if (value >= 10 && value <= 30) return 'rgba(46, 204, 113, 0.8)'; // green
        if ((value >= 0 && value < 10) || (value > 30 && value <= 40)) return 'rgba(241, 196, 15, 0.8)'; // yellow
        return 'rgba(231, 76, 60, 0.8)'; // red
        
      case 'distance':
        if (value >= 350) return 'rgba(46, 204, 113, 0.8)'; // green
        if (value >= 250) return 'rgba(241, 196, 15, 0.8)'; // yellow
        return 'rgba(231, 76, 60, 0.8)'; // red
        
      case 'batSpeed':
        if (value >= 70) return 'rgba(46, 204, 113, 0.8)'; // green
        if (value >= 60) return 'rgba(241, 196, 15, 0.8)'; // yellow
        return 'rgba(231, 76, 60, 0.8)'; // red
        
      default:
        return 'rgba(52, 152, 219, 0.8)'; // default blue
    }
  };
  
  // Get outcome text for non-home run outcomes
  const getOutcomeText = (shot: ShotData | null): string => {
    if (!shot) return 'OUT';
    
    if (shot.launchAngle < 0) return 'GROUND BALL';
    if (shot.launchAngle > 35) return 'POP UP';
    if (Math.abs(shot.launchDirection) > 20) return 'FOUL BALL';
    if (shot.distance < 200) return 'SHORT FLY';
    
    return 'FLY OUT';
  };
  
  // Render results screen
  const renderResultsScreen = () => {
    // Sort players by home run count
    const sortedPlayers = [...players].sort((a, b) => {
      const aHomeRuns = playerScores[a.id]?.filter(shot => shot.isHomeRun).length || 0;
      const bHomeRuns = playerScores[b.id]?.filter(shot => shot.isHomeRun).length || 0;
      
      if (aHomeRuns === bHomeRuns) {
        // If tied on HRs, sort by total score
        const aScore = playerScores[a.id]?.reduce((sum, shot) => sum + shot.score, 0) || 0;
        const bScore = playerScores[b.id]?.reduce((sum, shot) => sum + shot.score, 0) || 0;
        return bScore - aScore;
      }
      
      return bHomeRuns - aHomeRuns;
    });
    
    // Calculate stats for each player
    const playerStats = sortedPlayers.map(player => {
      const shots = playerScores[player.id] || [];
      const homeRuns = shots.filter(shot => shot.isHomeRun);
      const hrCount = homeRuns.length;
      const totalScore = shots.reduce((sum, shot) => sum + shot.score, 0);
      const distances = shots.map(shot => shot.distance);
      const longestHR = distances.length ? Math.max(...distances) : 0;
      const avgDistance = distances.length 
        ? Math.round(distances.reduce((sum, d) => sum + d, 0) / distances.length) 
        : 0;
      const exitVelocities = shots.map(shot => shot.exitVelocity);
      const avgExitVelo = exitVelocities.length 
        ? Math.round(exitVelocities.reduce((sum, v) => sum + v, 0) / exitVelocities.length) 
        : 0;
      const launchAngles = shots.map(shot => shot.launchAngle);
      const avgLaunchAngle = launchAngles.length 
        ? Math.round(launchAngles.reduce((sum, a) => sum + a, 0) / launchAngles.length) 
        : 0;
      
      return {
        player,
        hrCount,
        totalScore,
        longestHR,
        avgDistance,
        avgExitVelo,
        avgLaunchAngle,
        shots
      };
    });
    
    // Get winner (first in sorted list)
    const winner = playerStats[0];
    
    // Generate achievement badges
    const achievements = {
      longestHR: playerStats.reduce((champ, curr) => 
        curr.longestHR > (champ?.longestHR || 0) ? curr : champ, null as (typeof playerStats[0] | null)),
      mostHRs: playerStats.reduce((champ, curr) => 
        curr.hrCount > (champ?.hrCount || 0) ? curr : champ, null as (typeof playerStats[0] | null)),
      bestAvgEV: playerStats.reduce((champ, curr) => 
        curr.avgExitVelo > (champ?.avgExitVelo || 0) ? curr : champ, null as (typeof playerStats[0] | null))
    };
    
    // Return to setup screen
    const handleNewMatch = () => {
      // Save game to history before starting new match
      saveGameToHistory();
      router.replace('/games/home-run-derby');
    };
    
    // Generate encouraging feedback based on stats
    const getFeedback = (stats: typeof playerStats[0]) => {
      if (stats.hrCount > 5) return "You crushed it! 💪";
      if (stats.longestHR > 400) return "Monster power! 💥";
      if (stats.avgExitVelo > 90) return "Incredible bat speed! ⚡";
      if (stats.hrCount > 0) return "Nice swing! 👏";
      return "Keep swinging! 🔄";
    };
    
    return (
      <ScrollView 
        style={styles.resultsContainer} 
        contentContainerStyle={[
          styles.resultsContentContainer,
          isScreenLandscape && styles.resultsContentContainerLandscape
        ]}
      >
        {/* Header with close button */}
        <View style={styles.resultsHeader}>
          <Text style={[
            styles.resultsTitle,
            isScreenLandscape && { fontSize: 16 }
          ]}>Home Run Derby Results</Text>
          <TouchableOpacity 
            style={styles.exitButton}
            onPress={exitGame}
          >
            <X size={isScreenLandscape ? 16 : 20} color={colors.grey[600]} />
          </TouchableOpacity>
        </View>
        
        {/* Content layout - adapt to orientation */}
        <View style={[
          styles.resultsContent,
          isScreenLandscape && styles.resultsContentLandscape
        ]}>
          {/* Left column in landscape (top section in portrait) */}
          <View style={[
            styles.resultsLeftColumn,
            isScreenLandscape ? { width: '35%', marginRight: 8 } : { width: '100%' }
          ]}>
            {/* 1. Hero Section */}
            <View style={[
              styles.heroSection,
              isScreenLandscape && styles.heroSectionLandscape
            ]}>
              <View style={[
                styles.winnerSpotlight,
                isScreenLandscape && { marginBottom: 8 }
              ]}>
                <View style={[
                  styles.crownIcon,
                  isScreenLandscape && { marginBottom: 4 }
                ]}>
                  <Ionicons name="trophy" size={isScreenLandscape ? 20 : 32} color={colors.status.warning} />
                </View>
                <Text style={[
                  styles.winnerName,
                  isScreenLandscape && { fontSize: 18, marginBottom: 2 }
                ]}>{winner.player.name}</Text>
                <Text style={[
                  styles.winnerSubtitle,
                  isScreenLandscape && { fontSize: 12 }
                ]}>WINNER</Text>
              </View>
              
              <View style={[
                styles.winnerStats,
                isScreenLandscape && { marginBottom: 8 }
              ]}>
                <View style={styles.winnerStatItem}>
                  <Ionicons name="baseball-outline" size={isScreenLandscape ? 16 : 24} color={colors.status.warning} />
                  <Text style={[
                    styles.winnerStatValue,
                    isScreenLandscape && { fontSize: 18 }
                  ]}>{winner.hrCount}</Text>
                  <Text style={[
                    styles.winnerStatLabel,
                    isScreenLandscape && { fontSize: 10 }
                  ]}>HOME RUNS</Text>
                </View>
                
                <View style={styles.winnerStatItem}>
                  <Ionicons name="speedometer-outline" size={isScreenLandscape ? 16 : 24} color={colors.primary} />
                  <Text style={[
                    styles.winnerStatValue,
                    isScreenLandscape && { fontSize: 18 }
                  ]}>{winner.totalScore}</Text>
                  <Text style={[
                    styles.winnerStatLabel,
                    isScreenLandscape && { fontSize: 10 }
                  ]}>TOTAL POINTS</Text>
                </View>
              </View>
              
              <Text style={[
                styles.winnerFeedback,
                isScreenLandscape && { fontSize: 12, marginTop: 0, marginBottom: 0 }
              ]}>{getFeedback(winner)}</Text>
            </View>
            
            {/* Action buttons in landscape view */}
            {isScreenLandscape && (
              <View style={styles.actionButtonsLandscape}>
                <TouchableOpacity 
                  style={[styles.compactButton, { paddingVertical: 8 }]}
                  onPress={restartGame}
                >
                  <Ionicons name="reload" size={14} color={colors.white} />
                  <Text style={[styles.compactButtonText, { fontSize: 12 }]}>Play Again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.compactButton, { backgroundColor: colors.secondary.indigo, paddingVertical: 8 }]}
                  onPress={handleNewMatch}
                >
                  <Ionicons name="people" size={14} color={colors.white} />
                  <Text style={[styles.compactButtonText, { fontSize: 12 }]}>New Match</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Second row of buttons */}
            {isScreenLandscape && (
              <View style={[styles.actionButtonsLandscape, { marginTop: 8 }]}>
                <TouchableOpacity 
                  style={[styles.compactButton, { backgroundColor: colors.grey[100], paddingVertical: 8 }]}
                  onPress={exitGame}
                >
                  <Ionicons name="home" size={14} color={colors.grey[600]} />
                  <Text style={[styles.compactButtonText, { color: colors.grey[600], fontSize: 12 }]}>Menu</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.compactButton, { backgroundColor: colors.status.warning, paddingVertical: 8 }]}
                  onPress={() => {}}
                >
                  <Ionicons name="share-outline" size={14} color={colors.white} />
                  <Text style={[styles.compactButtonText, { fontSize: 12 }]}>Share</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Right column in landscape (bottom section in portrait) */}
          <View style={[
            styles.resultsRightColumn,
            isScreenLandscape ? { width: '63%' } : { width: '100%' }
          ]}>
            {/* 2. Leaderboard Section */}
            <View style={[
              styles.leaderboardSection,
              isScreenLandscape && styles.leaderboardSectionLandscape
            ]}>
              <Text style={[
                styles.sectionTitle,
                isScreenLandscape && { fontSize: 16, marginBottom: 6 }
              ]}>Leaderboard</Text>
              
              {/* Stat view toggle */}
              <View style={[
                styles.statViewToggle,
                isScreenLandscape && { marginBottom: 6, gap: 4 }
              ]}>
                <TouchableOpacity 
                  style={[
                    styles.statViewButton, 
                    statView === 'hrs' && styles.statViewButtonActive,
                    isScreenLandscape && { paddingVertical: 6, paddingHorizontal: 8 }
                  ]}
                  onPress={() => setStatView('hrs')}
                >
                  <Text style={[
                    styles.statViewButtonText, 
                    statView === 'hrs' && styles.statViewButtonTextActive,
                    isScreenLandscape && { fontSize: 10 }
                  ]}>
                    HOME RUNS
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.statViewButton, 
                    statView === 'distance' && styles.statViewButtonActive,
                    isScreenLandscape && { paddingVertical: 6, paddingHorizontal: 8 }
                  ]}
                  onPress={() => setStatView('distance')}
                >
                  <Text style={[
                    styles.statViewButtonText, 
                    statView === 'distance' && styles.statViewButtonTextActive,
                    isScreenLandscape && { fontSize: 10 }
                  ]}>
                    DISTANCE
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.statViewButton, 
                    statView === 'accuracy' && styles.statViewButtonActive,
                    isScreenLandscape && { paddingVertical: 6, paddingHorizontal: 8 }
                  ]}
                  onPress={() => setStatView('accuracy')}
                >
                  <Text style={[
                    styles.statViewButtonText, 
                    statView === 'accuracy' && styles.statViewButtonTextActive,
                    isScreenLandscape && { fontSize: 10 }
                  ]}>
                    ACCURACY
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Leaderboard table header */}
              <View style={[
                styles.leaderboardHeader,
                isScreenLandscape && { marginBottom: 8 }
              ]}>
                <Text style={[
                  styles.leaderboardHeaderText, 
                  { width: 40 },
                  isScreenLandscape && { fontSize: 12 }
                ]}>RANK</Text>
                <Text style={[
                  styles.leaderboardHeaderText, 
                  { flex: 1 },
                  isScreenLandscape && { fontSize: 12 }
                ]}>PLAYER</Text>
                
                {statView === 'hrs' && (
                  <>
                    <Text style={[
                      styles.leaderboardHeaderText, 
                      { width: 60 },
                      isScreenLandscape && { fontSize: 12 }
                    ]}>HRS</Text>
                    <Text style={[
                      styles.leaderboardHeaderText, 
                      { width: 80 },
                      isScreenLandscape && { fontSize: 12 }
                    ]}>POINTS</Text>
                  </>
                )}
                
                {statView === 'distance' && (
                  <>
                    <Text style={[
                      styles.leaderboardHeaderText, 
                      { width: 60 },
                      isScreenLandscape && { fontSize: 12 }
                    ]}>LONG</Text>
                    <Text style={[
                      styles.leaderboardHeaderText, 
                      { width: 80 },
                      isScreenLandscape && { fontSize: 12 }
                    ]}>AVG DIST</Text>
                  </>
                )}
                
                {statView === 'accuracy' && (
                  <>
                    <Text style={[
                      styles.leaderboardHeaderText, 
                      { width: 60 },
                      isScreenLandscape && { fontSize: 12 }
                    ]}>EV</Text>
                    <Text style={[
                      styles.leaderboardHeaderText, 
                      { width: 80 },
                      isScreenLandscape && { fontSize: 12 }
                    ]}>LA</Text>
                  </>
                )}
              </View>
              
              {/* Leaderboard rows */}
              {playerStats.map((stats, index) => {
                const isExpanded = expandedPlayerId === stats.player.id;
                const isWinner = index === 0;
                
                // Determine if this player has any achievements
                const hasLongestHR = achievements.longestHR?.player.id === stats.player.id;
                const hasMostHRs = achievements.mostHRs?.player.id === stats.player.id;
                const hasBestEV = achievements.bestAvgEV?.player.id === stats.player.id;
                
                return (
                  <View key={stats.player.id}>
                    <TouchableOpacity 
                      style={[
                        styles.leaderboardRow,
                        isWinner && styles.leaderboardRowWinner,
                        isExpanded && styles.leaderboardRowExpanded,
                        isScreenLandscape && styles.leaderboardRowLandscape
                      ]}
                      onPress={() => setExpandedPlayerId(isExpanded ? null : stats.player.id)}
                    >
                      <View style={[
                        styles.leaderboardRankContainer,
                        isScreenLandscape && { width: 26, height: 26, marginRight: 8 }
                      ]}>
                        <Text style={[
                          styles.leaderboardRankText,
                          isScreenLandscape && { fontSize: 12 }
                        ]}>{index + 1}</Text>
                      </View>
                      
                      <View style={styles.leaderboardPlayerInfo}>
                        <Text style={[
                          styles.leaderboardPlayerName,
                          isScreenLandscape && { fontSize: 14, marginBottom: 2 }
                        ]}>{stats.player.name}</Text>
                        
                        {/* Achievement badges */}
                        {(hasLongestHR || hasMostHRs || hasBestEV) && (
                          <View style={styles.achievementBadges}>
                            {hasLongestHR && (
                              <View style={[
                                styles.achievementBadge,
                                { backgroundColor: colors.secondary.green },
                                isScreenLandscape && styles.achievementBadgeLandscape
                              ]}>
                                <Text style={[
                                  styles.achievementBadgeText,
                                  isScreenLandscape && { fontSize: 9 }
                                ]}>LONGEST HR</Text>
                              </View>
                            )}
                            {hasMostHRs && (
                              <View style={[
                                styles.achievementBadge,
                                { backgroundColor: colors.status.warning },
                                isScreenLandscape && styles.achievementBadgeLandscape
                              ]}>
                                <Text style={[
                                  styles.achievementBadgeText,
                                  isScreenLandscape && { fontSize: 9 }
                                ]}>MOST HRs</Text>
                              </View>
                            )}
                            {hasBestEV && (
                              <View style={[
                                styles.achievementBadge,
                                { backgroundColor: colors.primary },
                                isScreenLandscape && styles.achievementBadgeLandscape
                              ]}>
                                <Text style={[
                                  styles.achievementBadgeText,
                                  isScreenLandscape && { fontSize: 9 }
                                ]}>BEST EXIT VELO</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                      
                      {statView === 'hrs' && (
                        <>
                          <Text style={[
                            styles.leaderboardStatCell,
                            isScreenLandscape && { fontSize: 14, width: 50 }
                          ]}>{stats.hrCount}</Text>
                          <Text style={[
                            styles.leaderboardStatCell,
                            isScreenLandscape && { fontSize: 14, width: 70 }
                          ]}>{stats.totalScore}</Text>
                        </>
                      )}
                      
                      {statView === 'distance' && (
                        <>
                          <Text style={[
                            styles.leaderboardStatCell,
                            isScreenLandscape && { fontSize: 14, width: 50 }
                          ]}>{stats.longestHR} ft</Text>
                          <Text style={[
                            styles.leaderboardStatCell,
                            isScreenLandscape && { fontSize: 14, width: 70 }
                          ]}>{stats.avgDistance} ft</Text>
                        </>
                      )}
                      
                      {statView === 'accuracy' && (
                        <>
                          <Text style={[
                            styles.leaderboardStatCell,
                            isScreenLandscape && { fontSize: 14, width: 50 }
                          ]}>{stats.avgExitVelo} mph</Text>
                          <Text style={[
                            styles.leaderboardStatCell,
                            isScreenLandscape && { fontSize: 14, width: 70 }
                          ]}>{stats.avgLaunchAngle}°</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    {/* 3. Expanded Player Performance Panel */}
                    {isExpanded && (
                      <View style={[
                        styles.playerPerformancePanel,
                        isScreenLandscape && styles.playerPerformancePanelLandscape
                      ]}>
                        <View style={[
                          styles.performanceSummary,
                          isScreenLandscape && { marginBottom: 8 }
                        ]}>
                          <View style={styles.performanceMetric}>
                            <Text style={[
                              styles.performanceMetricLabel,
                              isScreenLandscape && { fontSize: 10 }
                            ]}>AVG DISTANCE</Text>
                            <Text style={[
                              styles.performanceMetricValue,
                              isScreenLandscape && { fontSize: 14 }
                            ]}>{stats.avgDistance} ft</Text>
                          </View>
                          <View style={styles.performanceMetric}>
                            <Text style={[
                              styles.performanceMetricLabel,
                              isScreenLandscape && { fontSize: 10 }
                            ]}>AVG EXIT VELO</Text>
                            <Text style={[
                              styles.performanceMetricValue,
                              isScreenLandscape && { fontSize: 14 }
                            ]}>{stats.avgExitVelo} mph</Text>
                          </View>
                          <View style={styles.performanceMetric}>
                            <Text style={[
                              styles.performanceMetricLabel,
                              isScreenLandscape && { fontSize: 10 }
                            ]}>AVG LAUNCH ANGLE</Text>
                            <Text style={[
                              styles.performanceMetricValue,
                              isScreenLandscape && { fontSize: 14 }
                            ]}>{stats.avgLaunchAngle}°</Text>
                          </View>
                        </View>
                        
                        <Text style={[
                          styles.shotBreakdownTitle,
                          isScreenLandscape && { fontSize: 14, marginBottom: 8 }
                        ]}>Shot by Shot Breakdown</Text>
                        
                        <View style={[
                          styles.shotBreakdownContainer,
                          isScreenLandscape && { padding: 8 }
                        ]}>
                          {stats.shots.map((shot, shotIndex) => (
                            <View 
                              key={shot.id}
                              style={[
                                styles.shotItem,
                                shot.isHomeRun && styles.shotItemHomeRun,
                                shotIndex === stats.shots.length - 1 && { borderBottomWidth: 0 },
                                isScreenLandscape && { padding: 8 }
                              ]}
                            >
                              <Text style={[
                                styles.shotItemNumber,
                                isScreenLandscape && { fontSize: 12, marginRight: 8 }
                              ]}>{shotIndex + 1}</Text>
                              <View style={[
                                styles.shotItemDetails,
                                isScreenLandscape && { flex: 1 }
                              ]}>
                                <Text style={[
                                  styles.shotItemResult,
                                  isScreenLandscape && { fontSize: 12 }
                                ]}>{shot.isHomeRun ? 'HOME RUN' : 'OUT'}</Text>
                                <View style={styles.shotItemMetrics}>
                                  <Text style={[
                                    styles.shotItemMetric,
                                    isScreenLandscape && { fontSize: 10 }
                                  ]}>{shot.distance}ft • {shot.exitVelocity}mph • {shot.launchAngle}°</Text>
                                </View>
                              </View>
                              <Text style={[
                                styles.shotItemScore,
                                isScreenLandscape && { fontSize: 14 }
                              ]}>{shot.score}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  // Render the metrics tray that slides in from the right
  const renderMetricsTray = () => {
    // Find the selected shot by ID
    let selectedShot: ShotData | null = null;
    
    if (selectedShotId) {
      // Search through all player shots
      for (const playerId in playerScores) {
        const foundShot = playerScores[playerId].find(shot => shot.id === selectedShotId);
        if (foundShot) {
          selectedShot = foundShot;
          break;
        }
      }
    }
    
    // If no shot found, use latest shot as fallback
    if (!selectedShot) {
      selectedShot = latestShot;
    }
    
    if (!selectedShot) return null;
    
    // For debugging
    console.log("Rendering metrics tray for shot:", selectedShot.id);
    
    // Calculate the translation for the slide-in animation
    const translateX = metricsTrayAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [380, 0] // Updated width from 300 to 380
    });
    
    // Find the shot number
    let shotNumber = "?";
    for (const playerId in playerScores) {
      const shots = playerScores[playerId];
      const index = shots.findIndex(shot => shot.id === selectedShot?.id);
      if (index !== -1) {
        shotNumber = `${index + 1}`;
        break;
      }
    }
    
    return (
      <Animated.View 
        style={[
          styles.metricsTray,
          { transform: [{ translateX }] }
        ]}
      >
        <View style={styles.metricsTrayHeader}>
          <Text style={styles.metricsTrayTitle}>Shot Analysis</Text>
          <TouchableOpacity 
            style={styles.metricsTrayCloseButton}
            onPress={toggleMetricsView}
          >
            <X size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricsTrayContent}>
          {/* Shot info section */}
          <View style={styles.metricsTraySection}>
            <Text style={styles.metricsSectionTitle}>Shot #{shotNumber}</Text>
            <Text style={styles.metricsShotType}>
              {selectedShot.isHomeRun ? 'HOME RUN' : getOutcomeText(selectedShot)}
            </Text>
          </View>
          
          {/* Main metrics grid - 3x2 layout */}
          <View style={styles.metricsGrid}>
            {/* Row 1 */}
            <View style={styles.metricsTrayItem}>
              <Text style={styles.metricsItemLabel}>Distance</Text>
              <View style={styles.metricsValueRow}>
                <Text style={styles.metricsItemValue}>{selectedShot.distance}</Text>
                <Text style={styles.metricsItemUnit}>ft</Text>
              </View>
            </View>
            
            <View style={styles.metricsTrayItem}>
              <Text style={styles.metricsItemLabel}>Exit Velocity</Text>
              <View style={styles.metricsValueRow}>
                <Text style={styles.metricsItemValue}>{selectedShot.exitVelocity}</Text>
                <Text style={styles.metricsItemUnit}>mph</Text>
              </View>
            </View>
            
            <View style={styles.metricsTrayItem}>
              <Text style={styles.metricsItemLabel}>Bat Speed</Text>
              <View style={styles.metricsValueRow}>
                <Text style={styles.metricsItemValue}>{selectedShot.batSpeed}</Text>
                <Text style={styles.metricsItemUnit}>mph</Text>
              </View>
            </View>
            
            {/* Row 2 */}
            <View style={styles.metricsTrayItem}>
              <Text style={styles.metricsItemLabel}>Launch Angle</Text>
              <View style={styles.metricsValueRow}>
                <Text style={styles.metricsItemValue}>{selectedShot.launchAngle}</Text>
                <Text style={styles.metricsItemUnit}>°</Text>
              </View>
            </View>
            
            <View style={styles.metricsTrayItem}>
              <Text style={styles.metricsItemLabel}>Launch Direction</Text>
              <View style={styles.metricsValueRow}>
                <Text style={styles.metricsItemValue}>{selectedShot.launchDirection}</Text>
                <Text style={styles.metricsItemUnit}>°</Text>
              </View>
            </View>
            
            <View style={styles.metricsTrayItem}>
              <Text style={styles.metricsItemLabel}>Strike Zone</Text>
              <View style={styles.strikeZoneIcon}>
                <View style={styles.strikeZoneGrid}>
                  <View style={[styles.strikeZoneCell, styles.strikeZoneCellActive]} />
                  <View style={styles.strikeZoneCell} />
                  <View style={styles.strikeZoneCell} />
                  <View style={styles.strikeZoneCell} />
                  <View style={styles.strikeZoneCell} />
                  <View style={styles.strikeZoneCell} />
                  <View style={styles.strikeZoneCell} />
                  <View style={styles.strikeZoneCell} />
                  <View style={styles.strikeZoneCell} />
                </View>
              </View>
            </View>
          </View>
          
          {/* Additional stats section */}
          <View style={styles.metricsTraySection}>
            <Text style={styles.metricsSectionTitle}>Shot Score</Text>
            <Text style={[styles.metricsShotType, { color: colors.primary }]}>
              {selectedShot.score} pts
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };
  
  // Render the correct screen based on game state
  return showResults ? renderResultsScreen() : renderGameplayHUD();
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
  },
  // New floating player info
  floatingPlayerInfo: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  playerNameText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 28,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  ballCounterFloat: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ballCounterText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.white,
  },
  // Fade-in controls container
  controlsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column', // Stack vertically on right side
    gap: 12,
    zIndex: 10,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeRunOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 24,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeRunText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 50,
    color: colors.status.warning,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  
  // Bottom corner persistent metrics
  bottomLeftMetric: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    zIndex: 5,
  },
  bottomRightMetric: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 5,
  },
  keyMetricContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 150,
  },
  keyMetricLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 18,
    color: colors.white,
    marginTop: 4,
  },
  keyMetricValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 32,
    color: colors.white,
  },
  keyMetricUnit: {
    fontSize: 20,
    opacity: 0.8,
  },
  
  // Swing button - center bottom
  swingButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.status.error,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  swingButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.white,
  },
  
  // Full metrics view
  fullMetricsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 20,
  },
  fullMetricsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  fullMetricsTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.grey[600],
  },
  fullMetricsContent: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  metricCard: {
    width: '45%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    margin: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricCardTitle: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 18,
    color: colors.grey[600],
    marginLeft: 8,
  },
  metricCardValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 32,
    color: colors.grey[600],
  },
  metricCardUnit: {
    fontSize: 20,
    color: colors.grey[500],
  },
  
  // Results screen styles - unchanged
  resultsContainer: {
    flex: 1,
    backgroundColor: colors.grey[50],
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  resultsTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 20,
    color: colors.grey[600],
  },
  exitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  leaderboardContainer: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey[200],
  },
  leaderboardItemWinner: {
    borderColor: colors.status.warning,
    backgroundColor: colors.status.warning + '10', // 10% opacity
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leaderboardRankText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.grey[600],
    marginBottom: 4,
  },
  leaderboardStats: {
    flexDirection: 'row',
    gap: 12,
  },
  leaderboardStatText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[500],
  },
  winnerBadge: {
    marginLeft: 12,
  },
  resultsFooter: {
    marginTop: 16,
    marginBottom: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 8,
  },
  replayButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  newMatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondary.indigo,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginLeft: 8,
  },
  newMatchButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  exitFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.grey[100],
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 12,
    flex: 1,
    marginRight: 8,
  },
  exitFullButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.status.warning,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 12,
    flex: 1,
    marginLeft: 8,
  },
  shareButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  resultsContentContainer: {
    padding: 16,
  },
  resultsContentContainerLandscape: {
    padding: 8,
  },
  heroSection: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  heroSectionLandscape: {
    padding: 12,
    marginBottom: 8,
  },
  winnerSpotlight: {
    alignItems: 'center',
    marginBottom: 16,
  },
  crownIcon: {
    backgroundColor: colors.status.warning,
    borderRadius: 16,
    padding: 8,
    marginBottom: 8,
  },
  winnerName: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.grey[600],
  },
  winnerSubtitle: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[500],
  },
  winnerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  winnerStatItem: {
    alignItems: 'center',
  },
  winnerStatValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.grey[600],
  },
  winnerStatLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[500],
  },
  winnerFeedback: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[600],
    textAlign: 'center',
  },
  leaderboardSection: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  leaderboardSectionLandscape: {
    padding: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 20,
    color: colors.grey[600],
    marginBottom: 16,
  },
  statViewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statViewButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: colors.grey[200],
  },
  statViewButtonActive: {
    backgroundColor: colors.primary,
  },
  statViewButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
  },
  statViewButtonTextActive: {
    color: colors.white,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  leaderboardHeaderText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  leaderboardRowWinner: {
    borderColor: colors.status.warning,
    backgroundColor: colors.status.warning + '10', // 10% opacity
  },
  leaderboardRowExpanded: {
    backgroundColor: colors.grey[100],
  },
  leaderboardRowLandscape: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  leaderboardRankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leaderboardPlayerInfo: {
    flex: 1,
  },
  leaderboardPlayerName: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.grey[600],
    marginBottom: 4,
  },
  achievementBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  achievementBadge: {
    padding: 4,
    borderRadius: 4,
  },
  achievementBadgeLandscape: {
    padding: 3,
    borderRadius: 3,
  },
  achievementBadgeText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.white,
  },
  leaderboardStatCell: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
  },
  playerPerformancePanel: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 16,
  },
  playerPerformancePanelLandscape: {
    padding: 10,
    marginTop: 10,
  },
  performanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  performanceMetric: {
    alignItems: 'center',
  },
  performanceMetricLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[500],
  },
  performanceMetricValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
  },
  shotBreakdownTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.grey[600],
    marginBottom: 16,
  },
  shotBreakdownContainer: {
    padding: 16,
    backgroundColor: colors.grey[100],
    borderRadius: 12,
  },
  shotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  shotItemHomeRun: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  shotItemNumber: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginRight: 12,
  },
  shotItemDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shotItemResult: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[600],
  },
  shotItemMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  shotItemMetric: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.grey[500],
  },
  shotItemScore: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginLeft: 12,
  },
  resultsContent: {
    flexDirection: 'column',
  },
  resultsContentLandscape: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  resultsLeftColumn: {
    flex: 1,
  },
  resultsRightColumn: {
    flex: 1,
  },
  actionButtonsLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  compactButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  stadiumNameOverlay: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 10,
  },
  stadiumNameText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.white,
  },
  // Player header styles
  playerInfoHeader: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  swingsLeftText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  // Status icons
  statusIcons: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  deviceStatusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfoIcon: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionInfoText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.white,
  },
  
  // Ready indicator
  readyIndicator: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 5,
  },
  readyText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.white,
    marginLeft: 8,
  },
  
  // Update home run counter position to avoid overlap with bat speed
  homeRunCounterContainer: {
    position: 'absolute',
    right: 20,
    bottom: 140, // Moved up from 80 to avoid overlap
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 5,
  },
  homeRunCounterText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.white,
    marginLeft: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Current player indicator
  currentPlayerIndicator: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 5,
  },
  currentPlayerText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.white,
  },
  
  // New styles for simplified metrics display
  distanceCounter: {
    position: 'absolute',
    left: 20,
    bottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 16,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 5,
  },
  distanceLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  distanceValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  distanceValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 42,
    color: colors.white,
  },
  distanceUnit: {
    fontFamily: 'Barlow-Medium',
    fontSize: 24,
    color: colors.white,
    opacity: 0.8,
    marginLeft: 4,
    marginBottom: 4,
  },
  
  batSpeedCounter: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 16,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 5,
  },
  batSpeedLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  batSpeedValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  batSpeedValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 42,
    color: colors.white,
  },
  batSpeedUnit: {
    fontFamily: 'Barlow-Medium',
    fontSize: 24,
    color: colors.white,
    opacity: 0.8,
    marginLeft: 4,
    marginBottom: 4,
  },
  
  shotVerdict: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 30,
    zIndex: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  shotVerdictText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 48, // Dramatically increased from 16 to be visible from 2m
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  
  // Remove the old metrics popup styles
  metricsPopContainer: {
    // Removed or replaced
  },
  metricPopRow: {
    // Removed or replaced
  },
  metricPopItem: {
    // Removed or replaced
  },
  metricPopLabel: {
    // Removed or replaced
  },
  metricPopValue: {
    // Removed or replaced
  },
  // Style additions for player change card
  playerChangeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },
  playerChangeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  playerChangeHeader: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.grey[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  playerChangeStats: {
    width: '100%',
    marginBottom: 24,
  },
  playerChangeStat: {
    fontFamily: 'Barlow-Medium',
    fontSize: 18,
    color: colors.grey[600],
    marginBottom: 8,
    textAlign: 'center',
  },
  nextPlayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.status.success,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  nextPlayerButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  
  // Shot history styles
  shotHistoryContainer: {
    position: 'absolute',
    left: 20,
    top: 20, 
    width: 220,
    height: 350, // Increased from 300 to ensure enough room for scrolling
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 16,
    padding: 0, // Removed padding to give more space to ScrollView
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 20, // Increased from 5 to be in front of all other UI elements
    overflow: 'hidden', // Ensure content doesn't bleed out
  },
  shotHistoryHeader: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  shotHistoryList: {
    flex: 1, // Use flex instead of fixed height
  },
  shotHistoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 20, // Add more padding at bottom for scrolling
  },
  shotHistoryTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  emptyShotHistory: {
    padding: 16,
    alignItems: 'center',
  },
  emptyShotHistoryText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.white,
    opacity: 0.7,
  },
  shotHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 8,
  },
  homeRunShotItem: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  shotNumberBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  shotNumberText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 12,
    color: colors.white,
  },
  shotHistoryDetails: {
    flex: 1,
  },
  shotDistanceText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 14,
    color: colors.white,
  },
  shotTypeText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.white,
    opacity: 0.8,
  },
  selectedShotItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  metricsTray: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 380, // Increased from 300 to give more space
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 10,
  },
  metricsTrayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 12,
  },
  metricsTrayTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.white,
  },
  metricsTrayCloseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
  },
  metricsTrayContent: {
    flex: 1,
  },
  metricsTraySection: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  metricsSectionTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.white,
    marginBottom: 8,
  },
  metricsShotType: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.status.warning,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  metricsTrayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricsTrayItem: {
    width: '30%', // Changed from 48% to fit 3 items in a row
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12, // Reduced padding to make items more compact
    alignItems: 'center',
    marginBottom: 12, // Added margin bottom for spacing between rows
  },
  metricsItemLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12, // Reduced from 14
    color: colors.white,
    opacity: 0.7,
    marginBottom: 4,
  },
  metricsItemValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24, // Reduced from 32
    color: colors.white,
  },
  metricsItemUnit: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14, // Reduced from 16
    color: colors.white,
    opacity: 0.7,
    marginLeft: 2,
    marginBottom: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Enable wrapping
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricsValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  strikeZoneIcon: {
    width: 60, // Smaller strike zone icon
    height: 60, // Smaller strike zone icon
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4, // Add some spacing from the label
  },
  strikeZoneGrid: {
    width: 48,
    height: 48,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 2,
  },
  strikeZoneCell: {
    width: 14,
    height: 14,
    margin: 1,
    borderRadius: 2,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  strikeZoneCellActive: {
    backgroundColor: colors.status.warning,
    borderColor: colors.status.warning,
  },
}); 