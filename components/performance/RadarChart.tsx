import { View, Text, StyleSheet } from 'react-native';
import { Svg, Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { useColors } from '@/constants/theme';

interface RadarChartProps {
  data: {
    label: string;
    value: number;
  }[];
  size?: number;
}

export function RadarChart({ data, size = 250 }: RadarChartProps) {
  const colors = useColors();
  const center = size / 2;
  const radius = (size - 40) / 2;
  const angleStep = (2 * Math.PI) / data.length;

  // Calculate polygon points
  const points = data.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = data[i].value / 100;
    return `${center + radius * value * Math.cos(angle)},${
      center + radius * value * Math.sin(angle)
    }`;
  }).join(' ');

  // Calculate axis lines and labels
  const axes = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const endX = center + radius * Math.cos(angle);
    const endY = center + radius * Math.sin(angle);
    const labelX = center + (radius + 20) * Math.cos(angle);
    const labelY = center + (radius + 20) * Math.sin(angle);

    return {
      line: { x1: center, y1: center, x2: endX, y2: endY },
      label: { x: labelX, y: labelY, text: item.label },
    };
  });

  // Generate rings for 20%, 40%, 60%, 80%, 100%
  const rings = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    const ringPoints = data.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return `${center + radius * scale * Math.cos(angle)},${
        center + radius * scale * Math.sin(angle)
      }`;
    }).join(' ');
    return ringPoints;
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>Skill Profile</Text>
      <Svg width={size} height={size}>
        {/* Background rings */}
        {rings.map((points, i) => (
          <Polygon
            key={`ring-${i}`}
            points={points}
            fill="none"
            stroke={colors.grey[200]}
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axes.map((axis, i) => (
          <Line
            key={`axis-${i}`}
            {...axis.line}
            stroke={colors.grey[300]}
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <Polygon
          points={points}
          fill={colors.primary + '20'}
          stroke={colors.primary}
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const value = data[i].value / 100;
          return (
            <Circle
              key={`point-${i}`}
              cx={center + radius * value * Math.cos(angle)}
              cy={center + radius * value * Math.sin(angle)}
              r="4"
              fill={colors.primary}
            />
          );
        })}

        {/* Labels */}
        {axes.map((axis, i) => (
          <SvgText
            key={`label-${i}`}
            x={axis.label.x}
            y={axis.label.y}
            fill={colors.grey[600]}
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontFamily="Barlow-Medium"
          >
            {axis.label.text}
          </SvgText>
        ))}
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