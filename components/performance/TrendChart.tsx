import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { colors } from '@/constants/theme';

type MetricType = 'exitVelocity' | 'launchAngle' | 'barrelPercentage';

interface TrendChartProps {
  data: number[];
  metric: MetricType;
}

export function TrendChart({ data, metric }: TrendChartProps) {
  const screenWidth = Dimensions.get('window').width - 64;
  
  const getChartLabel = () => {
    switch (metric) {
      case 'exitVelocity':
        return 'Exit Velocity (mph)';
      case 'launchAngle':
        return 'Launch Angle (°)';
      case 'barrelPercentage':
        return 'Barrel %';
      default:
        return '';
    }
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(43, 115, 223, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const chartData = {
    labels: ['', '', '', '', ''],
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(43, 115, 223, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>{getChartLabel()}</Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={180}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
      />
      <Text style={styles.lastSessionLabel}>Last 5 Sessions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  lastSessionLabel: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    color: colors.grey[400],
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});