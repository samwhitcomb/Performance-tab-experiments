import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useColors } from '@/constants/theme';
import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';

interface HitDistribution {
  singles: number;
  doubles: number;
  homeRuns: number;
  outs: number;
}

interface OutcomeWheelProps {
  data: HitDistribution;
}

export function OutcomeWheel({ data }: OutcomeWheelProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  const size = Math.min(screenWidth - 64, 300);
  const radius = size / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Calculate total for percentages
  const total = data.singles + data.doubles + data.homeRuns + data.outs;
  
  // Calculate each outcome's percentage
  const singles = (data.singles / total) * 100;
  const doubles = (data.doubles / total) * 100;
  const homeRuns = (data.homeRuns / total) * 100;
  const outs = (data.outs / total) * 100;
  
  // Create array of segments
  const segments = [
    { name: 'Singles', value: singles, color: colors.secondary.green },
    { name: 'Doubles', value: doubles, color: colors.secondary.indigo },
    { name: 'Home Runs', value: homeRuns, color: colors.primary },
    { name: 'Outs', value: outs, color: colors.status.error },
  ];
  
  // Helper function to create pie segments
  const createPieSegment = (startAngle: number, endAngle: number, color: string) => {
    // Calculate points on the arc
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    // Create the arc path
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    // Create the path
    const path = `
      M ${centerX} ${centerY}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
    
    return path;
  };
  
  // Create the pie segments
  let startAngle = -Math.PI / 2; // Start at top (270 degrees)
  const pieSegments = segments.map((segment, index) => {
    const segmentAngle = (segment.value / 100) * Math.PI * 2;
    const endAngle = startAngle + segmentAngle;
    const path = createPieSegment(startAngle, endAngle, segment.color);
    
    // Calculate label position (halfway through the segment)
    const labelAngle = startAngle + segmentAngle / 2;
    const labelRadius = radius * 0.7; // Place label at 70% of radius
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);
    
    // Calculate percentage
    const percentage = segment.value.toFixed(1);
    
    // Update start angle for next segment
    startAngle = endAngle;
    
    return {
      path,
      color: segment.color,
      labelX,
      labelY,
      name: segment.name,
      percentage,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Pie segments */}
        {pieSegments.map((segment, index) => (
          <Path
            key={`segment-${index}`}
            d={segment.path}
            fill={segment.color}
            stroke="white"
            strokeWidth="1"
          />
        ))}
        
        {/* Center circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.3}
          fill="white"
        />
        
        {/* Percentage labels */}
        {pieSegments.map((segment, index) => (
          <SvgText
            key={`label-${index}`}
            x={segment.labelX}
            y={segment.labelY}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="white"
          >
            {segment.percentage}%
          </SvgText>
        ))}
      </Svg>
      
      {/* Legend */}
      <View style={styles.legend}>
        {segments.map((segment, index) => (
          <View key={`legend-${index}`} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendText}>{segment.name}</Text>
              <Text style={styles.legendPercent}>{segment.value.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
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
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendTextContainer: {
    flexDirection: 'column',
  },
  legendText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: '#666',
  },
  legendPercent: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 12,
    color: '#333',
  },
});

export default OutcomeWheel; 