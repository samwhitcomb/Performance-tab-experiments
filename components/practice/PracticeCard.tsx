import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Timer as TimerIcon } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface PracticeCardProps {
  drill: {
    id: string;
    title: string;
    description: string;
    focus: string;
    time: string;
    type: 'tee' | 'soft-toss';
    drillType: 'DRILL' | 'LADDER';
    image: string;
  };
  onPress: () => void;
}

export function PracticeCard({ drill, onPress }: PracticeCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: drill.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{drill.title}</Text>
            <View style={[
              styles.drillTypeTag,
              drill.drillType === 'LADDER' ? styles.ladderTag : styles.drillTag
            ]}>
              <Text style={styles.drillTypeText}>{drill.drillType}</Text>
            </View>
          </View>
          <View style={styles.tagContainer}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>
                {drill.type === 'tee' ? 'Tee' : 'Soft Toss'}
              </Text>
            </View>
            <View style={styles.focusTag}>
              <Text style={styles.focusText}>{drill.focus}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.description}>{drill.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <TimerIcon size={14} color={colors.white} />
            <Text style={styles.timeText}>{drill.time}</Text>
          </View>
          
          <View style={styles.startButton}>
            <Text style={styles.startText}>VIEW GUIDE</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  content: {
    padding: 16,
    justifyContent: 'space-between',
    height: '100%',
  },
  header: {
    flexDirection: 'column',
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    ...typography.h3,
    color: colors.white,
    flex: 1,
    marginRight: 8,
  },
  drillTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  drillTag: {
    backgroundColor: colors.secondary.neonGreen,
  },
  ladderTag: {
    backgroundColor: colors.secondary.indigo,
  },
  drillTypeText: {
    ...typography.caption,
    fontFamily: 'Barlow-Bold',
    color: colors.white,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeTag: {
    backgroundColor: colors.secondary.neonGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    ...typography.caption,
    color: colors.grey[600],
  },
  focusTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  focusText: {
    ...typography.caption,
    color: colors.white,
  },
  description: {
    ...typography.body2,
    color: colors.grey[100],
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...typography.body2,
    color: colors.white,
    marginLeft: 6,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startText: {
    ...typography.button,
    fontSize: 14,
    color: colors.white,
  },
});