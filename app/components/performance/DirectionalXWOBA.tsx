import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useColors } from '@/constants/theme';
import Svg, { Path, Line, Text as SvgText, Rect } from 'react-native-svg';

interface DirectionalTendencies {
  pull: number;
  center: number;
  oppo: number;
}

interface DirectionalXWOBAProps {
  data: DirectionalTendencies;
  xwOBAValues?: {
    pull: number;
    center: number;
    oppo: number;
  };
}

export function DirectionalXWOBA({ 
  data, 
  xwOBAValues = { pull: 0.520, center: 0.350, oppo: 0.280 } 
}: DirectionalXWOBAProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;
  const height = 250;
  const padding = 40;
  const chartWidth = screenWidth - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Bar properties
  const barCount = 3;
  const barWidth = chartWidth / (barCount * 2);
  const barGap = barWidth / 2;
  
  // Calculate positions
  const getBarHeight = (value: number) => {
    const maxValue = Math.max(data.pull, data.center, data.oppo);
    return (value / maxValue) * chartHeight;
  };
  
  // Get color based on xwOBA value
  const getBarColor = (value: number) => {
    if (value >= 0.400) return colors.secondary.green;
    if (value >= 0.300) return colors.secondary.indigo;
    return colors.status.error;
  };
  
  // Generate bars
  const bars = [
    { 
      label: 'Pull', 
      value: data.pull, 
      xwOBA: xwOBAValues.pull,
      x: padding + barGap,
      color: getBarColor(xwOBAValues.pull)
    },
    { 
      label: 'Center', 
      value: data.center, 
      xwOBA: xwOBAValues.center,
      x: padding + barWidth + barGap * 3,
      color: getBarColor(xwOBAValues.center)
    },
    { 
      label: 'Oppo', 
      value: data.oppo, 
      xwOBA: xwOBAValues.oppo,
      x: padding + barWidth * 2 + barGap * 5,
      color: getBarColor(xwOBAValues.oppo)
    }
  ];

  return (
    <View style={styles.container}>
      <Svg width={screenWidth} height={height}>
        {/* X-axis */}
        <Line
          x1={padding}
          y1={height - padding}
          x2={screenWidth - padding}
          y2={height - padding}
          stroke={colors.grey[300]}
          strokeWidth="1"
        />
        
        {/* Y-axis */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke={colors.grey[300]}
          strokeWidth="1"
        />
        
        {/* Bars */}
        {bars.map((bar, index) => {
          const barHeight = getBarHeight(bar.value);
          return (
            <React.Fragment key={`bar-${index}`}>
              <Rect
                x={bar.x}
                y={height - padding - barHeight}
                width={barWidth}
                height={barHeight}
                fill={bar.color}
              />
              <SvgText
                x={bar.x + barWidth / 2}
                y={height - padding + 16}
                fontSize="12"
                textAnchor="middle"
                fill={colors.grey[600]}
              >
                {bar.label}
              </SvgText>
              <SvgText
                x={bar.x + barWidth / 2}
                y={height - padding - barHeight - 8}
                fontSize="10"
                textAnchor="middle"
                fill={colors.grey[600]}
              >
                {bar.value}%
              </SvgText>
              <SvgText
                x={bar.x + barWidth / 2}
                y={height - padding - barHeight - 24}
                fontSize="10"
                textAnchor="middle"
                fill={colors.grey[600]}
              >
                {bar.xwOBA.toFixed(3)}
              </SvgText>
            </React.Fragment>
          );
        })}
        
        {/* Y-axis label */}
        <SvgText
          x={padding - 15}
          y={height / 2}
          fontSize="10"
          textAnchor="middle"
          fill={colors.grey[500]}
          rotate={-90}
          originX={padding - 15}
          originY={height / 2}
        >
          Percentage (%)
        </SvgText>
      </Svg>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.secondary.green }]} />
            <Text style={styles.legendText}>Good (≥.400)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.secondary.indigo }]} />
            <Text style={styles.legendText}>Average (.300-.399)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.status.error }]} />
            <Text style={styles.legendText}>Poor (&lt;.300)</Text>
          </View>
        </View>
        <Text style={styles.xwobaLabel}>xwOBA by Field Direction</Text>
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
    marginTop: 16,
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    color: '#666',
  },
  xwobaLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
});

export default DirectionalXWOBA; 