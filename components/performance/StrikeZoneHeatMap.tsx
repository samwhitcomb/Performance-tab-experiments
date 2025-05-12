import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { useColors } from '@/constants/theme';

interface StrikeZoneHeatMapProps {
  data: {
    zones: {
      x: number;
      y: number;
      value: number;
    }[];
    maxValue: number;
  };
}

export function StrikeZoneHeatMap({ data }: StrikeZoneHeatMapProps) {
  const colors = useColors();
  const size = Math.min(Dimensions.get('window').width - 64, 300);
  const zoneSize = size / 3;

  const getColor = (value: number) => {
    const intensity = value / data.maxValue;
    return `rgba(43, 115, 223, ${intensity})`; // Using primary color with opacity
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>
        Strike Zone Heat Map
      </Text>
      <Svg width={size} height={size}>
        <G>
          {/* Strike zone outline */}
          <Rect
            x={0}
            y={0}
            width={size}
            height={size}
            fill="none"
            stroke={colors.grey[300]}
            strokeWidth={2}
          />
          
          {/* Zone grid lines */}
          <Rect
            x={zoneSize}
            y={0}
            width={1}
            height={size}
            fill={colors.grey[200]}
          />
          <Rect
            x={zoneSize * 2}
            y={0}
            width={1}
            height={size}
            fill={colors.grey[200]}
          />
          <Rect
            x={0}
            y={zoneSize}
            width={size}
            height={1}
            fill={colors.grey[200]}
          />
          <Rect
            x={0}
            y={zoneSize * 2}
            width={size}
            height={1}
            fill={colors.grey[200]}
          />

          {/* Heat map zones */}
          {data.zones.map((zone, index) => (
            <Rect
              key={index}
              x={zone.x * zoneSize}
              y={zone.y * zoneSize}
              width={zoneSize}
              height={zoneSize}
              fill={getColor(zone.value)}
            />
          ))}

          {/* Zone labels */}
          {['Inside', 'Middle', 'Outside'].map((label, index) => (
            <SvgText
              key={`x-${index}`}
              x={zoneSize * (index + 0.5)}
              y={size + 20}
              textAnchor="middle"
              fill={colors.grey[600]}
              fontSize={12}
              fontFamily="Barlow-Regular"
            >
              {label}
            </SvgText>
          ))}
          {['High', 'Middle', 'Low'].map((label, index) => (
            <SvgText
              key={`y-${index}`}
              x={-20}
              y={zoneSize * (index + 0.5)}
              textAnchor="end"
              fill={colors.grey[600]}
              fontSize={12}
              fontFamily="Barlow-Regular"
            >
              {label}
            </SvgText>
          ))}
        </G>
      </Svg>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: getColor(0) }]} />
          <Text style={[styles.legendText, { color: colors.grey[600] }]}>Low</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: getColor(data.maxValue / 2) }]} />
          <Text style={[styles.legendText, { color: colors.grey[600] }]}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: getColor(data.maxValue) }]} />
          <Text style={[styles.legendText, { color: colors.grey[600] }]}>High</Text>
        </View>
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
  title: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
  },
}); 