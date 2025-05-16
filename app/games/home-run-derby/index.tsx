import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, Dimensions, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check, ArrowRight, Users, MapPin, Signal, Wind, Eye, Zap, Sun, Moon, CloudRain, Cloud, ChevronDown } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography } from '@/constants/theme';
import { useDevice } from '@/contexts/DeviceContext';
import { useGame } from '@/contexts/GameContext';
import { DeviceManagementModal } from '@/components/device/DeviceManagementModal';

type SessionType = 'tee' | 'soft-toss';
type Location = 'indoor' | 'outdoor';
type Weather = 'Sunny' | 'Wind' | 'Light Rain' | 'Cloudy';
type TimeOfDay = 'Day' | 'Night';
type StadiumSize = 'U10' | 'U12' | 'U14' | 'HIGH SCHOOL' | 'ADULT';

export default function HomeRunDerbySetupScreen() {
  const router = useRouter();
  const { isConnected } = useDevice();
  const { storeItems, equippedItems } = useGame();
  
  // Filter stadiums from store items
  const stadiumOptions = storeItems.filter(item => item.type === 'stadium');
  
  // Add state for device modal visibility
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  
  // Setup states
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionType, setSessionType] = useState<SessionType>('tee');
  const [location, setLocation] = useState<Location>('indoor');
  const [players, setPlayers] = useState([{ name: 'You', id: '1' }]);
  const [stadium, setStadium] = useState(equippedItems.stadium?.id || stadiumOptions[0]?.id || 'default');
  const [weather, setWeather] = useState<Weather>('Sunny');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Day');
  const [stadiumSize, setStadiumSize] = useState<StadiumSize>('ADULT');
  
  // Device width for proper sizing calculations
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.95; // Changed from 0.85 to 0.95 (95% of screen width)
  const cardMargin = (windowWidth - cardWidth) / 2; // Calculate margin to center cards
  
  // Add new state for condition dropdowns
  const [weatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  
  // Filter stadiums from store items and sort to show owned first
  const stadiumOptionsSorted = storeItems
    .filter(item => item.type === 'stadium')
    .sort((a, b) => {
      // Sort by ownership first (owned items first)
      if (a.owned && !b.owned) return -1;
      if (!a.owned && b.owned) return 1;
      return 0;
    });
  
  // Historical descriptions for stadiums
  const getStadiumDescription = (stadiumId: string) => {
    if (stadiumId === 'stadium1') {
      return "Opened in 2006, this iconic ballpark features the famous Gateway Arch backdrop and boasts a rich championship history with 11 World Series titles.";
    } else if (stadiumId === 'stadium2') {
      return "Built in 1988, this climate-controlled stadium with its distinctive air-supported dome roof was the first of its kind in Japan and hosts over 55,000 spectators.";
    } else if (stadiumId === 'stadium3') {
      return "Opened in 2009, this modern baseball cathedral combines state-of-the-art facilities with classical design elements that pay homage to the team's storied legacy.";
    } else {
      return "Standard practice facility with adjustable features to suit players of all skill levels.";
    }
  };

  // Add handler for toggling device modal
  const toggleDeviceModal = () => {
    setDeviceModalVisible(!deviceModalVisible);
  };
  
  // Continue to next step
  const handleNext = () => {
    console.log('handleNext called, currentStep:', currentStep);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start the game - use simpler navigation
      console.log('Trying to navigate to gameplay screen with stadium:', stadium);
      
      // Encode game parameters to pass to the gameplay screen
      const gameParams = {
        sessionType,
        location,
        stadium,
        weather,
        timeOfDay,
        stadiumSize,
        players: JSON.stringify(players)
      };
      
      router.push({
        pathname: '/games/home-run-derby/gameplay',
        params: gameParams
      });
    }
  };
  
  // Go back to previous step or exit setup
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };
  
  // Add a new player
  const addPlayer = () => {
    const newPlayer = {
      name: `Player ${players.length + 1}`,
      id: `${players.length + 1}`
    };
    setPlayers([...players, newPlayer]);
  };
  
  // Remove a player
  const removePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
  };
  
  // Move player up in batting order
  const movePlayerUp = (index: number) => {
    if (index === 0) return;
    const newPlayers = [...players];
    [newPlayers[index], newPlayers[index-1]] = [newPlayers[index-1], newPlayers[index]];
    setPlayers(newPlayers);
  };
  
  // Move player down in batting order
  const movePlayerDown = (index: number) => {
    if (index === players.length - 1) return;
    const newPlayers = [...players];
    [newPlayers[index], newPlayers[index+1]] = [newPlayers[index+1], newPlayers[index]];
    setPlayers(newPlayers);
  };
  
  // Get stadium name by ID
  const getStadiumName = (stadiumId: string) => {
    const selectedStadium = stadiumOptions.find(stadium => stadium.id === stadiumId);
    return selectedStadium ? selectedStadium.name : 'Default Stadium';
  };
  
  // Render the stadium selection step with modifications
  const renderStadiumStep = () => {
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>3. Stadium Selection</Text>
        
        <View style={styles.stadiumCarouselContainer}>
          <FlatList
            horizontal
            data={stadiumOptionsSorted.length > 0 ? stadiumOptionsSorted : [{ 
              id: 'default', 
              name: 'Default Stadium', 
              description: 'Standard batting practice facility',
              type: 'stadium',
              price: 0,
              image: '',
              owned: true,
              features: ['Standard dimensions', 'Clear visibility', 'No wind effects']
            }]}
            renderItem={({item}) => {
              const isSelected = stadium === item.id;
              const isLocked = !item.owned;
              
              return (
                <View style={styles.cardWrapper}>
                  <TouchableOpacity 
                    style={[
                      styles.stadiumFullCard,
                      isSelected && styles.stadiumFullCardSelected,
                      isLocked && styles.stadiumCardLocked,
                    ]}
                    onPress={() => item.owned && setStadium(item.id)}
                    activeOpacity={0.9}
                  >
                    {/* Background Image */}
                    {item.image ? (
                      <Image 
                        source={{ uri: item.image }}
                        style={styles.stadiumFullImage}
                      />
                    ) : (
                      <View style={styles.stadiumImagePlaceholder}>
                        <Ionicons name="baseball-outline" size={64} color={colors.white} />
                      </View>
                    )}
                    
                    {/* Content Overlay */}
                    <View style={styles.stadiumCardContent}>
                      {/* Header */}
                      <View style={styles.stadiumCardHeader}>
                        <Text style={styles.stadiumFullName}>{item.name}</Text>
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <Check size={16} color={colors.white} />
                            <Text style={styles.selectedBadgeText}>Selected</Text>
                          </View>
                        )}
                      </View>
                      
                      {/* Historical Description */}
                      <Text style={styles.stadiumDescription}>
                        {getStadiumDescription(item.id)}
                      </Text>
                    </View>
                    
                    {/* Lock Overlay */}
                    {isLocked && (
                      <View style={styles.stadiumLockOverlay}>
                        <Ionicons name="lock-closed" size={40} color={colors.white} />
                        <Text style={styles.stadiumLockedText}>Locked Stadium</Text>
                        <Text style={styles.unlockText}>Purchase in Store</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={cardWidth}
            contentContainerStyle={styles.stadiumCarouselContent}
            onViewableItemsChanged={({viewableItems}) => {
              if (viewableItems.length > 0 && viewableItems[0].item.owned) {
                setStadium(viewableItems[0].item.id);
              }
            }}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50
            }}
          />
        </View>
        
        {/* Stadium Conditions Options with Dropdowns */}
        <View style={styles.conditionsContainer}>
          <Text style={styles.conditionsTitle}>Stadium Conditions</Text>
          
          {/* Weather Dropdown */}
          <TouchableOpacity 
            style={styles.dropdownHeader} 
            onPress={() => setWeatherDropdownOpen(!weatherDropdownOpen)}
          >
            <View style={styles.dropdownTitleRow}>
              <Text style={styles.dropdownTitle}>Weather: <Text style={styles.selectedValue}>{weather}</Text></Text>
              <ChevronDown 
                size={20} 
                color={colors.grey[600]} 
                style={{transform: [{ rotate: weatherDropdownOpen ? '180deg' : '0deg' }]}}
              />
            </View>
          </TouchableOpacity>
          
          {weatherDropdownOpen && (
            <View style={[styles.optionButtonsRow, styles.dropdownPopup]}>
              <TouchableOpacity 
                style={[styles.conditionButton, weather === 'Sunny' && styles.conditionButtonSelected]}
                onPress={() => {
                  setWeather('Sunny');
                  setWeatherDropdownOpen(false);
                }}
              >
                <Sun size={18} color={weather === 'Sunny' ? colors.white : colors.grey[600]} />
                <Text style={[styles.conditionButtonText, weather === 'Sunny' && styles.conditionButtonTextSelected]}>Sunny</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, weather === 'Wind' && styles.conditionButtonSelected]}
                onPress={() => {
                  setWeather('Wind');
                  setWeatherDropdownOpen(false);
                }}
              >
                <Wind size={18} color={weather === 'Wind' ? colors.white : colors.grey[600]} />
                <Text style={[styles.conditionButtonText, weather === 'Wind' && styles.conditionButtonTextSelected]}>Wind</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, weather === 'Light Rain' && styles.conditionButtonSelected]}
                onPress={() => {
                  setWeather('Light Rain');
                  setWeatherDropdownOpen(false);
                }}
              >
                <CloudRain size={18} color={weather === 'Light Rain' ? colors.white : colors.grey[600]} />
                <Text style={[styles.conditionButtonText, weather === 'Light Rain' && styles.conditionButtonTextSelected]}>Light Rain</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, weather === 'Cloudy' && styles.conditionButtonSelected]}
                onPress={() => {
                  setWeather('Cloudy');
                  setWeatherDropdownOpen(false);
                }}
              >
                <Cloud size={18} color={weather === 'Cloudy' ? colors.white : colors.grey[600]} />
                <Text style={[styles.conditionButtonText, weather === 'Cloudy' && styles.conditionButtonTextSelected]}>Cloudy</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Time of Day Dropdown */}
          <TouchableOpacity 
            style={styles.dropdownHeader} 
            onPress={() => setTimeDropdownOpen(!timeDropdownOpen)}
          >
            <View style={styles.dropdownTitleRow}>
              <Text style={styles.dropdownTitle}>Time of Day: <Text style={styles.selectedValue}>{timeOfDay}</Text></Text>
              <ChevronDown 
                size={20} 
                color={colors.grey[600]} 
                style={{transform: [{ rotate: timeDropdownOpen ? '180deg' : '0deg' }]}}
              />
            </View>
          </TouchableOpacity>
          
          {timeDropdownOpen && (
            <View style={[styles.optionButtonsRow, styles.dropdownPopup]}>
              <TouchableOpacity 
                style={[styles.conditionButton, timeOfDay === 'Day' && styles.conditionButtonSelected]}
                onPress={() => {
                  setTimeOfDay('Day');
                  setTimeDropdownOpen(false);
                }}
              >
                <Sun size={18} color={timeOfDay === 'Day' ? colors.white : colors.grey[600]} />
                <Text style={[styles.conditionButtonText, timeOfDay === 'Day' && styles.conditionButtonTextSelected]}>Day</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, timeOfDay === 'Night' && styles.conditionButtonSelected]}
                onPress={() => {
                  setTimeOfDay('Night');
                  setTimeDropdownOpen(false);
                }}
              >
                <Moon size={18} color={timeOfDay === 'Night' ? colors.white : colors.grey[600]} />
                <Text style={[styles.conditionButtonText, timeOfDay === 'Night' && styles.conditionButtonTextSelected]}>Night</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Stadium Size Dropdown */}
          <TouchableOpacity 
            style={styles.dropdownHeader} 
            onPress={() => setSizeDropdownOpen(!sizeDropdownOpen)}
          >
            <View style={styles.dropdownTitleRow}>
              <Text style={styles.dropdownTitle}>Stadium Size: <Text style={styles.selectedValue}>{stadiumSize}</Text></Text>
              <ChevronDown 
                size={20} 
                color={colors.grey[600]} 
                style={{transform: [{ rotate: sizeDropdownOpen ? '180deg' : '0deg' }]}}
              />
            </View>
          </TouchableOpacity>
          
          {sizeDropdownOpen && (
            <View style={[styles.optionButtonsRow, styles.dropdownPopup]}>
              <TouchableOpacity 
                style={[styles.conditionButton, stadiumSize === 'U10' && styles.conditionButtonSelected]}
                onPress={() => {
                  setStadiumSize('U10');
                  setSizeDropdownOpen(false);
                }}
              >
                <Text style={[styles.conditionButtonText, stadiumSize === 'U10' && styles.conditionButtonTextSelected]}>U10</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, stadiumSize === 'U12' && styles.conditionButtonSelected]}
                onPress={() => {
                  setStadiumSize('U12');
                  setSizeDropdownOpen(false);
                }}
              >
                <Text style={[styles.conditionButtonText, stadiumSize === 'U12' && styles.conditionButtonTextSelected]}>U12</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, stadiumSize === 'U14' && styles.conditionButtonSelected]}
                onPress={() => {
                  setStadiumSize('U14');
                  setSizeDropdownOpen(false);
                }}
              >
                <Text style={[styles.conditionButtonText, stadiumSize === 'U14' && styles.conditionButtonTextSelected]}>U14</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, stadiumSize === 'HIGH SCHOOL' && styles.conditionButtonSelected]}
                onPress={() => {
                  setStadiumSize('HIGH SCHOOL');
                  setSizeDropdownOpen(false);
                }}
              >
                <Text style={[styles.conditionButtonText, stadiumSize === 'HIGH SCHOOL' && styles.conditionButtonTextSelected]}>HIGH SCHOOL</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.conditionButton, stadiumSize === 'ADULT' && styles.conditionButtonSelected]}
                onPress={() => {
                  setStadiumSize('ADULT');
                  setSizeDropdownOpen(false);
                }}
              >
                <Text style={[styles.conditionButtonText, stadiumSize === 'ADULT' && styles.conditionButtonTextSelected]}>ADULT</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };
  
  // Setup screen content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>1. Session Type</Text>
            <Text style={styles.stepDescription}>Choose how you want to hit the ball</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  sessionType === 'tee' && styles.optionButtonSelected
                ]}
                onPress={() => setSessionType('tee')}
              >
                <Text style={styles.optionTitle}>Tee</Text>
                <Text style={styles.optionDescription}>Hit balls from a stationary tee</Text>
                {sessionType === 'tee' && <Check style={styles.checkIcon} color={colors.primary} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  sessionType === 'soft-toss' && styles.optionButtonSelected
                ]}
                onPress={() => setSessionType('soft-toss')}
              >
                <Text style={styles.optionTitle}>Soft Toss</Text>
                <Text style={styles.optionDescription}>Hit balls tossed by a partner</Text>
                {sessionType === 'soft-toss' && <Check style={styles.checkIcon} color={colors.primary} />}
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.subSectionTitle}>Playing Location</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  location === 'indoor' && styles.optionButtonSelected
                ]}
                onPress={() => setLocation('indoor')}
              >
                <Text style={styles.optionTitle}>Indoor</Text>
                <Text style={styles.optionDescription}>Batting cage or indoor facility</Text>
                {location === 'indoor' && <Check style={styles.checkIcon} color={colors.primary} />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  location === 'outdoor' && styles.optionButtonSelected
                ]}
                onPress={() => setLocation('outdoor')}
              >
                <Text style={styles.optionTitle}>Outdoor</Text>
                <Text style={styles.optionDescription}>Field, park, or backyard</Text>
                {location === 'outdoor' && <Check style={styles.checkIcon} color={colors.primary} />}
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>2. Players</Text>
            <Text style={styles.stepDescription}>Add players and set batting order</Text>
            
            <View style={styles.playersContainer}>
              {players.map((player, index) => (
                <View key={player.id} style={styles.playerItem}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerNumber}>{index + 1}</Text>
                    <Text style={styles.playerName}>{player.name}</Text>
                  </View>
                  
                  <View style={styles.playerActions}>
                    <TouchableOpacity 
                      style={[styles.orderButton, index === 0 && styles.orderButtonDisabled]}
                      onPress={() => movePlayerUp(index)}
                      disabled={index === 0}
                    >
                      <Text style={styles.orderButtonText}>↑</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.orderButton, index === players.length - 1 && styles.orderButtonDisabled]}
                      onPress={() => movePlayerDown(index)}
                      disabled={index === players.length - 1}
                    >
                      <Text style={styles.orderButtonText}>↓</Text>
                    </TouchableOpacity>
                    
                    {players.length > 1 && (
                      <TouchableOpacity 
                        style={styles.removeButton}
                        onPress={() => removePlayer(player.id)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addPlayer}
            >
              <Text style={styles.addButtonText}>Add Player</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 2:
        return renderStadiumStep();
        
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>4. Device Connection</Text>
            <Text style={styles.stepDescription}>Ensure your launch monitor is connected</Text>
            
            <View style={styles.deviceStatusContainer}>
              <View style={[
                styles.deviceStatusIndicator, 
                isConnected ? styles.deviceConnected : styles.deviceDisconnected
              ]}>
                <Signal size={32} color={isConnected ? colors.status.success : colors.status.error} />
              </View>
              
              <Text style={styles.deviceStatusText}>
                {isConnected ? 'Device Connected' : 'Device Not Connected'}
              </Text>
              
              <Text style={styles.deviceInstructions}>
                {isConnected 
                  ? 'Your launch monitor is ready to go!' 
                  : 'Please connect your launch monitor to continue'}
              </Text>
              
              {!isConnected && (
                <TouchableOpacity 
                  style={styles.connectDeviceButton}
                  onPress={toggleDeviceModal}
                >
                  <Text style={styles.connectDeviceButtonText}>Connect Device</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.gameSummary}>
              <Text style={styles.summaryTitle}>Game Summary</Text>
              <View style={styles.summaryItem}>
                <Ionicons name="baseball-outline" size={16} color={colors.grey[600]} />
                <Text style={styles.summaryLabel}>Session Type:</Text>
                <Text style={styles.summaryValue}>{sessionType === 'tee' ? 'Tee' : 'Soft Toss'}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <MapPin size={16} color={colors.grey[600]} />
                <Text style={styles.summaryLabel}>Location:</Text>
                <Text style={styles.summaryValue}>{location === 'indoor' ? 'Indoor' : 'Outdoor'}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Users size={16} color={colors.grey[600]} />
                <Text style={styles.summaryLabel}>Players:</Text>
                <Text style={styles.summaryValue}>{players.length}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <MapPin size={16} color={colors.grey[600]} />
                <Text style={styles.summaryLabel}>Stadium:</Text>
                <Text style={styles.summaryValue}>
                  {getStadiumName(stadium)}
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Sun size={16} color={colors.grey[600]} />
                <Text style={styles.summaryLabel}>Weather:</Text>
                <Text style={styles.summaryValue}>{weather}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                {timeOfDay === 'Day' ? 
                  <Sun size={16} color={colors.grey[600]} /> : 
                  <Moon size={16} color={colors.grey[600]} />
                }
                <Text style={styles.summaryLabel}>Time of Day:</Text>
                <Text style={styles.summaryValue}>{timeOfDay}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Ionicons name="resize-outline" size={16} color={colors.grey[600]} />
                <Text style={styles.summaryLabel}>Stadium Size:</Text>
                <Text style={styles.summaryValue}>{stadiumSize}</Text>
              </View>
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <ChevronLeft size={24} color={colors.grey[600]} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Home Run Derby Setup</Text>
        
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {renderStepContent()}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.progressIndicator}>
          {[0, 1, 2, 3].map(step => (
            <View 
              key={step}
              style={[
                styles.progressDot,
                currentStep === step && styles.progressDotActive,
                currentStep > step && styles.progressDotCompleted
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            currentStep === 3 && styles.startGameButton,
            currentStep === 3 && !isConnected && styles.startGameButtonDisabled
          ]}
          onPress={handleNext}
          disabled={currentStep === 3 && !isConnected}
        >
          <Text style={styles.nextButtonText}>
            {currentStep < 3 ? 'Continue' : 'Start Game'}
          </Text>
          <ArrowRight size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
      
      {/* Add the DeviceManagementModal to the component */}
      <DeviceManagementModal 
        visible={deviceModalVisible}
        onClose={toggleDeviceModal}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.grey[600],
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 24,
  },
  stepContent: {
    padding: 12,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.grey[600],
    marginBottom: 8,
  },
  stepDescription: {
    ...typography.body1,
    color: colors.grey[500],
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey[200],
    backgroundColor: colors.white,
    position: 'relative',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  optionTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 4,
  },
  optionDescription: {
    ...typography.body2,
    color: colors.grey[500],
  },
  checkIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey[200],
    marginVertical: 24,
  },
  subSectionTitle: {
    ...typography.h3,
    color: colors.grey[600],
    marginBottom: 16,
  },
  playersContainer: {
    marginBottom: 16,
    gap: 8,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey[200],
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerNumber: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[500],
    width: 24,
    textAlign: 'center',
  },
  playerName: {
    ...typography.body1,
    color: colors.grey[600],
    marginLeft: 12,
  },
  playerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonDisabled: {
    opacity: 0.5,
  },
  orderButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.status.error + '20', // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.status.error,
  },
  addButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  stadiumCarouselContainer: {
    marginVertical: 8,
    height: 380,
  },
  stadiumCarouselContent: {
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  cardWrapper: {
    width: Dimensions.get('window').width * 0.97,
  },
  stadiumFullCard: {
    width: '100%',
    height: 380,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.grey[100],
    position: 'relative',
  },
  stadiumFullCardSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  stadiumCardLocked: {
    opacity: 0.7,
  },
  stadiumFullImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  stadiumCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  stadiumCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stadiumFullName: {
    fontFamily: 'Barlow-Bold',
    fontSize: 26,
    color: colors.white,
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  stadiumDescription: {
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  selectedBadgeText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.white,
  },
  stadiumImagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.grey[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stadiumLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stadiumLockedText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 14,
    color: colors.white,
    marginTop: 8,
  },
  unlockText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  dropdownHeader: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  dropdownTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[600],
  },
  selectedValue: {
    fontFamily: 'Barlow-Bold',
    color: colors.primary,
  },
  conditionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  conditionsTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.grey[600],
    marginBottom: 8,
  },
  optionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  conditionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.grey[100],
    gap: 6,
  },
  conditionButtonSelected: {
    backgroundColor: colors.primary,
  },
  conditionButtonText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 13,
    color: colors.grey[600],
  },
  conditionButtonTextSelected: {
    color: colors.white,
  },
  deviceStatusContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 24,
  },
  deviceStatusIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deviceConnected: {
    backgroundColor: colors.status.success + '20', // 20% opacity
  },
  deviceDisconnected: {
    backgroundColor: colors.status.error + '20', // 20% opacity
  },
  deviceStatusText: {
    ...typography.h3,
    color: colors.grey[600],
    marginBottom: 8,
  },
  deviceInstructions: {
    ...typography.body2,
    color: colors.grey[500],
    textAlign: 'center',
    marginBottom: 16,
  },
  connectDeviceButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  connectDeviceButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  gameSummary: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    gap: 12,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.grey[600],
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    ...typography.body2,
    color: colors.grey[600],
    width: 100,
  },
  summaryValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 14,
    color: colors.grey[600],
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
    backgroundColor: colors.white,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.grey[300],
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  progressDotCompleted: {
    backgroundColor: colors.primary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    backgroundColor: colors.status.error,
    gap: 8,
  },
  nextButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
  startGameButton: {
    backgroundColor: colors.status.success,
    shadowColor: colors.status.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startGameButtonDisabled: {
    backgroundColor: colors.grey[400],
    opacity: 0.7,
  },
  dropdownPopup: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 10,
    left: 0,
    right: 0,
    bottom: '100%', // Position above the dropdown header
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.grey[200],
  },
}); 