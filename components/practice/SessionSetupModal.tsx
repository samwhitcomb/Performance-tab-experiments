import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, ChevronDown, Target } from 'lucide-react-native';
import { useState } from 'react';
import { colors, typography } from '@/constants/theme';

interface SessionSetupModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SessionSetupModal({ visible, onClose }: SessionSetupModalProps) {
  const [sessionType, setSessionType] = useState('tee');
  const [pitchIntent, setPitchIntent] = useState('middle-middle');
  
  // Mock zones for pitch intent
  const zones = [
    'high-inside', 'high-middle', 'high-outside',
    'middle-inside', 'middle-middle', 'middle-outside',
    'low-inside', 'low-middle', 'low-outside',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Session Setup</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.grey[600]} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Type</Text>
              <View style={styles.sessionTypeContainer}>
                <TouchableOpacity 
                  style={[
                    styles.sessionTypeButton,
                    sessionType === 'tee' && styles.selectedSessionType,
                  ]}
                  onPress={() => setSessionType('tee')}
                >
                  <Text 
                    style={[
                      styles.sessionTypeText,
                      sessionType === 'tee' && styles.selectedSessionTypeText,
                    ]}
                  >
                    Tee Work
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.sessionTypeButton,
                    sessionType === 'soft-toss' && styles.selectedSessionType,
                  ]}
                  onPress={() => setSessionType('soft-toss')}
                >
                  <Text 
                    style={[
                      styles.sessionTypeText,
                      sessionType === 'soft-toss' && styles.selectedSessionTypeText,
                    ]}
                  >
                    Soft Toss
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pitch Intent</Text>
              <Text style={styles.sectionSubtitle}>
                Select the location you want to simulate
              </Text>
              
              <View style={styles.zoneContainer}>
                <View style={styles.strikeZone}>
                  {zones.map((zone, index) => (
                    <TouchableOpacity 
                      key={zone}
                      style={[
                        styles.zoneButton,
                        pitchIntent === zone && styles.selectedZone,
                      ]}
                      onPress={() => setPitchIntent(zone)}
                    >
                      {pitchIntent === zone && (
                        <Target size={16} color={colors.white} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                
                <Text style={styles.selectedZoneText}>
                  Selected: {pitchIntent.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Session Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any notes for this session..."
                multiline={true}
                numberOfLines={3}
                placeholderTextColor={colors.grey[400]}
              />
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.startButton} onPress={onClose}>
              <Text style={styles.startButtonText}>Start Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[500],
    marginBottom: 16,
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  sessionTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.grey[100],
    alignItems: 'center',
  },
  selectedSessionType: {
    backgroundColor: colors.primary,
  },
  sessionTypeText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    color: colors.grey[600],
  },
  selectedSessionTypeText: {
    color: colors.white,
  },
  zoneContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  strikeZone: {
    width: 240,
    height: 240,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: colors.grey[200],
    borderRadius: 8,
    overflow: 'hidden',
  },
  zoneButton: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey[100],
  },
  selectedZone: {
    backgroundColor: colors.primary,
  },
  selectedZoneText: {
    fontFamily: 'Barlow-Medium',
    fontSize: 14,
    color: colors.grey[500],
    marginTop: 12,
  },
  notesInput: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    color: colors.grey[600],
    borderWidth: 1,
    borderColor: colors.grey[200],
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grey[100],
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: 'Barlow-Bold',
    fontSize: 16,
    color: colors.white,
  },
});