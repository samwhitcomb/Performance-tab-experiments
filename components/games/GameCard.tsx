import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Users, Clock } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    level: string;
    time: string;
    image: string;
  };
}

export function GameCard({ game }: GameCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Image 
        source={{ uri: game.image }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.description}>{game.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <Users size={14} color="#666666" />
            <Text style={styles.metaText}>{game.level}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Clock size={14} color="#666666" />
            <Text style={styles.metaText}>{game.time}</Text>
          </View>
          
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playButtonText}>PLAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.grey[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 18,
    color: colors.grey[600],
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[400],
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    color: colors.grey[400],
    marginLeft: 4,
  },
  playButton: {
    marginLeft: 'auto',
    backgroundColor: colors.secondary.neonGreen,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  playButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 12,
    color: colors.grey[600],
  },
});