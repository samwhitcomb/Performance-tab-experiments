import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useColors } from '@/constants/theme';
import Svg, { Polyline, Line, Text, Circle } from 'react-native-svg';

interface BatSpeedData {
  date: string;
  speed: number;
}

interface BatSpeedTrendChartProps {
  data: BatSpeedData[];
}

export function BatSpeedTrendChart({ data }: BatSpeedTrendChartProps) {
  const colors = useColors();
  const size = Dimensions.get('window').width - 32;
  const padding = 40;
  const chartWidth = size - padding * 2;
  const chartHeight = 200;

  // Calculate min and max values for scaling
  const speeds = data.map(d => d.speed);
  const minSpeed = Math.min(...speeds) - 2; // Add some padding
  const maxSpeed = Math.max(...speeds) + 2;
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Generate points for the polyline
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((d.speed - minSpeed) / (maxSpeed - minSpeed)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={size} height={chartHeight + padding * 2}>
        {/* X and Y axis */}
        <Line
          x1={padding}
          y1={padding + chartHeight}
          x2={padding + chartWidth}
          y2={padding + chartHeight}
          stroke={colors.grey[300]}
          strokeWidth="1"
        />
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={padding + chartHeight}
          stroke={colors.grey[300]}
          strokeWidth="1"
        />
        
        {/* X-axis labels (dates) */}
        {data.map((d, i) => (
          <Text
            key={`x-label-${i}`}
            x={padding + (i / (data.length - 1)) * chartWidth}
            y={padding + chartHeight + 20}
            fontSize="10"
            textAnchor="middle"
            fill={colors.grey[500]}
          >
            {formatDate(d.date)}
          </Text>
        ))}
        
        {/* Y-axis labels (bat speed) */}
        {[minSpeed, (minSpeed + maxSpeed) / 2, maxSpeed].map((speed, i) => (
          <Text
            key={`y-label-${i}`}
            x={padding - 10}
            y={padding + chartHeight - (i * chartHeight / 2)}
            fontSize="10"
            textAnchor="end"
            alignmentBaseline="middle"
            fill={colors.grey[500]}
          >
            {speed.toFixed(0)}
          </Text>
        ))}
        
        {/* Y-axis title */}
        <Text
          x={padding - 25}
          y={padding + chartHeight / 2}
          fontSize="10"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={colors.grey[500]}
          rotate={-90}
          originX={padding - 25}
          originY={padding + chartHeight / 2}
        >
          Bat Speed (mph)
        </Text>
        
        {/* Line chart */}
        <Polyline
          points={points}
          fill="none"
          stroke={colors.primary}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * chartWidth;
          const y = padding + chartHeight - ((d.speed - minSpeed) / (maxSpeed - minSpeed)) * chartHeight;
          return (
            <Circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill={colors.white}
              stroke={colors.primary}
              strokeWidth="2"
            />
          );
        })}
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

export default BatSpeedTrendChart; 