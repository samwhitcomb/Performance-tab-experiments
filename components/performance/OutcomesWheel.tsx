import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { useColors } from '@/constants/theme';

interface OutcomesWheelProps {
  data: {
    singles: number;
    doubles: number;
    triples: number;
    homeRuns: number;
    flyOuts: number;
    groundOuts: number;
    xwOBA: number;
  };
}

export function OutcomesWheel({ data }: OutcomesWheelProps) {
  const colors = useColors();
  const size = Math.min(Dimensions.get('window').width - 64, 300);
  const center = size / 2;
  const radius = size * 0.4;

  const outcomes = [
    { label: 'Singles', value: data.singles, color: colors.secondary.green },
    { label: 'Doubles', value: data.doubles, color: colors.secondary.lightGreen },
    { label: 'Triples', value: data.triples, color: colors.secondary.neonGreen },
    { label: 'HR', value: data.homeRuns, color: colors.status.error },
    { label: 'Fly Outs', value: data.flyOuts, color: colors.grey[300] },
    { label: 'Ground Outs', value: data.groundOuts, color: colors.grey[400] },
  ];

  let startAngle = 0;
  const paths = outcomes.map((outcome, index) => {
    const angle = outcome.value * 360;
    const endAngle = startAngle + angle;
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    // Calculate points for the arc
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    // Create the path
    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
    
    startAngle = endAngle;
    
    return (
      <Path
        key={index}
        d={path}
        fill={outcome.color}
        stroke={colors.white}
        strokeWidth={2}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {paths}
          <Circle
            cx={center}
            cy={center}
            r={radius * 0.6}
            fill={colors.white}
          />
          <SvgText
            x={center}
            y={center - 10}
            textAnchor="middle"
            fill={colors.grey[600]}
            fontSize={16}
            fontFamily="Barlow-Bold"
          >
            xwOBA
          </SvgText>
          <SvgText
            x={center}
            y={center + 10}
            textAnchor="middle"
            fill={colors.grey[600]}
            fontSize={20}
            fontFamily="Barlow-Bold"
          >
            {data.xwOBA.toFixed(3)}
          </SvgText>
        </G>
      </Svg>
      <View style={styles.legend}>
        {outcomes.map((outcome, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: outcome.color }]} />
            <Text style={[styles.legendText, { color: colors.grey[600] }]}>
              {outcome.label} ({(outcome.value * 100).toFixed(0)}%)
            </Text>
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
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
  },
}); 