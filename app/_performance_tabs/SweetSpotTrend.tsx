import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';
import { Redirect } from 'expo-router';

interface SweetSpotData {
  date: string;
  percentage: number;
}

interface SweetSpotTrendProps {
  data: SweetSpotData[];
}

export function SweetSpotTrend({ data }: SweetSpotTrendProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;

  const chartData = {
    labels: data.map(point => point.date.split('-')[2]), // Show only day
    datasets: [
      {
        data: data.map(point => point.percentage),
        color: (opacity = 1) => colors.primary,
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
      r: '6',
      strokeWidth: '2',
      stroke: colors.white,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={300}
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
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix="%"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default function RedirectPage() {
  return <Redirect href="/performance" />;
} 