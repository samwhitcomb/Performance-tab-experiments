import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { useColors, typography } from '@/constants/theme';
import { useEffect } from 'react';

interface DrillGuideModalProps {
  visible: boolean;
  onClose: () => void;
  drill: {
    title: string;
    description: string;
    setup: string[];
    targets: string[];
    type: 'tee' | 'soft-toss';
  } | null;
}

export function DrillGuideModal({ visible, onClose, drill }: DrillGuideModalProps) {
  const colors = useColors();
  
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.grey[100],
    },
    title: {
      ...typography.h3,
      color: colors.grey[600],
    },
    closeButton: {
      padding: 4,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    typeTag: {
      backgroundColor: colors.secondary.lightGreen,
      alignSelf: 'flex-start',
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 16,
      marginBottom: 16,
    },
    typeText: {
      ...typography.button,
      color: colors.grey[600],
    },
    description: {
      ...typography.body1,
      color: colors.grey[500],
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.grey[600],
      marginBottom: 12,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    bulletDot: {
      ...typography.body1,
      color: colors.primary,
      marginRight: 8,
    },
    bulletText: {
      ...typography.body1,
      color: colors.grey[500],
      flex: 1,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.grey[100],
    },
    startButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 30,
      alignItems: 'center',
    },
    startButtonText: {
      ...typography.button,
      color: colors.white,
    },
  });

  useEffect(() => {
    // Any side effects that were causing state updates should be moved here
  }, [drill]);

  if (!drill) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{drill.title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.grey[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>
                {drill.type === 'tee' ? 'Tee Drill' : 'Soft Toss Drill'}
              </Text>
            </View>

            <Text style={styles.description}>{drill.description}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Setup Instructions</Text>
              {drill.setup.map((step, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{step}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Target Requirements</Text>
              {drill.targets.map((target, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{target}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={onClose}
            >
              <Text style={styles.startButtonText}>Continue to Setup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export { DrillGuideModal }