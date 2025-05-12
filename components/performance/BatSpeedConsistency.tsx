import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';

interface BatSpeedConsistencyProps {
  data: {
    avgSpeed: number;
    stdDev: number;
    consistencyScore: number;
    speedDistribution: {
      range: string;
      count: number;
    }[];
  };
}

export function BatSpeedConsistency({ data }: BatSpeedConsistencyProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;

  const chartData = {
    labels: data.speedDistribution.map(item => item.range),
    datasets: [
      {
        data: data.speedDistribution.map(item => item.count),
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
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>
        Bat Speed Consistency
      </Text>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.grey[600] }]}>
            Avg Speed
          </Text>
          <Text style={[styles.metricValue, { color: colors.grey[600] }]}>
            {data.avgSpeed.toFixed(1)} mph
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.grey[600] }]}>
            Std Dev
          </Text>
          <Text style={[styles.metricValue, { color: colors.grey[600] }]}>
            {data.stdDev.toFixed(1)} mph
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.grey[600] }]}>
            Consistency
          </Text>
          <Text style={[styles.metricValue, { color: colors.grey[600] }]}>
            {data.consistencyScore.toFixed(0)}%
          </Text>
        </View>
      </View>

      <BarChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
      />
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
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 