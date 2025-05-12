import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, TrendingUp, TrendingDown } from 'lucide-react-native';
import { useColors } from '@/constants/theme';

interface SessionComparisonModalProps {
  visible: boolean;
  onClose: () => void;
  sessions: {
    id: string;
    date: string;
    metrics: {
      avgExitVelo: number;
      avgLaunchAngle: number;
      barrelPercentage: number;
      swings: number;
    };
  }[];
}

export function SessionComparisonModal({ visible, onClose, sessions }: SessionComparisonModalProps) {
  const colors = useColors();
  
  const getPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? colors.status.success : colors.status.error;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp size={16} color={colors.status.success} />
    ) : (
      <TrendingDown size={16} color={colors.status.error} />
    );
  };

  if (sessions.length !== 2) return null;

  const [currentSession, previousSession] = sessions;
  
  const metrics = [
    {
      label: 'Exit Velocity',
      current: currentSession.metrics.avgExitVelo,
      previous: previousSession.metrics.avgExitVelo,
      unit: 'mph'
    },
    {
      label: 'Launch Angle',
      current: currentSession.metrics.avgLaunchAngle,
      previous: previousSession.metrics.avgLaunchAngle,
      unit: '°'
    },
    {
      label: 'Barrel %',
      current: currentSession.metrics.barrelPercentage,
      previous: previousSession.metrics.barrelPercentage,
      unit: '%'
    },
    {
      label: 'Total Swings',
      current: currentSession.metrics.swings,
      previous: previousSession.metrics.swings,
      unit: ''
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.container, { backgroundColor: colors.white }]}>
          <View style={[styles.header, { borderBottomColor: colors.grey[100] }]}>
            <Text style={[styles.title, { color: colors.grey[600] }]}>Session Comparison</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={colors.grey[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={[styles.dateComparison, { backgroundColor: colors.grey[50] }]}>
              <View style={styles.dateColumn}>
                <Text style={[styles.dateLabel, { color: colors.grey[400] }]}>Current</Text>
                <Text style={[styles.date, { color: colors.grey[600] }]}>{currentSession.date}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.grey[200] }]} />
              <View style={styles.dateColumn}>
                <Text style={[styles.dateLabel, { color: colors.grey[400] }]}>Previous</Text>
                <Text style={[styles.date, { color: colors.grey[600] }]}>{previousSession.date}</Text>
              </View>
            </View>

            {metrics.map((metric, index) => {
              const change = getPercentageChange(metric.current, metric.previous);
              const changeColor = getChangeColor(parseFloat(change));
              
              return (
                <View key={index} style={[styles.metricRow, { borderBottomColor: colors.grey[100] }]}>
                  <Text style={[styles.metricLabel, { color: colors.grey[600] }]}>{metric.label}</Text>
                  <View style={styles.metricValues}>
                    <Text style={[styles.currentValue, { color: colors.grey[600] }]}>
                      {metric.current}{metric.unit}
                    </Text>
                    <View style={styles.changeContainer}>
                      {getChangeIcon(parseFloat(change))}
                      <Text style={[styles.changeValue, { color: changeColor }]}>
                        {change}%
                      </Text>
                    </View>
                    <Text style={[styles.previousValue, { color: colors.grey[400] }]}>
                      {metric.previous}{metric.unit}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: 'Barlow-Bold',
    fontSize: 20,
  },
  content: {
    maxHeight: '80%',
  },
  dateComparison: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
  },
  divider: {
    width: 1,
    marginHorizontal: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  metricLabel: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 16,
  },
  metricValues: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontFamily: 'Barlow-Bold',
    fontSize: 18,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  changeValue: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  previousValue: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
  },
});