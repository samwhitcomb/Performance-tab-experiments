import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';

interface SwipeableChartViewProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeableChartView({ 
  children, 
  onSwipeLeft, 
  onSwipeRight 
}: SwipeableChartViewProps) {
  const translateX = useSharedValue(0);
  const screenWidth = Dimensions.get('window').width;
  
  const resetPosition = useCallback(() => {
    translateX.value = withTiming(0, { duration: 250 });
  }, [translateX]);
  
  const handleSwipeLeft = () => {
    if (onSwipeLeft) {
      onSwipeLeft();
      // Reset position after the navigation happens
      setTimeout(resetPosition, 50);
    }
  };
  
  const handleSwipeRight = () => {
    if (onSwipeRight) {
      onSwipeRight();
      // Reset position after the navigation happens
      setTimeout(resetPosition, 50);
    }
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      // Start with no offset
      translateX.value = 0;
    })
    .onUpdate((event) => {
      // Add resistance to the swipe as it gets farther from center
      const dragDistance = event.translationX;
      const resistance = 0.7;
      translateX.value = dragDistance * resistance;
    })
    .onEnd((event) => {
      // Detect swipe based on velocity and distance
      const isSwipingLeft = event.translationX < -screenWidth * 0.15 || event.velocityX < -500;
      const isSwipingRight = event.translationX > screenWidth * 0.15 || event.velocityX > 500;
      
      if (isSwipingLeft && onSwipeLeft) {
        // Animate to left edge with quick timing
        translateX.value = withTiming(-screenWidth * 0.25, { duration: 150 });
        runOnJS(handleSwipeLeft)();
      } else if (isSwipingRight && onSwipeRight) {
        // Animate to right edge with quick timing
        translateX.value = withTiming(screenWidth * 0.25, { duration: 150 });
        runOnJS(handleSwipeRight)();
      } else {
        // Spring back to center with nice animation
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.chartContainer, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden', // Ensure content doesn't bleed outside the container
  },
  chartContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 