import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';

interface EVTrendSparklineProps {
  data: {
    date: string;
    ev: number;
  }[];
  currentValue: number;
  previousValue: number;
}

export function EVTrendSparkline({ data, currentValue, previousValue }: EVTrendSparklineProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;

  const chartData = {
    labels: data.map(point => point.date.split('-')[2]), // Show only day
    datasets: [
      {
        data: data.map(point => point.ev),
        color: (opacity = 1) => colors.secondary.indigo,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 1,
    color: (opacity = 1) => colors.grey[600],
    labelColor: (opacity = 1) => colors.grey[600],
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0', // Hide dots for sparkline
    },
  };

  const trend = currentValue - previousValue;
  const trendColor = trend >= 0 ? colors.status.success : colors.status.error;
  const trendArrow = trend >= 0 ? '↑' : '↓';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.grey[600] }]}>
          Exit Velocity Trend
        </Text>
        <View style={styles.trendContainer}>
          <Text style={[styles.trendValue, { color: trendColor }]}>
            {trendArrow} {Math.abs(trend).toFixed(1)} mph
          </Text>
        </View>
      </View>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={100}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
        fromZero={false}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 16,
    fontFamily: 'Barlow-Bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 