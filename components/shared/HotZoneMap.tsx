import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export function HotZoneMap() {
  // Mock data for strike zone heat map (values 0-100)
  const zoneHeatmap = [
    [75, 60, 45],  // Top row
    [85, 70, 50],  // Middle row
    [65, 55, 40],  // Bottom row
  ];
  
  const getZoneColor = (value: number) => {
    if (value >= 80) return '#E63946'; // Hot - red
    if (value >= 70) return '#FF9800'; // Warm - orange
    if (value >= 50) return '#FFD700'; // Neutral - yellow
    return '#DDDDDD'; // Cold - gray
  };
  
  const getZoneLabel = (value: number) => {
    if (value >= 80) return 'HOT';
    if (value >= 70) return 'GOOD';
    if (value >= 50) return 'OK';
    return 'COLD';
  };

  return (
    <View style={styles.container}>
      <View style={styles.strikezone}>
        {zoneHeatmap.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((zoneValue, colIndex) => (
              <View 
                key={`zone-${rowIndex}-${colIndex}`} 
                style={[
                  styles.zone,
                  { backgroundColor: getZoneColor(zoneValue) }
                ]}
              >
                <Text style={styles.zoneValue}>{zoneValue}</Text>
                <Text style={styles.zoneLabel}>{getZoneLabel(zoneValue)}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E63946' }]} />
          <Text style={styles.legendText}>HOT (80+)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>GOOD (70-79)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFD700' }]} />
          <Text style={styles.legendText}>OK (50-69)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#DDDDDD' }]} />
          <Text style={styles.legendText}>COLD (&lt;50)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  strikezone: {
    borderWidth: 2,
    borderColor: colors.grey[600],
    borderRadius: 4,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    height: 70,
  },
  zone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  zoneValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
    color: colors.grey[600],
  },
  zoneLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 10,
    color: colors.grey[600],
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    color: colors.grey[400],
  },
});