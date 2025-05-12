import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';

export default function BatSettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bat Specifications</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Bat Length"
              subtitle="32 inches"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Bat Weight"
              subtitle="30 oz"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Bat Model"
              subtitle="Pro Model 2024"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Swing Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Preferred Launch Angle"
              subtitle="15-20 degrees"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Target Exit Velocity"
              subtitle="85-90 mph"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Swing Type"
              subtitle="Power Hitter"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calibration</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Calibrate Bat Sensor"
              subtitle="Last calibrated 2 days ago"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Reset Calibration"
              subtitle="Reset to factory settings"
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