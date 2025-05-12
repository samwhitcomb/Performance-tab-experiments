import { View, Text, StyleSheet } from 'react-native';
import { Svg, Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import { useColors } from '@/constants/theme';

interface HitData {
  exitVelocity: number;
  launchAngle: number;
}

interface LaunchAngleChartProps {
  hits: HitData[];
  size?: number;
}

export function LaunchAngleChart({ hits, size = 300 }: LaunchAngleChartProps) {
  const colors = useColors();
  const padding = 40;
  const chartWidth = size - padding * 2;
  const chartHeight = size - padding * 2;

  // Chart bounds
  const maxEV = 120;
  const maxLA = 45;

  // Optimal zones
  const barrelZone = {
    evRange: [95, 105],
    laRange: [25, 35],
  };

  const scaleX = (ev: number) => (ev / maxEV) * chartWidth + padding;
  const scaleY = (la: number) => size - ((la / maxLA) * chartHeight + padding);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>Launch Angle vs Exit Velocity</Text>
      <Svg width={size} height={size}>
        {/* Barrel zone */}
        <Rect
          x={scaleX(barrelZone.evRange[0])}
          y={scaleY(barrelZone.laRange[1])}
          width={scaleX(barrelZone.evRange[1]) - scaleX(barrelZone.evRange[0])}
          height={scaleY(barrelZone.laRange[0]) - scaleY(barrelZone.laRange[1])}
          fill={colors.status.success + '20'}
          stroke={colors.status.success}
          strokeWidth="1"
        />

        {/* Axes */}
        <Line
          x1={padding}
          y1={size - padding}
          x2={size - padding}
          y2={size - padding}
          stroke={colors.grey[400]}
          strokeWidth="1"
        />
        <Line
          x1={padding}
          y1={size - padding}
          x2={padding}
          y2={padding}
          stroke={colors.grey[400]}
          strokeWidth="1"
        />

        {/* Hit markers */}
        {hits.map((hit, index) => (
          <Circle
            key={index}
            cx={scaleX(hit.exitVelocity)}
            cy={scaleY(hit.launchAngle)}
            r="4"
            fill={colors.primary}
            opacity="0.7"
          />
        ))}

        {/* Axis labels */}
        <SvgText
          x={size / 2}
          y={size - 10}
          fill={colors.grey[600]}
          fontSize="12"
          textAnchor="middle"
          fontFamily="Barlow-Medium"
        >
          Exit Velocity (mph)
        </SvgText>
        <SvgText
          x={15}
          y={size / 2}
          fill={colors.grey[600]}
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90, 15, ${size / 2})`}
          fontFamily="Barlow-Medium"
        >
          Launch Angle (°)
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
});