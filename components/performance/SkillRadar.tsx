import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';

interface SkillRadarProps {
  data: {
    category: string;
    value: number;
  }[];
  maxValue: number;
}

export function SkillRadar({ data, maxValue }: SkillRadarProps) {
  const colors = useColors();
  const size = Math.min(Dimensions.get('window').width - 64, 300);

  // Convert data to radar chart format
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => (item.value / maxValue) * 100),
        color: (opacity = 1) => colors.secondary.indigo,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.grey[600],
    labelColor: (opacity = 1) => colors.grey[600],
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.white,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>
        Skill Radar
      </Text>
      <LineChart
        data={chartData}
        width={size}
        height={size}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix="%"
        segments={4}
      />
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.secondary.indigo }]} />
            <Text style={[styles.legendText, { color: colors.grey[600] }]}>
              {item.category}: {item.value.toFixed(1)}
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
  title: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 8,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
  },
}); 