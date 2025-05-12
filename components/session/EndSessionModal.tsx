import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, typography } from '@/constants/theme';
import { MinusCircle, XCircle } from 'lucide-react-native';

interface EndSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onEnd: (shouldEnd: boolean) => void;
}

export function EndSessionModal({ visible, onClose, onEnd }: EndSessionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>End Session?</Text>
          <Text style={styles.message}>
            Do you want to end or minimize your current session?
          </Text>
          
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={[styles.button, styles.pauseButton]}
              onPress={() => onEnd(false)}
            >
              <MinusCircle size={20} color={colors.grey[600]} style={styles.buttonIcon} />
              <Text style={[styles.buttonText, styles.pauseButtonText]}>
                Minimize Session
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.endButton]}
              onPress={() => onEnd(true)}
            >
              <XCircle size={20} color={colors.white} style={styles.buttonIcon} />
              <Text style={[styles.buttonText, styles.endButtonText]}>
                End Session
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    ...typography.h3,
    color: colors.grey[600],
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...typography.body1,
    color: colors.grey[500],
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    ...typography.button,
  },
  pauseButton: {
    backgroundColor: colors.grey[100],
  },
  pauseButtonText: {
    color: colors.grey[600],
  },
  endButton: {
    backgroundColor: colors.status.error,
  },
  endButtonText: {
    color: colors.white,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.grey[400],
    textAlign: 'center',
  },
});