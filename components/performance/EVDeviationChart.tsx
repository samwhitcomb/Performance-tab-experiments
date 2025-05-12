import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';

interface EVDeviationData {
  date: string;
  deviation: number;
}

interface EVDeviationChartProps {
  data: EVDeviationData[];
}

export function EVDeviationChart({ data }: EVDeviationChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;

  const chartData = {
    labels: data.map(point => point.date.split('-')[2]), // Show only day
    datasets: [
      {
        data: data.map(point => point.deviation),
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
      r: '6',
      strokeWidth: '2',
      stroke: colors.white,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>
        Exit Velocity Deviation
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
        yAxisLabel=""
        yAxisSuffix=" mph"
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 