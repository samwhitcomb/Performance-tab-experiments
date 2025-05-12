import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Image, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Calendar, Clock, Activity, TrendingUp, Download, Share2, Filter, Settings, ClipboardList, X, Check, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors, useColors } from '@/constants/theme';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';

// Define types for metrics and comparison points
type MetricId = 'swings' | 'avgExitVelo' | 'peakExitVelo' | 'avgLaunchAngle' | 'barrelPercentage' | 'sweetSpotPercentage' | 'hardHitPercentage' | 'contactRate';
type MetricItem = { id: MetricId; label: string; active: boolean };
type ComparisonPoint = 'none' | 'your-avg' | 'your-max' | 'age-avg';
type Shot = {
  id: number;
  exitVelo: number;
  launchAngle: number;
  direction: string;
  distance: number;
  result: string;
};

interface Metrics {
  swings: number;
  avgExitVelo: number;
  peakExitVelo: number;
  avgLaunchAngle: number;
  barrelPercentage: number;
  sweetSpotPercentage: number;
  hardHitPercentage: number;
  contactRate: number;
  [key: string]: number; // Index signature to allow string indexing
}

interface SessionData {
  id: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  title: string;
  metrics: Metrics;
  notes: string;
  drillFocus: string[];
  keyInsights: string[];
  shots: Shot[];
}

// Define visualization types
type VisualizationType = '3d-view' | 'heatmap' | 'dispersion';

// Placeholder image paths - replace with actual assets
const visualizationImages = {
  '3d-view': require('@/assets/images/3D View.jpg'),
  'heatmap': require('@/assets/images/Heatmap.jpg'),
  'dispersion': require('@/assets/images/Dispersion.png'),
};

// Component for swipeable visualization carousel
interface VisualizationCarouselProps {
  selectedVisualization: VisualizationType;
  onSwipe: (visualization: VisualizationType) => void;
}

const VisualizationCarousel = ({ selectedVisualization, onSwipe }: VisualizationCarouselProps) => {
  const { width } = Dimensions.get('window');
  const translateX = useRef(new Animated.Value(0)).current;
  const visualizations: VisualizationType[] = ['3d-view', 'heatmap', 'dispersion'];
  const currentIndex = visualizations.indexOf(selectedVisualization);
  
  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );
  
  const handleStateChange = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.state === State.END) {
      const { translationX } = nativeEvent;
      // Determine if it's a left or right swipe
      if (Math.abs(translationX) > 50) { // Threshold for swipe
        const nextIndex = translationX > 0 
          ? Math.max(currentIndex - 1, 0) 
          : Math.min(currentIndex + 1, visualizations.length - 1);
        
        if (nextIndex !== currentIndex) {
          onSwipe(visualizations[nextIndex]);
        }
      }
      
      // Reset the position
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };
  
  return (
    <View style={styles.visualizationContainer}>
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {visualizations.map((viz, index) => (
            <View 
              key={viz} 
              style={[
                styles.paginationDot, 
                index === currentIndex && styles.activePaginationDot
              ]} 
            />
          ))}
        </View>
      </View>
      
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <Animated.View 
          style={[
            styles.visualizationImageContainer,
            { transform: [{ translateX }] }
          ]}
        >
          <Image 
            source={visualizationImages[selectedVisualization]} 
            style={styles.visualizationImage}
            resizeMode="cover"
          />
          
          <View style={styles.swipeInstructions}>
            {currentIndex > 0 && (
              <View style={styles.swipeArrow}>
                <ChevronLeft size={20} color={colors.white} />
              </View>
            )}
            {currentIndex < visualizations.length - 1 && (
              <View style={styles.swipeArrow}>
                <ChevronRight size={20} color={colors.white} />
              </View>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>
      
      <View style={styles.visualizationLabelContainer}>
        <Text style={styles.visualizationLabel}>
          {selectedVisualization === '3d-view' ? '3D View' : 
           selectedVisualization === 'heatmap' ? 'Heatmap' : 'Dispersion'}
        </Text>
      </View>
    </View>
  );
};

export default function SessionDetailScreen() {
  const params = useLocalSearchParams();
  const { id, type } = params;
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState('metrics');
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [comparisonPoint, setComparisonPoint] = useState<ComparisonPoint>('none');
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType>('3d-view');
  const [selectedShotId, setSelectedShotId] = useState<number | null>(null);
  
  // Available metrics and which ones to show
  const [availableMetrics, setAvailableMetrics] = useState<MetricItem[]>([
    { id: 'swings', label: 'Swings', active: true },
    { id: 'avgExitVelo', label: 'Avg EV (mph)', active: true },
    { id: 'peakExitVelo', label: 'Peak EV (mph)', active: true },
    { id: 'avgLaunchAngle', label: 'Avg Launch Angle', active: true },
    { id: 'barrelPercentage', label: 'Barrel %', active: true },
    { id: 'sweetSpotPercentage', label: 'Sweet Spot %', active: true },
    { id: 'hardHitPercentage', label: 'Hard Hit %', active: false },
    { id: 'contactRate', label: 'Contact Rate', active: false },
  ]);
  
  // Debug logging for navigation parameters
  useEffect(() => {
    console.log('Session Detail - params:', params);
    console.log('Session Detail - id:', id, 'type:', type);
  }, [params, id, type]);
  
  // Mock session data - this would come from an API or storage
  const sessionData: SessionData = {
    id: id as string,
    date: 'Today',
    time: '2:30 PM',
    duration: '45 minutes',
    type: type === 'games' ? 'Game' : 'Practice',
    title: type === 'games' ? 'Spray Chart Challenge' : 'Launch Angle Ladder',
    metrics: {
      swings: 48,
      avgExitVelo: 87,
      peakExitVelo: 98,
      avgLaunchAngle: 15,
      barrelPercentage: 32,
      sweetSpotPercentage: 45,
      hardHitPercentage: 65,
      contactRate: 80,
    },
    notes: "Great session with improved barrel percentage. Work on outside pitch recognition still needed.",
    drillFocus: ["Exit Velocity", "Launch Angle Control", "Zone Recognition"],
    keyInsights: [
      "Barrel percentage increased by 5% from previous session",
      "Peak exit velocity reached 98 mph (new personal best)",
      "Improved consistency on high pitches"
    ],
    shots: generateMockShots(48)
  };
  
  // Toggle a metric's active state
  const toggleMetric = (id: MetricId) => {
    setAvailableMetrics(availableMetrics.map(metric => 
      metric.id === id ? { ...metric, active: !metric.active } : metric
    ));
  };

  // Set comparison point
  const setComparison = (comparison: ComparisonPoint) => {
    setComparisonPoint(comparison);
    setShowFiltersModal(false);
  };
  
  // Generate 48 mock shots
  function generateMockShots(count: number): Shot[] {
    const directions = ["Left Field", "Center", "Right Field"];
    const results = ["Hit", "Out", "Home Run", "Double", "Triple"];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      exitVelo: Math.floor(70 + Math.random() * 30),
      launchAngle: Math.floor(5 + Math.random() * 30),
      direction: directions[Math.floor(Math.random() * directions.length)],
      distance: Math.floor(250 + Math.random() * 150),
      result: results[Math.floor(Math.random() * results.length)]
    }));
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Session Details',
          headerShown: true,
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <View style={styles.dateContainer}>
              <Calendar size={14} color={colors.grey[400]} />
              <Text style={styles.dateText}>{sessionData.date} • {sessionData.time}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Clock size={14} color={colors.grey[400]} />
              <Text style={styles.durationText}>{sessionData.duration}</Text>
            </View>
          </View>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{sessionData.title}</Text>
            <View style={[
              styles.typeTag,
              sessionData.type === 'Practice' ? styles.practiceTag : styles.gameTag,
            ]}>
              <Text style={styles.typeText}>{sessionData.type}</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation - more compact */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'metrics' && styles.activeTab]} 
            onPress={() => setActiveTab('metrics')}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Activity size={14} color={activeTab === 'metrics' ? colors.primary : colors.grey[500]} />
            <Text style={[styles.tabText, activeTab === 'metrics' && styles.activeTabText]}>Metrics</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'insights' && styles.activeTab]} 
            onPress={() => setActiveTab('insights')}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <TrendingUp size={14} color={activeTab === 'insights' ? colors.primary : colors.grey[500]} />
            <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>Insights</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'shots' && styles.activeTab]} 
            onPress={() => setActiveTab('shots')}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <ClipboardList size={14} color={activeTab === 'shots' ? colors.primary : colors.grey[500]} />
            <Text style={[styles.tabText, activeTab === 'shots' && styles.activeTabText]}>Shots</Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'metrics' && (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.metricsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Performance Metrics</Text>
                <View style={styles.headerButtons}>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => setShowFiltersModal(true)}
                    activeOpacity={0.7}
                  >
                    <Filter size={18} color={colors.grey[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => setShowMetricsModal(true)}
                    activeOpacity={0.7}
                  >
                    <Settings size={18} color={colors.grey[600]} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {comparisonPoint !== 'none' && (
                <View style={styles.comparisonBanner}>
                  <Text style={styles.comparisonText}>
                    Comparing with: {comparisonPoint === 'your-avg' ? 'Your Average' : 
                                    comparisonPoint === 'your-max' ? 'Your Best' : 
                                    'Age Group Average'}
                  </Text>
                </View>
              )}
              
              <View style={styles.metricsGrid}>
                {availableMetrics
                  .filter(metric => metric.active)
                  .map(metric => (
                    <View key={metric.id} style={styles.metricCard}>
                      <Text style={styles.metricValue}>
                        {sessionData.metrics[metric.id]}
                        {metric.id === 'avgLaunchAngle' ? '°' : 
                         (metric.id === 'barrelPercentage' || 
                          metric.id === 'sweetSpotPercentage' || 
                          metric.id === 'hardHitPercentage' ||
                          metric.id === 'contactRate') ? '%' : ''}
                      </Text>
                      <Text style={styles.metricLabel}>{metric.label}</Text>
                    </View>
                  ))
                }
              </View>

              <Text style={styles.sectionTitle}>Drill Focus</Text>
              <View style={styles.focusContainer}>
                {sessionData.drillFocus.map((focus, index) => (
                  <View key={index} style={styles.focusTag}>
                    <Text style={styles.focusText}>{focus}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{sessionData.notes}</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {activeTab === 'insights' && (
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.insightsContainer}>
              <Text style={styles.sectionTitle}>Key Insights</Text>
              {sessionData.keyInsights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <View style={styles.insightBullet} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
              
              <Text style={styles.sectionTitle}>Improvement Areas</Text>
              <View style={styles.improvementContainer}>
                <Text style={styles.improvementText}>
                  Focus on outside pitch recognition and consistent contact on low pitches.
                </Text>
              </View>
              
              <Text style={styles.sectionTitle}>Suggested Drills</Text>
              <View style={styles.suggestedDrillCard}>
                <Text style={styles.suggestedDrillTitle}>Outside Pitch Focus</Text>
                <Text style={styles.suggestedDrillDescription}>
                  Set up tee at belt height on outer half of plate. Focus on driving ball to opposite field.
                </Text>
                <TouchableOpacity 
                  style={styles.suggestedDrillButton}
                  onPress={() => router.push('/practice')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.suggestedDrillButtonText}>Start Drill</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
        
        {activeTab === 'shots' && (
          <View style={styles.shotsContainer}>
            <GestureHandlerRootView style={styles.visualizationWrapper}>
              <VisualizationCarousel 
                selectedVisualization={selectedVisualization}
                onSwipe={setSelectedVisualization}
              />
            </GestureHandlerRootView>
            
            <View style={styles.shotListContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Shots</Text>
                <View style={styles.headerButtons}>
                  {selectedShotId && (
                    <TouchableOpacity 
                      style={styles.clearSelectionButton}
                      onPress={() => setSelectedShotId(null)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.clearSelectionText}>Clear Selection</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                    <Filter size={18} color={colors.grey[600]} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.tableContainer}>
                <View style={styles.shotsTableHeader}>
                  <Text style={styles.tableHeaderCell}>Shot #</Text>
                  <Text style={styles.tableHeaderCell}>EV (mph)</Text>
                  <Text style={styles.tableHeaderCell}>LA (°)</Text>
                  <Text style={styles.tableHeaderCell}>Direction</Text>
                  <Text style={styles.tableHeaderCell}>Result</Text>
                </View>
                
                <FlatList
                  data={sessionData.shots}
                  keyExtractor={(item) => `shot-${item.id}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedShotId(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.tableRow, 
                        selectedShotId === item.id && styles.selectedRow
                      ]}>
                        <Text style={styles.tableCell}>{item.id}</Text>
                        <Text style={styles.tableCell}>{item.exitVelo}</Text>
                        <Text style={styles.tableCell}>{item.launchAngle}°</Text>
                        <Text style={styles.tableCell}>{item.direction}</Text>
                        <Text style={[
                          styles.tableCell, 
                          item.result === 'Home Run' && styles.homeRunResult,
                          item.result === 'Hit' && styles.hitResult,
                          item.result === 'Double' && styles.doubleResult,
                          item.result === 'Triple' && styles.tripleResult,
                          item.result === 'Out' && styles.outResult
                        ]}>
                          {item.result}
                        </Text>
                        
                        {selectedShotId === item.id && (
                          <View style={styles.rowActionButtons}>
                            <TouchableOpacity 
                              style={styles.rowActionButton}
                              activeOpacity={0.7}
                              onPress={() => setShowVideoModal(true)}
                            >
                              <View style={styles.rowActionIcon}>
                                <View style={styles.playIcon} />
                              </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              style={styles.rowActionButton}
                              activeOpacity={0.7}
                            >
                              <View style={styles.rowActionIcon}>
                                <Share2 size={16} color={colors.white} />
                              </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              style={styles.rowActionButton}
                              activeOpacity={0.7}
                            >
                              <View style={styles.rowActionIcon}>
                                <Download size={16} color={colors.white} />
                              </View>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  getItemLayout={(_, index) => ({
                    length: 44, // height of each row
                    offset: 44 * index,
                    index,
                  })}
                  windowSize={10} // how many items to render outside of the visible area
                  maxToRenderPerBatch={10} // how many items to render in a single batch
                  removeClippedSubviews={true} // improve memory usage and performance
                  initialNumToRender={15} // how many items to render initially
                  contentContainerStyle={styles.flatListContent}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </View>
        )}

        {/* Metrics Customization Modal */}
        <Modal
          visible={showMetricsModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMetricsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Customize Metrics</Text>
                <TouchableOpacity 
                  onPress={() => setShowMetricsModal(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <X size={24} color={colors.grey[600]} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScroll}>
                {availableMetrics.map((metric) => (
                  <TouchableOpacity 
                    key={metric.id} 
                    style={styles.metricToggleRow}
                    onPress={() => toggleMetric(metric.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.metricToggleLabel}>{metric.label}</Text>
                    <View style={[
                      styles.checkboxContainer,
                      metric.active && styles.activeCheckbox
                    ]}>
                      {metric.active && <Check size={16} color={colors.white} />}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowMetricsModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Apply Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Comparison Filters Modal */}
        <Modal
          visible={showFiltersModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFiltersModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Comparison</Text>
                <TouchableOpacity 
                  onPress={() => setShowFiltersModal(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <X size={24} color={colors.grey[600]} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScroll}>
                <TouchableOpacity 
                  style={styles.comparisonOption}
                  onPress={() => setComparison('none')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.comparisonOptionText}>No Comparison</Text>
                  {comparisonPoint === 'none' && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.comparisonOption}
                  onPress={() => setComparison('your-avg')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.comparisonOptionText}>Your Average</Text>
                  {comparisonPoint === 'your-avg' && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.comparisonOption}
                  onPress={() => setComparison('your-max')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.comparisonOptionText}>Your Best</Text>
                  {comparisonPoint === 'your-max' && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.comparisonOption}
                  onPress={() => setComparison('age-avg')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.comparisonOptionText}>Age Group Average</Text>
                  {comparisonPoint === 'age-avg' && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Video Modal */}
        <Modal
          visible={showVideoModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowVideoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.videoModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Shot Video</Text>
                <TouchableOpacity 
                  onPress={() => setShowVideoModal(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <X size={24} color={colors.grey[600]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.videoContainer}>
                <Image 
                  source={require('@/assets/images/Video.jpg')}
                  style={styles.videoImage}
                  resizeMode="cover"
                />
                <View style={styles.videoPlayOverlay}>
                  <TouchableOpacity style={styles.videoPlayButton} activeOpacity={0.7}>
                    <View style={styles.videoPlayIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.videoInfoContainer}>
                <Text style={styles.videoInfoTitle}>Shot #{selectedShotId} Details</Text>
                <Text style={styles.videoInfoText}>
                  Exit Velocity: {selectedShotId && sessionData.shots.find(s => s.id === selectedShotId)?.exitVelo} mph
                </Text>
                <Text style={styles.videoInfoText}>
                  Launch Angle: {selectedShotId && sessionData.shots.find(s => s.id === selectedShotId)?.launchAngle}°
                </Text>
                <Text style={styles.videoInfoText}>
                  Direction: {selectedShotId && sessionData.shots.find(s => s.id === selectedShotId)?.direction}
                </Text>
                <Text style={styles.videoInfoText}>
                  Result: {selectedShotId && sessionData.shots.find(s => s.id === selectedShotId)?.result}
                </Text>
              </View>
            </View>
          </View>
        </Modal>

        {/* Footer Buttons - not shown in shots tab */}
        {activeTab !== 'shots' && (
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
              <Download size={20} color={colors.grey[600]} />
              <Text style={styles.footerButtonText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
              <Share2 size={20} color={colors.grey[600]} />
              <Text style={styles.footerButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey[50],
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: colors.white,
    padding: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  dateText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    color: colors.grey[600],
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    color: colors.grey[600],
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 20,
    color: colors.grey[600],
    flex: 1,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  practiceTag: {
    backgroundColor: 'rgba(43, 115, 223, 0.1)',
  },
  gameTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  typeText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.grey[600],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
    height: 40, // reduced height
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 13,
    color: colors.grey[500],
  },
  activeTabText: {
    color: colors.primary,
  },
  metricsContainer: {
    padding: 12,
  },
  insightsContainer: {
    padding: 12,
  },
  shotsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: colors.grey[100],
  },
  sectionTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginTop: 12,
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    color: colors.grey[600],
  },
  metricLabel: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[500],
    marginTop: 4,
  },
  comparisonBanner: {
    backgroundColor: colors.grey[100],
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  comparisonText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[600],
    textAlign: 'center',
  },
  focusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  focusTag: {
    backgroundColor: colors.grey[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  focusText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[600],
  },
  notesContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notesText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    color: colors.grey[600],
    lineHeight: 24,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    color: colors.grey[600],
    lineHeight: 24,
  },
  improvementContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  improvementText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    color: colors.grey[600],
    lineHeight: 24,
  },
  suggestedDrillCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestedDrillTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 8,
  },
  suggestedDrillDescription: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[600],
    lineHeight: 20,
    marginBottom: 16,
  },
  suggestedDrillButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  suggestedDrillButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 14,
    color: colors.white,
  },
  shotsTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.grey[100],
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontFamily: 'Barlow-Bold',
    fontSize: 14,
    color: colors.grey[600],
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
    height: 44, // fixed height for performance
  },
  tableCell: {
    flex: 1,
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[600],
    textAlign: 'center',
  },
  homeRunResult: {
    color: colors.primary,
    fontFamily: 'Barlow-Bold',
  },
  hitResult: {
    color: 'green',
  },
  doubleResult: {
    color: 'blue',
  },
  tripleResult: {
    color: 'purple',
  },
  outResult: {
    color: 'red',
  },
  flatListContent: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.grey[600],
  },
  modalScroll: {
    maxHeight: 400,
  },
  metricToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
    height: 48, // fixed height for better touch area
  },
  metricToggleLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[600],
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.grey[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  comparisonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
    height: 52, // fixed height for better touch area
  },
  comparisonOptionText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[600],
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey[100],
    gap: 24,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerButtonText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[600],
  },
  visualizationContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  paginationDots: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.grey[300],
  },
  activePaginationDot: {
    backgroundColor: colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  visualizationImageContainer: {
    height: 200,
    position: 'relative',
    backgroundColor: colors.grey[50],
  },
  visualizationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  swipeInstructions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  swipeArrow: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualizationWrapper: {
    marginBottom: 4,
  },
  clearSelectionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.grey[100],
  },
  clearSelectionText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[600],
  },
  selectedRow: {
    backgroundColor: 'rgba(43, 115, 223, 0.1)',
  },
  shotListContainer: {
    flex: 1,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  rowActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    alignItems: 'center',
  },
  rowActionButton: {
    alignItems: 'center',
    gap: 8,
  },
  rowActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: colors.white,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  visualizationLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  visualizationLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
  },
  videoModalContent: {
    backgroundColor: colors.white,
    marginTop: 120,
    marginBottom: 120,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: '80%',
  },
  videoContainer: {
    height: 250,
    position: 'relative',
    backgroundColor: '#222',
  },
  videoImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  videoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayIcon: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 18,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: colors.white,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 5,
  },
  videoInfoContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  videoInfoTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.grey[600],
    marginBottom: 8,
  },
  videoInfoText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[600],
    marginBottom: 4,
  },
}); 