import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lightbulb, Brain } from 'lucide-react-native';
import { colors } from '@/constants/theme';

interface DrillTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export function DrillTypeSelector({ selectedType, onSelectType }: DrillTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedType === 'skill' && styles.selectedOption,
        ]}
        onPress={() => onSelectType('skill')}
      >
        <Lightbulb 
          size={18} 
          color={selectedType === 'skill' ? '#FFFFFF' : '#666666'} 
        />
        <Text
          style={[
            styles.optionText,
            selectedType === 'skill' && styles.selectedOptionText,
          ]}
        >
          Skill-Based Drills
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          selectedType === 'adaptive' && styles.selectedOption,
        ]}
        onPress={() => onSelectType('adaptive')}
      >
        <Brain 
          size={18} 
          color={selectedType === 'adaptive' ? '#FFFFFF' : '#666666'} 
        />
        <Text
          style={[
            styles.optionText,
            selectedType === 'adaptive' && styles.selectedOptionText,
          ]}
        >
          AI Adaptive Drills
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.grey[100],
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[500],
    marginLeft: 6,
  },
  selectedOptionText: {
    color: colors.white,
  },
});