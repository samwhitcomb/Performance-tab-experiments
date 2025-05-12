import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/constants/theme';
import { Redirect } from 'expo-router';

interface ContactTrendData {
  date: string;
  rate: number;
}

interface ContactTrendChartProps {
  data?: ContactTrendData[];
}

export function ContactTrendChart({ data = [] }: ContactTrendChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;

  // Check if we have data to display
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
        data: data.map(point => point.rate),
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

export default function RedirectPage() {
  return <Redirect href="/performance" />;
} 