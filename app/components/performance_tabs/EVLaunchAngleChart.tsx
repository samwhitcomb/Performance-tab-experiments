import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Text } from 'react-native-svg';
import { useColors } from '@/constants/theme';

interface EVLaunchAngleData {
  launchAngle: number;
  ev: number;
  xwOBA: number;
}

interface EVLaunchAngleChartProps {
  data: EVLaunchAngleData[];
}

export function EVLaunchAngleChart({ data }: EVLaunchAngleChartProps) {
  const colors = useColors();
  const size = Dimensions.get('window').width - 32;
  const padding = 40;
  const chartSize = size - padding * 2;

  // Define chart boundaries
  const minLA = -20;
  const maxLA = 50;
  const minEV = 50;
  const maxEV = 110;

  const getX = (launchAngle: number) => {
    return padding + ((launchAngle - minLA) / (maxLA - minLA)) * chartSize;
  };

  const getY = (ev: number) => {
    return padding + chartSize - ((ev - minEV) / (maxEV - minEV)) * chartSize;
  };

  const getDotColor = (xwOBA: number) => {
    if (xwOBA < 0.3) return colors.status.error;
    if (xwOBA < 0.5) return colors.secondary.indigo;
    return colors.secondary.green;
  };

  const getDotSize = (xwOBA: number) => {
    return 4 + xwOBA * 4; // Scale dot size based on xwOBA
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Grid lines */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={size - padding}
          stroke={colors.grey[300]}
          strokeWidth="1"
        />
        <Line
          x1={padding}
          y1={size - padding}
          x2={size - padding}
          y2={size - padding}
          stroke={colors.grey[300]}
          strokeWidth="1"
        />

        {/* Axis labels */}
        <Text
          x={size / 2}
          y={size - padding / 2}
          fill={colors.grey[600]}
          fontSize="12"
          textAnchor="middle"
        >
          Launch Angle (°)
        </Text>
        <Text
          x={padding / 2}
          y={size / 2}
          fill={colors.grey[600]}
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90, ${padding / 2}, ${size / 2})`}
        >
          Exit Velocity (mph)
        </Text>

        {/* Sweet spot zone */}
        <Line
          x1={getX(8)}
          y1={padding}
          x2={getX(8)}
          y2={size - padding}
          stroke={colors.secondary.green}
          strokeWidth="1"
          strokeDasharray="4,4"
        />
        <Line
          x1={getX(32)}
          y1={padding}
          x2={getX(32)}
          y2={size - padding}
          stroke={colors.secondary.green}
          strokeWidth="1"
          strokeDasharray="4,4"
        />

        {/* Data points */}
        {data.map((point, index) => (
          <Circle
            key={index}
            cx={getX(point.launchAngle)}
            cy={getY(point.ev)}
            r={getDotSize(point.xwOBA)}
            fill={getDotColor(point.xwOBA)}
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
}); 