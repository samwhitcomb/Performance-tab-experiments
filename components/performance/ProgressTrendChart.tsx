import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';

interface ProgressTrendData {
  date: string;
  sweetSpot: number;
  barrel: number;
}

interface ProgressTrendChartProps {
  data?: ProgressTrendData[];
}

export function ProgressTrendChart({ data = [] }: ProgressTrendChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;

  // Ensure we have data to display
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.noDataText, { color: colors.grey[400] }]}>
          No data available
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map(point => point.date.split('-')[2]), // Show only day
    datasets: [
      {
        data: data.map(point => point.sweetSpot),
        color: (opacity = 1) => colors.secondary.green,
      },
      {
        data: data.map(point => point.barrel),
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
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary.green }]} />
          <Text style={[styles.legendText, { color: colors.grey[600] }]}>Sweet Spot %</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary.indigo }]} />
          <Text style={[styles.legendText, { color: colors.grey[600] }]}>Barrel %</Text>
        </View>
      </View>
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
    padding: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Barlow-Regular',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    textAlign: 'center',
  },
}); 