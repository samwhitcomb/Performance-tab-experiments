import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

export function SessionMetrics() {
  return (
    <View style={styles.container}>
      <View style={styles.metric}>
        <Text style={styles.value}>87</Text>
        <Text style={styles.label}>Exit Velo (mph)</Text>
      </View>
      
      <View style={styles.metric}>
        <Text style={styles.value}>15°</Text>
        <Text style={styles.label}>Launch Angle</Text>
      </View>
      
      <View style={styles.metric}>
        <Text style={styles.value}>32%</Text>
        <Text style={styles.label}>Barrel %</Text>
      </View>
      
      <View style={styles.metric}>
        <Text style={styles.value}>48</Text>
        <Text style={styles.label}>Total Swings</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  metric: {
    alignItems: 'center',
  },
  value: {
    ...typography.h2,
    color: colors.white,
    fontFamily: 'Barlow-Bold',
  },
  label: {
    ...typography.caption,
    color: colors.grey[300],
  },
});