import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, typography } from '@/constants/theme';
import { SettingsMenuItem } from '@/components/settings/SettingsMenuItem';
import { useTheme } from '@/contexts/ThemeContext';

export default function UnitsScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Theme"
              subtitle={getThemeText()}
              onPress={() => router.push('/settings/theme')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurement Units</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Distance"
              subtitle="Feet"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Speed"
              subtitle="MPH"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Weight"
              subtitle="Ounces"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Length"
              subtitle="Inches"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Format</Text>
          <View style={styles.sectionContent}>
            <SettingsMenuItem
              title="Time Format"
              subtitle="12-hour"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Date Format"
              subtitle="MM/DD/YYYY"
              onPress={() => {}}
            />
            <SettingsMenuItem
              title="Decimal Places"
              subtitle="2"
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