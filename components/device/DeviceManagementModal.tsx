import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Battery, Wifi, CreditCard as Edit2, X } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';

interface DeviceManagementModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DeviceManagementModal({ visible, onClose }: DeviceManagementModalProps) {
  // Mock device data - replace with actual device state management
  const deviceData = {
    connected: true,
    name: 'MLMDS-2024',
    batteryLife: 4.5, // hours
    wifiStrength: 'Strong',
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Device Management</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.grey[600]} />
            </TouchableOpacity>
          </View>

          {deviceData.connected ? (
            <>
              <View style={styles.deviceImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg' }} 
                  style={styles.deviceImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.deviceInfo}>
                <View style={styles.deviceNameContainer}>
                  <Text style={styles.deviceName}>{deviceData.name}</Text>
                  <TouchableOpacity style={styles.editButton}>
                    <Edit2 size={16} color={colors.white} />
                    <Text style={styles.editButtonText}>Edit Name</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.statusContainer}>
                  <View style={styles.statusItem}>
                    <Battery size={20} color={colors.status.success} />
                    <Text style={styles.statusText}>
                      {deviceData.batteryLife} hrs remaining
                    </Text>
                  </View>
                  <View style={styles.statusItem}>
                    <Wifi size={20} color={colors.status.success} />
                    <Text style={styles.statusText}>
                      {deviceData.wifiStrength} Connection
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.disconnectButton}>
                <Text style={styles.disconnectText}>Disconnect Device</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.connectContainer}>
              <View style={styles.deviceImageContainer}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg' }} 
                  style={[styles.deviceImage, styles.disconnectedImage]}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.connectText}>No Device Connected</Text>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect Device</Text>
              </TouchableOpacity>
            </View>
          )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    ...typography.h3,
    color: colors.grey[600],
  },
  closeButton: {
    padding: 4,
  },
  deviceImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: colors.grey[100],
  },
  deviceImage: {
    width: '100%',
    height: '100%',
  },
  disconnectedImage: {
    opacity: 0.5,
  },
  deviceInfo: {
    marginBottom: 24,
  },
  deviceNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  deviceName: {
    ...typography.h4,
    color: colors.grey[600],
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    ...typography.button,
    fontSize: 14,
    color: colors.white,
    marginLeft: 6,
  },
  statusContainer: {
    backgroundColor: colors.grey[50],
    borderRadius: 12,
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    ...typography.body2,
    color: colors.grey[600],
    marginLeft: 8,
  },
  disconnectButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.status.error + '10',
    alignItems: 'center',
  },
  disconnectText: {
    ...typography.button,
    color: colors.status.error,
  },
  connectContainer: {
    alignItems: 'center',
    padding: 24,
  },
  connectText: {
    ...typography.body1,
    color: colors.grey[400],
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  connectButtonText: {
    ...typography.button,
    color: colors.white,
  },
});