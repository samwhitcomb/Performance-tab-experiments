import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { useColors } from '@/constants/theme';

interface SprayChartProps {
  data?: {
    x: number;
    y: number;
    type: 'pull' | 'center' | 'oppo';
    ev: number;
    launchAngle: number;
  }[];
  showLaunchAngle?: boolean;
  showZones?: boolean;
}

export function SprayChart({ data = [], showLaunchAngle = false, showZones = false }: SprayChartProps) {
  const colors = useColors();
  const size = Dimensions.get('window').width - 32;
  const padding = 40;
  const chartSize = size - padding * 2;

  // Check if we have data to display
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.noDataText, { color: colors.grey[400] }]}>
          No data available
        </Text>
      </View>
    );
  }

  // Define chart boundaries
  const minX = 0;
  const maxX = 1;
  const minY = 0;
  const maxY = 1;

  const getX = (x: number) => {
    return padding + ((x - minX) / (maxX - minX)) * chartSize;
  };

  const getY = (y: number) => {
    return padding + chartSize - ((y - minY) / (maxY - minY)) * chartSize;
  };

  const getDotColor = (launchAngle: number) => {
    if (launchAngle < 10) return colors.secondary.indigo; // Grounders
    if (launchAngle > 25) return colors.status.error; // Flies
    return colors.secondary.green; // Line drives
  };

  const getDotSize = (ev: number) => {
    const minSize = 4;
    const maxSize = 12;
    const minEV = 60;
    const maxEV = 110;
    return minSize + ((ev - minEV) / (maxEV - minEV)) * (maxSize - minSize);
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Field outline */}
        <Path
          d={`M${padding},${padding} L${size - padding},${padding} L${size - padding},${size - padding} L${padding},${size - padding} Z`}
          fill="none"
          stroke={colors.grey[300]}
          strokeWidth="1"
        />

        {/* Zones */}
        {showZones && (
          <>
            <Path
              d={`M${padding},${padding} L${getX(0.33)},${padding} L${getX(0.33)},${size - padding} L${padding},${size - padding} Z`}
              fill={colors.secondary.lightGreen}
              fillOpacity={0.1}
            />
            <Path
              d={`M${getX(0.33)},${padding} L${getX(0.66)},${padding} L${getX(0.66)},${size - padding} L${getX(0.33)},${size - padding} Z`}
              fill={colors.secondary.green}
              fillOpacity={0.1}
            />
            <Path
              d={`M${getX(0.66)},${padding} L${size - padding},${padding} L${size - padding},${size - padding} L${getX(0.66)},${size - padding} Z`}
              fill={colors.secondary.lightGreen}
              fillOpacity={0.1}
            />
          </>
        )}

        {/* Hit locations */}
        {data.map((hit, index) => (
          <Circle
            key={index}
            cx={getX(hit.x)}
            cy={getY(hit.y)}
            r={getDotSize(hit.ev)}
            fill={showLaunchAngle ? getDotColor(hit.launchAngle) : colors.primary}
            fillOpacity={0.8}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    textAlign: 'center',
  },
});