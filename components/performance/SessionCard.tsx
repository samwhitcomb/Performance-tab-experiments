import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, ChevronRight, Check } from 'lucide-react-native';
import { colors, useColors } from '@/constants/theme';

interface SessionCardProps {
  session: {
    id: string;
    date: string;
    time: string;
    type: string;
    title: string;
    metrics: {
      swings: number;
      avgExitVelo: number;
      avgLaunchAngle: number;
      barrelPercentage: number;
    };
  };
  selected: boolean;
  onSelect: (sessionId: string) => void;
  selectionMode: boolean;
}

export function SessionCard({ session, selected, onSelect, selectionMode }: SessionCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.white },
        selected && styles.selectedContainer
      ]}
      onPress={() => onSelect(session.id)}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={colors.grey[400]} />
          <Text style={[styles.dateText, { color: colors.grey[600] }]}>{session.date} • {session.time}</Text>
        </View>
        
        <View style={[
          styles.typeTag,
          session.type === 'Practice' ? styles.practiceTag : styles.gameTag,
          { backgroundColor: colors.grey[100] }
        ]}>
          <Text style={[styles.typeText, { color: colors.grey[600] }]}>{session.type}</Text>
        </View>
      </View>
      
      <Text style={[styles.title, { color: colors.grey[600] }]}>{session.title}</Text>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: colors.grey[600] }]}>{session.metrics.swings}</Text>
          <Text style={[styles.metricLabel, { color: colors.grey[400] }]}>Swings</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: colors.grey[600] }]}>{session.metrics.avgExitVelo}</Text>
          <Text style={[styles.metricLabel, { color: colors.grey[400] }]}>Avg EV</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: colors.grey[600] }]}>{session.metrics.avgLaunchAngle}°</Text>
          <Text style={[styles.metricLabel, { color: colors.grey[400] }]}>Launch</Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: colors.grey[600] }]}>{session.metrics.barrelPercentage}%</Text>
          <Text style={[styles.metricLabel, { color: colors.grey[400] }]}>Barrel</Text>
        </View>
      </View>
      
      {selectionMode && (
        <View style={[styles.checkbox, selected && { backgroundColor: colors.primary }]}>
          {selected && <Check size={16} color={colors.white} />}
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <ChevronRight size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.grey[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: '#2B73DF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    marginLeft: 6,
  },
  typeTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  practiceTag: {
    backgroundColor: 'rgba(43, 115, 223, 0.1)',
  },
  gameTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  typeText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
  },
  title: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 20,
  },
  metricLabel: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.grey[100],
    paddingTop: 12,
  },
  viewDetailsText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  checkbox: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2B73DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});