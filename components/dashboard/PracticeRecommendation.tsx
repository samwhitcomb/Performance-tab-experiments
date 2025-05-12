import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Clock, Zap } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface PracticeRecommendationProps {
  plan: {
    title: string;
    description: string;
    intensity: string;
    timeEstimate: string;
  };
}

export function PracticeRecommendation({ plan }: PracticeRecommendationProps) {
  const getIntensityColor = (intensity: string) => {
    switch (intensity.toLowerCase()) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#E63946';
      default:
        return '#0F52BA';
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.description}>{plan.description}</Text>
        
        <View style={styles.metadata}>
          <View style={styles.metaItem}>
            <Zap size={16} color={getIntensityColor(plan.intensity)} />
            <Text style={[
              styles.metaText, 
              { color: getIntensityColor(plan.intensity) }
            ]}>
              {plan.intensity}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Clock size={16} color="#666666" />
            <Text style={styles.metaText}>{plan.timeEstimate}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.arrowContainer}>
        <ChevronRight size={20} color="#0F52BA" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.grey[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[400],
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 12,
    color: colors.grey[400],
    marginLeft: 4,
  },
  arrowContainer: {
    justifyContent: 'center',
  },
});