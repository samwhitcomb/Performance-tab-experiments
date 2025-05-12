import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react-native';
import { colors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';

export default function DeviceInfoScreen() {
  // Mock device data
  const deviceInfo = {
    name: 'MLMDS-1234',
    status: 'Connected',
    batteryLevel: '85%',
    signalStrength: 'Strong',
    firmwareVersion: 'v2.1.0',
    lastSync: '2 minutes ago',
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              icon={<Smartphone size={20} color={colors.primary} />}
              title="Device Name"
              subtitle={deviceInfo.name}
              showChevron={false}
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon={<Wifi size={20} color={colors.primary} />}
              title="Connection Status"
              subtitle={deviceInfo.status}
              showChevron={false}
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon={<Battery size={20} color={colors.primary} />}
              title="Battery Level"
              subtitle={deviceInfo.batteryLevel}
              showChevron={false}
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon={<Signal size={20} color={colors.primary} />}
              title="Signal Strength"
              subtitle={deviceInfo.signalStrength}
              showChevron={false}
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Information</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Firmware Version"
              subtitle={deviceInfo.firmwareVersion}
              showChevron={false}
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Last Sync"
              subtitle={deviceInfo.lastSync}
              showChevron={false}
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey[50],
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.grey[400],
    textTransform: 'uppercase',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: colors.white,
  },
}); 