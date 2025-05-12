import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '@/constants/theme';

interface CarouselDotsProps {
  count: number;
  activeIndex: number;
  onDotPress: (index: number) => void;
}

export function CarouselDots({ count, activeIndex, onDotPress }: CarouselDotsProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onDotPress(index)}
          style={styles.dotContainer}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? colors.primary : colors.grey[300],
                width: index === activeIndex ? 24 : 8,
              },
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dotContainer: {
    padding: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
}); 