import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';

interface xBAComparisonProps {
  data: {
    xBA: number;
    actualBA: number;
    difference: number;
  };
}

export function xBAComparison({ data }: xBAComparisonProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;

  const chartData = {
    labels: ['xBA', 'BA'],
    datasets: [
      {
        data: [data.xBA * 1000, data.actualBA * 1000],
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
    barPercentage: 0.5,
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.grey[600] }]}>
        Expected vs Actual BA
      </Text>
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
      <View style={styles.differenceContainer}>
        <Text style={[styles.differenceLabel, { color: colors.grey[600] }]}>
          Difference:
        </Text>
        <Text
          style={[
            styles.differenceValue,
            {
              color: data.difference >= 0
                ? colors.status.success
                : colors.status.error,
            },
          ]}
        >
          {data.difference >= 0 ? '+' : ''}
          {data.difference.toFixed(3)}
        </Text>
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
  differenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  differenceLabel: {
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    marginRight: 8,
  },
  differenceValue: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
  },
}); 