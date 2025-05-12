import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useColors } from '@/constants/theme';

export type HeatMapZone = 'inside' | 'outside' | 'high' | 'low';

interface HeatMapData {
  zone: HeatMapZone;
  avgEV: number;
}

interface HeatMapProps {
  data: HeatMapData[];
}

export function HeatMap({ data }: HeatMapProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width - 32;
  const cellSize = screenWidth / 2 - 8;

  // Find min and max values for color mapping
  const minEV = Math.min(...data.map(d => d.avgEV));
  const maxEV = Math.max(...data.map(d => d.avgEV));
  
  // Helper function to get color for a value
  const getColor = (value: number) => {
    // Normalize value between 0 and 1
    const normalizedValue = (value - minEV) / (maxEV - minEV);
    
    // Red for weak, green for strong
    if (normalizedValue < 0.33) {
      return colors.status.error;
    } else if (normalizedValue < 0.66) {
      return colors.secondary.indigo;
    } else {
      return colors.secondary.green;
    }
  };

  // Helper function to get zone data
  const getZoneData = (zone: HeatMapZone) => {
    const zoneData = data.find(d => d.zone === zone);
    return zoneData || { zone, avgEV: 0 };
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.row}>
          <View style={[
            styles.cell, 
            { 
              backgroundColor: getColor(getZoneData('high').avgEV),
              width: cellSize,
              height: cellSize
            }
          ]}>
            <Text style={styles.zoneLabel}>HIGH</Text>
            <Text style={styles.zoneValue}>{getZoneData('high').avgEV.toFixed(1)} mph</Text>
          </View>
          <View style={[
            styles.cell, 
            { 
              backgroundColor: getColor(getZoneData('outside').avgEV),
              width: cellSize,
              height: cellSize
            }
          ]}>
            <Text style={styles.zoneLabel}>OUTSIDE</Text>
            <Text style={styles.zoneValue}>{getZoneData('outside').avgEV.toFixed(1)} mph</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[
            styles.cell, 
            { 
              backgroundColor: getColor(getZoneData('inside').avgEV),
              width: cellSize,
              height: cellSize
            }
          ]}>
            <Text style={styles.zoneLabel}>INSIDE</Text>
            <Text style={styles.zoneValue}>{getZoneData('inside').avgEV.toFixed(1)} mph</Text>
          </View>
          <View style={[
            styles.cell, 
            { 
              backgroundColor: getColor(getZoneData('low').avgEV),
              width: cellSize,
              height: cellSize 
            }
          ]}>
            <Text style={styles.zoneLabel}>LOW</Text>
            <Text style={styles.zoneValue}>{getZoneData('low').avgEV.toFixed(1)} mph</Text>
          </View>
        </View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.status.error }]} />
          <Text style={styles.legendText}>Weak</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.secondary.indigo }]} />
          <Text style={styles.legendText}>Average</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.secondary.green }]} />
          <Text style={styles.legendText}>Strong</Text>
        </View>
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
  grid: {
    width: '100%',
    flexDirection: 'column',
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zoneLabel: {
    fontFamily: 'Barlow-Bold',
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  zoneValue: {
    fontFamily: 'Barlow-Medium',
    color: 'white',
    fontSize: 18,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: '#666',
  },
});

export default HeatMap; 